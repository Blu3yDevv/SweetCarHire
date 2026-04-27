"use client"

import { useEffect, useState, useRef } from "react"
import { Award, Car, Briefcase } from "lucide-react"

export function StatsBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState({
    vehicles: 0,
    years: 0,
    bookings: 0,
  })

  const sectionRef = useRef<HTMLDivElement>(null)

  const stats = [
    { icon: Car, label: "Premium Vehicles", value: 2, suffix: "", color: "text-magenta", bgColor: "bg-magenta/10" },
    { icon: Award, label: "Years Experience", value: 5, suffix: "", color: "text-sunshine", bgColor: "bg-sunshine/10" },
    {
      icon: Briefcase,
      label: "Successful Bookings",
      value: 100,
      suffix: "+",
      color: "text-navy",
      bgColor: "bg-navy/10",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const timers = stats.map((stat, index) => {
      const increment = stat.value / steps
      let currentCount = 0

      return setInterval(() => {
        currentCount += increment
        if (currentCount >= stat.value) {
          currentCount = stat.value
          clearInterval(timers[index])
        }

        setCounts((prev) => ({
          ...prev,
          [Object.keys(counts)[index]]: Math.floor(currentCount),
        }))
      }, interval)
    })

    return () => timers.forEach(clearInterval)
  }, [isVisible])

  return (
    <div ref={sectionRef} className="bg-cream py-16 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-magenta/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const countKey = Object.keys(counts)[index] as keyof typeof counts

            return (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`${stat.bgColor} ${stat.color} p-5 rounded-2xl shadow-sm transition-transform duration-300 hover:scale-105`}
                  >
                    <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <div className="font-poppins font-black text-4xl md:text-5xl lg:text-6xl text-navy tracking-tight">
                      {counts[countKey]}
                      {stat.suffix}
                    </div>
                    <div className="text-sm md:text-base text-muted-foreground font-medium tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
