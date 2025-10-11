"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Fuel, Cog } from "lucide-react"
import Link from "next/link"

export function FleetSection() {
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

  return (
    <section id="fleet" className="py-12 md:py-20 section-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gradient mb-4">
            Our Sweet Fleet
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Choose from our carefully maintained vehicles, perfect for exploring the beautiful islands of Seychelles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {vehicles.map((vehicle, index) => (
            <Card key={vehicle.name} className="card-hover overflow-hidden border-0 bubble-shadow">
              <div className="relative">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  className="w-full h-48 md:h-56 object-cover"
                />
                {vehicle.popular && (
                  <div className="absolute top-4 right-4 bg-[var(--magenta)] text-white rounded-full px-3 py-1">
                    <span className="text-sm font-semibold">Popular</span>
                  </div>
                )}
              </div>

              <CardContent className="p-4 md:p-6">
                <h3 className="font-poppins font-bold text-xl md:text-2xl mb-2">{vehicle.name}</h3>
                <p className="text-primary font-bold text-lg md:text-xl mb-4" data-price={vehicle.basePrice}>
                  {vehicle.price}
                </p>

                <div className="flex items-center gap-3 md:gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{vehicle.passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Cog className="h-4 w-4" />
                    <span>{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-4 w-4" />
                    <span>{vehicle.fuel}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature) => (
                      <span
                        key={feature}
                        className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/booking?car=${encodeURIComponent(vehicle.name)}`}
                  className="w-full bg-[var(--magenta)] hover:bg-[var(--magenta)]/90 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl border-2 border-white/20 backdrop-blur-sm inline-block text-center"
                >
                  Book This Car
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
