import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie } from '../../../lib/auth'

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
    // Create response with cleared cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    response.headers.set('Set-Cookie', clearAuthCookie())

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
