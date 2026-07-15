"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Star } from "lucide-react"

const RIBBON_ITEMS = [
  "Airport delivery",
  "Unlimited mileage",
  "No hidden fees",
  "24/7 support",
  "Free cancellation",
  "Best rates guaranteed",
]

function MarqueeRibbon() {
  const items = [...RIBBON_ITEMS, ...RIBBON_ITEMS]

  return (
    <div className="marquee-ribbon absolute bottom-0 left-[-2%] w-[104%] overflow-hidden py-3 md:py-4 z-20">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0" aria-hidden={half === 1}>
            {items.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center font-display font-bold uppercase tracking-[0.15em] text-xs md:text-sm whitespace-nowrap"
              >
                <span className="px-5 md:px-8">{item}</span>
                <span className="text-white">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToFleet = () => {
    const element = document.getElementById("fleet")
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }
  }

  const reveal = (delay: string) =>
    `transition-all duration-1000 ${delay} ease-out ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`

  return (
    <section id="home" className="relative min-h-svh flex items-center justify-center overflow-hidden bg-navy pt-28 pb-32 md:pt-32">
      {/* Beach backdrop */}
      <div className="absolute inset-0">
        <Image src="/beach-bg.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(13,43,95,0.5)_100%)]" />
      </div>

      <div className="container mx-auto px-5 md:px-8 relative z-10 text-center max-w-4xl">
        <div className={reveal("delay-100")}>
          <Image
            src="/logo.png"
            alt="Sweet Car Hire"
            width={360}
            height={225}
            className="h-32 sm:h-40 md:h-48 w-auto mx-auto drop-shadow-2xl"
            priority
          />
        </div>

        <h1 className={`display-heading text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl mt-8 text-balance ${reveal("delay-300")}`}>
          Drive Mahé
          <span className="block text-pink">your way.</span>
        </h1>

        <p className={`mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mx-auto text-pretty ${reveal("delay-500")}`}>
          Escape through the sweetness of the island. Your car is ready when you land, and the rest
          of Mahé is a short drive away.
        </p>

        <div className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center ${reveal("delay-700")}`}>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center bg-magenta hover:bg-pink text-white font-display font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 shadow-[0_10px_30px_-8px_rgba(231,44,130,0.6)] hover:-translate-y-0.5"
          >
            Book your adventure
          </Link>
          <a
            href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 border-2 border-white/40 hover:border-white text-white font-display font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
            </svg>
            WhatsApp us
          </a>
        </div>

        <div className={`mt-8 flex items-center gap-2 justify-center text-white/70 text-sm ${reveal("delay-1000")}`}>
          <span className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-pink text-pink" />
            ))}
          </span>
          Loved by 100+ travellers across Seychelles
        </div>
      </div>

      <button
        onClick={scrollToFleet}
        className={`absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-all duration-500 z-10 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Scroll to fleet"
      >
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </button>

      <MarqueeRibbon />
    </section>
  )
}
