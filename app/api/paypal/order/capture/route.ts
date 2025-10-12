import { type NextRequest, NextResponse } from "next/server"
import { capturePayPalOrder } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderID, bookingId } = body

    console.log("[v0] Capturing PayPal order:", orderID)

    if (!orderID) {
      return NextResponse.json({ error: "Missing orderID" }, { status: 400 })
    }

    // Capture the order using REST API
    const captureResult = await capturePayPalOrder(orderID)

    const captureId = captureResult.purchase_units[0].payments.captures[0].id
    const status = captureResult.status

    console.log("[v0] PayPal capture result:", {
      captureId,
      status,
      orderID,
    })

    if (status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: `Payment not completed. Status: ${status}`,
        },
        { status: 400 },
      )
    }

    try {
      // Get booking data from sessionStorage (passed from client)
      const bookingData = body.bookingData
      if (bookingData) {
        await fetch(`${process.env.APP_BASE_URL || "http://localhost:3000"}/api/emails/send-confirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        })
      }
    } catch (emailError) {
      console.error("[v0] Failed to send confirmation emails:", emailError)
      // Don't fail the payment if email fails
    }

    return NextResponse.json({
      success: true,
      captureId,
      orderID,
      bookingId,
      status,
    })
  } catch (error) {
    console.error("[v0] PayPal Capture Order Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to capture PayPal order",
      },
      { status: 500 },
    )
  }
}
