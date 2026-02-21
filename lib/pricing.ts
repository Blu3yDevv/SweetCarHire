/**
 * Sweet Car Hire Pricing Calculator
 * Single source of truth for pricing calculations
 *
 * Day Calculation Rules:
 * - A rental "day" is a 24-hour period from pickup time
 * - Example: Pickup 8am Tuesday → Dropoff 8am Wednesday = 1 day
 * - Late Return Fee: If dropoff is after pickup time on the final day, add €10 fee
 * - Example: Pickup 8am Tuesday → Dropoff 11am Wednesday = 1 day + €10 late fee
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
const LATE_RETURN_FEE = 10 // flat fee for returning late

export function calculatePricing(input: BookingInput): PricingBreakdown {
  const base = input.dailyRate * input.billableDays

  // ✅ FIXED, not multiplied by days
  const fixedExtras = (input.childSeat ? CHILD_SEAT_FEE : 0) + (input.additionalDriver ? ADDL_DRIVER_FEE : 0)

  const subtotal = base + fixedExtras
  const total = Math.round(subtotal * 100) / 100

  return { billableDays: input.billableDays, subtotal, total, currency: input.currency }
}

/**
 * Calculate billable rental days with grace period logic
 * - A "day" = 24 hours from pickup time
 * - Returns: { days: number, lateFee: number }
 * - If dropoff time is later than pickup time on the final day, adds late fee
 *
 * Examples:
 * - Pickup 8am Tue → Dropoff 8am Wed = 1 day, €0 late fee
 * - Pickup 8am Tue → Dropoff 11am Wed = 1 day, €10 late fee
 * - Pickup 8am Tue → Dropoff 7am Wed = 1 day, €0 late fee (returned early)
 * - Pickup 8am Tue → Dropoff 9am Thu = 2 days, €10 late fee
 */
export function computeRentalDays(pickupDateTime: Date, dropoffDateTime: Date): { days: number; lateFee: number } {
  if (dropoffDateTime <= pickupDateTime) {
    throw new Error("Drop-off time must be after pickup time")
  }

  const hours = (dropoffDateTime.getTime() - pickupDateTime.getTime()) / (1000 * 60 * 60)

  // Use ceil so any partial day counts as a full rental day
  // Example: 71 hours (Apr 27 15:00 → Apr 30 14:00) = ceil(71/24) = 3 days
  const rentalDays = Math.max(1, Math.ceil(hours / 24))

  // Late fee: compare TIME-OF-DAY only
  // If dropoff hour:minute is strictly AFTER pickup hour:minute, charge late fee
  // Example: Pickup 15:00 → Dropoff 16:00 on any day = late fee
  // Example: Pickup 15:00 → Dropoff 14:00 on any day = no late fee
  const pickupMinutes = pickupDateTime.getHours() * 60 + pickupDateTime.getMinutes()
  const dropoffMinutes = dropoffDateTime.getHours() * 60 + dropoffDateTime.getMinutes()
  const lateFee = dropoffMinutes > pickupMinutes ? LATE_RETURN_FEE : 0

  console.log(
    `[v0] Rental calculation: ${hours.toFixed(2)} hours = ${rentalDays} days + €${lateFee} late fee (pickup ${pickupDateTime.getHours()}:${String(pickupDateTime.getMinutes()).padStart(2, "0")} vs dropoff ${dropoffDateTime.getHours()}:${String(dropoffDateTime.getMinutes()).padStart(2, "0")})`,
  )

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
  const total = Math.round((subtotal + lateFee) * 100) / 100

  return {
    rentalDays: days,
    basePerDay: Math.round(payload.ratePerDay * 100) / 100,
    extrasTotal: Math.round(extrasTotal * 100) / 100,
    lateFee: Math.round(lateFee * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    total,
  }
}
