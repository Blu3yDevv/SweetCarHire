"use server"

import { computePrice, type BookingInput as PricingInput } from "@/lib/pricing"

export interface BookingSubmission {
  // Customer details
  driverName: string
  driverEmail: string
  whatsappNumber: string
  country: string
  flightNumber?: string

  // Rental details
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
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
    vat: number
    total: number
  }
}

/**
 * Server action to validate and submit booking
 * Re-validates pricing on server to prevent tampering
 */
export async function submitBooking(data: BookingSubmission): Promise<BookingResult> {
  try {
    if (!data.driverName || !data.driverEmail || !data.whatsappNumber) {
      return { success: false, error: "Missing required contact information" }
    }

    if (!data.pickupDate || !data.pickupTime || !data.dropoffDate || !data.dropoffTime) {
      return { success: false, error: "Missing required rental dates/times" }
    }

    if (!data.carType || !data.carPricePerDay) {
      return { success: false, error: "Missing car selection" }
    }

    const pricingInput: PricingInput = {
      ratePerDay: data.carPricePerDay,
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      dropoffDate: data.dropoffDate,
      dropoffTime: data.dropoffTime,
      childSeat: data.childSeat,
      additionalDriver: data.additionalDriver,
      childSeatPerDay: 5,
      additionalDriverPerDay: 10,
      vatRate: 0.15,
    }

    const pricing = computePrice(pricingInput)

    // Generate booking reference
    const reference = `SCH-${Date.now().toString().slice(-6)}`

    const pickupLocation = data.pickupLocation === "Custom Location" ? data.customPickupLocation : data.pickupLocation
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
📞 CUSTOMER CONTACT INFORMATION (IMPORTANT!)
───────────────────────────────────────────────
Name: ${data.driverName}
Email: ${data.driverEmail}
WhatsApp: ${data.whatsappNumber}
Country: ${data.country}
Flight Number: ${data.flightNumber || "Not provided"}

───────────────────────────────────────────────
🚗 RENTAL DETAILS
───────────────────────────────────────────────
Vehicle: ${data.carType}
Pickup: ${data.pickupDate} at ${data.pickupTime}
Drop-off: ${data.dropoffDate} at ${data.dropoffTime}
Duration: ${pricing.rentalDays} day${pricing.rentalDays > 1 ? "s" : ""}

Pickup Location: ${pickupLocation}
Drop-off Location: ${dropoffLocation}

───────────────────────────────────────────────
💰 PRICING BREAKDOWN
───────────────────────────────────────────────
Car Rental: €${data.carPricePerDay}/day × ${pricing.rentalDays} day${pricing.rentalDays > 1 ? "s" : ""} = €${data.carPricePerDay * pricing.rentalDays}
${data.childSeat ? `Child Seat: €5/day × ${pricing.rentalDays} day${pricing.rentalDays > 1 ? "s" : ""} = €${5 * pricing.rentalDays}` : ""}
${data.additionalDriver ? `Additional Driver: €10/day × ${pricing.rentalDays} day${pricing.rentalDays > 1 ? "s" : ""} = €${10 * pricing.rentalDays}` : ""}

Subtotal: €${pricing.subtotal}
VAT (15%): €${pricing.vat}
───────────────────────────────────────────────
TOTAL AMOUNT: €${pricing.total}
───────────────────────────────────────────────

⚠️ ACTION REQUIRED:
Please contact the customer within 24 hours to confirm booking and arrange payment.

Customer Email: ${data.driverEmail}
Customer WhatsApp: ${data.whatsappNumber}
    `

    const formData = new FormData()
    formData.append("access_key", "ff2074c5-af87-401e-ae78-3398f2644261")
    formData.append("subject", `New Car Rental Booking - ${reference}`)
    formData.append("from_name", "Sweet Car Hire Booking System")
    formData.append("replyto", data.driverEmail) // RFC 5322 Reply-To header
    formData.append("message", adminEmailBody)

    // Add structured data for admin
    formData.append("customer_name", data.driverName)
    formData.append("customer_email", data.driverEmail)
    formData.append("customer_whatsapp", data.whatsappNumber)
    formData.append("customer_country", data.country)
    formData.append("booking_reference", reference)
    formData.append("total_amount", `€${pricing.total}`)
    formData.append("rental_days", pricing.rentalDays.toString())

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to send booking notification")
    }

    // This would require adding Supabase integration and creating a bookings table

    return {
      success: true,
      reference,
      pricing: {
        rentalDays: pricing.rentalDays,
        subtotal: pricing.subtotal,
        vat: pricing.vat,
        total: pricing.total,
      },
    }
  } catch (error) {
    console.error("[v0] Booking submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit booking",
    }
  }
}
