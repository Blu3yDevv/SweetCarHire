import { NextResponse } from "next/server"

const cache = new Map<string, { t: number; data: { rates: Record<string, number> } }>()
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
  const cached = cache.get(base)
  if (cached && now - cached.t < TTL_MS) {
    return NextResponse.json(cached.data)
  }

  const rates: Record<string, number> = { [base]: 1 }
  const apis = [
    `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`,
    `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`,
  ]

  for (const apiUrl of apis) {
    try {
      const res = await fetch(apiUrl, {
        signal: AbortSignal.timeout(5000),
        next: { revalidate: TTL_MS / 1000 },
      })

      if (!res.ok) continue

      const data = await res.json()
      const sourceRates = data.rates || data.conversion_rates || {}
      for (const code of Object.keys(FALLBACK_RATES)) {
        const rate = sourceRates[code]
        if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) rates[code] = rate
      }
      // Frankfurter does not publish SCR. Keep checking the second provider until SCR is present.
      if (rates.SCR) break
    } catch {
      // Keep trying another provider; never fail the booking page because rates are unavailable.
    }
  }

  // These are clearly estimates used only if providers omit a currency; EUR remains the pricing base.
  for (const [code, rate] of Object.entries(FALLBACK_RATES)) {
    if (!(code in rates)) rates[code] = rate
  }
  const data = { rates }
  cache.set(base, { t: now, data })
  return NextResponse.json(data)
}
