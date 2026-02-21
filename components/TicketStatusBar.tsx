'use client'

import { TicketStatus } from '@/lib/types'
import { Check, Circle } from 'lucide-react'

const STEPS: { key: TicketStatus[]; label: string }[] = [
  { key: ['new', 'gathering_info'], label: 'Submitted' },
  { key: ['triaged'], label: 'Triaged' },
  { key: ['finding_vendors'], label: 'Vendors found' },
  { key: ['awaiting_approval'], label: 'Your approval' },
  { key: ['scheduled'], label: 'Scheduled' },
  { key: ['complete'], label: 'Complete' },
]

const STATUS_ORDER: TicketStatus[] = [
  'new',
  'gathering_info',
  'triaged',
  'finding_vendors',
  'awaiting_approval',
  'scheduled',
  'complete',
]

export default function TicketStatusBar({ status }: { status: TicketStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(status)

  function getStepState(step: (typeof STEPS)[number]) {
    const stepMaxIndex = Math.max(
      ...step.key.map((k) => STATUS_ORDER.indexOf(k))
    )
    const stepMinIndex = Math.min(
      ...step.key.map((k) => STATUS_ORDER.indexOf(k))
    )
    if (currentIndex > stepMaxIndex) return 'complete'
    if (currentIndex >= stepMinIndex && currentIndex <= stepMaxIndex)
      return 'current'
    return 'future'
  }

  return (
    <div className="flex items-center gap-1 w-full overflow-x-auto py-2">
      {STEPS.map((step, i) => {
        const state = getStepState(step)
        return (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div
                className={`h-0.5 w-6 mx-1 ${
                  state === 'future' ? 'bg-gray-200' : 'bg-primary'
                }`}
              />
            )}
            <div className="flex items-center gap-1.5">
              {state === 'complete' ? (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              ) : state === 'current' ? (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <Circle className="h-2.5 w-2.5 fill-primary-foreground text-primary-foreground" />
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
              )}
              <span
                className={`text-xs whitespace-nowrap ${
                  state === 'future'
                    ? 'text-muted-foreground'
                    : 'text-foreground font-medium'
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
