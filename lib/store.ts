import { Ticket, Property, Tenant } from './types'

// Seed data — 3 properties, 2 tenants
export const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: '123 Oak St',
    address: '123 Oak Street',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    slug: 'portland-oak-st',
  },
  {
    id: 'prop-2',
    name: '456 Maple Ave',
    address: '456 Maple Avenue',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    slug: 'austin-maple-ave',
  },
  {
    id: 'prop-3',
    name: '789 Pine Rd',
    address: '789 Pine Road',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    slug: 'chicago-pine-rd',
  },
]

export const TENANTS: Tenant[] = [
  { id: 'tenant-1', name: 'Maria Lopez', unit: '2B', propertyId: 'prop-1' },
  { id: 'tenant-2', name: 'James Kim', unit: '3C', propertyId: 'prop-3' },
]

// Persist ticket store across HMR in dev mode using globalThis
const globalForTickets = globalThis as unknown as {
  __tickets?: Map<string, Ticket>
}

if (!globalForTickets.__tickets) {
  globalForTickets.__tickets = new Map()

  // Seed one pre-existing completed ticket so dashboard isn't empty
  globalForTickets.__tickets.set('ticket-seed-1', {
    id: 'ticket-seed-1',
    propertyId: 'prop-2',
    tenantId: 'tenant-seed',
    tenantName: 'Derek Walsh',
    unit: '1B',
    issueType: 'hvac',
    urgency: 'low',
    summary: 'AC filter replacement requested',
    rawMessage: 'Can someone replace the AC filter? It looks really dirty.',
    status: 'complete',
    messages: [],
    vendors: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  })

  // Demo ticket — pre-seeded at awaiting_approval for walkthrough
  globalForTickets.__tickets.set('demo-ticket-1', {
    id: 'demo-ticket-1',
    propertyId: 'prop-1',
    tenantId: 'tenant-1',
    tenantName: 'Maria Lopez',
    unit: '2B',
    issueType: 'plumbing',
    urgency: 'medium',
    summary: 'Kitchen sink leaking under cabinet. Water dripping, bucket in place.',
    rawMessage: 'My kitchen sink is leaking under the cabinet. Water is pooling.',
    status: 'awaiting_approval',
    messages: [
      { role: 'tenant', content: 'My kitchen sink is leaking under the cabinet. Water is pooling.', timestamp: new Date(Date.now() - 25 * 60 * 1000) },
      { role: 'ai', content: 'I\'m sorry to hear that. Is water actively dripping right now, or has it pooled and stopped?', timestamp: new Date(Date.now() - 24 * 60 * 1000) },
      { role: 'tenant', content: 'It\'s still dripping slowly. I put a bucket under it.', timestamp: new Date(Date.now() - 22 * 60 * 1000) },
      { role: 'ai', content: 'Got it — I\'ve created a repair ticket and found 3 plumbers available nearby. Your landlord is reviewing the options now.', timestamp: new Date(Date.now() - 21 * 60 * 1000) },
    ],
    vendors: [
      {
        id: 'v1',
        name: "Mike's Plumbing",
        rating: 4.8,
        reviewCount: 127,
        distanceMiles: 0.8,
        estimatedCostLow: 150,
        estimatedCostHigh: 250,
        availableSlots: ['Tomorrow 9–11am', 'Tomorrow 2–4pm', 'Wednesday 10am–12pm'],
        phone: '(503) 555-0101',
      },
      {
        id: 'v2',
        name: 'Fast Fix Plumbing',
        rating: 4.5,
        reviewCount: 89,
        distanceMiles: 1.4,
        estimatedCostLow: 180,
        estimatedCostHigh: 300,
        availableSlots: ['Tomorrow 1–3pm', 'Thursday 9–11am'],
        phone: '(503) 555-0202',
      },
      {
        id: 'v3',
        name: 'Portland Pro Services',
        rating: 4.3,
        reviewCount: 44,
        distanceMiles: 2.1,
        estimatedCostLow: 120,
        estimatedCostHigh: 200,
        availableSlots: ['Wednesday 2–4pm', 'Friday 9–11am'],
        phone: '(503) 555-0303',
      },
    ],
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
    updatedAt: new Date(Date.now() - 21 * 60 * 1000),
  })
}

export const tickets = globalForTickets.__tickets
