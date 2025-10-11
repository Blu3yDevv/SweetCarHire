/**
 * Sweet Car Hire Pricing Calculator
 * Single source of truth for pricing calculations
 * Mirrors the logic from pro.py
 */

export interface BookingInput {
  dailyRate: number
  billableDays: number
  // FIXED FEES (per booking, NOT per day)
  childSeat?: boolean
  additionalDriver?: boolean
  // currency/i18n
  currency: string // ISO 4217, e.g. "SCR" | "EUR"
  locale: string // e.g. "en-SEZ" | "en-GB"
}

export interface PricingBreakdown {
  billableDays: number
  subtotal: number
  tax: number
  total: number
  currency: string
}

export interface LegacyBookingInput {
  ratePerDay: number
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
  childSeatFee?: number
  additionalDriverFee?: number
  childSeat: boolean
  additionalDriver: boolean
  vatRate?: number
}

export interface BookingPrice {
  rentalDays: number
  basePerDay: number
  extrasTotal: number
  subtotal: number
  vat: number
  total: number
}

const CHILD_SEAT_FEE = 5 // flat
const ADDL_DRIVER_FEE = 10 // flat
const VAT = 0.15

export function calculatePricing(input: BookingInput): PricingBreakdown {
  const base = input.dailyRate * input.billableDays

  // ✅ FIXED, not multiplied by days
  const fixedExtras = (input.childSeat ? CHILD_SEAT_FEE : 0) + (input.additionalDriver ? ADDL_DRIVER_FEE : 0)

  const subtotal = base + fixedExtras
  const tax = Math.round(subtotal * VAT * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  return { billableDays: input.billableDays, subtotal, tax, total, currency: input.currency }
}

/**
 * Calculate billable rental days from two datetimes
 * - If drop-off is before pickup: return error (should be blocked in UI)
 * - Same-day rental (< 24 hours): counts as 1 day
 * - Otherwise: ceil(hours / 24)
 */
export function computeRentalDays(pickupDateTime: Date, dropoffDateTime: Date): number {
  if (dropoffDateTime <= pickupDateTime) {
    throw new Error("Drop-off time must be after pickup time")
  }

  const hours = (dropoffDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60)
  const days = Math.max(1, Math.ceil(hours / 24))

  return days
}

export function computePrice(payload: LegacyBookingInput): BookingPrice {
  const pickupDateTime = new Date(`${payload.pickupDate}T${payload.pickupTime}`)
  const dropoffDateTime = new Date(`${payload.dropoffDate}T${payload.dropoffTime}`)

  const days = computeRentalDays(pickupDateTime, dropoffDateTime)

  // ✅ FIXED extras - not multiplied by days
  let extrasTotal = 0
  if (payload.childSeat) {
    extrasTotal += payload.childSeatFee ?? CHILD_SEAT_FEE
  }
  if (payload.additionalDriver) {
    extrasTotal += payload.additionalDriverFee ?? ADDL_DRIVER_FEE
  }

  const subtotal = payload.ratePerDay * days + extrasTotal
  const vat = Math.round(subtotal * (payload.vatRate ?? VAT) * 100) / 100
  const total = Math.round((subtotal + vat) * 100) / 100

  return {
    rentalDays: days,
    basePerDay: Math.round(payload.ratePerDay * 100) / 100,
    extrasTotal: Math.round(extrasTotal * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    vat,
    total,
  }
}
