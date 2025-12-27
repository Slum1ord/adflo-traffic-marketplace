import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../lib/db'
import { hashPassword, generateToken, setAuthCookie } from '../../../lib/auth'
import { Role, Lane } from '@prisma/client'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['BUYER', 'SELLER', 'BOTH']),
  laneAccess: z.enum(['CLEAN', 'PRIVATE']).optional().default('CLEAN'),
  walletAddress: z.string().optional(),
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
    const body = await req.json()

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { email, password, role, laneAccess, walletAddress } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Check if wallet address is already in use
    if (walletAddress) {
      const existingWallet = await prisma.user.findUnique({
        where: { walletAddress },
      })

      if (existingWallet) {
        return NextResponse.json(
          { error: 'Wallet address already in use' },
          { status: 409 }
        )
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: role as Role,
        laneAccess: laneAccess as Lane,
        walletAddress: walletAddress || null,
        // Buyers are auto-approved, sellers need approval
        isApproved: role === 'BUYER',
      },
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: role === 'BUYER'
        ? 'Registration successful'
        : 'Registration successful. Seller profile creation required.',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        laneAccess: user.laneAccess,
        isApproved: user.isApproved,
        walletAddress: user.walletAddress,
      },
      token,
    }, { status: 201 })

    response.headers.set('Set-Cookie', setAuthCookie(token))

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
