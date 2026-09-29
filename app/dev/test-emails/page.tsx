import Link from "next/link"

export default function TestEmailsPage() {
  return (
    <main className="min-h-screen bg-cream px-5 py-24 text-navy">
      <section className="mx-auto max-w-xl rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-magenta">Development information</p>
        <h1 className="mt-3 text-3xl font-bold">Email testing</h1>
        <p className="mt-4 leading-relaxed text-navy/75">
          The old sample email used unsupported VAT and deposit figures. Those sample figures and the public send form have been removed.
        </p>
        <p className="mt-3 leading-relaxed text-navy/75">
          Booking email tests should use a test inbox and verified sender settings. A booking request is only submitted after the team notification email has been accepted by the email provider; no database is used.
        </p>
        <Link href="/" className="mt-6 inline-flex font-semibold text-magenta underline underline-offset-4">Return to the site</Link>
      </section>
    </main>
  )
}
