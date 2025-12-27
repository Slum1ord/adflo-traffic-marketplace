import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { requireAuth } from '../../../lib/auth'
import { TrafficType, Lane } from '@prisma/client'

const createSellerSchema = z.object({
  displayName: z.string().min(3, 'Display name must be at least 3 characters').max(50),
  bio: z.string().max(500).optional(),
  trafficTypes: z.array(z.enum(['EMAIL', 'SOCIAL', 'NATIVE', 'DISPLAY', 'PUSH', 'MIXED'])).min(1, 'Select at least one traffic type'),
  allowedLanes: z.array(z.enum(['CLEAN', 'PRIVATE'])).min(1, 'Select at least one lane'),
  complianceAgreed: z.boolean().refine(val => val === true, 'You must agree to compliance terms'),
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

    // Check if user role allows seller profile
    if (user.role !== 'SELLER' && user.role !== 'BOTH') {
      return NextResponse.json(
        { error: 'Only users with SELLER or BOTH role can create seller profiles' },
        { status: 403 }
      )
    }

    // Check if seller profile already exists
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Seller profile already exists' },
        { status: 409 }
      )
    }

    const body = await req.json()

    // Validate input
    const validation = createSellerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { displayName, bio, trafficTypes, allowedLanes, complianceAgreed } = validation.data

    // Verify lane access matches user's account settings
    if (allowedLanes.includes('PRIVATE' as Lane) && user.laneAccess !== 'PRIVATE') {
      return NextResponse.json(
        { error: 'Your account does not have PRIVATE lane access. Please contact support.' },
        { status: 403 }
      )
    }

    // Create seller profile
    const sellerProfile = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        displayName,
        bio: bio || null,
        trafficTypes: trafficTypes as TrafficType[],
        allowedLanes: allowedLanes as Lane[],
        complianceAgreed,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            laneAccess: true,
            isApproved: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Seller profile created successfully. Awaiting admin approval.',
      sellerProfile,
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

    console.error('Create seller profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
