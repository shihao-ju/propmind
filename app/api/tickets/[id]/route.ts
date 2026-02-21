import { NextRequest } from 'next/server'
import { tickets } from '@/lib/store'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ticket = tickets.get(id)
  if (!ticket) {
    return Response.json({ error: 'Ticket not found' }, { status: 404 })
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
    return Response.json({ error: 'Ticket not found' }, { status: 404 })
  }

  const updates = await req.json()

  // Only allow specific fields to be updated
  const allowedFields = ['status', 'selectedVendor', 'selectedSlot'] as const
  const safeUpdates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in updates) {
      safeUpdates[field] = updates[field]
    }
  }

  const updated = { ...ticket, ...safeUpdates, updatedAt: new Date() }
  tickets.set(id, updated)

  console.log(`[ticket:${id}] updated:`, Object.keys(safeUpdates).join(', '))
  return Response.json(updated)
}
