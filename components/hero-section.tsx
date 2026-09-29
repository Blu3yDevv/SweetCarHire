import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { TripPlanner } from "@/components/trip-planner"

export function HeroSection() {
  return (
    <section id="home" className="hero-scene relative isolate overflow-hidden bg-navy">
      {/* Beach backdrop */}
      <div className="absolute inset-0">
        <Image src="/beach-bg.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-navy/65" />
      </div>

      <div className="hero-copy container mx-auto px-5 md:px-8 relative z-10 text-center max-w-6xl">
        <p className="text-sm font-medium tracking-wide text-white/80 mb-6">Car hire in Mahé, Seychelles</p>

        <h1 className="display-heading text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-balance">
          Drive Mahé
          <span className="block text-pink">your way.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-xl mx-auto text-pretty">
          Start your Seychelles trip with a car that suits your plans. Choose airport or local pickup and explore Mahé at your own pace.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="#fleet"
            className="hero-cta hero-cta-primary group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-magenta px-7 py-3 font-semibold text-white"
          >
            Explore the fleet
            <ArrowRight className="hero-cta-arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta hero-cta-secondary group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/50 px-7 py-3 font-semibold text-white"
          >
            <MessageCircle className="hero-whatsapp-icon h-4 w-4" aria-hidden="true" />
            WhatsApp us
          </a>
        </div>
      </div>
      <TripPlanner />
    </section>
  )
}
