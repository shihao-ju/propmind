'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TicketStatus } from '@/lib/types'
import { getStatusConfig, ALL_STATUSES } from '@/lib/status'
import { ChevronLeft, ChevronRight, Monitor } from 'lucide-react'

const DEMO_TICKET_ID = 'demo-ticket-1'

interface DemoControlsProps {
  onStatusChange?: (newStatus: TicketStatus) => void
}

export default function DemoControls({ onStatusChange }: DemoControlsProps) {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  const [currentIndex, setCurrentIndex] = useState(
    ALL_STATUSES.indexOf('awaiting_approval')
  )
  const [updating, setUpdating] = useState(false)

  if (!isDemo) return null

  const currentStatus = ALL_STATUSES[currentIndex]
  const config = getStatusConfig(currentStatus)

  async function changeStatus(newIndex: number) {
    if (newIndex < 0 || newIndex >= ALL_STATUSES.length || updating) return
    setUpdating(true)
    const newStatus = ALL_STATUSES[newIndex]

    try {
      const res = await fetch(`/api/tickets/${DEMO_TICKET_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setCurrentIndex(newIndex)
        onStatusChange?.(newStatus)
      }
    } catch (err) {
      console.error('Demo status change failed:', err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-3 z-50 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <Monitor className="h-4 w-4 text-amber-400" />
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">
          Demo Mode
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Status track */}
        <div className="hidden md:flex items-center gap-1">
          {ALL_STATUSES.map((s, i) => {
            const sc = getStatusConfig(s)
            return (
              <button
                key={s}
                onClick={() => changeStatus(i)}
                disabled={updating}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === currentIndex
                    ? `${sc.dotColor} ring-2 ring-white ring-offset-1 ring-offset-gray-900`
                    : i < currentIndex
                      ? sc.dotColor
                      : 'bg-gray-600'
                }`}
                title={sc.label}
              />
            )
          })}
        </div>

        <Badge className={`${config.color} text-xs`}>{config.label}</Badge>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-white hover:bg-gray-700"
            onClick={() => changeStatus(currentIndex - 1)}
            disabled={currentIndex === 0 || updating}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-white hover:bg-gray-700"
            onClick={() => changeStatus(currentIndex + 1)}
            disabled={currentIndex === ALL_STATUSES.length - 1 || updating}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <span className="text-xs text-gray-400">
        {currentIndex + 1}/{ALL_STATUSES.length}
      </span>
    </div>
  )
}
