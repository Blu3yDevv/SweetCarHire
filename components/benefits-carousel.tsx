"use client"

export function BenefitsCarousel() {
  const benefits = [
    "Airport delivery",
    "Unlimited mileage",
    "No hidden fees",
    "24/7 Support",
    "Free cancellation",
    "Best rates guaranteed",
  ]

  return (
    <div className="overflow-hidden max-w-xs sm:max-w-lg md:max-w-2xl mx-auto">
      <div className="flex animate-scroll-left whitespace-nowrap">
        {benefits.map((benefit, index) => (
          <span
            key={index}
            className="text-white font-medium text-sm sm:text-base md:text-lg mx-4 sm:mx-6 md:mx-8 drop-shadow-lg"
          >
            {benefit}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {benefits.map((benefit, index) => (
          <span
            key={`duplicate-${index}`}
            className="text-white font-medium text-sm sm:text-base md:text-lg mx-4 sm:mx-6 md:mx-8 drop-shadow-lg"
          >
            {benefit}
          </span>
        ))}
      </div>
    </div>
  )
}
