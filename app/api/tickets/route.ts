import { NextRequest } from 'next/server'
import { tickets } from '@/lib/store'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const propertyId = searchParams.get('propertyId')

  let allTickets = Array.from(tickets.values())

  if (propertyId) {
    allTickets = allTickets.filter((t) => t.propertyId === propertyId)
  }

  // Sort: awaiting_approval first, then by urgency (emergency > medium > low), then newest first
  const urgencyOrder = { emergency: 0, medium: 1, low: 2 }
  const statusOrder = { awaiting_approval: 0 }

  allTickets.sort((a, b) => {
    const aStatus = (statusOrder as Record<string, number>)[a.status] ?? 10
    const bStatus = (statusOrder as Record<string, number>)[b.status] ?? 10
    if (aStatus !== bStatus) return aStatus - bStatus

    const aUrg = urgencyOrder[a.urgency] ?? 3
    const bUrg = urgencyOrder[b.urgency] ?? 3
    if (aUrg !== bUrg) return aUrg - bUrg

    return b.createdAt.getTime() - a.createdAt.getTime()
  })

  return Response.json(allTickets)
}
