import { type NextRequest, NextResponse } from "next/server"
import {
  generateCustomerConfirmationEmail,
  generateAdminNotificationEmail,
  type BookingEmailData,
} from "@/lib/email-templates"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const booking: BookingEmailData = await request.json()

    console.log("[v0] Sending confirmation emails for booking:", booking.bookingId)
    console.log("[v0] Customer email address:", booking.customerEmail)
    console.log("[v0] Customer name:", booking.customerName)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(booking.customerEmail)) {
      console.error("[v0] Invalid email format:", booking.customerEmail)
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid email address format. Please provide a valid email address.",
        },
        { status: 400 },
      )
    }

    const customerHtml = generateCustomerConfirmationEmail(booking)
    const adminHtml = generateAdminNotificationEmail(booking)

    const results = {
      customerEmail: { sent: false, preview: customerHtml, error: null as string | null, details: null as any },
      adminEmail: { sent: false, error: null as string | null, details: null as any },
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || "bookings@sweetcarhire.com"
    const senderName = process.env.BREVO_SENDER_NAME || "Sweet Car Hire"
    const adminEmail = process.env.ADMIN_EMAIL || "info@sweetcarhire.com"

    if (!process.env.BREVO_API_KEY) {
      console.warn("[v0] BREVO_API_KEY not configured - email preview available in response")
      results.customerEmail.error = "Missing BREVO_API_KEY (email preview available)"
      results.adminEmail.error = "Missing BREVO_API_KEY"
      return NextResponse.json({ ok: true, results })
    }

    try {
      console.log("[v0] Attempting to send customer email via Brevo...")
      console.log("[v0] Using sender:", senderEmail)
      const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: booking.customerEmail,
              name: booking.customerName,
            },
          ],
          subject: `Booking Confirmation - ${booking.bookingId}`,
          htmlContent: customerHtml,
        }),
      })

      const responseText = await brevoResponse.text()
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = responseText
      }

      console.log("[v0] Brevo customer email response status:", brevoResponse.status)

      if (brevoResponse.ok) {
        console.log("[v0] Customer email sent via Brevo successfully")
        results.customerEmail.sent = true
        results.customerEmail.details = responseData
      } else {
        console.error("[v0] Brevo customer email error:", responseData)
        results.customerEmail.error = typeof responseData === "string" ? responseData : JSON.stringify(responseData)
      }
    } catch (e: any) {
      console.error("[v0] Brevo customer email exception:", e?.message)
      results.customerEmail.error = e?.message ?? "Brevo failed"
    }

    try {
      console.log("[v0] Attempting to send admin notification via Brevo...")
      console.log("[v0] Admin email address:", adminEmail)
      const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: adminEmail,
              name: "Sweet Car Hire Admin",
            },
          ],
          replyTo: {
            email: booking.customerEmail,
            name: booking.customerName,
          },
          subject: `🚗 New Booking: ${booking.bookingId} - ${booking.carName}`,
          htmlContent: adminHtml,
        }),
      })

      const responseText = await brevoResponse.text()
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = responseText
      }

      console.log("[v0] Brevo admin email response status:", brevoResponse.status)

      if (brevoResponse.ok) {
        console.log("[v0] Admin email sent via Brevo successfully")
        results.adminEmail.sent = true
        results.adminEmail.details = responseData
      } else {
        console.error("[v0] Brevo admin email error:", responseData)
        results.adminEmail.error = typeof responseData === "string" ? responseData : JSON.stringify(responseData)
      }
    } catch (e: any) {
      console.error("[v0] Brevo admin email exception:", e?.message)
      results.adminEmail.error = e?.message ?? "Brevo failed"
    }

    return NextResponse.json({ ok: true, results })
  } catch (e: any) {
    console.error("[v0] Email API error:", e?.message)
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status: 500 })
  }
}
