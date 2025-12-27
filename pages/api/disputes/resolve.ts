import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/auth'
import { canResolveDispute } from '../../../lib/permissions'
import { releaseEscrow, refundEscrow } from '../../../lib/escrow'
import { DisputeStatus } from '@prisma/client'

const resolveDisputeSchema = z.object({
  disputeId: z.string().uuid('Invalid dispute ID'),
  status: z.enum(['RESOLVED', 'REJECTED']),
  resolution: z.string().min(20, 'Resolution explanation must be at least 20 characters').max(1000),
  refundBuyer: z.boolean().optional().default(false),
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
    // Authenticate and check admin permissions
    const admin = await requireAuth(req, 'ADMIN')

    if (!canResolveDispute(admin)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = resolveDisputeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { disputeId, status, resolution, refundBuyer } = validation.data

    // Get dispute with relations
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        order: {
          include: {
            buyer: true,
            seller: true,
            listing: true,
            escrow: true,
          },
        },
        user: true,
      },
    })

    if (!dispute) {
      return NextResponse.json(
        { error: 'Dispute not found' },
        { status: 404 }
      )
    }

    // Check if dispute is already resolved
    if (dispute.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Dispute is already resolved' },
        { status: 400 }
      )
    }

    // Check if escrow exists
    if (!dispute.order.escrow) {
      return NextResponse.json(
        { error: 'No escrow found for this order' },
        { status: 400 }
      )
    }

    // Check if escrow is already released
    if (dispute.order.escrow.released) {
      return NextResponse.json(
        { error: 'Escrow has already been released' },
        { status: 400 }
      )
    }

    let escrowResult
    let newOrderStatus: 'COMPLETED' | 'CANCELLED' | 'ACTIVE'

    // Handle escrow based on resolution
    if (status === 'RESOLVED') {
      if (refundBuyer) {
        // Refund buyer - dispute ruled in buyer's favor
        escrowResult = await refundEscrow(dispute.orderId)
        newOrderStatus = 'CANCELLED'
      } else {
        // Release to seller - dispute ruled in seller's favor
        escrowResult = await releaseEscrow(dispute.orderId, admin.id)
        newOrderStatus = 'COMPLETED'
      }

      if (!escrowResult.success) {
        return NextResponse.json(
          { error: `Failed to process escrow: ${escrowResult.message}` },
          { status: 500 }
        )
      }
    } else {
      // Dispute rejected - return order to ACTIVE status
      newOrderStatus = 'ACTIVE'
    }

    // Update dispute and order in a transaction
    const [updatedDispute, updatedOrder] = await prisma.$transaction([
      prisma.dispute.update({
        where: { id: disputeId },
        data: {
          status: status as DisputeStatus,
          resolution,
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
        where: { id: dispute.orderId },
        data: { status: newOrderStatus },
      }),
    ])

    let message = `Dispute ${status.toLowerCase()} successfully.`
    if (status === 'RESOLVED') {
      message += refundBuyer
        ? ' Escrow refunded to buyer.'
        : ' Escrow released to seller.'
    } else {
      message += ' Order returned to active status.'
    }

    return NextResponse.json({
      success: true,
      message,
      dispute: updatedDispute,
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

    console.error('Resolve dispute error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
