import { type NextRequest, NextResponse } from "next/server"
import {
  generateAdminNotificationEmail,
  generateCustomerConfirmationEmail,
  type BookingEmailData,
} from "@/lib/email-templates"
import { VEHICLES } from "@/lib/fleet"
import { computePrice } from "@/lib/pricing"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const emailPattern = /^[^\s<>"'&@]+@[^\s<>"'&@]+\.[^\s<>"'&@]+$/
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/

function plainText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : ""
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!)
}

async function sendEmail(payload: Record<string, unknown>) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY! },
    body: JSON.stringify(payload),
  })
  return response
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.BREVO_API_KEY) {
      return NextResponse.json({ ok: false, error: "Booking email is temporarily unavailable. Please contact us directly." }, { status: 503 })
    }

    const body = await request.json()
    const customerEmail = plainText(body.customerEmail, 254).toLowerCase()
    const car = VEHICLES.find((vehicle) => vehicle.id === body.carId)
    const pickupDate = plainText(body.pickupDate, 10)
    const returnDate = plainText(body.returnDate, 10)
    const pickupTime = plainText(body.pickupTime, 5)
    const returnTime = plainText(body.returnTime, 5)
    const childSeat = body.childSeat === true
    const additionalDriver = body.additionalDriver === true

    if (!emailPattern.test(customerEmail)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 })
    }
    if (!car || !/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) || !/^\d{4}-\d{2}-\d{2}$/.test(returnDate) || !timePattern.test(pickupTime) || !timePattern.test(returnTime)) {
      return NextResponse.json({ ok: false, error: "The booking details are incomplete or invalid. Please review your request." }, { status: 400 })
    }

    const customerNameRaw = plainText(body.customerName, 120)
    const customerPhoneRaw = plainText(body.customerPhone, 40)
    const whatsappNumberRaw = plainText(body.whatsappNumber, 40)
    const bookingIdRaw = plainText(body.bookingId, 48)
    const pickupLocationRaw = plainText(body.pickupLocation, 180)
    const returnLocationRaw = plainText(body.returnLocation, 180)
    if (!customerNameRaw || !customerPhoneRaw || !whatsappNumberRaw || !bookingIdRaw || !pickupLocationRaw || !returnLocationRaw) {
      return NextResponse.json({ ok: false, error: "Some required booking details are missing." }, { status: 400 })
    }

    const pricing = computePrice({
      ratePerDay: car.dailyRate,
      pickupDate,
      pickupTime,
      dropoffDate: returnDate,
      dropoffTime: returnTime,
      childSeat,
      additionalDriver,
    })
    const extras = [
      ...(childSeat ? [{ name: "Child Seat", price: 5 }] : []),
      ...(additionalDriver ? [{ name: "Additional Driver", price: 10 }] : []),
    ]
    const booking: BookingEmailData = {
      bookingId: escapeHtml(bookingIdRaw),
      bookingDate: new Date().toISOString(),
      customerName: escapeHtml(customerNameRaw),
      customerEmail,
      customerPhone: escapeHtml(customerPhoneRaw),
      flightNumber: escapeHtml(plainText(body.flightNumber, 40)),
      whatsappNumber: escapeHtml(whatsappNumberRaw),
      carName: car.name,
      carType: car.bodyStyle,
      pickupDate,
      pickupTime,
      pickupLocation: escapeHtml(pickupLocationRaw),
      returnDate,
      returnTime,
      returnLocation: escapeHtml(returnLocationRaw),
      extras,
      subtotal: pricing.subtotal,
      total: pricing.total,
      pricing: { subtotal: pricing.subtotal, total: pricing.total },
    }

    const sender = {
      name: process.env.BREVO_SENDER_NAME || "Sweet Car Hire",
      email: process.env.BREVO_SENDER_EMAIL || "bookings@sweetcarhire.com",
    }
    const adminEmail = process.env.ADMIN_EMAIL || "sweetcarhirebooking@gmail.com"
    const adminResponse = await sendEmail({
      sender,
      to: [{ email: adminEmail, name: "Sweet Car Hire" }],
      replyTo: { email: customerEmail, name: customerNameRaw },
      subject: `New booking request: ${bookingIdRaw} - ${car.name}`,
      htmlContent: generateAdminNotificationEmail(booking),
    })
    if (!adminResponse.ok) {
      console.error("[Booking Email] Admin notification failed with status", adminResponse.status)
      return NextResponse.json({ ok: false, error: "We could not email the team, so your request was not submitted. Please contact us directly." }, { status: 502 })
    }

    let customerSent = false
    try {
      const customerResponse = await sendEmail({
        sender,
        to: [{ email: customerEmail, name: customerNameRaw }],
        subject: `Booking request received - ${bookingIdRaw}`,
        htmlContent: generateCustomerConfirmationEmail(booking),
      })
      customerSent = customerResponse.ok
      if (!customerResponse.ok) console.error("[Booking Email] Customer receipt failed with status", customerResponse.status)
    } catch (error) {
      console.error("[Booking Email] Customer receipt failed", error instanceof Error ? error.message : "Unknown error")
    }

    return NextResponse.json({ ok: true, results: { adminEmail: { sent: true }, customerEmail: { sent: customerSent } } })
  } catch (error) {
    console.error("[Booking Email Error]", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ ok: false, error: "We could not send your request. Please try again or contact us." }, { status: 502 })
  }
}
