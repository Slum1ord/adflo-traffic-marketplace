import { prisma } from './db'
import { OrderStatus } from '@prisma/client'

export interface EscrowResult {
  success: boolean
  message: string
  escrowId?: string
}

export async function createEscrow(
  orderId: string,
  amount: number,
  currency: string = 'USD'
): Promise<EscrowResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { escrow: true }
    })

    if (!order) {
      return { success: false, message: 'Order not found' }
    }

    if (order.escrow) {
      return { success: false, message: 'Escrow already exists for this order' }
    }

    const escrow = await prisma.escrow.create({
      data: {
        orderId,
        amount,
        currency,
        released: false,
      },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'ACTIVE' },
    })

    return {
      success: true,
      message: 'Escrow created successfully',
      escrowId: escrow.id,
    }
  } catch (error) {
    console.error('Escrow creation error:', error)
    return { success: false, message: 'Failed to create escrow' }
  }
}

export async function releaseEscrow(
  orderId: string,
  adminUserId?: string
): Promise<EscrowResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        escrow: true,
        dispute: true
      }
    })

    if (!order) {
      return { success: false, message: 'Order not found' }
    }

    if (!order.escrow) {
      return { success: false, message: 'No escrow found for this order' }
    }

    if (order.escrow.released) {
      return { success: false, message: 'Escrow already released' }
    }

    if (order.dispute && order.dispute.status === 'OPEN') {
      return { success: false, message: 'Cannot release escrow while dispute is open' }
    }

    const escrow = await prisma.escrow.update({
      where: { id: order.escrow.id },
      data: { released: true },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' },
    })

    return {
      success: true,
      message: 'Escrow released successfully',
      escrowId: escrow.id,
    }
  } catch (error) {
    console.error('Escrow release error:', error)
    return { success: false, message: 'Failed to release escrow' }
  }
}

export async function refundEscrow(orderId: string): Promise<EscrowResult> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { escrow: true }
    })

    if (!order) {
      return { success: false, message: 'Order not found' }
    }

    if (!order.escrow) {
      return { success: false, message: 'No escrow found for this order' }
    }

    if (order.escrow.released) {
      return { success: false, message: 'Escrow already released, cannot refund' }
    }

    await prisma.escrow.delete({
      where: { id: order.escrow.id },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    })

    return {
      success: true,
      message: 'Escrow refunded successfully',
    }
  } catch (error) {
    console.error('Escrow refund error:', error)
    return { success: false, message: 'Failed to refund escrow' }
  }
}

export async function getEscrowStatus(orderId: string) {
  try {
    const escrow = await prisma.escrow.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            buyer: true,
            seller: true,
            listing: true,
          },
        },
      },
    })

    return escrow
  } catch (error) {
    console.error('Get escrow status error:', error)
    return null
  }
}

export function calculatePlatformFee(amount: number, feePercentage: number = 5): number {
  return Number((amount * (feePercentage / 100)).toFixed(2))
}

export function calculateSellerPayout(totalAmount: number, feePercentage: number = 5): number {
  const fee = calculatePlatformFee(totalAmount, feePercentage)
  return Number((totalAmount - fee).toFixed(2))
}
