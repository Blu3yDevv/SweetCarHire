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
    { icon: Car, label: "Premium Vehicles", value: 2, suffix: "", color: "text-magenta" },
    { icon: Award, label: "Years Experience", value: 5, suffix: "", color: "text-sunshine" },
    { icon: Briefcase, label: "Successful Bookings", value: 100, suffix: "+", color: "text-navy" },
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
    <div
      ref={sectionRef}
      className="bg-gradient-to-r from-navy/5 via-magenta/5 to-navy/5 py-12 md:py-16 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #0d2b5f 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const countKey = Object.keys(counts)[index] as keyof typeof counts

            return (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 delay-${index * 100} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`${stat.color} bg-white p-4 rounded-2xl shadow-lg`}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
                  </div>
                  <div className="font-poppins font-black text-3xl md:text-4xl lg:text-5xl text-navy">
                    {counts[countKey]}
                    {stat.suffix}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
