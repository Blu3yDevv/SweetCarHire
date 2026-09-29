"use client"

import { useEffect, useRef, useState } from "react"
import { X, Receipt, ChevronUp } from "lucide-react"

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

export function MobileBookingSummary({ carType, dailyRate, rentalDays, childSeat, additionalDriver, totalPrice, formatPrice }: MobileBookingSummaryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!isOpen) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIsOpen(false); trigger.current?.focus() }
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [isOpen])
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50">
      {isOpen && (
        <section id="mobile-trip-summary" aria-label="Estimated rental charges" className="bg-white border-t border-border rounded-t-3xl shadow-xl p-5 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-xl text-navy">Estimated rental charges</h2>
            <button aria-label="Close trip summary" onClick={() => { setIsOpen(false); trigger.current?.focus() }} className="p-3 rounded-full bg-cream"><X className="w-5 h-5" /></button>
          </div>
          {carType ? (
            <div className="text-sm space-y-3 text-navy">
              <p className="font-semibold">{carType}</p>
              <div className="flex justify-between gap-3"><span>{formatPrice(dailyRate)} × {rentalDays} day{rentalDays === 1 ? "" : "s"}</span><span>{formatPrice(dailyRate * rentalDays)}</span></div>
              {childSeat && <div className="flex justify-between gap-3"><span>Child seat · one-time</span><span>{formatPrice(5)}</span></div>}
              {additionalDriver && <div className="flex justify-between gap-3"><span>Additional driver · one-time</span><span>{formatPrice(10)}</span></div>}
              <div className="flex justify-between font-bold text-xl border-t pt-4"><span>Rental estimate</span><span>{formatPrice(totalPrice)}</span></div>
            </div>
          ) : <p className="text-muted-foreground">Choose a car to see your estimate.</p>}
          <p className="text-xs text-muted-foreground mt-5">Each started 24-hour period counts as one rental day. Extras are charged once. This estimate uses base EUR rates and excludes insurance. The team will confirm any available cover, premium and terms with your quote.</p>
        </section>
      )}
      <button ref={trigger} aria-expanded={isOpen} aria-controls={isOpen ? "mobile-trip-summary" : undefined} onClick={() => setIsOpen(!isOpen)} className="w-full bg-navy text-white px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-lg">
        <span className="flex items-center gap-3"><Receipt className="w-5 h-5 text-pink" /><span className="text-left"><span className="block text-xs text-white/75">Rental estimate · insurance excluded</span><span className="block text-lg font-bold">{carType ? formatPrice(totalPrice) : "Choose a car"}</span></span></span>
        <span className="flex items-center gap-2 text-sm">{isOpen ? "Hide details" : "View details"}<ChevronUp className={`w-5 h-5 ${isOpen ? "rotate-180" : ""}`} /></span>
      </button>
    </div>
  )
}
