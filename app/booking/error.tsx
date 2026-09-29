"use client"

import Link from "next/link"

export default function BookingError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-cream px-5 py-20">
      <div role="alert" className="max-w-xl mx-auto rounded-3xl bg-white border border-border p-8 text-center">
        <p className="eyebrow text-magenta mb-4">Let’s try that again</p>
        <h1 className="font-display text-3xl font-bold text-navy">Your booking page couldn’t load.</h1>
        <p className="text-muted-foreground mt-4">Retry below, or contact us on WhatsApp to plan your rental.</p>
        <button onClick={reset} className="mt-6 rounded-xl bg-navy text-white px-6 py-3 font-semibold">Try again</button>
        <div className="mt-5 flex justify-center gap-6 text-sm text-magenta underline">
          <Link href="/">Back to home</Link>
          <a href="https://wa.me/2482821182" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
        </div>
      </div>
    </main>
  )
}
