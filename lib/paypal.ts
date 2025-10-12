import { v4 as uuidv4 } from "uuid"

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com"

interface PayPalAccessToken {
  access_token: string
  expires_in: number
  token_type: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getPayPalAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`)
  }

  const data: PayPalAccessToken = await response.json()

  // Cache token (expires in 9 hours, we cache for 8 hours to be safe)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 3600000, // 1 hour buffer
  }

  return data.access_token
}

export async function createPayPalOrder(params: {
  amount: string
  currency: string
  description: string
  bookingId: string
}): Promise<{ orderID: string }> {
  const accessToken = await getPayPalAccessToken()
  const idempotencyKey = uuidv4()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": idempotencyKey,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.bookingId,
          amount: {
            currency_code: params.currency,
            value: params.amount,
          },
          description: params.description,
        },
      ],
      application_context: {
        brand_name: "Sweet Car Hire",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${process.env.APP_BASE_URL}/booking/success`,
        cancel_url: `${process.env.APP_BASE_URL}/booking/payment`,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("[PayPal Create Order Error]:", error)
    throw new Error(`Failed to create PayPal order: ${response.statusText}`)
  }

  const data = await response.json()
  return { orderID: data.id }
}

export async function capturePayPalOrder(orderID: string): Promise<any> {
  const accessToken = await getPayPalAccessToken()
  const idempotencyKey = uuidv4()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": idempotencyKey,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("[PayPal Capture Order Error]:", error)
    throw new Error(`Failed to capture PayPal order: ${response.statusText}`)
  }

  return await response.json()
}

export async function verifyWebhookSignature(params: {
  webhookId: string
  headers: Record<string, string>
  body: string
}): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken()

    const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: params.headers["paypal-transmission-id"],
        transmission_time: params.headers["paypal-transmission-time"],
        cert_url: params.headers["paypal-cert-url"],
        auth_algo: params.headers["paypal-auth-algo"],
        transmission_sig: params.headers["paypal-transmission-sig"],
        webhook_id: params.webhookId,
        webhook_event: JSON.parse(params.body),
      }),
    })

    if (!response.ok) {
      console.error("[PayPal Webhook Verification Failed]:", await response.text())
      return false
    }

    const data = await response.json()
    return data.verification_status === "SUCCESS"
  } catch (error) {
    console.error("[PayPal Webhook Verification Error]:", error)
    return false
  }
}

export async function refundPayPalCapture(params: {
  captureId: string
  amount: string
  currency: string
}): Promise<any> {
  const accessToken = await getPayPalAccessToken()
  const idempotencyKey = uuidv4()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/payments/captures/${params.captureId}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": idempotencyKey,
    },
    body: JSON.stringify({
      amount: {
        currency_code: params.currency,
        value: params.amount,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("[PayPal Refund Error]:", error)
    throw new Error(`Failed to refund PayPal capture: ${response.statusText}`)
  }

  return await response.json()
}

// These are deprecated and not used in the current codebase
// The new implementation uses REST API directly via the functions above
export const paypalClient = null
export const checkoutNodeJssdk = null
