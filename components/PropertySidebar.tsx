'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Property, Ticket } from '@/lib/types'
import { Building2 } from 'lucide-react'

interface PropertySidebarProps {
  properties: Property[]
  tickets: Ticket[]
  selectedPropertyId: string | null
  onSelect: (propertyId: string | null) => void
}

export default function PropertySidebar({
  properties,
  tickets,
  selectedPropertyId,
  onSelect,
}: PropertySidebarProps) {
  const activeCount = (propId: string) =>
    tickets.filter((t) => t.propertyId === propId && t.status !== 'complete').length

  const totalActive = tickets.filter((t) => t.status !== 'complete').length

  const hasUrgent = (propId: string) =>
    tickets.some(
      (t) =>
        t.propertyId === propId &&
        t.urgency === 'emergency' &&
        t.status !== 'complete'
    )

  return (
    <div className="w-60 border-r bg-white p-4 flex flex-col gap-2 h-full overflow-y-auto">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        Properties
      </h2>

      {/* All Properties */}
      <Card
        className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
          selectedPropertyId === null ? 'bg-accent border-primary' : ''
        }`}
        onClick={() => onSelect(null)}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">All Properties</span>
          {totalActive > 0 && (
            <Badge variant="secondary" className="text-xs">
              {totalActive}
            </Badge>
          )}
        </div>
      </Card>

      {/* Individual properties */}
      {properties.map((prop) => {
        const count = activeCount(prop.id)
        const urgent = hasUrgent(prop.id)
        const isSelected = selectedPropertyId === prop.id

        return (
          <Card
            key={prop.id}
            className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
              isSelected ? 'bg-accent border-primary' : ''
            } ${urgent ? 'border-l-4 border-l-red-500' : ''}`}
            onClick={() => onSelect(prop.id)}
          >
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">
                    {prop.name}
                  </span>
                  {count > 0 && (
                    <Badge
                      variant={urgent ? 'destructive' : 'secondary'}
                      className="text-xs ml-2 shrink-0"
                    >
                      {count}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {prop.city}, {prop.state}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
