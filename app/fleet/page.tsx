"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Car,
  Fuel,
  Users,
  Briefcase,
  Gauge,
  ArrowRight,
  ChevronDown,
  Check,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ListFilter,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

// Car data (assuming this structure)
const cars = [
  {
    id: "grand-i10",
    name: "Grand i10",
    category: "Compact",
    price: 675,
    priceDisplay: "SCR 675",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT_Image_Apr_21__2025__02_05_19_PM-removebg-preview-gHni9SjpNmWaMQsghz7fuQmvQUbenh.png",
    description: "A compact and fuel-efficient car, perfect for navigating the winding roads of Seychelles.",
    specs: {
      engine: "1.2L",
      transmission: "Auto",
      fuelEconomy: "5.2L/100km",
      seating: "5 Seats",
      luggage: "2 Bags",
      features: ["Air Conditioning", "Bluetooth Audio", "Power Windows", "USB Charging", "Fuel Efficient"],
    },
    availability: "High",
    globalRating: 4.2,
    popular: true,
  },
  {
    id: "suzuki-fronx",
    name: "Suzuki Fronx GLX",
    category: "SUV",
    price: 900,
    priceDisplay: "SCR 900",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT_Image_Apr_21__2025__02_06_40_PM-removebg-preview-ECMRx0nJbpjTcyHoJ2npwM7YN1rC2D.png",
    description: "A stylish compact SUV with excellent handling and comfort for exploring the island.",
    specs: {
      engine: "1.5L",
      transmission: "Auto",
      fuelEconomy: "6.1L/100km",
      seating: "5 Seats",
      luggage: "3 Bags",
      features: ["Air Conditioning", "Bluetooth Audio", "Backup Camera", "Cruise Control", "Touchscreen Display"],
    },
    availability: "Medium",
    globalRating: 4.5,
    popular: true,
  },
  {
    id: "suzuki-dzire",
    name: "Suzuki Dzire",
    category: "Sedan",
    price: 750,
    priceDisplay: "SCR 750",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT_Image_Apr_21__2025__02_05_37_PM-removebg-preview-9YTDF3cCSSibL1IydySzlSEpygQxmV.png",
    description: "A comfortable sedan with ample trunk space, ideal for couples or small families.",
    specs: {
      engine: "1.2L",
      transmission: "Auto",
      fuelEconomy: "5.5L/100km",
      seating: "5 Seats",
      luggage: "3 Bags",
      features: ["Air Conditioning", "Bluetooth Audio", "Power Windows", "Spacious Trunk", "Fuel Efficient"],
    },
    availability: "High",
    globalRating: 4.3,
    popular: false,
  },
]

function FleetContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("type") || "all")
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [showDesktopFilters, setShowDesktopFilters] = useState(true) // Default to true for desktop
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("recommended")

  const carListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Update filters if URL params change
    setSearchQuery(searchParams.get("search") || "")
    setSelectedCategory(searchParams.get("type") || "all")
  }, [searchParams])

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || car.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "popular") return (b.globalRating || 0) - (a.globalRating || 0)
    return b.popular === a.popular ? 0 : b.popular ? 1 : -1 // Recommended (popular first)
  })

  const FilterControls = ({ inSheet = false }: { inSheet?: boolean }) => (
    <div className={cn("space-y-6", inSheet ? "p-4" : "pt-4 mt-4 border-t border-white/20")}>
      <div>
        <label className={cn("block text-sm font-medium mb-2", inSheet ? "text-foreground" : "text-white/80")}>
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {["all", "compact", "suv", "sedan"].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : inSheet
                    ? "border-input bg-background hover:bg-accent"
                    : "border-white/30 text-white/80 hover:bg-white/20",
              )}
            >
              {category === "all" ? "All Types" : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label className={cn("block text-sm font-medium mb-2", inSheet ? "text-foreground" : "text-white/80")}>
          Price Range: SCR {priceRange[0]} - SCR {priceRange[1]}
        </label>
        <Slider
          defaultValue={[0, 1500]}
          min={0}
          max={1500}
          step={50}
          value={priceRange}
          onValueChange={setPriceRange}
          className="py-2"
          thumbClassName={inSheet ? "bg-primary" : "bg-white"}
          trackClassName={inSheet ? "bg-primary/20" : "bg-white/30"}
        />
      </div>
      <div>
        <label className={cn("block text-sm font-medium mb-2", inSheet ? "text-foreground" : "text-white/80")}>
          Sort By
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "recommended", label: "Recommended" },
            { id: "price-low", label: "Price: Low-High" },
            { id: "price-high", label: "Price: High-Low" },
            { id: "popular", label: "Popularity" },
          ].map((option) => (
            <Button
              key={option.id}
              variant={sortBy === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(option.id)}
              className={cn(
                sortBy === option.id
                  ? "bg-primary text-primary-foreground"
                  : inSheet
                    ? "border-input bg-background hover:bg-accent"
                    : "border-white/30 text-white/80 hover:bg-white/20",
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      {inSheet && (
        <SheetClose asChild>
          <Button className="w-full btn-primary mt-4">Apply Filters</Button>
        </SheetClose>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden section-padding !pt-24 !pb-12 md:!pt-32 md:!pb-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/70" />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kGn9yYNKNqsEu40zdKT6c8pGKQ9Br6.png"
            alt="Seychelles Beach"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            Discover Our <span className="text-primary">Premium</span> Fleet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/90 max-w-2xl mx-auto text-base sm:text-lg md:text-xl"
          >
            Choose from our selection of well-maintained vehicles perfect for exploring the beauty of Seychelles.
          </motion.p>
        </div>
      </div>

      {/* Search and Filter Bar - Sticky for Desktop, Button for Mobile */}
      <div className="sticky top-[80px] sm:top-[88px] z-40 bg-background/80 backdrop-blur-md shadow-sm py-3 sm:py-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search cars (e.g., SUV, Grand i10)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input-base pl-10 w-full"
                aria-label="Search cars"
              />
            </div>
            {/* Desktop Filter Toggle */}
            <Button
              onClick={() => setShowDesktopFilters(!showDesktopFilters)}
              variant="outline"
              className="hidden md:flex items-center gap-2 btn"
            >
              <ListFilter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", showDesktopFilters && "rotate-180")} />
            </Button>
            {/* Mobile Filter Trigger */}
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild className="md:hidden w-full">
                <Button variant="outline" className="w-full flex items-center gap-2 btn">
                  <ListFilter className="h-5 w-5" />
                  <span>Filters & Sort</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-2xl">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Filters & Sort</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto">
                  <FilterControls inSheet={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* Desktop Expanded Filters */}
          <AnimatePresence>
            {showDesktopFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:block overflow-hidden"
              >
                <FilterControls />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Car List Section */}
      <div ref={carListRef} className="container mx-auto section-padding">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            {sortedCars.length} {sortedCars.length === 1 ? "Car" : "Cars"} Found
          </h2>
          {(selectedCategory !== "all" || searchQuery) && (
            <p className="text-sm text-muted-foreground mt-1">
              {selectedCategory !== "all" && `Category: ${selectedCategory}. `}
              {searchQuery && `Search: "${searchQuery}".`}
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto ml-1"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Clear
              </Button>
            </p>
          )}
        </div>

        {sortedCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedCars.map((car, index) => (
              <CarCard
                key={car.id}
                car={car}
                isSelected={selectedCar === car.id}
                onSelect={() => setSelectedCar(selectedCar === car.id ? null : car.id)}
                loading={index < 3 ? "eager" : "lazy"} // Eager load first few images
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cars match your criteria</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setPriceRange([0, 1500])
                setSortBy("recommended")
              }}
              variant="outline"
              className="btn"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-background section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-secondary">Why Choose Our Fleet</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground">
              We provide the best car rental experience in Seychelles with our premium fleet and exceptional service.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Sparkles,
                title: "Premium Vehicles",
                description: "Well-maintained, late-model vehicles for comfort and reliability.",
              },
              {
                icon: Calendar,
                title: "Flexible Rentals",
                description: "Rent for a day or as long as you need with flexible options.",
              },
              {
                icon: MapPin,
                title: "Free Delivery",
                description: "Convenient free delivery and pickup anywhere on Mahe Island.",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Our friendly team is available around the clock to assist you.",
              },
              {
                icon: Check,
                title: "Full Insurance",
                description: "Drive with peace of mind with our comprehensive insurance.",
              },
              {
                icon: Fuel,
                title: "Fuel Efficient",
                description: "Save on fuel costs with our selection of fuel-efficient vehicles.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-secondary to-secondary/90 section-padding">
        <div className="container mx-auto text-center">
          <h2 className="text-white">Ready to Explore Seychelles?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Book your car today and experience the freedom to discover all the hidden gems of our beautiful islands.
          </p>
          <Link href="/booking">
            <Button size="lg" className="btn btn-primary text-base px-8 py-3">
              Book Your Car Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Car Card Component
function CarCard({
  car,
  isSelected,
  onSelect,
  loading = "lazy",
}: { car: any; isSelected: boolean; onSelect: () => void; loading?: "eager" | "lazy" }) {
  const commonIconClass = "h-4 w-4 text-primary mr-1.5 flex-shrink-0"
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col",
        isSelected && "ring-2 ring-primary shadow-2xl",
      )}
    >
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        {car.popular && (
          <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground">Popular</Badge>
        )}
        <Image
          src={car.imageUrl || "/placeholder.svg?width=400&height=300&text=Car+Image"}
          alt={car.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading={loading}
        />
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-card-foreground leading-tight">{car.name}</h3>
          <Badge variant="outline" className="text-xs sm:text-sm whitespace-nowrap">
            {car.category}
          </Badge>
        </div>

        {car.globalRating && (
          <div className="flex items-center mb-2 text-xs sm:text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span>{car.globalRating.toFixed(1)}</span>
            <span className="mx-1">·</span>
            <span>{Math.floor(Math.random() * 50) + 5} reviews</span> {/* Placeholder for review count */}
          </div>
        )}

        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow min-h-[2.5em] sm:min-h-[3em]">
          {car.description}
        </p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Users className={commonIconClass} /> {car.specs.seating}
          </div>
          <div className="flex items-center">
            <Briefcase className={commonIconClass} /> {car.specs.luggage}
          </div>
          <div className="flex items-center">
            <Gauge className={commonIconClass} /> {car.specs.transmission}
          </div>
          <div className="flex items-center">
            <Fuel className={commonIconClass} /> {car.specs.engine}
          </div>
        </div>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: "0.75rem" }} // mb-3
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <h4 className="text-xs sm:text-sm font-medium mb-1 text-card-foreground">Key Features:</h4>
              <ul className="space-y-0.5 mb-3">
                {car.specs.features.slice(0, 3).map((feature: string, i: number) => (
                  <li key={i} className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 mr-1.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-3 border-t border-border/50">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{car.priceDisplay}</p>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                }}
                className="btn h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
              >
                {isSelected ? "Less" : "More"}
              </Button>
              <Link href={`/booking?car=${car.id}`} onClick={(e) => e.stopPropagation()}>
                <Button size="sm" className="btn btn-primary h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
                  Select
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function FleetPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading cars...</div>}>
      <FleetContent />
    </Suspense>
  )
}
