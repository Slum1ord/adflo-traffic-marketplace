import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/auth'
import { canManageOrder } from '../../../lib/permissions'
import { releaseEscrow, refundEscrow } from '../../../lib/escrow'
import { OrderStatus } from '@prisma/client'

const updateOrderSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'DISPUTED', 'CANCELLED']),
  trackingUrl: z.string().url().optional(),
})

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
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
    const validation = updateOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { orderId, status, trackingUrl } = validation.data

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

    // Check permissions
    if (!canManageOrder(user, order)) {
      return NextResponse.json(
        { error: 'You do not have permission to manage this order' },
        { status: 403 }
      )
    }

    // Validate status transitions
    const currentStatus = order.status
    const newStatus = status as OrderStatus

    // Only seller can mark as ACTIVE (with tracking URL)
    if (newStatus === 'ACTIVE' && order.sellerId !== user.id) {
      return NextResponse.json(
        { error: 'Only the seller can activate an order' },
        { status: 403 }
      )
    }

    // Only buyer or admin can mark as COMPLETED
    if (newStatus === 'COMPLETED' && order.buyerId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only the buyer or admin can complete an order' },
        { status: 403 }
      )
    }

    // Can't change status if order is disputed
    if (order.dispute && order.dispute.status === 'OPEN' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot update order status while dispute is open' },
        { status: 400 }
      )
    }

    // Prevent invalid transitions
    if (currentStatus === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot modify a completed order' },
        { status: 400 }
      )
    }

    if (currentStatus === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot modify a cancelled order' },
        { status: 400 }
      )
    }

    // Require tracking URL when activating
    if (newStatus === 'ACTIVE' && !trackingUrl && !order.trackingUrl) {
      return NextResponse.json(
        { error: 'Tracking URL is required to activate an order' },
        { status: 400 }
      )
    }

    // Update order
    const updateData: any = { status: newStatus }
    if (trackingUrl) {
      updateData.trackingUrl = trackingUrl
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
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

    // Handle escrow based on status change
    let escrowMessage = ''

    if (newStatus === 'COMPLETED' && order.escrow && !order.escrow.released) {
      const escrowResult = await releaseEscrow(orderId, user.id)
      if (escrowResult.success) {
        escrowMessage = ' Escrow released to seller.'
      } else {
        escrowMessage = ` Warning: ${escrowResult.message}`
      }
    }

    if (newStatus === 'CANCELLED' && order.escrow && !order.escrow.released) {
      const escrowResult = await refundEscrow(orderId)
      if (escrowResult.success) {
        escrowMessage = ' Escrow refunded to buyer.'
      } else {
        escrowMessage = ` Warning: ${escrowResult.message}`
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${newStatus}.${escrowMessage}`,
      order: updatedOrder,
    })
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

    console.error('Update order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
