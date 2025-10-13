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

    const html = generateCustomerConfirmationEmail(booking)
    const adminText = generateAdminNotificationEmail(booking)

    const results = {
      customerEmail: { sent: false, preview: html, error: null as string | null, details: null as any },
      adminEmail: { sent: false, error: null as string | null, details: null as any },
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || "bookings@sweetcarhire.com"
    const senderName = process.env.BREVO_SENDER_NAME || "Sweet Car Hire"

    if (process.env.BREVO_API_KEY) {
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
            htmlContent: html,
          }),
        })

        const responseText = await brevoResponse.text()
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch {
          responseData = responseText
        }

        console.log("[v0] Brevo response status:", brevoResponse.status)
        console.log("[v0] Brevo response data:", JSON.stringify(responseData, null, 2))

        if (brevoResponse.ok) {
          console.log("[v0] Customer email sent via Brevo successfully")
          results.customerEmail.sent = true
          results.customerEmail.details = responseData
          results.customerEmail.details.warning =
            "⚠️ If customer doesn't receive email, verify sender email in Brevo dashboard: https://app.brevo.com/settings/senders"
        } else {
          console.error("[v0] Brevo error response:", responseData)
          results.customerEmail.error = typeof responseData === "string" ? responseData : JSON.stringify(responseData)
        }
      } catch (e: any) {
        console.error("[v0] Brevo exception:", e?.message)
        results.customerEmail.error = e?.message ?? "Brevo failed"
      }
    } else {
      console.warn("[v0] BREVO_API_KEY not configured - email preview available in response")
      results.customerEmail.error = "Missing BREVO_API_KEY (email preview available)"
    }

    if (process.env.WEB3FORMS_KEY) {
      try {
        console.log("[v0] Attempting to send admin notification via Web3Forms...")
        const web3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_KEY,
            subject: `New Booking: ${booking.bookingId}`,
            from_name: "Sweet Car Hire Booking System",
            email: booking.customerEmail,
            replyto: booking.customerEmail,
            message: adminText,
          }),
        })

        const responseText = await web3Response.text()
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch {
          responseData = responseText
        }

        console.log("[v0] Web3Forms response status:", web3Response.status)
        console.log("[v0] Web3Forms response data:", JSON.stringify(responseData, null, 2))

        if (web3Response.ok) {
          console.log("[v0] Admin email sent via Web3Forms successfully")
          results.adminEmail.sent = true
          results.adminEmail.details = responseData
        } else {
          console.error("[v0] Web3Forms error response:", responseData)
          results.adminEmail.error = typeof responseData === "string" ? responseData : JSON.stringify(responseData)
        }
      } catch (e: any) {
        console.error("[v0] Web3Forms exception:", e?.message)
        results.adminEmail.error = e?.message ?? "Web3Forms failed"
      }
    } else {
      console.warn("[v0] WEB3FORMS_KEY not configured")
      results.adminEmail.error = "Missing WEB3FORMS_KEY"
    }

    return NextResponse.json({ ok: true, results })
  } catch (e: any) {
    console.error("[v0] Email API error:", e?.message)
    return NextResponse.json({ ok: false, error: e?.message ?? "Bad Request" }, { status: 500 })
  }
}
