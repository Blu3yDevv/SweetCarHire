"use client"

import { Users, Fuel, Cog, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

const VEHICLES = [
  {
    name: "Suzuki Dzire",
    tagline: "Nimble compact sedan for coastal roads",
    image: "/images/dzire2.png",
    passengers: "5 seats",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Air conditioning", "Bluetooth", "USB charging"],
    price: 45,
    popular: true,
  },
  {
    name: "Hyundai Grand i10",
    tagline: "2026 hatchback that is easy to park anywhere",
    image: "/images/grandi10.png",
    passengers: "5 seats",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["Air conditioning", "Bluetooth"],
    price: 45,
    popular: false,
  },
  {
    name: "Suzuki Fronx",
    tagline: "Compact SUV with extra ground clearance",
    image: "/images/fronx2.png",
    passengers: "5 seats",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["High clearance", "Spacious interior", "Modern design"],
    price: 60,
    popular: false,
  },
]

export function FleetSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="fleet" className="py-20 md:py-28 bg-cream relative">
      <div className="container mx-auto px-5 md:px-8">
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="eyebrow text-magenta mb-4">Our sweet fleet</p>
          <h2 className="display-heading text-navy text-5xl md:text-6xl lg:text-7xl text-balance">
            Small fleet,
            <span className="text-magenta"> big adventures.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            We keep three cars and we know them inside out. Each one is cleaned and checked before
            it goes out, and we hand over the keys in person.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {VEHICLES.map((vehicle, index) => (
            <div
              key={vehicle.name}
              className={`transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <article className="group bg-white rounded-3xl shadow-[0_4px_40px_-12px_rgba(13,43,95,0.12)] hover:shadow-[0_16px_60px_-16px_rgba(231,44,130,0.25)] transition-shadow duration-500 overflow-hidden h-full flex flex-col">
                {/* Car */}
                <div className="relative bg-gradient-to-b from-warm-gray/60 to-white px-8 pt-10 pb-2">
                  {vehicle.popular && (
                    <div className="sticker absolute top-6 right-6 px-4 py-1.5 text-sm z-10">Most popular</div>
                  )}
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    width={560}
                    height={340}
                    className="w-full h-52 md:h-60 object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:-rotate-1"
                  />
                </div>

                <div className="p-8 pt-4 flex flex-col flex-1">
                  <h3 className="display-heading text-navy text-3xl md:text-4xl">{vehicle.name}</h3>
                  <p className="text-muted-foreground mt-2">{vehicle.tagline}</p>

                  <div className="flex flex-wrap gap-2 mt-5 mb-7">
                    {[
                      { icon: Users, text: vehicle.passengers },
                      { icon: Cog, text: vehicle.transmission },
                      { icon: Fuel, text: vehicle.fuel },
                      ...vehicle.features.map((f) => ({ icon: null, text: f })),
                    ].map(({ icon: Icon, text }) => (
                      <span
                        key={text}
                        className="inline-flex items-center gap-1.5 bg-cream text-navy/80 px-3 py-1.5 rounded-full text-xs font-semibold"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 text-magenta" strokeWidth={2} />}
                        {text}
                      </span>
                    ))}
                  </div>

                  {/* Ticket tear line, pushed to the bottom so all cards align */}
                  <div className="ticket-divider mt-auto mb-6" aria-hidden="true" />

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span className="eyebrow text-muted-foreground block mb-1">From</span>
                      <span className="display-heading text-magenta text-4xl md:text-5xl">
                        €{vehicle.price}
                        <span className="text-lg text-navy/50 font-semibold tracking-normal">/day</span>
                      </span>
                    </div>
                    <Link
                      href={`/booking?car=${encodeURIComponent(vehicle.name)}`}
                      className="group/btn inline-flex items-center gap-2 bg-navy hover:bg-magenta text-white font-display font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                    >
                      Book
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
