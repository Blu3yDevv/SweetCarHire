import { NextResponse } from "next/server"

let cache: { t: number; data: any } | null = null
const TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

export async function GET(req: Request) {
  const url = new URL(req.url)
  const base = url.searchParams.get("base") || "EUR"
  const now = Date.now()

  if (cache && now - cache.t < TTL_MS) {
    return NextResponse.json(cache.data)
  }

  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${base}`, {
      next: { revalidate: TTL_MS / 1000 },
    })

    if (!res.ok) {
      return NextResponse.json({ rates: { EUR: 1, SCR: 14.8, GBP: 0.85, USD: 1.09, JPY: 163 } }, { status: 200 })
    }

    const data = await res.json()
    cache = { t: now, data: { rates: data.rates } }
    return NextResponse.json({ rates: data.rates })
  } catch (error) {
    console.error("[v0] Exchange rate fetch failed:", error)
    return NextResponse.json({ rates: { EUR: 1, SCR: 14.8, GBP: 0.85, USD: 1.09, JPY: 163 } }, { status: 200 })
  }
}
