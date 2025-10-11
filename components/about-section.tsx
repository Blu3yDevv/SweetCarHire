"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  const stats = [
    { number: "Strong", label: "Community", icon: Users },
    { number: "24/7", label: "Support Available", icon: Heart },
  ]

  return (
    <section id="about" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gradient mb-4 md:mb-6">
              About Sweet Car Hire
            </h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed">
              <p>
                Sweet Car Hire is a warm, local Mahé car-rental that feels like a friendly island helper more than a
                faceless service, clean, reliable cars, easy mobile booking, and quick airport meet-ups so guests can
                start exploring Seychelles the moment they arrive; the brand voice is sunny and reassuring, promising
                simple pricing and flexible support so travellers can focus on beaches, viewpoints and spontaneous
                detours rather than logistics.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              <Image
                src="/images/disp1.jpg"
                alt="Sweet Car Hire service at Seychelles airport"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 md:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={stat.label} className="card-hover border-0 bubble-shadow bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-12 md:w-16 h-12 md:h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-3 md:mb-4">
                      <IconComponent className="h-5 md:h-6 w-5 md:w-6 text-primary" />
                    </div>
                    <div className="font-poppins font-bold text-2xl md:text-3xl text-gradient mb-1 md:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground font-medium text-xs md:text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
