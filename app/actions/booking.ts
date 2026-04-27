"use server"

import { computePrice, isValidDate, isValidTime, isValidPrice } from "@/lib/pricing"

export interface BookingSubmission {
  // Customer details
  driverName: string
  driverEmail: string
  whatsappNumber: string
  country: string
  flightNumber?: string

  // Rental details — canonical names used throughout the app
  pickupDate: string
  pickupTime: string
  dropoffDate: string  // canonical (not returnDate)
  dropoffTime: string  // canonical (not returnTime)
  pickupLocation: string
  dropoffLocation: string
  customPickupLocation?: string
  customDropoffLocation?: string

  // Car and extras
  carType: string
  carPricePerDay: number
  childSeat: boolean
  additionalDriver: boolean
}

export interface BookingResult {
  success: boolean
  reference?: string
  error?: string
  pricing?: {
    rentalDays: number
    subtotal: number
    lateFee: number
    total: number
  }
}

/**
 * Server action to validate and submit a booking.
 * Re-calculates pricing on the server to prevent client-side tampering.
 * No VAT is applied — Sweet Car Hire prices are inclusive.
 */
export async function submitBooking(data: BookingSubmission): Promise<BookingResult> {
  try {
    // --- Contact validation ---
    if (!data.driverName?.trim() || !data.driverEmail?.trim() || !data.whatsappNumber?.trim()) {
      return { success: false, error: "Missing required contact information" }
    }

    // --- Date/time validation ---
    if (!isValidDate(data.pickupDate)) {
      return { success: false, error: "Invalid pickup date format (expected YYYY-MM-DD)" }
    }
    if (!isValidTime(data.pickupTime)) {
      return { success: false, error: "Invalid pickup time format (expected HH:MM)" }
    }
    if (!isValidDate(data.dropoffDate)) {
      return { success: false, error: "Invalid drop-off date format (expected YYYY-MM-DD)" }
    }
    if (!isValidTime(data.dropoffTime)) {
      return { success: false, error: "Invalid drop-off time format (expected HH:MM)" }
    }

    const pickupDT = new Date(`${data.pickupDate}T${data.pickupTime}`)
    const dropoffDT = new Date(`${data.dropoffDate}T${data.dropoffTime}`)
    if (dropoffDT <= pickupDT) {
      return { success: false, error: "Drop-off must be after pickup" }
    }

    // --- Car/price validation ---
    if (!data.carType?.trim()) {
      return { success: false, error: "Missing car selection" }
    }
    if (!isValidPrice(data.carPricePerDay)) {
      return { success: false, error: "Invalid car price per day" }
    }

    // --- Server-side price calculation (source of truth) ---
    const pricing = computePrice({
      ratePerDay: data.carPricePerDay,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      dropoffDate: data.dropoffDate,
      dropoffTime: data.dropoffTime,
      childSeat: data.childSeat,
      additionalDriver: data.additionalDriver,
    })

    // --- Generate reference ---
    const reference = `SCH-${Date.now().toString().slice(-6)}`

    const pickupLocation =
      data.pickupLocation === "Custom Location" ? data.customPickupLocation : data.pickupLocation
    const dropoffLocation =
      data.dropoffLocation === "Custom Location" ? data.customDropoffLocation : data.dropoffLocation

    const adminEmailBody = `
═══════════════════════════════════════════════
    SWEET CAR HIRE - NEW BOOKING RECEIVED
═══════════════════════════════════════════════

BOOKING REFERENCE: ${reference}
Booking Date: ${new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}

───────────────────────────────────────────────
CUSTOMER CONTACT INFORMATION
───────────────────────────────────────────────
Name: ${data.driverName}
Email: ${data.driverEmail}
WhatsApp: ${data.whatsappNumber}
Country: ${data.country}
Flight Number: ${data.flightNumber || "Not provided"}

───────────────────────────────────────────────
RENTAL DETAILS
───────────────────────────────────────────────
Vehicle: ${data.carType}
Pickup:   ${data.pickupDate} at ${data.pickupTime}
Drop-off: ${data.dropoffDate} at ${data.dropoffTime}
Duration: ${pricing.rentalDays} day${pricing.rentalDays !== 1 ? "s" : ""}

Pickup Location:   ${pickupLocation}
Drop-off Location: ${dropoffLocation}

───────────────────────────────────────────────
PRICING BREAKDOWN
───────────────────────────────────────────────
Car Rental: €${data.carPricePerDay}/day × ${pricing.rentalDays} day${pricing.rentalDays !== 1 ? "s" : ""} = €${(data.carPricePerDay * pricing.rentalDays).toFixed(2)}
${data.childSeat ? `Child Seat (one-time): €5.00` : ""}
${data.additionalDriver ? `Additional Driver (one-time): €10.00` : ""}
${pricing.lateFee > 0 ? `Late Return Fee: €${pricing.lateFee.toFixed(2)}` : ""}

Subtotal: €${pricing.subtotal.toFixed(2)}
───────────────────────────────────────────────
TOTAL AMOUNT: €${pricing.total.toFixed(2)}
───────────────────────────────────────────────

ACTION REQUIRED:
Please contact the customer within 24 hours to confirm booking and arrange payment.

Customer Email:    ${data.driverEmail}
Customer WhatsApp: ${data.whatsappNumber}
    `

    const formData = new FormData()
    formData.append("access_key", "ff2074c5-af87-401e-ae78-3398f2644261")
    formData.append("subject", `New Car Rental Booking - ${reference}`)
    formData.append("from_name", "Sweet Car Hire Booking System")
    formData.append("replyto", data.driverEmail)
    formData.append("message", adminEmailBody)
    formData.append("customer_name", data.driverName)
    formData.append("customer_email", data.driverEmail)
    formData.append("customer_whatsapp", data.whatsappNumber)
    formData.append("customer_country", data.country)
    formData.append("booking_reference", reference)
    formData.append("total_amount", `€${pricing.total.toFixed(2)}`)
    formData.append("rental_days", pricing.rentalDays.toString())

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to send booking notification")
    }

    return {
      success: true,
      reference,
      pricing: {
        rentalDays: pricing.rentalDays,
        subtotal: pricing.subtotal,
        lateFee: pricing.lateFee,
        total: pricing.total,
      },
    }
  } catch (error) {
    console.error("[booking] Submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit booking",
    }
  }
}
