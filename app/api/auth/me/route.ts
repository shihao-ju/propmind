import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('propmind-session')?.value
  if (!cookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const session = decodeSession(cookie)
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  return NextResponse.json({ user: session })
}
