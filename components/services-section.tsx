"use client"

import { useState, useEffect, useRef } from "react"

const SERVICES = [
  {
    title: "Airport delivery",
    description: "We meet you at SEZ Airport with the car ready to go, so you skip the counters and the waiting around.",
  },
  {
    title: "Unlimited mileage",
    description: "There is no distance limit on any rental. Drive as much of the island as you like.",
  },
  {
    title: "Full insurance",
    description: "Comprehensive cover is included as standard with every booking.",
  },
  {
    title: "24/7 support",
    description: "You can reach a real local person on the phone at any hour of your rental.",
  },
  {
    title: "WhatsApp booking",
    description: "Book and get your questions answered over WhatsApp, usually within minutes.",
  },
  {
    title: "No hidden fees",
    description: "The price you see when you book is the price you pay. Nothing gets added later.",
  },
]

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="py-20 md:py-28 bg-navy relative overflow-hidden">
      {/* Soft glows */}
      <div className="absolute -top-40 right-[-10%] w-[500px] h-[500px] bg-magenta/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 left-[-10%] w-[500px] h-[500px] bg-pink/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-5 md:px-8 relative z-10">
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="eyebrow text-pink mb-4">Why choose us</p>
          <h2 className="display-heading text-white text-5xl md:text-6xl lg:text-7xl text-balance">
            The sweet way to rent.
          </h2>
          <p className="mt-5 text-lg text-white/70 leading-relaxed">
            Renting a car should be the easy part of your holiday. Here is how we keep it that way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {SERVICES.map((service, index) => (
            <div
              key={service.title}
              className={`group border-t-2 border-white/15 pt-6 transition-all duration-700 ease-out hover:border-pink ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="display-heading text-outline-white text-6xl md:text-7xl select-none transition-colors duration-300 group-hover:text-pink">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-white mt-4">{service.title}</h3>
              <p className="text-white/65 leading-relaxed mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
