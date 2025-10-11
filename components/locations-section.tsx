"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LocationsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  const handleLocationClick = (locationName: string) => {
    router.push(`/booking?location=${encodeURIComponent(locationName)}`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 1) {
      setIsLoading(true)
      // Simulate API delay for realistic feel
      setTimeout(() => {
        const filtered = seychellesLocations
          .filter((location) => location.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5) // Show max 5 suggestions
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
    <section id="locations" className="py-12 md:py-20 section-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gradient mb-4">
            Pickup & Drop-off Locations
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Convenient locations across Mahé for your pickup and drop-off needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {locations.map((location, index) => (
            <Card
              key={location.name}
              className="card-hover overflow-hidden border-0 bubble-shadow relative cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleLocationClick(location.name)}
            >
              {location.popular && (
                <div className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="relative">
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="w-full h-32 md:h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <CardContent className="p-4 md:p-6">
                <h3 className="font-poppins font-bold text-base md:text-lg mb-2 flex items-center gap-2">
                  <MapPin className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                  {location.name}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm">{location.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 md:mt-12 flex justify-center">
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for a custom location in Seychelles..."
                className="w-full px-4 py-3 pl-12 bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-center placeholder:text-muted-foreground/60 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />

              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 overflow-hidden z-50">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 text-primary/60" />
                    <span className="text-navy">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <Card className="glass-card p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="font-poppins font-bold text-xl md:text-2xl mb-3 md:mb-4">Need a Different Location?</h3>
            <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
              We can arrange pickup and drop-off at other locations across Mahé. Use the search above or contact us
              directly.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
