"use client"

import { Shield, Zap, DollarSign, Clock, XCircle, TrendingDown } from "lucide-react"

export function BenefitsCarousel() {
  const benefits = [
    { text: "Airport delivery", icon: Clock },
    { text: "Unlimited mileage", icon: TrendingDown },
    { text: "No hidden fees", icon: Shield },
    { text: "24/7 Support", icon: Zap },
    { text: "Free cancellation", icon: XCircle },
    { text: "Best rates guaranteed", icon: DollarSign },
  ]

  return (
    <div className="relative overflow-hidden max-w-5xl mx-auto py-6">
      <div className="flex animate-scroll-left whitespace-nowrap">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <div
              key={index}
              className="inline-flex items-center gap-3 mx-4 md:mx-6 bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-full border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/15 hover:scale-[1.02]"
            >
              <Icon className="w-5 h-5 text-sunshine" strokeWidth={2} />
              <span className="text-white font-semibold text-sm md:text-base">{benefit.text}</span>
            </div>
          )
        })}
        {/* Duplicate for seamless loop */}
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <div
              key={`duplicate-${index}`}
              className="inline-flex items-center gap-3 mx-4 md:mx-6 bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-full border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/15 hover:scale-[1.02]"
            >
              <Icon className="w-5 h-5 text-sunshine" strokeWidth={2} />
              <span className="text-white font-semibold text-sm md:text-base">{benefit.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
