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

    // In a real app, update database here
    // For now, we'll rely on sessionStorage on client side

    // TODO: Send confirmation emails to customer and admin

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
