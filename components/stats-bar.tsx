"use client"

import { useEffect, useState, useRef } from "react"

const STATS = [
  { key: "vehicles", label: "Premium vehicles", value: 3, suffix: "", pad: true },
  { key: "years", label: "Years on the island", value: 7, suffix: "", pad: true },
  { key: "bookings", label: "Happy bookings", value: 100, suffix: "+", pad: false },
] as const

export function StatsBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0))
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.3 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 1600
    const start = performance.now()
    let frame: number

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCounts(STATS.map((stat) => Math.round(stat.value * eased)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isVisible])

  return (
    <div ref={sectionRef} className="bg-cream py-16 md:py-24">
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x-2 md:divide-dashed md:divide-navy/15">
          {STATS.map((stat, index) => (
            <div
              key={stat.key}
              className={`text-center transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="display-heading text-outline-navy text-7xl md:text-8xl lg:text-9xl select-none notranslate">
                {stat.pad ? String(counts[index]).padStart(2, "0") : counts[index]}
                {stat.suffix}
              </div>
              <div className="eyebrow text-magenta mt-4">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
