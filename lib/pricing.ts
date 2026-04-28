/**
 * Sweet Car Hire Pricing Calculator
 * Single source of truth for pricing calculations
 *
 * Day Calculation Rules:
 * - A rental "day" is any started 24-hour period from pickup time
 * - Partial days are always rounded UP (ceil) so the customer is charged for the full day
 * - Example: Pickup 8am Tuesday → Dropoff 8am Wednesday = 1 day
 * - Example: Pickup 6:30pm Thu → Dropoff 6:45am Sat = 2 days (36.25 hrs → ceil = 2)
 * - Minimum rental is always 1 day
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
}

export interface BookingPrice {
  rentalDays: number
  basePerDay: number
  extrasTotal: number
  lateFee: number
  subtotal: number
  total: number
}

const CHILD_SEAT_FEE = 5 // flat
const ADDL_DRIVER_FEE = 10 // flat

export function calculatePricing(input: BookingInput): PricingBreakdown {
  const base = input.dailyRate * input.billableDays

  // ✅ FIXED, not multiplied by days
  const fixedExtras = (input.childSeat ? CHILD_SEAT_FEE : 0) + (input.additionalDriver ? ADDL_DRIVER_FEE : 0)

  const subtotal = base + fixedExtras
  const total = Math.round(subtotal * 100) / 100

  return { billableDays: input.billableDays, subtotal, total, currency: input.currency }
}

/**
 * Calculate billable rental days
 * - Any partial 24-hour period is rounded UP (ceil) — no late fees
 * - Minimum 1 day rental
 *
 * Examples:
 * - Pickup 8am Tue → Dropoff 8am Wed  = exactly 24 hrs → 1 day
 * - Pickup 8am Tue → Dropoff 11am Wed = 27 hrs → ceil(27/24) = 2 days
 * - Pickup 6:30pm Thu → Dropoff 6:45am Sat = 36.25 hrs → ceil(36.25/24) = 2 days
 * - Pickup 8am Tue → Dropoff 9am Thu  = 49 hrs → ceil(49/24) = 3 days
 */
export function computeRentalDays(pickupDateTime: Date, dropoffDateTime: Date): { days: number; lateFee: number } {
  if (dropoffDateTime <= pickupDateTime) {
    throw new Error("Drop-off time must be after pickup time")
  }

  const hours = (dropoffDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60)

  // Any partial day counts as a full day — round UP
  const rentalDays = Math.max(1, Math.ceil(hours / 24))

  // No late fees with ceil-based billing — partial days are already charged as full days
  const lateFee = 0

  return { days: rentalDays, lateFee }
}

export function computePrice(payload: LegacyBookingInput): BookingPrice {
  const pickupDateTime = new Date(`${payload.pickupDate}T${payload.pickupTime}`)
  const dropoffDateTime = new Date(`${payload.dropoffDate}T${payload.dropoffTime}`)

  const { days, lateFee } = computeRentalDays(pickupDateTime, dropoffDateTime)

  // ✅ FIXED extras - not multiplied by days
  let extrasTotal = 0
  if (payload.childSeat) {
    extrasTotal += payload.childSeatFee ?? CHILD_SEAT_FEE
  }
  if (payload.additionalDriver) {
    extrasTotal += payload.additionalDriverFee ?? ADDL_DRIVER_FEE
  }

  const subtotal = payload.ratePerDay * days + extrasTotal
  const total = Math.round(subtotal * 100) / 100

  return {
    rentalDays: days,
    basePerDay: Math.round(payload.ratePerDay * 100) / 100,
    extrasTotal: Math.round(extrasTotal * 100) / 100,
    lateFee: Math.round(lateFee * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    total,
  }
}
