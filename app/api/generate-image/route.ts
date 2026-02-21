import { NextRequest, NextResponse } from 'next/server'
import { generateImage } from '@/lib/image-gen'

export async function POST(request: NextRequest) {
  if (!process.env.MINIMAX_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'MINIMAX_API_KEY is not configured' },
      { status: 500 },
    )
  }

  const body = await request.json()
  const { prompt, width, height } = body

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json(
      { success: false, error: 'A prompt string is required' },
      { status: 400 },
    )
  }

  const imageUrl = await generateImage(prompt, { width, height })

  if (!imageUrl) {
    return NextResponse.json(
      { success: false, error: 'Image generation failed' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true, imageUrl })
}
