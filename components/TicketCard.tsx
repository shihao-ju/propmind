'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticket } from '@/lib/types'
import { PROPERTIES } from '@/lib/store'
import {
  Droplets,
  Zap,
  Wind,
  Refrigerator,
  Hammer,
  Bug,
  Wrench,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

const ISSUE_ICONS: Record<string, React.ReactNode> = {
  plumbing: <Droplets className="h-4 w-4" />,
  electrical: <Zap className="h-4 w-4" />,
  hvac: <Wind className="h-4 w-4" />,
  appliance: <Refrigerator className="h-4 w-4" />,
  structural: <Hammer className="h-4 w-4" />,
  pest: <Bug className="h-4 w-4" />,
  other: <Wrench className="h-4 w-4" />,
}

const URGENCY_STYLES: Record<string, { border: string; badge: string }> = {
  emergency: { border: 'border-l-4 border-l-red-500', badge: 'bg-red-100 text-red-800' },
  medium: { border: 'border-l-4 border-l-amber-500', badge: 'bg-amber-100 text-amber-800' },
  low: { border: 'border-l-4 border-l-green-500', badge: 'bg-green-100 text-green-800' },
}

const STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  new: { label: 'New', variant: 'bg-gray-100 text-gray-800' },
  gathering_info: { label: 'Gathering info', variant: 'bg-blue-100 text-blue-800' },
  triaged: { label: 'Triaged', variant: 'bg-blue-100 text-blue-800' },
  finding_vendors: { label: 'Finding vendors', variant: 'bg-purple-100 text-purple-800' },
  awaiting_approval: { label: 'Action needed', variant: 'bg-amber-100 text-amber-800' },
  scheduled: { label: 'Scheduled', variant: 'bg-green-100 text-green-800' },
  complete: { label: 'Complete', variant: 'bg-gray-100 text-gray-800' },
}

function timeAgo(date: Date | string): string {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const property = PROPERTIES.find((p) => p.id === ticket.propertyId)
  const urgency = URGENCY_STYLES[ticket.urgency] || URGENCY_STYLES.low
  const status = STATUS_LABELS[ticket.status] || STATUS_LABELS.new
  const isActionNeeded = ticket.status === 'awaiting_approval'

  return (
    <Link href={`/dashboard/tickets/${ticket.id}`}>
      <Card
        className={`p-4 cursor-pointer transition-colors hover:bg-accent ${urgency.border}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 text-muted-foreground">
              {ISSUE_ICONS[ticket.issueType] || ISSUE_ICONS.other}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{ticket.summary}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {property?.name || 'Unknown'} &middot; Unit {ticket.unit} &middot;{' '}
                {ticket.tenantName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {timeAgo(ticket.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge className={`text-xs ${status.variant}`}>
              {status.label}
            </Badge>
            {isActionNeeded && (
              <span className="text-xs font-medium text-amber-600 flex items-center gap-0.5">
                Review <ChevronRight className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
