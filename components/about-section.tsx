"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const stats = [
    { number: "Strong", label: "Community", icon: Users },
    { number: "24/7", label: "Support Available", icon: Heart },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-32 bg-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-magenta/10 to-transparent" />
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-magenta/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center max-w-6xl mx-auto">
          <div
            className={`order-2 lg:order-1 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <h2 className="font-poppins font-black text-4xl md:text-5xl lg:text-6xl text-navy mb-8 tracking-tight leading-tight">
              About Sweet
              <span className="block text-magenta">Car Hire</span>
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground mb-10">
              <p>
                Sweet Car Hire is a warm, local Mahé car-rental that feels like a friendly island helper more than a
                faceless service—clean, reliable cars, easy mobile booking, and quick airport meet-ups so guests can
                start exploring Seychelles the moment they arrive.
              </p>
              <p>
                Our brand voice is sunny and reassuring, promising simple pricing and flexible support so travellers can
                focus on beaches, viewpoints and spontaneous detours rather than logistics.
              </p>
            </div>

            <Link
              href="/booking"
              className="group inline-flex items-center gap-3 bg-magenta hover:bg-pink text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div
            className={`order-1 lg:order-2 transition-all duration-700 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-magenta/10 to-navy/10 rounded-[2rem] blur-2xl opacity-50" />
              <Image
                src="/images/disp1.jpg"
                alt="Sweet Car Hire service at Seychelles airport"
                width={600}
                height={450}
                className="relative rounded-3xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div
          className={`mt-20 md:mt-28 transition-all duration-700 ease-out delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={stat.label}
                  className="border-0 shadow-[0_4px_30px_-10px_rgba(13,43,95,0.1)] bg-white rounded-3xl hover:shadow-[0_8px_40px_-10px_rgba(231,44,130,0.12)] transition-all duration-500 hover:-translate-y-1"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-magenta/10 to-navy/10 mb-4">
                      <IconComponent className="h-7 w-7 text-navy" strokeWidth={1.5} />
                    </div>
                    <div className="font-poppins font-black text-3xl md:text-4xl text-navy mb-2">{stat.number}</div>
                    <div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
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
