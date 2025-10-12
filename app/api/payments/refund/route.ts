import { type NextRequest, NextResponse } from "next/server"
import { refundPayPalCapture } from "@/lib/paypal"

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication middleware
    const { bookingId, captureId, amountMinor, currency } = await request.json()

    console.log("[v0] Processing refund:", { bookingId, captureId, amountMinor })

    if (!captureId) {
      return NextResponse.json({ error: "Missing captureId" }, { status: 400 })
    }

    const refundAmount = ((amountMinor || 0) / 100).toFixed(2)

    if (Number.parseFloat(refundAmount) <= 0) {
      return NextResponse.json({ error: "Invalid refund amount" }, { status: 400 })
    }

    const refund = await refundPayPalCapture({
      captureId,
      amount: refundAmount,
      currency: currency || "EUR",
    })

    console.log("[v0] Refund processed:", refund.id)

    // In a real app with database, update booking status here
    // For now, just return success

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
    })
  } catch (error) {
    console.error("[v0] PayPal Refund Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process refund",
      },
      { status: 500 },
    )
  }
}
