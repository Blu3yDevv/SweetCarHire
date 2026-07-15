"use client"

import { ArrowRight, Heart, Phone, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const VALUES = [
  { icon: Heart, text: "Family-run and local, with the same friendly faces at every handover" },
  { icon: Sparkles, text: "Cars cleaned and checked by hand before every rental" },
  { icon: Phone, text: "One WhatsApp message away at any hour of your trip" },
]

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 md:gap-20 items-center max-w-6xl mx-auto">
          {/* Photo */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-x-0 rotate-[-2deg]" : "opacity-0 -translate-x-12 rotate-0"
            }`}
          >
            <div className="bg-cream p-3 pb-14 rounded-2xl shadow-[0_20px_60px_-20px_rgba(13,43,95,0.35)]">
              <Image
                src="/images/disp1.jpg"
                alt="Sweet Car Hire handover at Seychelles airport"
                width={600}
                height={450}
                className="rounded-xl w-full object-cover"
              />
              <p className="font-display font-bold text-navy/60 text-center mt-4 text-sm tracking-wide">
                Airport handover, Mahé
              </p>
            </div>
            <div className="sticker absolute -top-4 -right-3 px-5 py-2 text-sm rotate-6">100% island-owned</div>
          </div>

          {/* Copy */}
          <div
            className={`transition-all duration-700 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <p className="eyebrow text-magenta mb-4">About us</p>
            <h2 className="display-heading text-navy text-5xl md:text-6xl lg:text-7xl text-balance">
              A friendly island helper, not a rental counter.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Sweet Car Hire is a small, local rental run from Mahé. We keep our cars clean and
              reliable, booking works from your phone, and we meet you at the airport so your
              holiday starts the moment you land.
            </p>

            <ul className="mt-8 space-y-4">
              {VALUES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3.5">
                  <span className="mt-0.5 w-8 h-8 shrink-0 rounded-full bg-magenta/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-magenta" strokeWidth={2} />
                  </span>
                  <span className="text-navy/80 leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/booking"
              className="group inline-flex items-center gap-3 bg-magenta hover:bg-pink text-white font-display font-bold text-lg px-9 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_30px_-8px_rgba(231,44,130,0.5)] mt-10"
            >
              Start your journey
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
