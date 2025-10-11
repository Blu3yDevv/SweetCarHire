"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Check, Users, Gauge, Briefcase, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { EnhancedBookingForm } from "@/components/enhanced-booking-form" // Or use the full form
import { cn } from "@/lib/utils"

// Mock car data - in a real app, this would come from a database or API
const carsData = [
  {
    id: "grand-i10",
    name: "Grand i10",
    category: "Economy",
    priceDisplay: "SCR 675",
    priceValue: 675,
    images: [
      // Allow multiple images
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT_Image_Apr_21__2025__02_05_19_PM-removebg-preview-gHni9SjpNmWaMQsghz7fuQmvQUbenh.png",
      "/placeholder.svg?height=400&width=600&text=Grand+i10+Side",
      "/placeholder.svg?height=400&width=600&text=Grand+i10+Interior",
    ],
    mainFeatures: ["5 Seats", "2 Bags", "AC", "Automatic"],
    fuel: "Petrol",
    mileage: "Unlimited",
    year: "2023",
    insurance: "Comprehensive",
    deposit: "SCR 5,000",
    description:
      "The Hyundai Grand i10 is a stylish and comfortable compact car with automatic transmission, making it easy to drive around Seychelles. With excellent fuel efficiency and modern features, it's ideal for couples or small families.",
    specifications: {
      engine: "1.2L 4-cylinder",
      transmission: "4-speed Automatic",
      fuelEconomy: "5.3L/100km",
      dimensions: "3,805mm (L) x 1,680mm (W) x 1,520mm (H)",
      bootSpace: "260 liters",
      airConditioning: "Yes",
      powerSteering: "Yes",
      abs: "Yes",
      airbags: "Dual Front",
    },
    includedFeatures: ["Bluetooth Audio", "Power Windows", "USB Port", "Reverse Sensors", "Keyless Entry"],
    rating: 4.2,
    reviewsCount: 35,
  },
  {
    id: "suzuki-fronx",
    name: "Suzuki Fronx GLX",
    category: "SUV",
    priceDisplay: "SCR 900",
    priceValue: 900,
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT_Image_Apr_21__2025__02_06_40_PM-removebg-preview-ECMRx0nJbpjTcyHoJ2npwM7YN1rC2D.png",
      "/placeholder.svg?height=400&width=600&text=Fronx+Side",
      "/placeholder.svg?height=400&width=600&text=Fronx+Interior",
    ],
    mainFeatures: ["5 Seats", "3 Bags", "AC", "Automatic", "SUV"],
    fuel: "Petrol",
    mileage: "Unlimited",
    year: "2024",
    insurance: "Comprehensive",
    deposit: "SCR 7,000",
    description:
      "The Suzuki Fronx GLX is a modern compact SUV offering a blend of style, comfort, and capability. Its raised driving position and spacious interior make it a great choice for exploring Seychelles' diverse landscapes.",
    specifications: {
      engine: "1.5L K-Series Petrol",
      transmission: "6-speed Automatic",
      fuelEconomy: "5.8L/100km",
      dimensions: "3,995mm (L) x 1,765mm (W) x 1,550mm (H)",
      bootSpace: "308 liters",
      groundClearance: "190mm",
      infotainment: "9-inch Touchscreen",
      safety: "6 Airbags, ESP, Hill Hold Assist",
    },
    includedFeatures: [
      "360 View Camera",
      "Wireless Apple CarPlay/Android Auto",
      "Cruise Control",
      "LED Headlamps",
      "Push Start/Stop",
    ],
    rating: 4.5,
    reviewsCount: 28,
  },
  // Add other cars here...
]

function CarDetailsContent() {
  const params = useParams()
  const carId = params.carId as string

  const [car, setCar] = useState<any>(null) // Consider defining a proper type for car
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const foundCar = carsData.find((c) => c.id === carId || c.name.toLowerCase().replace(/\s+/g, "-") === carId)
    setCar(foundCar || null)
    setCurrentImageIndex(0) // Reset image index when car changes
  }, [carId])

  if (!car) {
    return (
      <div className="container mx-auto section-padding text-center">
        <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
        <p className="text-muted-foreground mb-6">Sorry, we couldn't find the car you're looking for.</p>
        <Link href="/fleet">
          <Button className="btn btn-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fleet
          </Button>
        </Link>
      </div>
    )
  }

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % car.images.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)

  return (
    <div className="bg-background">
      <div className="container mx-auto section-padding">
        <div className="mb-6 sm:mb-8">
          <Link href="/fleet" className="inline-flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fleet
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12">
          {/* Left Column: Image Gallery and Key Details */}
          <div className="lg:col-span-3">
            <div className="bg-card p-3 sm:p-4 rounded-xl shadow-lg border sticky top-24">
              {/* Image Gallery */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={car.images[currentImageIndex] || "/placeholder.svg"}
                      alt={`${car.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1023px) 100vw, 60vw"
                      priority={currentImageIndex === 0} // Prioritize first image
                    />
                  </motion.div>
                </AnimatePresence>
                {car.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10"
                    >
                      {" "}
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />{" "}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8 sm:h-10 sm:w-10"
                    >
                      {" "}
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />{" "}
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                      {car.images.map((_: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={cn(
                            "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all",
                            currentImageIndex === i ? "bg-white w-4 sm:w-6" : "bg-white/50 hover:bg-white/80",
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Quick Info Bar */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4 px-2">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {car.category}
                </Badge>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-primary" /> {car.mainFeatures[0]}
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-primary" /> {car.mainFeatures[1]}
                </div>
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-1 text-primary" /> {car.mainFeatures[3]}
                </div>
              </div>

              <div className="px-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{car.name}</h1>
                {car.rating && (
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>
                      {car.rating.toFixed(1)} ({car.reviewsCount} reviews)
                    </span>
                  </div>
                )}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{car.description}</p>
              </div>

              {/* Tabs for Details */}
              <Tabs defaultValue="features" className="w-full mt-4 sm:mt-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-auto">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="rental_info" className="hidden sm:flex">
                    Rental Info
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="p-3 sm:p-4 text-sm">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {car.includedFeatures.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center text-muted-foreground">
                        <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" /> {feature}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="specs" className="p-3 sm:p-4 text-sm">
                  <div className="space-y-2">
                    {Object.entries(car.specifications).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="font-medium text-foreground text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="rental_info" className="p-3 sm:p-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Rate:</span>
                      <span className="font-medium text-foreground">{car.priceDisplay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium text-foreground">{car.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel:</span>
                      <span className="font-medium text-foreground">{car.fuel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mileage:</span>
                      <span className="font-medium text-foreground">{car.mileage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insurance:</span>
                      <span className="font-medium text-foreground">{car.insurance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Deposit:</span>
                      <span className="font-medium text-foreground">{car.deposit}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-2">
            {/* Use EnhancedBookingForm directly, it will pick up carId from URL */}
            <EnhancedBookingForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CarDetailsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading car details...</div>}>
      <CarDetailsContent />
    </Suspense>
  )
}
