import { NextRequest } from 'next/server'
import { tickets } from '@/lib/store'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ticket = tickets.get(id)
  if (!ticket) {
    return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404 })
  }
  return Response.json(ticket)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ticket = tickets.get(id)
  if (!ticket) {
    return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404 })
  }
  const updates = await req.json()
  const updated = { ...ticket, ...updates, updatedAt: new Date() }
  tickets.set(id, updated)
  return Response.json(updated)
}
