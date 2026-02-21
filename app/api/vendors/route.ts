import { NextRequest } from 'next/server'
import { getMockVendors } from '@/lib/vendors'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const issueType = searchParams.get('issue_type') || 'other'
  const zip = searchParams.get('zip') || '00000'

  const vendors = getMockVendors(issueType, zip)
  return Response.json(vendors)
}
