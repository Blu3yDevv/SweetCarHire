import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Creating booking with data:", JSON.stringify(body, null, 2))

    const {
      customerName,
      customerEmail,
      whatsappNumber,
      country,
      flightNumber,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupLocation,
      dropoffLocation,
      carId,
      carName,
      currency,
      totalAmountMinor,
      childSeat,
      additionalDriver,
    } = body

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !whatsappNumber ||
      !country ||
      !pickupDate ||
      !pickupTime ||
      !returnDate ||
      !returnTime ||
      !pickupLocation ||
      !dropoffLocation ||
      !carId ||
      !carName ||
      !currency ||
      !totalAmountMinor
    ) {
      console.error("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const bookingId = `SCH-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const booking = {
      id: bookingId,
      customerName,
      customerEmail,
      whatsappNumber,
      country,
      flightNumber: flightNumber || null,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupLocation,
      dropoffLocation,
      carId,
      carName,
      currency,
      totalAmountMinor,
      depositPercent: 15,
      depositAmountMinor: Math.round(totalAmountMinor * 0.15),
      status: "PENDING",
      childSeat: childSeat || false,
      additionalDriver: additionalDriver || false,
      createdAt: new Date().toISOString(),
    }

    console.log("[v0] Booking created successfully:", bookingId)

    // For now, we'll pass the booking data to the payment page via URL params

    return NextResponse.json({
      bookingId: booking.id,
      booking: booking, // Include full booking data for client-side use
    })
  } catch (error) {
    console.error("[v0] Create Booking Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
