import { Vendor } from './types'

const VENDOR_DB: Record<string, { names: string[]; prefix: string }> = {
  plumbing: {
    names: ["Mike's Plumbing", 'Fast Fix Plumbing', 'Pro Pipe Services'],
    prefix: 'Plumber',
  },
  electrical: {
    names: ['Spark Electric Co', 'BrightWire Electrical', 'PowerUp Electric'],
    prefix: 'Electrician',
  },
  hvac: {
    names: ['CoolBreeze HVAC', 'AirFlow Solutions', 'TempRight Heating & Air'],
    prefix: 'HVAC Tech',
  },
  appliance: {
    names: ['AppliancePro Repair', 'FixIt Appliances', 'HomeServe Appliance'],
    prefix: 'Appliance Tech',
  },
  structural: {
    names: ['SolidWall Contractors', 'FoundationFirst', 'BuildRight Repairs'],
    prefix: 'Contractor',
  },
  pest: {
    names: ['BugBusters Pest Control', 'SafeHome Exterminators', 'GreenShield Pest'],
    prefix: 'Pest Control',
  },
  other: {
    names: ['HandyPro Services', 'AllFix Maintenance', 'QuickRepair Co'],
    prefix: 'Handyman',
  },
}

export function getMockVendors(issueType: string, _zip: string): Vendor[] {
  const db = VENDOR_DB[issueType] || VENDOR_DB.other
  return db.names.map((name, i) => ({
    id: `v${i + 1}`,
    name,
    rating: parseFloat((4.8 - i * 0.3).toFixed(1)),
    reviewCount: [127, 89, 44][i],
    distanceMiles: parseFloat((0.8 + i * 0.6).toFixed(1)),
    estimatedCostLow: 120 + i * 30,
    estimatedCostHigh: 200 + i * 50,
    availableSlots: [
      ['Tomorrow 9–11am', 'Tomorrow 2–4pm', 'Wednesday 10am–12pm'],
      ['Tomorrow 1–3pm', 'Thursday 9–11am'],
      ['Wednesday 2–4pm', 'Friday 9–11am'],
    ][i],
    phone: `(555) 010-${String(i + 1).padStart(4, '0')}`,
  }))
}
