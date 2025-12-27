import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/auth'
import { canCreateListing } from '../../../lib/permissions'
import { TrafficType, Lane } from '@prisma/client'

const createListingSchema = z.object({
  lane: z.enum(['CLEAN', 'PRIVATE']),
  trafficType: z.enum(['EMAIL', 'SOCIAL', 'NATIVE', 'DISPLAY', 'PUSH', 'MIXED']),
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  description: z.string().max(1000).optional(),
  price: z.number().positive('Price must be positive').max(10000, 'Price cannot exceed $10,000'),
  minOrder: z.number().int().positive('Minimum order must be positive').min(100, 'Minimum order must be at least 100'),
  maxDaily: z.number().int().positive('Maximum daily must be positive').min(1000, 'Maximum daily must be at least 1000'),
})

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  }

  try {
    // Authenticate user
    const user = await requireAuth(req)

    // Check if user can create listings
    if (!canCreateListing(user)) {
      return NextResponse.json(
        { error: 'You must be an approved seller to create listings' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = createListingSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { lane, trafficType, title, description, price, minOrder, maxDaily } = validation.data

    // Get seller profile
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    })

    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      )
    }

    // Verify seller can access requested lane
    if (!sellerProfile.allowedLanes.includes(lane as Lane)) {
      return NextResponse.json(
        { error: `You don't have access to the ${lane} lane` },
        { status: 403 }
      )
    }

    // Verify seller supports traffic type
    if (!sellerProfile.trafficTypes.includes(trafficType as TrafficType)) {
      return NextResponse.json(
        { error: `You don't support ${trafficType} traffic type` },
        { status: 403 }
      )
    }

    // Validate min order vs max daily
    if (minOrder > maxDaily) {
      return NextResponse.json(
        { error: 'Minimum order cannot exceed maximum daily limit' },
        { status: 400 }
      )
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        sellerId: sellerProfile.id,
        lane: lane as Lane,
        trafficType: trafficType as TrafficType,
        title,
        description: description || null,
        price,
        minOrder,
        maxDaily,
        isActive: true,
      },
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
      message: 'Listing created successfully',
      listing,
    }, { status: 201 })
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

    console.error('Create listing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
