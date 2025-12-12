"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Plane, MapPin, Shield, Clock, Phone, CreditCard } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export function ServicesSection() {
  const [showAllPerks, setShowAllPerks] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const services = [
    {
      icon: Plane,
      title: "Airport Delivery",
      description: "We'll meet you at SEZ Airport with your rental car ready to go. No waiting, no hassle.",
      gradient: "from-magenta/10 to-pink/10",
      iconColor: "text-magenta",
    },
    {
      icon: MapPin,
      title: "Unlimited Mileage",
      description: "Explore every corner of Mahé and beyond without worrying about distance limits.",
      gradient: "from-navy/10 to-blue-500/10",
      iconColor: "text-navy",
    },
    {
      icon: Shield,
      title: "Full Insurance",
      description: "Drive with peace of mind knowing you're fully covered with comprehensive insurance.",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-600",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our team is available around the clock to assist you during your rental period.",
      gradient: "from-sunshine/10 to-amber-500/10",
      iconColor: "text-amber-600",
    },
    {
      icon: Phone,
      title: "WhatsApp Booking",
      description: "Quick and easy booking through WhatsApp. Get instant responses to your queries.",
      gradient: "from-magenta/10 to-pink/10",
      iconColor: "text-magenta",
    },
    {
      icon: CreditCard,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprise charges. What you see is what you pay.",
      gradient: "from-navy/10 to-blue-500/10",
      iconColor: "text-navy",
    },
  ]

  const displayedServices = showAllPerks ? services : services.slice(0, 3)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-service-index") || "0")
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])])
          }
        })
      },
      { threshold: 0.15 },
    )

    const cards = sectionRef.current?.querySelectorAll("[data-service-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [showAllPerks])

  return (
    <section ref={sectionRef} id="services" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/5 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
          <h2 className="font-poppins font-black text-4xl md:text-5xl lg:text-6xl text-navy mb-6 tracking-tight">
            Why Choose Us?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We make car rental in Seychelles simple, transparent, and stress-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {displayedServices.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={service.title}
                data-service-index={index}
                className={`transition-all duration-700 ease-out ${
                  visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="h-full border-0 shadow-[0_2px_20px_-6px_rgba(13,43,95,0.08)] hover:shadow-[0_8px_40px_-12px_rgba(13,43,95,0.12)] transition-all duration-500 bg-white rounded-3xl group hover:-translate-y-1">
                  <CardContent className="p-8 md:p-10">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 transition-transform duration-300 group-hover:scale-105`}
                    >
                      <IconComponent className={`h-7 w-7 md:h-8 md:w-8 ${service.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-poppins font-bold text-xl md:text-2xl text-navy mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {!showAllPerks && (
          <div className="text-center mt-10 md:hidden">
            <button
              onClick={() => setShowAllPerks(true)}
              className="bg-navy hover:bg-navy/90 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
            >
              View More Perks
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
