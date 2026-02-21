import { NextRequest } from 'next/server'
import { tickets } from '@/lib/store'

export async function GET(req: NextRequest) {
  const allTickets = Array.from(tickets.values())
  return Response.json(allTickets)
}
