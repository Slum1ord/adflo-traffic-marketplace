import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { getUserFromRequest } from '../../../lib/auth'
import { canAccessLane } from '../../../lib/permissions'
import { Lane, TrafficType } from '@prisma/client'

const getListingsSchema = z.object({
  lane: z.enum(['CLEAN', 'PRIVATE']).optional(),
  trafficType: z.enum(['EMAIL', 'SOCIAL', 'NATIVE', 'DISPLAY', 'PUSH', 'MIXED']).optional(),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  sellerId: z.string().optional(),
  isActive: z.string().optional().transform(val => val === 'true'),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
})

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
    // Get current user (optional - public endpoint but filtered by access)
    const user = await getUserFromRequest(req)

    // Parse query parameters
    const url = new URL(req.url)
    const queryParams = Object.fromEntries(url.searchParams.entries())

    const validation = getListingsSchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const {
      lane,
      trafficType,
      minPrice,
      maxPrice,
      sellerId,
      isActive,
      page = 1,
      limit = 20,
    } = validation.data

    // Build filter conditions
    const where: any = {}

    // Lane filter with access control
    if (lane) {
      // If user is not logged in or doesn't have access to PRIVATE, filter it out
      if (lane === 'PRIVATE') {
        if (!user || !canAccessLane(user, 'PRIVATE' as Lane)) {
          return NextResponse.json(
            { error: 'You do not have access to PRIVATE lane listings' },
            { status: 403 }
          )
        }
      }
      where.lane = lane
    } else {
      // If no lane specified, only show lanes user has access to
      if (!user || !canAccessLane(user, 'PRIVATE' as Lane)) {
        where.lane = 'CLEAN'
      }
    }

    if (trafficType) {
      where.trafficType = trafficType
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    if (sellerId) {
      where.sellerId = sellerId
    }

    if (isActive !== undefined) {
      where.isActive = isActive
    } else {
      // By default, only show active listings to non-sellers
      if (!user || (user.role !== 'SELLER' && user.role !== 'BOTH' && user.role !== 'ADMIN')) {
        where.isActive = true
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const take = Math.min(limit, 100) // Cap at 100 items per page

    // Fetch listings with pagination
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take,
        include: {
          seller: {
            include: {
              user: {
                select: {
                  id: true,
                  email: false, // Don't expose seller email
                  role: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.listing.count({ where }),
    ])

    const totalPages = Math.ceil(total / take)

    return NextResponse.json({
      success: true,
      listings,
      pagination: {
        page,
        limit: take,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Get listings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
