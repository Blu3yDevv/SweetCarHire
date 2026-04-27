"use client"

import { useState } from "react"
import { X, Receipt, ChevronUp, Shield, Check } from "lucide-react"

interface MobileBookingSummaryProps {
  carType: string
  dailyRate: number
  rentalDays: number
  childSeat: boolean
  additionalDriver: boolean
  lateFee: number
  totalPrice: number
  formatPrice: (price: number) => string
}

export function MobileBookingSummary({
  carType,
  dailyRate,
  rentalDays,
  childSeat,
  additionalDriver,
  lateFee,
  totalPrice,
  formatPrice,
}: MobileBookingSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Collapsed bar - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-navy text-white px-4 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-magenta/20 flex items-center justify-center">
            <Receipt className="w-4 h-4 text-magenta" />
          </div>
          <div className="text-left">
            <p className="text-xs text-white/70">Booking Total</p>
            <p className="text-lg font-bold text-magenta">{formatPrice(totalPrice)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span className="text-sm">View Details</span>
          <ChevronUp className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Expanded summary panel */}
      <div
        className={`absolute bottom-full left-0 right-0 bg-white rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out overflow-hidden ${
          isOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-navy">Booking Summary</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-navy" />
            </button>
          </div>

          {/* Car details */}
          {carType && (
            <div className="space-y-3 mb-5 pb-5 border-b border-navy/10">
              <div className="flex justify-between">
                <span className="font-medium text-navy">{carType}</span>
                <span className="text-navy">{formatPrice(dailyRate)}/day</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {formatPrice(dailyRate)}/day × {rentalDays} day{rentalDays > 1 ? "s" : ""}
                </span>
                <span>{formatPrice(dailyRate * rentalDays)}</span>
              </div>
            </div>
          )}

          {/* Extras */}
          {(childSeat || additionalDriver) && (
            <div className="space-y-2 mb-5 pb-5 border-b border-navy/10">
              <h4 className="font-semibold text-navy text-sm">Extras:</h4>
              {childSeat && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Child Seat (one-time)</span>
                  <span>{formatPrice(5)}</span>
                </div>
              )}
              {additionalDriver && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Additional Driver (one-time)</span>
                  <span>{formatPrice(10)}</span>
                </div>
              )}
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between text-xl font-bold text-magenta mb-5">
            <span>Total:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          {/* Late fee notice */}
          {lateFee > 0 && (
            <div className="mb-5 pb-5 border-b border-navy/10">
              <p className="text-xs font-semibold text-amber-700 mb-1">⚠ Late Drop-off Fee</p>
              <p className="text-xs text-muted-foreground">
                If you return the car after the scheduled pickup time on the final day, an additional fee of {formatPrice(lateFee)} will be charged.
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-cream/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-navy">
              <Shield className="w-4 h-4 text-magenta flex-shrink-0" />
              <span>Free cancellation up to 24h</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-navy">
              <Check className="w-4 h-4 text-magenta flex-shrink-0" />
              <span>Insurance included</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-navy">
              <Check className="w-4 h-4 text-magenta flex-shrink-0" />
              <span>24/7 roadside assistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop when open */}
      {isOpen && <div className="fixed inset-0 bg-black/30 -z-10" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
