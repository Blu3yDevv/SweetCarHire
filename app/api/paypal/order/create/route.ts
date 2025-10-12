import { type NextRequest, NextResponse } from "next/server"
import { createPayPalOrder } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("bookingId")

    console.log("[v0] Creating PayPal order for booking:", bookingId)

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 })
    }

    const { booking } = await request.json()

    if (!booking) {
      return NextResponse.json({ error: "Booking data not found" }, { status: 404 })
    }

    // Compute 15% deposit on server (never trust client)
    const totalAmount = booking.totalAmountMinor / 100
    const depositAmount = (totalAmount * 0.15).toFixed(2)

    console.log("[v0] Deposit calculation:", {
      totalAmount,
      depositAmount,
      currency: booking.currency,
    })

    // Create PayPal order using REST API
    const { orderID } = await createPayPalOrder({
      amount: depositAmount,
      currency: booking.currency || "EUR",
      description: `Sweet Car Hire - ${booking.carName} (15% deposit)`,
      bookingId,
    })

    console.log("[v0] PayPal order created:", orderID)

    // Store order ID in sessionStorage (client-side)
    return NextResponse.json({
      orderID,
      depositAmount,
      totalAmount,
    })
  } catch (error) {
    console.error("[v0] PayPal Create Order Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create PayPal order",
      },
      { status: 500 },
    )
  }
}
