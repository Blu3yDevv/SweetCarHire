"use client"

import type React from "react"

import { MapPin, Search, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const SEYCHELLES_LOCATIONS = [
  "Anse Boileau",
  "Anse Etoile",
  "Anse Faure",
  "Anse Forbans",
  "Anse Intendance",
  "Anse Kerlan",
  "Anse La Mouche",
  "Anse Lazio",
  "Anse Major",
  "Anse Royale",
  "Anse Source d'Argent",
  "Anse Takamaka",
  "Anse Volbert",
  "Au Cap",
  "Barbarons",
  "Baie Lazare",
  "Baie Sainte Anne",
  "Beau Vallon",
  "Belombre",
  "Bel Ombre",
  "Cascade",
  "Cote d'Or",
  "Eden Island",
  "English River",
  "Fairyland",
  "Glacis",
  "Grand Anse",
  "Grand Anse Praslin",
  "La Digue",
  "La Misere",
  "La Passe",
  "Les Cannelles",
  "Mahe",
  "Mont Buxton",
  "Mont Fleuri",
  "North East Point",
  "Petite Anse",
  "Pointe Au Sel",
  "Pointe Larue",
  "Port Glaud",
  "Praslin",
  "Roche Caiman",
  "Saint Louis",
  "Takamaka",
  "Victoria",
  "SEZ Airport",
]

const LOCATIONS = [
  {
    name: "SEZ Airport",
    description: "Meet & greet, 24/7",
    image: "/images/sez-airport.jpg",
    popular: true,
  },
  {
    name: "Victoria",
    description: "Capital city pickup",
    image: "/images/victoria.jpg",
  },
  {
    name: "Beau Vallon",
    description: "Popular beach area",
    image: "/images/beau-vallon.jpg",
  },
  {
    name: "Eden Island",
    description: "Marina & resorts",
    image: "/images/eden-island.png",
  },
]

export function LocationsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleLocationClick = (locationName: string) => {
    router.push(`/booking?location=${encodeURIComponent(locationName)}`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 1) {
      setIsLoading(true)
      setTimeout(() => {
        const filtered = SEYCHELLES_LOCATIONS.filter((location) =>
          location.toLowerCase().includes(value.toLowerCase()),
        ).slice(0, 5)
        setSuggestions(filtered)
        setShowSuggestions(true)
        setIsLoading(false)
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    router.push(`/booking?location=custom&customLocation=${encodeURIComponent(suggestion)}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      router.push(`/booking?location=custom&customLocation=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section ref={sectionRef} id="locations" className="py-20 md:py-28 bg-cream relative">
      <div className="container mx-auto px-5 md:px-8">
        <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
          <p className="eyebrow text-magenta mb-4">Pickup & drop-off</p>
          <h2 className="display-heading text-navy text-5xl md:text-6xl lg:text-7xl text-balance">
            We come to you.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            These are our four usual meeting points. If somewhere else on Mahé suits you better,
            just tell us.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 max-w-5xl mx-auto">
          {LOCATIONS.map((location, index) => (
            <button
              key={location.name}
              onClick={() => handleLocationClick(location.name)}
              className={`group text-center transition-all duration-700 ease-out cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                {location.popular && (
                  <div className="sticker absolute -top-2 -right-1 px-3.5 py-1.5 text-xs z-10">Most popular</div>
                )}
                <div className="arch-image relative aspect-[3/4] shadow-[0_10px_40px_-14px_rgba(13,43,95,0.3)] group-hover:shadow-[0_16px_50px_-14px_rgba(231,44,130,0.35)] transition-shadow duration-500">
                  <img
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center gap-1.5 bg-white text-navy text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg">
                      Book pickup here
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="font-display font-bold text-lg md:text-xl text-navy mt-4 flex items-center justify-center gap-1.5">
                <MapPin className="h-4 w-4 text-magenta" strokeWidth={2.5} />
                {location.name}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">{location.description}</p>
            </button>
          ))}
        </div>

        {/* Custom location search */}
        <div className="mt-14 md:mt-20 max-w-lg mx-auto">
          <p className="eyebrow text-navy/50 text-center mb-4">Somewhere else on Mahé?</p>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for a custom location..."
                className="w-full px-6 py-4 pl-14 bg-white border-2 border-navy/10 focus:border-magenta rounded-full outline-none text-navy placeholder:text-muted-foreground/60 transition-all duration-300 shadow-sm focus:shadow-md"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy/40" />

              {isLoading && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-5 w-5 border-2 border-magenta border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-navy/5 overflow-hidden z-50">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-5 py-4 hover:bg-cream transition-colors border-b border-navy/5 last:border-b-0 flex items-center gap-3 group/item"
                  >
                    <MapPin className="h-4 w-4 text-magenta" />
                    <span className="text-navy font-medium">{suggestion}</span>
                    <ArrowRight className="h-4 w-4 text-navy/30 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Prefer to just ask?{" "}
            <a
              href="https://wa.me/2482821182"
              target="_blank"
              rel="noopener noreferrer"
              className="text-magenta font-semibold hover:underline"
            >
              Message us on WhatsApp
            </a>{" "}
            and we'll sort it out.
          </p>
        </div>
      </div>
    </section>
  )
}
