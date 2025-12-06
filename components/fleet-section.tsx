"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Fuel, Cog } from "lucide-react"
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
    <section ref={sectionRef} id="fleet" className="py-16 md:py-24 section-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-magenta/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with animation */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-poppins font-black text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-navy via-magenta to-navy bg-clip-text text-transparent mb-6">
            Our Sweet Fleet
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            Choose from our carefully maintained vehicles, perfect for exploring the beautiful islands of Seychelles.
            Every car is hand-picked for quality, comfort, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.name}
              data-card-index={index}
              className={`transition-all duration-700 delay-${index * 200} ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              <Card className="overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    className="w-full h-64 md:h-72 object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                  {vehicle.popular && (
                    <div className="absolute top-4 right-4 bg-magenta text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-md">
                      Most Popular
                    </div>
                  )}
                </div>

                <CardContent className="p-6 md:p-8">
                  <h3 className="font-poppins font-bold text-2xl text-navy mb-2">{vehicle.name}</h3>

                  <p className="text-magenta font-black text-2xl mb-6" data-price={vehicle.basePrice}>
                    {vehicle.price}
                  </p>

                  <div className="flex items-center justify-around gap-4 mb-6 pb-6 border-b">
                    <div className="flex flex-col items-center gap-1.5">
                      <Users className="h-5 w-5 text-navy" strokeWidth={2} />
                      <span className="text-xs font-medium text-muted-foreground">{vehicle.passengers} Seats</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Cog className="h-5 w-5 text-navy" strokeWidth={2} />
                      <span className="text-xs font-medium text-muted-foreground">{vehicle.transmission}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Fuel className="h-5 w-5 text-navy" strokeWidth={2} />
                      <span className="text-xs font-medium text-muted-foreground">{vehicle.fuel}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature) => (
                        <span
                          key={feature}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/booking?car=${encodeURIComponent(vehicle.name)}`}
                    className="w-full bg-magenta hover:bg-pink text-white font-bold text-base px-6 py-3.5 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg inline-block text-center"
                  >
                    Book This Car
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
