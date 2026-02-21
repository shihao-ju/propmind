'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Vendor } from '@/lib/types'

interface ConfirmBookingModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  vendor: Vendor | null
  slot: string | null
  issueSummary: string
  propertyName: string
  loading?: boolean
}

export default function ConfirmBookingModal({
  open,
  onClose,
  onConfirm,
  vendor,
  slot,
  issueSummary,
  propertyName,
  loading,
}: ConfirmBookingModalProps) {
  if (!vendor || !slot) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Review the details below before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
            <span className="text-muted-foreground">Vendor</span>
            <span className="font-medium">{vendor.name}</span>

            <span className="text-muted-foreground">Time slot</span>
            <span className="font-medium">{slot}</span>

            <span className="text-muted-foreground">Property</span>
            <span>{propertyName}</span>

            <span className="text-muted-foreground">Issue</span>
            <span>{issueSummary}</span>

            <span className="text-muted-foreground">Est. cost</span>
            <span>
              ${vendor.estimatedCostLow}–${vendor.estimatedCostHigh}
            </span>
          </div>

          <div className="bg-muted rounded-md p-3 text-sm">
            <p className="font-medium mb-1.5">PropMind will:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Notify the vendor and confirm the appointment</li>
              <li>Send the tenant a confirmation with the scheduled time</li>
              <li>Send you a reminder 1 hour before the appointment</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
