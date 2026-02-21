export type IssueType =
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'appliance'
  | 'structural'
  | 'pest'
  | 'other'

export type Urgency = 'emergency' | 'medium' | 'low'

export type TicketStatus =
  | 'new'
  | 'gathering_info'
  | 'triaged'
  | 'finding_vendors'
  | 'awaiting_approval'
  | 'scheduled'
  | 'complete'

export interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  slug: string // used in tenant URL: /tenant/[slug]
}

export interface Tenant {
  id: string
  name: string
  unit: string
  propertyId: string
}

export interface Message {
  role: 'tenant' | 'ai'
  content: string
  timestamp: Date
}

export interface Vendor {
  id: string
  name: string
  rating: number
  reviewCount: number
  distanceMiles: number
  estimatedCostLow: number
  estimatedCostHigh: number
  availableSlots: string[] // e.g. ["Tomorrow 9–11am", "Tomorrow 2–4pm"]
  phone: string
}

export interface Ticket {
  id: string
  propertyId: string
  tenantId: string
  tenantName: string
  unit: string
  issueType: IssueType
  urgency: Urgency
  summary: string // AI-generated one-liner
  rawMessage: string // tenant's original words
  status: TicketStatus
  messages: Message[]
  vendors: Vendor[] // populated in finding_vendors state
  selectedVendor?: Vendor
  selectedSlot?: string
  createdAt: Date
  updatedAt: Date
}
