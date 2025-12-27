import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/auth'
import { canPurchase, canAccessLane } from '../../../lib/permissions'
import { createEscrow } from '../../../lib/escrow'
import { Lane } from '@prisma/client'

const createOrderSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID'),
  quantity: z.number().int().positive('Quantity must be positive'),
  destinationUrl: z.string().url('Invalid destination URL'),
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

    // Check if user can make purchases
    if (!canPurchase(user)) {
      return NextResponse.json(
        { error: 'You do not have permission to purchase traffic' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = createOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { listingId, quantity, destinationUrl } = validation.data

    // Get listing with seller info
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        seller: {
          include: {
            user: true,
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

    // Check if listing is active
    if (!listing.isActive) {
      return NextResponse.json(
        { error: 'This listing is not currently active' },
        { status: 400 }
      )
    }

    // Check if seller is approved
    if (!listing.seller.user.isApproved) {
      return NextResponse.json(
        { error: 'Seller is not approved' },
        { status: 400 }
      )
    }

    // Check lane access
    if (!canAccessLane(user, listing.lane as Lane)) {
      return NextResponse.json(
        { error: `You do not have access to the ${listing.lane} lane` },
        { status: 403 }
      )
    }

    // Prevent self-purchase
    if (listing.seller.userId === user.id) {
      return NextResponse.json(
        { error: 'You cannot purchase your own listing' },
        { status: 400 }
      )
    }

    // Validate quantity
    if (quantity < listing.minOrder) {
      return NextResponse.json(
        { error: `Minimum order quantity is ${listing.minOrder}` },
        { status: 400 }
      )
    }

    if (quantity > listing.maxDaily) {
      return NextResponse.json(
        { error: `Maximum daily quantity is ${listing.maxDaily}` },
        { status: 400 }
      )
    }

    // Calculate total price
    const totalPrice = listing.price * quantity

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: user.id,
        sellerId: listing.seller.userId,
        listingId: listing.id,
        lane: listing.lane,
        destinationUrl,
        quantity,
        totalPrice,
        status: 'PENDING',
      },
      include: {
        buyer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        listing: true,
      },
    })

    // Create escrow for the order
    const escrowResult = await createEscrow(order.id, totalPrice)

    if (!escrowResult.success) {
      // If escrow creation fails, delete the order
      await prisma.order.delete({ where: { id: order.id } })

      return NextResponse.json(
        { error: `Failed to create escrow: ${escrowResult.message}` },
        { status: 500 }
      )
    }

    // Fetch updated order with escrow
    const orderWithEscrow = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        buyer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        listing: true,
        escrow: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Order created successfully. Funds held in escrow.',
      order: orderWithEscrow,
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

    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
