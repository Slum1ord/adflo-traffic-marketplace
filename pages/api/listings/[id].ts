import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { getUserFromRequest, requireAuth } from '../../../lib/auth'
import { canEditListing, canAccessLane } from '../../../lib/permissions'
import { Lane, TrafficType } from '@prisma/client'

const updateListingSchema = z.object({
  title: z.string().min(10).max(100).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive().max(10000).optional(),
  minOrder: z.number().int().positive().min(100).optional(),
  maxDaily: z.number().int().positive().min(1000).optional(),
  isActive: z.boolean().optional(),
})

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  try {
    // Extract listing ID from URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const listingId = pathParts[pathParts.length - 1]

    if (!listingId || listingId === '[id]') {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      )
    }

    // GET - View listing details
    if (req.method === 'GET') {
      const user = await getUserFromRequest(req)

      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  id: true,
                  email: false,
                  role: true,
                  isApproved: true,
                },
              },
            },
          },
        },
      })

      if (!listing) {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        )
      }

      // Check lane access
      if (listing.lane === 'PRIVATE') {
        if (!user || !canAccessLane(user, 'PRIVATE' as Lane)) {
          return NextResponse.json(
            { error: 'You do not have access to this listing' },
            { status: 403 }
          )
        }
      }

      return NextResponse.json({
        success: true,
        listing,
      })
    }

    // PUT/PATCH - Update listing
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const user = await requireAuth(req)

      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: {
          seller: true,
        },
      })

      if (!listing) {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        )
      }

      // Check permissions
      if (!canEditListing(user, listing)) {
        return NextResponse.json(
          { error: 'You do not have permission to edit this listing' },
          { status: 403 }
        )
      }

      const body = await req.json()

      // Validate input
      const validation = updateListingSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validation.error.errors },
          { status: 400 }
        )
      }

      const updateData = validation.data

      // Validate min order vs max daily if both are being updated
      const newMinOrder = updateData.minOrder ?? listing.minOrder
      const newMaxDaily = updateData.maxDaily ?? listing.maxDaily

      if (newMinOrder > newMaxDaily) {
        return NextResponse.json(
          { error: 'Minimum order cannot exceed maximum daily limit' },
          { status: 400 }
        )
      }

      // Update listing
      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: updateData,
        include: {
          seller: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Listing updated successfully',
        listing: updatedListing,
      })
    }

    // DELETE - Delete listing
    if (req.method === 'DELETE') {
      const user = await requireAuth(req)

      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: {
          seller: true,
          orders: {
            where: {
              status: {
                in: ['PENDING', 'ACTIVE'],
              },
            },
          },
        },
      })

      if (!listing) {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        )
      }

      // Check permissions
      if (!canEditListing(user, listing)) {
        return NextResponse.json(
          { error: 'You do not have permission to delete this listing' },
          { status: 403 }
        )
      }

      // Check for active orders
      if (listing.orders.length > 0) {
        return NextResponse.json(
          { error: 'Cannot delete listing with active or pending orders. Please deactivate instead.' },
          { status: 400 }
        )
      }

      // Delete listing
      await prisma.listing.delete({
        where: { id: listingId },
      })

      return NextResponse.json({
        success: true,
        message: 'Listing deleted successfully',
      })
    }

    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    console.error('Listing operation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
