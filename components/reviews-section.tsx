"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================
// REVIEWS CONFIGURATION - Edit reviews here
// ============================================
const REVIEWS_DATA = [
  {
    name: "Steve Lanham",
    location: "Verified guest",
    rating: 4,
    text: "We are using Sweet Car Hire at the moment. They have been perfect. Arranged a car for us on Praslin also. Pick you up and let you drop the car off wherever... always on time with meet and greet. Great service...",
  },
  {
    name: "Ati Kagazchi",
    location: "Verified guest",
    rating: 5,
    text: "Best car rental agency hands down!!! In all my years of renting cars around the world, never has a rental agency gone so far in customer service and customer satisfaction as Sweet Car Hire.",
  },
  {
    name: "Ciara Sparkes",
    location: "Verified guest",
    rating: 5,
    text: "Your service was fabulous and the cleanliness of your car was impeccable. Would definitely recommend you to everyone.",
  },
  {
    name: "Anonymous",
    location: "Seychelles",
    rating: 5,
    text: "Rented from Sweet Car Hire last week. Lovely people who give amazing customer service! Rent from them and you won't be disappointed!!",
  },
  {
    name: "Anonymous",
    location: "Seychelles",
    rating: 4,
    text: "We used Sweet Car hire on Mahe. They picked us up from the airport and took return of the car at the ferry port. They arranged car hire for us in Praslin.",
  },
]
// ============================================

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function ReviewCard({ review, compact = false }: { review: (typeof REVIEWS_DATA)[number]; compact?: boolean }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_50px_-18px_rgba(13,43,95,0.25)] relative h-full">
      <span className="display-heading text-magenta/20 text-7xl absolute top-2 left-5 select-none" aria-hidden="true">
        "
      </span>

      <div className="relative">
        <div className="flex gap-0.5 mb-4 pt-3">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-magenta text-magenta" />
          ))}
        </div>

        <p className={`text-navy/80 leading-relaxed mb-6 ${compact ? "text-sm" : "text-base"}`}>{review.text}</p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy to-magenta flex items-center justify-center text-white font-bold text-sm">
            {getInitials(review.name)}
          </div>
          <div>
            <h4 className="font-display font-bold text-navy text-sm">{review.name}</h4>
            <p className="text-xs text-muted-foreground">{review.location}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reviews = REVIEWS_DATA

  const nextReview = () => setActiveIndex((prev) => (prev + 1) % reviews.length)
  const prevReview = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)

  const getVisibleReviews = () => {
    const result = []
    for (let i = -1; i <= 1; i++) {
      const index = (activeIndex + i + reviews.length) % reviews.length
      result.push({ ...reviews[index], position: i })
    }
    return result
  }

  return (
    <section className="py-20 md:py-28 bg-cream overflow-hidden relative">
      <div className="container mx-auto px-5 md:px-8 relative">
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <p className="eyebrow text-magenta mb-4">Testimonials</p>
          <h2 className="display-heading text-navy text-5xl md:text-6xl lg:text-7xl text-balance">
            Sweet words from travellers.
          </h2>
        </div>

        {/* Desktop carousel */}
        <div className="hidden md:block relative max-w-5xl mx-auto">
          <div className="flex items-stretch justify-center gap-6 py-6">
            {getVisibleReviews().map((review, idx) => {
              const isCenter = review.position === 0
              return (
                <div
                  key={`${review.name}-${idx}`}
                  className={`transition-all duration-500 ease-out flex-shrink-0 ${
                    isCenter ? "scale-100 opacity-100 z-20" : "scale-95 opacity-40 z-10"
                  }`}
                  style={{ width: isCenter ? "420px" : "320px" }}
                >
                  <ReviewCard review={review} compact={!isCenter} />
                </div>
              )
            })}
          </div>

          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300 z-30"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300 z-30"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden relative">
          <div className="mx-2">
            <ReviewCard review={reviews[activeIndex]} compact />
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy active:scale-95 transition-transform"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1.5">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex ? "w-5 h-1.5 bg-magenta" : "w-1.5 h-1.5 bg-navy/20"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy active:scale-95 transition-transform"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop dots */}
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex ? "w-6 h-2 bg-magenta" : "w-2 h-2 bg-navy/20 hover:bg-navy/40"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
