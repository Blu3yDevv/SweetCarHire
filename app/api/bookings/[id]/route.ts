import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // For now, return a placeholder response that the client will handle
    console.log("[v0] Fetching booking:", id)

    // The booking data will be stored in sessionStorage on the client side
    // and passed to the payment page
    return NextResponse.json({
      message: "Booking data should be passed from client",
      bookingId: id,
    })
  } catch (error) {
    console.error("[Get Booking Error]:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}
