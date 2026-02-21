'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Vendor } from '@/lib/types'
import { Star, MapPin, DollarSign } from 'lucide-react'

interface VendorCardProps {
  vendor: Vendor
  onSelect: (vendor: Vendor, slot: string) => void
}

export default function VendorCard({ vendor, onSelect }: VendorCardProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm">{vendor.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {vendor.rating} ({vendor.reviewCount})
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {vendor.distanceMiles} mi
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              ${vendor.estimatedCostLow}–${vendor.estimatedCostHigh}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <p className="text-xs font-medium text-muted-foreground">
          Available slots:
        </p>
        {vendor.availableSlots.map((slot) => (
          <label
            key={slot}
            className={`flex items-center gap-2 p-2 rounded-md border text-sm cursor-pointer transition-colors ${
              selectedSlot === slot
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-accent'
            }`}
          >
            <input
              type="radio"
              name={`vendor-${vendor.id}`}
              checked={selectedSlot === slot}
              onChange={() => setSelectedSlot(slot)}
              className="accent-primary"
            />
            {slot}
          </label>
        ))}
      </div>

      <Button
        size="sm"
        className="w-full"
        disabled={!selectedSlot}
        onClick={() => selectedSlot && onSelect(vendor, selectedSlot)}
      >
        Select this vendor
      </Button>
    </Card>
  )
}
