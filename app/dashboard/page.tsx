'use client'

import { useState, useEffect, useCallback } from 'react'
import { PROPERTIES } from '@/lib/store'
import { Ticket } from '@/lib/types'
import PropertySidebar from '@/components/PropertySidebar'
import TicketCard from '@/components/TicketCard'

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/tickets')
      if (res.ok) {
        const data = await res.json()
        setTickets(data)
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
    const interval = setInterval(fetchTickets, 5000)
    return () => clearInterval(interval)
  }, [fetchTickets])

  const filtered = selectedPropertyId
    ? tickets.filter((t) => t.propertyId === selectedPropertyId)
    : tickets

  const activeTickets = filtered.filter((t) => t.status !== 'complete')
  const completedTickets = filtered.filter((t) => t.status === 'complete')

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <PropertySidebar
        properties={PROPERTIES}
        tickets={tickets}
        selectedPropertyId={selectedPropertyId}
        onSelect={setSelectedPropertyId}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold mb-1">Maintenance Tickets</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {activeTickets.length} active{' '}
            {activeTickets.length === 1 ? 'ticket' : 'tickets'}
            {selectedPropertyId && (
              <>
                {' '}
                for{' '}
                {PROPERTIES.find((p) => p.id === selectedPropertyId)?.name}
              </>
            )}
          </p>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : activeTickets.length === 0 && completedTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No tickets yet. Your tenants are all good.</p>
            </div>
          ) : (
            <>
              {activeTickets.length > 0 && (
                <div className="space-y-3 mb-8">
                  {activeTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              )}

              {completedTickets.length > 0 && (
                <>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Recently Completed
                  </h2>
                  <div className="space-y-3 opacity-60">
                    {completedTickets.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
