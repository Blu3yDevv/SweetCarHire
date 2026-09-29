export default function Loading() {
  return (
    <main className="min-h-screen bg-cream px-5 py-20">
      <div role="status" className="max-w-2xl mx-auto rounded-3xl bg-white border border-border p-8 text-center">
        <p className="eyebrow text-magenta mb-4">Your island trip</p>
        <h1 className="font-display text-3xl font-bold text-navy">Loading your booking…</h1>
        <p className="text-muted-foreground mt-3">Getting the trip details ready.</p>
      </div>
    </main>
  )
}
