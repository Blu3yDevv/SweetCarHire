import { randomBytes } from "node:crypto"
import { type NextRequest, NextResponse } from "next/server"
import { VEHICLES } from "@/lib/fleet"
import { computePrice } from "@/lib/pricing"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

function calendarDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null
}

function todayInSeychelles() {
  return new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const customerName = text(body.customerName, 120)
    const customerEmail = text(body.customerEmail, 254).toLowerCase()
    const customerPhone = text(body.phoneNumber, 40)
    const whatsappNumber = text(body.whatsappNumber, 40)
    const country = text(body.country, 100)
    const pickupDate = calendarDate(body.pickupDate)
    const returnDate = calendarDate(body.returnDate)
    const pickupTime = text(body.pickupTime, 5)
    const returnTime = text(body.returnTime, 5)
    const pickupLocation = text(body.pickupLocation, 180)
    const dropoffLocation = text(body.dropoffLocation, 180)
    const car = VEHICLES.find((vehicle) => vehicle.id === body.carId)

    if (!customerName || !emailPattern.test(customerEmail) || !customerPhone || !whatsappNumber || !country) {
      return NextResponse.json({ error: "Enter a valid name, email, phone number, WhatsApp contact and country." }, { status: 400 })
    }
    if (!pickupDate || !returnDate || !timePattern.test(pickupTime) || !timePattern.test(returnTime) || !pickupLocation || !dropoffLocation) {
      return NextResponse.json({ error: "Enter valid trip dates, times and pickup and return locations." }, { status: 400 })
    }
    if (body.pickupDate < todayInSeychelles()) {
      return NextResponse.json({ error: "Pickup date cannot be in the past." }, { status: 400 })
    }
    if (`${body.returnDate}T${returnTime}` <= `${body.pickupDate}T${pickupTime}`) {
      return NextResponse.json({ error: "Return must be after pickup." }, { status: 400 })
    }
    if (!car) return NextResponse.json({ error: "Choose one of the listed vehicles." }, { status: 400 })
    if (typeof body.childSeat !== "boolean" || typeof body.additionalDriver !== "boolean") {
      return NextResponse.json({ error: "Invalid extras selection." }, { status: 400 })
    }

    const pricing = computePrice({
      ratePerDay: car.dailyRate,
      pickupDate: body.pickupDate,
      pickupTime,
      dropoffDate: body.returnDate,
      dropoffTime: returnTime,
      childSeat: body.childSeat,
      additionalDriver: body.additionalDriver,
    })
    const bookingId = `SCH-${Date.now()}-${randomBytes(5).toString("hex").toUpperCase()}`
    const createdAt = new Date().toISOString()
    const booking = {
      id: bookingId,
      customerName,
      customerEmail,
      customerPhone,
      whatsappNumber,
      country,
      flightNumber: pickupLocation === "SEZ Airport" ? text(body.flightNumber, 40) : "",
      pickupDate: pickupDate.toISOString(),
      pickupTime,
      pickupLocation,
      returnDate: returnDate.toISOString(),
      returnTime,
      returnLocation: dropoffLocation,
      carId: car.id,
      carName: car.name,
      carType: car.bodyStyle,
      currency: "EUR",
      dailyRateMinor: Math.round(car.dailyRate * 100),
      rentalDays: pricing.rentalDays,
      totalAmountMinor: Math.round(pricing.total * 100),
      status: "PENDING",
      childSeat: body.childSeat,
      additionalDriver: body.additionalDriver,
      createdAt,
    }

    return NextResponse.json({ bookingId, booking }, { status: 201 })
  } catch (error) {
    console.error("[Booking Request Error]", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "We could not prepare your request. Please try again or contact us." }, { status: 400 })
  }
}
