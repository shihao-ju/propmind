import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials, encodeSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 },
    )
  }

  const user = validateCredentials(email, password)
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 },
    )
  }

  const session = encodeSession(user)
  const response = NextResponse.json({ success: true, user })

  response.cookies.set('propmind-session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}
