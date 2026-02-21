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
}

export const tickets = globalForTickets.__tickets
