import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<any | null> {
  try {
    const token = request.cookies.get('token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        sellerProfile: true,
      },
    })

    if (!user || user.isBanned) {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth(request: NextRequest, requiredRole?: string): Promise<any> {
  const user = await getUserFromRequest(request)

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }

  return user
}

export function setAuthCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds
  return `token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`
}

export function clearAuthCookie(): string {
  return `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
}
