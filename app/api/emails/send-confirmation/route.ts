import { type NextRequest, NextResponse } from "next/server"
import {
  generateCustomerConfirmationEmail,
  generateAdminNotificationEmail,
  type BookingEmailData,
} from "@/lib/email-templates"

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingEmailData = await request.json()

    console.log("[v0] Sending confirmation emails for booking:", bookingData.bookingId)

    // Send customer confirmation email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const customerEmailHtml = generateCustomerConfirmationEmail(bookingData)

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Sweet Car Hire <bookings@sweetcarhire.com>",
            to: bookingData.customerEmail,
            subject: `Booking Confirmation - ${bookingData.bookingId}`,
            html: customerEmailHtml,
          }),
        })

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json()
          console.error("[v0] Resend API error:", errorData)
          throw new Error(`Resend API error: ${errorData.message || "Unknown error"}`)
        }

        const resendData = await resendResponse.json()
        console.log("[v0] Customer email sent successfully:", resendData)
      } catch (error) {
        console.error("[v0] Failed to send customer email:", error)
        // Don't fail the entire request if email fails
      }
    } else {
      console.warn("[v0] RESEND_API_KEY not configured, skipping customer email")
    }

    if (process.env.WEB3FORMS_KEY) {
      try {
        const adminEmailHtml = generateAdminNotificationEmail(bookingData)

        const web3FormsResponse = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_KEY,
            subject: `New Booking: ${bookingData.bookingId}`,
            from_name: "Sweet Car Hire Booking System",
            email: bookingData.customerEmail,
            replyto: bookingData.customerEmail,
            message: adminEmailHtml,
          }),
        })

        if (!web3FormsResponse.ok) {
          console.error("[v0] Web3Forms error:", await web3FormsResponse.text())
        } else {
          console.log("[v0] Admin notification sent successfully")
        }
      } catch (error) {
        console.error("[v0] Failed to send admin notification:", error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Email sending error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send emails",
      },
      { status: 500 },
    )
  }
}
