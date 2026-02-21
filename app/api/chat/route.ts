import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  return new Response(JSON.stringify({ message: 'Chat endpoint placeholder' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
