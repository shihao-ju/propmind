'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Ticket, Vendor } from '@/lib/types'
import { PROPERTIES } from '@/lib/store'
import TicketStatusBar from '@/components/TicketStatusBar'
import VendorCard from '@/components/VendorCard'
import ConfirmBookingModal from '@/components/ConfirmBookingModal'
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const URGENCY_BADGE: Record<string, string> = {
  emergency: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-green-100 text-green-800',
}

const URGENCY_TEXT: Record<string, string> = {
  emergency: 'Emergency — act immediately.',
  medium: 'Non-emergency. Schedule within 48 hours.',
  low: 'Low priority. Schedule within 1 week.',
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const fetchTicket = useCallback(async () => {
    try {
      const res = await fetch(`/api/tickets/${id}`)
      if (res.ok) {
        setTicket(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch ticket:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTicket()
    // In demo mode, poll every 1s so state changes from DemoControls reflect instantly
    if (isDemo) {
      const interval = setInterval(fetchTicket, 1000)
      return () => clearInterval(interval)
    }
  }, [fetchTicket, isDemo])

  function handleVendorSelect(vendor: Vendor, slot: string) {
    setSelectedVendor(vendor)
    setSelectedSlot(slot)
    setModalOpen(true)
  }

  async function handleConfirm() {
    if (!selectedVendor || !selectedSlot) return
    setConfirming(true)
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'scheduled',
          selectedVendor,
          selectedSlot,
        }),
      })
      if (res.ok) {
        setTicket(await res.json())
        setModalOpen(false)
      }
    } catch (err) {
      console.error('Failed to confirm:', err)
    } finally {
      setConfirming(false)
    }
  }

  async function handleMarkComplete() {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'complete' }),
      })
      if (res.ok) {
        setTicket(await res.json())
      }
    } catch (err) {
      console.error('Failed to mark complete:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="h-4 w-24 bg-muted animate-pulse rounded mb-4" />
        <div className="h-7 w-72 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="h-16 bg-muted animate-pulse rounded mb-4" />
        <div className="h-24 bg-muted animate-pulse rounded mb-4" />
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center text-muted-foreground">
        Ticket not found.{' '}
        <Link href="/dashboard" className="underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const property = PROPERTIES.find((p) => p.id === ticket.propertyId)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">{ticket.summary}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {property?.name} &middot; Unit {ticket.unit} &middot;{' '}
            {ticket.tenantName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submitted {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
        <Badge className={URGENCY_BADGE[ticket.urgency]}>
          {ticket.urgency}
        </Badge>
      </div>

      {/* Status bar */}
      <Card className="p-4 mb-4">
        <TicketStatusBar status={ticket.status} />
      </Card>

      {/* AI Summary */}
      <Card className="p-4 mb-4 border-primary/20">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">AI Summary</p>
            <p className="text-sm text-muted-foreground mt-1">
              {ticket.summary}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {URGENCY_TEXT[ticket.urgency]}
            </p>
          </div>
        </div>
      </Card>

      {/* Dynamic content by status */}
      {ticket.status === 'finding_vendors' && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-3">
            Searching for vendors near {property?.city}, {property?.state}...
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="h-4 w-32 bg-muted animate-pulse rounded mb-3" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-20 bg-muted animate-pulse rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-8 bg-muted animate-pulse rounded" />
                  <div className="h-8 bg-muted animate-pulse rounded" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {ticket.status === 'awaiting_approval' && ticket.vendors.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-3">
            Select a vendor ({ticket.vendors.length} available)
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {ticket.vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onSelect={handleVendorSelect}
              />
            ))}
          </div>
        </div>
      )}

      {ticket.status === 'scheduled' && ticket.selectedVendor && (
        <Card className="p-4 mb-4 border-green-200 bg-green-50">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Appointment Scheduled
              </p>
              <p className="text-sm text-green-700 mt-1">
                {ticket.selectedVendor.name} &middot; {ticket.selectedSlot}
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                {ticket.selectedVendor.phone}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkComplete}
            >
              Mark as Complete
            </Button>
          </div>
        </Card>
      )}

      {ticket.status === 'complete' && (
        <Card className="p-4 mb-4 bg-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-medium">
              This ticket has been resolved.
            </p>
          </div>
        </Card>
      )}

      {/* Message thread */}
      {ticket.messages.length > 0 && (
        <>
          <Separator className="my-4" />
          <h2 className="text-sm font-semibold mb-3">Conversation</h2>
          <div className="space-y-3">
            {ticket.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'tenant' ? 'justify-end' : 'justify-start'}`}
              >
                <Card
                  className={`max-w-[80%] px-3 py-2 ${
                    msg.role === 'tenant' ? 'bg-primary/10' : 'bg-muted'
                  }`}
                >
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">
                    {msg.role === 'tenant' ? ticket.tenantName : 'PropMind AI'}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirmation modal */}
      <ConfirmBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        vendor={selectedVendor}
        slot={selectedSlot}
        issueSummary={ticket.summary}
        propertyName={property?.name || 'Unknown'}
        loading={confirming}
      />
    </div>
  )
}
