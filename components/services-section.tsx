"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Plane, MapPin, Shield, Clock, Phone, CreditCard } from "lucide-react"
import { useState } from "react"

export function ServicesSection() {
  const [showAllPerks, setShowAllPerks] = useState(false)

  const services = [
    {
      icon: Plane,
      title: "Airport Delivery",
      description: "We'll meet you at SEZ Airport with your rental car ready to go. No waiting, no hassle.",
      color: "text-primary",
    },
    {
      icon: MapPin,
      title: "Unlimited Mileage",
      description: "Explore every corner of Mahé and beyond without worrying about distance limits.",
      color: "text-accent",
    },
    {
      icon: Shield,
      title: "Full Insurance",
      description: "Drive with peace of mind knowing you're fully covered with comprehensive insurance.",
      color: "text-primary",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our team is available around the clock to assist you during your rental period.",
      color: "text-accent",
    },
    {
      icon: Phone,
      title: "WhatsApp Booking",
      description: "Quick and easy booking through WhatsApp. Get instant responses to your queries.",
      color: "text-primary",
    },
    {
      icon: CreditCard,
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprise charges. What you see is what you pay.",
      color: "text-accent",
    },
  ]

  const displayedServices = showAllPerks ? services : services.slice(0, 3)

  return (
    <section id="services" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gradient mb-4">
            Why Choose Sweet Car Hire?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            We make car rental in Seychelles simple, transparent, and stress-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedServices.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card key={service.title} className="card-hover border-0 bubble-shadow bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-12 md:w-16 h-12 md:h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4 md:mb-6`}
                  >
                    <IconComponent className={`h-6 md:h-8 w-6 md:w-8 ${service.color}`} />
                  </div>
                  <h3 className="font-poppins font-bold text-lg md:text-xl mb-3 md:mb-4">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {!showAllPerks && (
          <div className="text-center mt-8 md:hidden">
            <button
              onClick={() => setShowAllPerks(true)}
              className="bg-magenta hover:bg-magenta/90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View More Perks
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
