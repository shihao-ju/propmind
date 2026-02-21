import { TicketStatus } from './types'

export interface StatusConfig {
  label: string
  color: string // tailwind bg + text classes
  dotColor: string // for small indicators
}

const STATUS_CONFIG: Record<TicketStatus, StatusConfig> = {
  new: {
    label: 'New',
    color: 'bg-gray-100 text-gray-800',
    dotColor: 'bg-gray-400',
  },
  gathering_info: {
    label: 'Gathering info',
    color: 'bg-blue-100 text-blue-800',
    dotColor: 'bg-blue-400',
  },
  triaged: {
    label: 'Triaged',
    color: 'bg-blue-100 text-blue-800',
    dotColor: 'bg-blue-400',
  },
  finding_vendors: {
    label: 'Finding vendors',
    color: 'bg-purple-100 text-purple-800',
    dotColor: 'bg-purple-400',
  },
  awaiting_approval: {
    label: 'Action needed',
    color: 'bg-amber-100 text-amber-800',
    dotColor: 'bg-amber-400',
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-green-100 text-green-800',
    dotColor: 'bg-green-400',
  },
  complete: {
    label: 'Complete',
    color: 'bg-gray-100 text-gray-800',
    dotColor: 'bg-gray-400',
  },
}

export function getStatusConfig(status: TicketStatus): StatusConfig {
  return STATUS_CONFIG[status] || STATUS_CONFIG.new
}

export const ALL_STATUSES: TicketStatus[] = [
  'new',
  'gathering_info',
  'triaged',
  'finding_vendors',
  'awaiting_approval',
  'scheduled',
  'complete',
]
