"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

// ============================================
// REVIEWS CONFIGURATION - Edit reviews here
// ============================================
const REVIEWS_DATA = [
  {
    name: "Steve Lanham.",
    location: "Unkown",
    rating: 4,
    text: "We are using Sweet Car Hire at the moment. They have been perfect. Arranged a car for us on Praslin also. Pick you up and let you drop the car off wherever... always on time with meet and greet. Great service...",
  },
  {
    name: "Ati Kagazchi",
    location: "Unkown",
    rating: 5,
    text: "Best car rental agency hands down!!! In all my years of renting cars around the world, never has a rental agency gone so far in customer service and customer satisfaction as Sweet Car Hire.",
  },
  {
    name: "Ciara Sparkes.",
    location: "Unkown",
    rating: 5,
    text: "Your service was fabulous and the cleanliness of your car was impeccable. Would definitely recommend you to everyone.",
  },
  {
    name: "Anonymous",
    location: "Seychelles",
    rating: 5,
    text: "Rented from Sweet Car Hire last week. Lovely people who give amazing customer service! Rent from them and you won’t be disappointed!!",
  },
  {
    name: "Anonymous",
    location: "Seychelles",
    rating: 4,
    text: "We used Sweet Car hire on Mahe. They picked us up from the airport and took return of the car at the ferry port. They arranged car hire for us in Praslin.",
  },
]
// ============================================

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const reviews = REVIEWS_DATA

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  // Get visible reviews (current + 1 on each side for desktop)
  const getVisibleReviews = () => {
    const result = []
    for (let i = -1; i <= 1; i++) {
      const index = (activeIndex + i + reviews.length) % reviews.length
      result.push({ ...reviews[index], position: i })
    }
    return result
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <section className="py-16 md:py-28 bg-gradient-to-b from-cream to-white overflow-hidden relative">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-magenta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-ocean/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 bg-magenta/10 text-magenta font-semibold text-sm rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="font-poppins font-black text-3xl md:text-5xl lg:text-6xl text-navy mb-4 tracking-tight">
            Loved by Travelers
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Real experiences from explorers who chose Sweet Car Hire
          </p>
        </div>

        {/* Desktop Carousel */}
        <div className="hidden md:block relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-6 py-6">
            {getVisibleReviews().map((review, idx) => {
              const isCenter = review.position === 0

              return (
                <div
                  key={`${review.name}-${idx}`}
                  className={`transition-all duration-500 ease-out flex-shrink-0 ${
                    isCenter ? "scale-100 opacity-100 z-20" : "scale-95 opacity-40 z-10"
                  }`}
                  style={{
                    width: isCenter ? "420px" : "320px",
                  }}
                >
                  <div
                    className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-navy/5 relative ${
                      isCenter ? "shadow-xl" : ""
                    }`}
                  >
                    {/* Quote icon */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-magenta rounded-xl flex items-center justify-center shadow-md">
                      <Quote className="w-4 h-4 text-white" fill="white" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-sunshine text-sunshine" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className={`text-navy/80 leading-relaxed mb-6 ${isCenter ? "text-base" : "text-sm"}`}>
                      "{review.text}"
                    </p>

                    {/* Author - with anonymous avatar */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean to-magenta flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(review.name)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy text-sm">{review.name}</h4>
                        <p className="text-xs text-muted-foreground">{review.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-navy/5 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300 z-30"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-navy/5 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all duration-300 z-30"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="md:hidden relative">
          {/* Current Review Card */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-navy/5 relative mx-2">
            {/* Quote icon */}
            <div className="absolute -top-2 -left-1 w-8 h-8 bg-magenta rounded-lg flex items-center justify-center shadow-md">
              <Quote className="w-3 h-3 text-white" fill="white" />
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-3 pt-1">
              {[...Array(reviews[activeIndex].rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-sunshine text-sunshine" />
              ))}
            </div>

            {/* Review text */}
            <p className="text-navy/80 leading-relaxed mb-4 text-sm">"{reviews[activeIndex].text}"</p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocean to-magenta flex items-center justify-center text-white font-bold text-xs">
                {getInitials(reviews[activeIndex].name)}
              </div>
              <div>
                <h4 className="font-semibold text-navy text-sm">{reviews[activeIndex].name}</h4>
                <p className="text-xs text-muted-foreground">{reviews[activeIndex].location}</p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full bg-white shadow-md border border-navy/10 flex items-center justify-center text-navy active:scale-95 transition-transform"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
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
              className="w-10 h-10 rounded-full bg-white shadow-md border border-navy/10 flex items-center justify-center text-navy active:scale-95 transition-transform"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dots indicator - Desktop only */}
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
