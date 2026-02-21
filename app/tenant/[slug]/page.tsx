import { notFound } from 'next/navigation'
import { PROPERTIES, TENANTS } from '@/lib/store'
import TenantChat from '@/components/TenantChat'

export default async function TenantChatPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property = PROPERTIES.find((p) => p.slug === slug)
  if (!property) notFound()

  // Find first tenant for this property (simplification for hackathon)
  const tenant = TENANTS.find((t) => t.propertyId === property.id)
  if (!tenant) notFound()

  return (
    <TenantChat
      propertySlug={property.slug}
      tenantId={tenant.id}
      propertyName={property.name}
      propertyAddress={`${property.address}, ${property.city}, ${property.state} ${property.zip}`}
      tenantName={tenant.name}
      unit={tenant.unit}
      defaultProvider={process.env.LLM_PROVIDER || 'anthropic'}
    />
  )
}
