/**
 * Sweet Car Hire Pricing Calculator
 * Single source of truth for pricing calculations
 *
 * Day Calculation Rules:
 * - A rental "day" is a 24-hour period from pickup time
 * - Billable days = floor(totalHours / 24), minimum 1
 * - If there are leftover hours beyond the last full day AND
 *   the dropoff time-of-day is STRICTLY LATER than pickup time-of-day,
 *   a €10 late return fee is charged (no extra day is added).
 *
 * Examples:
 *   Pickup 10:00 Mon → Dropoff 10:00 Tue = 1 day,  €0 late fee
 *   Pickup 10:00 Mon → Dropoff 11:00 Tue = 1 day,  €10 late fee
 *   Pickup 10:00 Mon → Dropoff 09:00 Tue = 1 day,  €0 late fee  (early return)
 *   Pickup 10:00 Mon → Dropoff 10:00 Wed = 2 days, €0 late fee
 *   Pickup 10:00 Mon → Dropoff 11:00 Wed = 2 days, €10 late fee
 *   Pickup 10:00 Mon → Dropoff 11:00 Thu = 3 days, €10 late fee
 */

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/

export function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const d = new Date(value)
  return !isNaN(d.getTime())
}

export function isValidTime(value: string): boolean {
  return TIME_RE.test(value)
}

export function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && isFinite(value) && value > 0
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHILD_SEAT_FEE = 5    // flat per booking
const ADDL_DRIVER_FEE = 10  // flat per booking
const LATE_RETURN_FEE = 10  // flat per booking

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface BookingInput {
  ratePerDay: number
  pickupDate: string   // YYYY-MM-DD
  pickupTime: string   // HH:MM
  dropoffDate: string  // YYYY-MM-DD — canonical field name (not returnDate)
  dropoffTime: string  // HH:MM       — canonical field name (not returnTime)
  childSeat: boolean
  additionalDriver: boolean
}

export interface BookingPrice {
  rentalDays: number
  basePerDay: number
  basePrice: number        // basePerDay * rentalDays
  childSeatFee: number     // 0 or CHILD_SEAT_FEE
  additionalDriverFee: number  // 0 or ADDL_DRIVER_FEE
  extrasTotal: number
  lateFee: number
  subtotal: number
  total: number
}

// Kept for backward-compatibility with calculatePricing() callers
export interface PricingBreakdown {
  billableDays: number
  subtotal: number
  total: number
  currency: string
}

// ---------------------------------------------------------------------------
// computeRentalDays
// ---------------------------------------------------------------------------

/**
 * Returns billable days and the late-return fee.
 *
 * Algorithm (fixes the previous ceil-always bug):
 *  1. Compute exact elapsed hours.
 *  2. fullDays = floor(hours / 24), minimum 1.
 *  3. remainderHours = hours % 24.
 *  4. A late fee applies when remainderHours > 0 AND
 *     the dropoff clock-time (HH:MM) is strictly later than the pickup clock-time.
 *     This correctly handles:
 *       - Exact 24 h multiples  → no late fee
 *       - Early return on final day → no late fee
 *       - Late return on final day  → €10 fee, no extra day
 */
export function computeRentalDays(
  pickupDateTime: Date,
  dropoffDateTime: Date,
): { days: number; lateFee: number } {
  if (dropoffDateTime <= pickupDateTime) {
    throw new Error("Drop-off time must be after pickup time")
  }

  const totalMs = dropoffDateTime.getTime() - pickupDateTime.getTime()
  const totalHours = totalMs / (1000 * 60 * 60)

  // Full 24-hour periods, minimum 1 day
  const fullDays = Math.max(1, Math.floor(totalHours / 24))

  // Remaining hours beyond the last complete day
  const remainderHours = totalHours % 24

  // Late fee: only when there IS a partial day AND dropoff clock is later than pickup clock
  const pickupMinutes = pickupDateTime.getHours() * 60 + pickupDateTime.getMinutes()
  const dropoffMinutes = dropoffDateTime.getHours() * 60 + dropoffDateTime.getMinutes()
  const hasRemainder = remainderHours > 0
  const lateFee = hasRemainder && dropoffMinutes > pickupMinutes ? LATE_RETURN_FEE : 0

  return { days: fullDays, lateFee }
}

// ---------------------------------------------------------------------------
// computePrice  (primary entry point used by API, action, and page)
// ---------------------------------------------------------------------------

export function computePrice(payload: BookingInput): BookingPrice {
  // Strict input validation
  if (!isValidDate(payload.pickupDate)) {
    throw new Error(`Invalid pickup date: "${payload.pickupDate}"`)
  }
  if (!isValidTime(payload.pickupTime)) {
    throw new Error(`Invalid pickup time: "${payload.pickupTime}"`)
  }
  if (!isValidDate(payload.dropoffDate)) {
    throw new Error(`Invalid dropoff date: "${payload.dropoffDate}"`)
  }
  if (!isValidTime(payload.dropoffTime)) {
    throw new Error(`Invalid dropoff time: "${payload.dropoffTime}"`)
  }
  if (!isValidPrice(payload.ratePerDay)) {
    throw new Error(`Invalid rate per day: "${payload.ratePerDay}"`)
  }

  const pickupDateTime = new Date(`${payload.pickupDate}T${payload.pickupTime}`)
  const dropoffDateTime = new Date(`${payload.dropoffDate}T${payload.dropoffTime}`)

  const { days, lateFee } = computeRentalDays(pickupDateTime, dropoffDateTime)

  // Fixed extras — NOT multiplied by days
  const extrasTotal =
    (payload.childSeat ? CHILD_SEAT_FEE : 0) +
    (payload.additionalDriver ? ADDL_DRIVER_FEE : 0)

  const basePrice = Math.round(payload.ratePerDay * days * 100) / 100
  const childSeatFee = payload.childSeat ? CHILD_SEAT_FEE : 0
  const additionalDriverFee = payload.additionalDriver ? ADDL_DRIVER_FEE : 0
  const extrasTotal = Math.round((childSeatFee + additionalDriverFee) * 100) / 100
  const subtotal = Math.round((basePrice + extrasTotal) * 100) / 100
  const total = Math.round((subtotal + lateFee) * 100) / 100

  return {
    rentalDays: days,
    basePerDay: Math.round(payload.ratePerDay * 100) / 100,
    basePrice,
    childSeatFee,
    additionalDriverFee,
    extrasTotal,
    lateFee: Math.round(lateFee * 100) / 100,
    subtotal,
    total,
  }
}

// ---------------------------------------------------------------------------
// calculatePricing  (kept for any callers using the newer BookingInput shape)
// ---------------------------------------------------------------------------

export interface NewBookingInput {
  dailyRate: number
  billableDays: number
  childSeat?: boolean
  additionalDriver?: boolean
  currency: string
  locale: string
}

export function calculatePricing(input: NewBookingInput): PricingBreakdown {
  const base = input.dailyRate * input.billableDays
  const fixedExtras =
    (input.childSeat ? CHILD_SEAT_FEE : 0) +
    (input.additionalDriver ? ADDL_DRIVER_FEE : 0)
  const subtotal = Math.round((base + fixedExtras) * 100) / 100
  const total = subtotal

  return { billableDays: input.billableDays, subtotal, total, currency: input.currency }
}
