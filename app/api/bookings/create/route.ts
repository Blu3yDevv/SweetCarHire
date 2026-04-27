import { type NextRequest, NextResponse } from "next/server"
import { computePrice, isValidDate, isValidTime, isValidPrice } from "@/lib/pricing"

// Known cars — keeps the API from accepting arbitrary daily rates
const KNOWN_CARS: Record<string, { name: string; dailyRate: number }> = {
  "suzuki-dzire": { name: "Suzuki Dzire", dailyRate: 45 },
  "suzuki-fronx":  { name: "Suzuki Fronx", dailyRate: 60 },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      customerName,
      customerEmail,
      whatsappNumber,
      country,
      flightNumber,
      pickupDate,
      pickupTime,
      // Accept both the canonical name and the legacy alias from older clients
      dropoffDate = body.returnDate,
      dropoffTime = body.returnTime,
      pickupLocation,
      dropoffLocation,
      carId,
      currency,
      childSeat,
      additionalDriver,
    } = body

    // -----------------------------------------------------------------------
    // Strict field-presence validation
    // -----------------------------------------------------------------------
    const missing: string[] = []
    if (!customerName?.trim())   missing.push("customerName")
    if (!customerEmail?.trim())  missing.push("customerEmail")
    if (!whatsappNumber?.trim()) missing.push("whatsappNumber")
    if (!country?.trim())        missing.push("country")
    if (!pickupDate)             missing.push("pickupDate")
    if (!pickupTime)             missing.push("pickupTime")
    if (!dropoffDate)            missing.push("dropoffDate (or returnDate)")
    if (!dropoffTime)            missing.push("dropoffTime (or returnTime)")
    if (!pickupLocation?.trim()) missing.push("pickupLocation")
    if (!dropoffLocation?.trim()) missing.push("dropoffLocation")
    if (!carId)                  missing.push("carId")
    if (!currency?.trim())       missing.push("currency")

    if (missing.length > 0) {
      return NextResponse.json(
        { error: "Missing required fields", fields: missing },
        { status: 400 },
      )
    }

    // -----------------------------------------------------------------------
    // Format validation
    // -----------------------------------------------------------------------
    if (!isValidDate(pickupDate)) {
      return NextResponse.json({ error: `Invalid pickupDate: "${pickupDate}"` }, { status: 400 })
    }
    if (!isValidTime(pickupTime)) {
      return NextResponse.json({ error: `Invalid pickupTime: "${pickupTime}"` }, { status: 400 })
    }
    if (!isValidDate(dropoffDate)) {
      return NextResponse.json({ error: `Invalid dropoffDate: "${dropoffDate}"` }, { status: 400 })
    }
    if (!isValidTime(dropoffTime)) {
      return NextResponse.json({ error: `Invalid dropoffTime: "${dropoffTime}"` }, { status: 400 })
    }

    const pickupDT  = new Date(`${pickupDate}T${pickupTime}`)
    const dropoffDT = new Date(`${dropoffDate}T${dropoffTime}`)
    if (dropoffDT <= pickupDT) {
      return NextResponse.json(
        { error: "dropoffDate/Time must be after pickupDate/Time" },
        { status: 400 },
      )
    }

    // -----------------------------------------------------------------------
    // Car validation — look up server-side daily rate, ignore client total
    // -----------------------------------------------------------------------
    const car = KNOWN_CARS[carId]
    if (!car) {
      return NextResponse.json(
        { error: `Unknown carId: "${carId}". Valid values: ${Object.keys(KNOWN_CARS).join(", ")}` },
        { status: 400 },
      )
    }

    // -----------------------------------------------------------------------
    // Server-side price calculation — NEVER trust totalAmountMinor from client
    // -----------------------------------------------------------------------
    const pricing = computePrice({
      ratePerDay: car.dailyRate,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      childSeat:        Boolean(childSeat),
      additionalDriver: Boolean(additionalDriver),
    })

    if (!isValidPrice(pricing.total)) {
      return NextResponse.json({ error: "Pricing calculation produced an invalid total" }, { status: 500 })
    }

    // -----------------------------------------------------------------------
    // Build booking record
    // -----------------------------------------------------------------------
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
      dropoffDate,   // canonical field name stored consistently
      dropoffTime,   // canonical field name stored consistently
      pickupLocation,
      dropoffLocation,
      carId,
      carName: car.name,
      currency,
      // Authoritative server-computed totals
      rentalDays:         pricing.rentalDays,
      totalAmountMinor:   Math.round(pricing.total * 100),
      subtotalMinor:      Math.round(pricing.subtotal * 100),
      lateFeeMinor:       Math.round(pricing.lateFee * 100),
      depositPercent:     15,
      depositAmountMinor: Math.round(pricing.total * 100 * 0.15),
      status: "PENDING",
      childSeat:        Boolean(childSeat),
      additionalDriver: Boolean(additionalDriver),
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ bookingId: booking.id, booking })
  } catch (error) {
    console.error("[api/bookings/create] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
