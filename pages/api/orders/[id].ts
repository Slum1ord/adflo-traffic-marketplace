import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/auth'
import { canViewOrder } from '../../../lib/permissions'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  }

  try {
    // Authenticate user
    const user = await requireAuth(req)

    // Extract order ID from URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const orderId = pathParts[pathParts.length - 1]

    if (!orderId || orderId === '[id]') {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get order with all relations
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: {
          select: {
            id: true,
            email: true,
            role: true,
            walletAddress: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            role: true,
            walletAddress: true,
          },
        },
        listing: {
          include: {
            seller: {
              select: {
                id: true,
                displayName: true,
                reputationClean: true,
                reputationPrivate: true,
              },
            },
          },
        },
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
    if (!canViewOrder(user, order)) {
      return NextResponse.json(
        { error: 'You do not have permission to view this order' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      order,
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

    console.error('Get order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
