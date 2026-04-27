"use client"
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type Rates = Record<string, number>
type Ctx = {
  currency: string
  locale: string
  rates: Rates
  setCurrency: (c: string) => void
  convert: (amountEUR: number) => number
  format: (amountEUR: number) => string
}

const CurrencyCtx = createContext<Ctx | null>(null)

export function CurrencyProvider({
  children,
  defaultCurrency = "EUR",
  defaultLocale = "en-SC",
}: {
  children: ReactNode
  defaultCurrency?: string
  defaultLocale?: string
}) {
  const [currency, setCurrencyState] = useState(defaultCurrency)
  const [rates, setRates] = useState<Rates>({ EUR: 1, SCR: 14.8, GBP: 0.85, USD: 1.09, JPY: 163 })

  useEffect(() => {
    const saved = localStorage.getItem("selectedCurrency")
    if (saved) {
      console.log("[v0] Loaded currency from localStorage:", saved)
      setCurrencyState(saved)
    }
  }, [])

  useEffect(() => {
    const fetchRates = async () => {
      try {
        console.log("[v0] Fetching exchange rates...")
        const res = await fetch("/api/rates?base=EUR", { cache: "no-store" })
        if (!res.ok) {
          console.error("[v0] Failed to fetch rates:", res.status)
          return
        }
        const data = await res.json()
        console.log("[v0] Exchange rates updated:", data.rates)
        setRates((prev) => ({ ...prev, ...data.rates }))
      } catch (error) {
        console.error("[v0] Error fetching exchange rates:", error)
      }
    }

    fetchRates()
    const interval = setInterval(fetchRates, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const setCurrency = (c: string) => {
    console.log("[v0] Changing currency to:", c)
    setCurrencyState(c)
    localStorage.setItem("selectedCurrency", c)
    window.dispatchEvent(new CustomEvent("currency-changed", { detail: c }))
  }

  const convert = (amountEUR: number) => {
    const rate = rates[currency] ?? 1
    return Math.round(amountEUR * rate * 100) / 100
  }

  const format = (amountEUR: number) =>
    new Intl.NumberFormat(defaultLocale, { style: "currency", currency }).format(convert(amountEUR))

  const value = useMemo(
    () => ({ currency, locale: defaultLocale, rates, setCurrency, convert, format }),
    [currency, defaultLocale, rates],
  )
  return <CurrencyCtx.Provider value={value}>{children}</CurrencyCtx.Provider>
}

export function useCurrency() {
  const v = useContext(CurrencyCtx)
  if (!v) throw new Error("useCurrency must be used within CurrencyProvider")
  return v
}

export function formatCurrency(amountEUR: number, locale: string, currency: string, rates: Rates) {
  const rate = rates[currency] ?? 1
  const converted = Math.round(amountEUR * rate * 100) / 100
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(converted)
}
