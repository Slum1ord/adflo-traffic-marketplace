import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/auth'
import { canOpenDispute } from '../../../lib/permissions'

const createDisputeSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  reason: z.string().min(20, 'Reason must be at least 20 characters').max(1000, 'Reason cannot exceed 1000 characters'),
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

    const body = await req.json()

    // Validate input
    const validation = createDisputeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { orderId, reason } = validation.data

    // Get order with relations
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: true,
        seller: true,
        listing: true,
        escrow: true,
        dispute: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if user can open dispute
    if (!canOpenDispute(user, order)) {
      return NextResponse.json(
        { error: 'You cannot open a dispute for this order' },
        { status: 403 }
      )
    }

    // Check if dispute already exists
    if (order.dispute) {
      return NextResponse.json(
        { error: 'A dispute already exists for this order' },
        { status: 409 }
      )
    }

    // Check if order status allows disputes
    if (order.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Disputes can only be opened for active orders' },
        { status: 400 }
      )
    }

    // Check if escrow exists and is not released
    if (!order.escrow) {
      return NextResponse.json(
        { error: 'No escrow found for this order' },
        { status: 400 }
      )
    }

    if (order.escrow.released) {
      return NextResponse.json(
        { error: 'Cannot dispute an order with released escrow' },
        { status: 400 }
      )
    }

    // Create dispute and update order status
    const [dispute, updatedOrder] = await prisma.$transaction([
      prisma.dispute.create({
        data: {
          orderId,
          openedBy: user.id,
          reason,
          status: 'OPEN',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          order: {
            include: {
              buyer: {
                select: {
                  id: true,
                  email: true,
                },
              },
              seller: {
                select: {
                  id: true,
                  email: true,
                },
              },
              listing: true,
              escrow: true,
            },
          },
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: 'DISPUTED' },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Dispute created successfully. An admin will review your case.',
      dispute,
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

    console.error('Create dispute error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
