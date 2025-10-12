import { type NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature } from "@/lib/paypal"

const processedEvents = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const event = JSON.parse(body)

    const eventId = event.id
    if (processedEvents.has(eventId)) {
      console.log("[PayPal Webhook] Duplicate event ignored:", eventId)
      return NextResponse.json({ received: true, duplicate: true })
    }

    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    if (!webhookId) {
      console.error("[PayPal Webhook] PAYPAL_WEBHOOK_ID not configured")
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
    }

    const headers: Record<string, string> = {
      "paypal-transmission-id": request.headers.get("paypal-transmission-id") || "",
      "paypal-transmission-time": request.headers.get("paypal-transmission-time") || "",
      "paypal-cert-url": request.headers.get("paypal-cert-url") || "",
      "paypal-auth-algo": request.headers.get("paypal-auth-algo") || "",
      "paypal-transmission-sig": request.headers.get("paypal-transmission-sig") || "",
    }

    const isValid = await verifyWebhookSignature({ webhookId, headers, body })

    if (!isValid) {
      console.error("[PayPal Webhook] Invalid signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    processedEvents.add(eventId)

    const eventType = event.event_type
    console.log("[PayPal Webhook] Processing event:", eventType, eventId)

    switch (eventType) {
      case "CHECKOUT.ORDER.APPROVED": {
        console.log("[PayPal Webhook] Order approved:", event.resource.id)
        // Optional: Log for sanity check
        break
      }

      case "PAYMENT.CAPTURE.COMPLETED": {
        const captureId = event.resource.id
        const bookingId = event.resource.custom_id || event.resource.supplementary_data?.related_ids?.order_id

        console.log("[PayPal Webhook] Payment captured:", { captureId, bookingId })

        // Since we don't have Prisma set up, we'll log it
        // In production, you would update the booking status in the database
        if (typeof window !== "undefined") {
          const paymentEvent = {
            type: "CAPTURE_COMPLETED",
            captureId,
            bookingId,
            timestamp: new Date().toISOString(),
            raw: event,
          }
          sessionStorage.setItem(`payment_${captureId}`, JSON.stringify(paymentEvent))
        }

        break
      }

      case "PAYMENT.CAPTURE.DENIED": {
        const captureId = event.resource.id
        console.error("[PayPal Webhook] Payment denied:", captureId)

        // In production, you would update the booking status in the database
        break
      }

      case "CHECKOUT.PAYMENT-APPROVAL.REVERSED": {
        console.log("[PayPal Webhook] Payment approval reversed:", event.resource.id)
        break
      }

      default:
        console.log("[PayPal Webhook] Unhandled event type:", eventType)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[PayPal Webhook Error]:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
