"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Fuel, Cog, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export function FleetSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const vehicles = [
    {
      name: "Suzuki Dzire",
      image: "/images/dzire2.png",
      passengers: "5",
      transmission: "Automatic",
      fuel: "Petrol",
      features: ["Air Conditioning", "Bluetooth", "USB Charging", "Compact Sedan"],
      price: "From €45/day",
      basePrice: 45,
      popular: true,
    },
    {
      name: "Suzuki Fronx",
      image: "/images/fronx2.png",
      passengers: "5",
      transmission: "Automatic",
      fuel: "Petrol",
      features: ["High Ground Clearance", "Spacious Interior", "Modern Design", "Compact SUV"],
      price: "From €60/day",
      basePrice: 60,
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-card-index") || "0")
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])])
          }
        })
      },
      { threshold: 0.2 },
    )

    const cards = sectionRef.current?.querySelectorAll("[data-card-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="fleet" className="py-20 md:py-32 bg-cream relative overflow-hidden">
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-magenta/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-navy/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
          <h2 className="font-poppins font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-navy mb-6 tracking-tight">
            Our Sweet Fleet
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Choose from our carefully maintained vehicles, perfect for exploring the beautiful islands of Seychelles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.name}
              data-card-index={index}
              className={`transition-all duration-700 ease-out ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Card className="overflow-hidden border-0 shadow-[0_4px_40px_-12px_rgba(13,43,95,0.12)] hover:shadow-[0_8px_50px_-12px_rgba(231,44,130,0.15)] transition-all duration-500 group bg-white rounded-3xl">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white p-8 pb-4">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    className="w-full h-52 md:h-64 object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  {vehicle.popular && (
                    <div className="absolute top-6 right-6 bg-magenta text-white rounded-full px-4 py-2 text-xs font-bold shadow-lg">
                      Most Popular
                    </div>
                  )}
                </div>

                <CardContent className="p-8 pt-4">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="font-poppins font-bold text-2xl md:text-3xl text-navy">{vehicle.name}</h3>
                    <p className="text-magenta font-black text-xl md:text-2xl" data-price={vehicle.basePrice}>
                      {vehicle.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 text-navy" strokeWidth={2} />
                      <span className="text-sm font-medium">{vehicle.passengers}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Cog className="h-4 w-4 text-navy" strokeWidth={2} />
                      <span className="text-sm font-medium">{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Fuel className="h-4 w-4 text-navy" strokeWidth={2} />
                      <span className="text-sm font-medium">{vehicle.fuel}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {vehicle.features.map((feature) => (
                      <span
                        key={feature}
                        className="bg-cream text-navy/70 px-3 py-1.5 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/booking?car=${encodeURIComponent(vehicle.name)}`}
                    className="group/btn w-full bg-navy hover:bg-navy/90 text-white font-bold text-base px-6 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                  >
                    Book This Car
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
