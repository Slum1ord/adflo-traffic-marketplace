import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/auth'
import { canApproveSeller } from '../../../lib/permissions'

const approveSellerSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  approved: z.boolean(),
  notes: z.string().max(500).optional(),
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

    if (!canApproveSeller(admin)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = approveSellerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { userId, approved, notes } = validation.data

    // Find user with seller profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sellerProfile: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has seller role
    if (user.role !== 'SELLER' && user.role !== 'BOTH') {
      return NextResponse.json(
        { error: 'User is not a seller' },
        { status: 400 }
      )
    }

    // Check if seller profile exists
    if (!user.sellerProfile) {
      return NextResponse.json(
        { error: 'Seller profile not found. User must create a seller profile first.' },
        { status: 404 }
      )
    }

    // Check if seller has agreed to compliance
    if (!user.sellerProfile.complianceAgreed) {
      return NextResponse.json(
        { error: 'Seller has not agreed to compliance terms' },
        { status: 400 }
      )
    }

    // Update user approval status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: approved },
      include: {
        sellerProfile: true,
      },
    })

    // Log the approval action (you could extend this to create an audit log entry)
    console.log(`Admin ${admin.email} ${approved ? 'approved' : 'rejected'} seller ${user.email}${notes ? `. Notes: ${notes}` : ''}`)

    return NextResponse.json({
      success: true,
      message: approved
        ? 'Seller approved successfully. They can now create listings.'
        : 'Seller approval revoked. Their listings will be deactivated.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        laneAccess: updatedUser.laneAccess,
        isApproved: updatedUser.isApproved,
        isBanned: updatedUser.isBanned,
        sellerProfile: {
          id: updatedUser.sellerProfile?.id,
          displayName: updatedUser.sellerProfile?.displayName,
          trafficTypes: updatedUser.sellerProfile?.trafficTypes,
          allowedLanes: updatedUser.sellerProfile?.allowedLanes,
          reputationClean: updatedUser.sellerProfile?.reputationClean,
          reputationPrivate: updatedUser.sellerProfile?.reputationPrivate,
        },
        createdAt: updatedUser.createdAt,
      },
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

    console.error('Approve seller error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
