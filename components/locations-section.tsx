"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export function LocationsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const seychellesLocations = [
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

  const locations = [
    {
      name: "SEZ Airport",
      description: "Meet & greet service available 24/7",
      image: "/images/sez-airport.jpg",
      popular: true,
    },
    {
      name: "Victoria",
      description: "Capital city pickup and drop-off",
      image: "/images/victoria.jpg",
    },
    {
      name: "Beau Vallon",
      description: "Popular beach area service",
      image: "/images/beau-vallon.jpg",
    },
    {
      name: "Eden Island",
      description: "Marina and resort area",
      image: "/images/eden-island.png",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number.parseInt(entry.target.getAttribute("data-location-index") || "0")
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])])
          }
        })
      },
      { threshold: 0.15 },
    )

    const cards = sectionRef.current?.querySelectorAll("[data-location-index]")
    cards?.forEach((card) => observer.observe(card))

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
        const filtered = seychellesLocations
          .filter((location) => location.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5)
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
    <section ref={sectionRef} id="locations" className="py-20 md:py-32 bg-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-magenta/10 to-transparent" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-navy/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-14 md:mb-20 max-w-4xl mx-auto">
          <h2 className="font-poppins font-black text-4xl md:text-5xl lg:text-6xl text-navy mb-6 tracking-tight">
            Pickup & Drop-off
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Convenient locations across Mahé for your pickup and drop-off needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {locations.map((location, index) => (
            <div
              key={location.name}
              data-location-index={index}
              className={`transition-all duration-700 ease-out ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card
                className="group overflow-hidden border-0 shadow-[0_4px_30px_-10px_rgba(13,43,95,0.1)] cursor-pointer transition-all duration-500 hover:shadow-[0_8px_40px_-10px_rgba(231,44,130,0.12)] hover:-translate-y-1 rounded-3xl bg-white"
                onClick={() => handleLocationClick(location.name)}
              >
                {location.popular && (
                  <div className="absolute top-4 left-4 z-10 bg-magenta text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="relative overflow-hidden">
                  <img
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    className="w-full h-40 md:h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
                </div>

                <CardContent className="p-6">
                  <h3 className="font-poppins font-bold text-lg md:text-xl text-navy mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-magenta" strokeWidth={2} />
                    {location.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{location.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <form onSubmit={handleSearchSubmit} className="relative max-w-lg w-full">
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
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy/40" />

              {isLoading && (
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-5 w-5 border-2 border-magenta border-t-transparent rounded-full"></div>
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
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Card className="border-0 shadow-[0_4px_30px_-10px_rgba(13,43,95,0.08)] p-8 md:p-10 max-w-2xl mx-auto rounded-3xl bg-white">
            <h3 className="font-poppins font-bold text-xl md:text-2xl text-navy mb-4">Need a Different Location?</h3>
            <p className="text-muted-foreground mb-6">
              We can arrange pickup and drop-off at other locations across Mahé. Use the search above or contact us
              directly.
            </p>
            <a
              href="https://wa.me/2482821182"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              Contact via WhatsApp
            </a>
          </Card>
        </div>
      </div>
    </section>
  )
}
