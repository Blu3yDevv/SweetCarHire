import { NextResponse } from "next/server"

let cache: { t: number; data: any } | null = null
const TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

const FALLBACK_RATES = {
  EUR: 1,
  SCR: 14.8,
  GBP: 0.85,
  USD: 1.09,
  JPY: 163,
  CHF: 0.95,
  CAD: 1.47,
  AUD: 1.65,
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const base = url.searchParams.get("base") || "EUR"
  const now = Date.now()

  // Return cached data if still valid
  if (cache && now - cache.t < TTL_MS) {
    return NextResponse.json(cache.data)
  }

  const apis = [
    // Frankfurter.app - Free, no API key, maintained by ECB
    `https://api.frankfurter.app/latest?from=${base}`,
    // ExchangeRate-API.com - Free tier, 1500 requests/month
    `https://open.er-api.com/v6/latest/${base}`,
  ]

  for (const apiUrl of apis) {
    try {
      console.log(`[v0] Fetching exchange rates from ${apiUrl}`)
      const res = await fetch(apiUrl, {
        next: { revalidate: TTL_MS / 1000 },
      })

      if (!res.ok) {
        console.log(`[v0] API returned status ${res.status}, trying next API`)
        continue
      }

      const data = await res.json()

      const rates = data.rates || data.conversion_rates || {}

      // Ensure base currency is included
      if (!rates[base]) {
        rates[base] = 1
      }

      const normalizedData = { rates }
      cache = { t: now, data: normalizedData }

      console.log(`[v0] Successfully fetched exchange rates from ${apiUrl}`)
      return NextResponse.json(normalizedData)
    } catch (error) {
      console.error(`[v0] Failed to fetch from ${apiUrl}:`, error)
      // Continue to next API
    }
  }

  console.log("[v0] All exchange rate APIs failed, using fallback rates")
  return NextResponse.json({ rates: FALLBACK_RATES }, { status: 200 })
}
