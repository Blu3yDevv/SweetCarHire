"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Info, ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface CarSpec {
  icon: React.ReactNode
  name: string
  value: string
  color: string
}

interface CarFeature {
  name: string
  description: string
}

interface Car {
  id: string
  name: string
  category: string
  price: string
  imageUrl: string
  description: string
  specs: CarSpec[]
  features: CarFeature[]
}

interface CarShowcaseProps {
  cars: Car[]
  initialCarIndex?: number
}

export function CarShowcase({ cars, initialCarIndex = 0 }: CarShowcaseProps) {
  const [currentCarIndex, setCurrentCarIndex] = useState(initialCarIndex)
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "features">("overview")
  const [isAnimating, setIsAnimating] = useState(false)

  const currentCar = cars[currentCarIndex]

  const nextCar = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentCarIndex((prev) => (prev + 1) % cars.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevCar = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentCarIndex((prev) => (prev - 1 + cars.length) % cars.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Car Image Section */}
        <div className="relative bg-gradient-to-br from-blue-900 to-indigo-900 p-6 flex items-center justify-center overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-pattern"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Car image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`car-image-${currentCarIndex}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex items-center justify-center p-8"
            >
              <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
                <Image
                  src={currentCar.imageUrl || "/placeholder.svg"}
                  alt={currentCar.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Category badge */}
          <Badge className="absolute top-6 left-6 bg-white/90 text-blue-900 hover:bg-white">
            {currentCar.category}
          </Badge>

          {/* Navigation controls */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={prevCar}
              className="rounded-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex space-x-2">
              {cars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCarIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentCarIndex === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`View car ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextCar}
              className="rounded-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Car Details Section */}
        <div className="bg-white p-6 md:p-8 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={`car-details-${currentCarIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{currentCar.name}</h2>
                  <p className="text-gray-500">{currentCar.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">from</p>
                  <p className="text-3xl font-bold text-[#e94d97]">{currentCar.price}</p>
                  <p className="text-xs text-gray-500">per day</p>
                </div>
              </div>

              {/* Tab navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === "overview"
                      ? "text-[#e94d97] border-b-2 border-[#e94d97]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === "specs"
                      ? "text-[#e94d97] border-b-2 border-[#e94d97]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === "features"
                      ? "text-[#e94d97] border-b-2 border-[#e94d97]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Features
                </button>
              </div>

              {/* Tab content */}
              <div className="flex-1">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {currentCar.specs.map((spec, index) => (
                        <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: spec.color }}
                          >
                            {spec.icon}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{spec.name}</p>
                            <p className="font-medium">{spec.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentCar.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-4 w-4 text-[#e94d97] mr-2 flex-shrink-0" />
                            <span className="text-sm">{feature.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-4">
                    {currentCar.specs.map((spec, index) => (
                      <div key={index} className="flex items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: spec.color }}
                        >
                          {spec.icon}
                        </div>
                        <div>
                          <p className="font-medium">{spec.name}</p>
                          <p className="text-gray-600">{spec.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-4">
                    {currentCar.features.map((feature, index) => (
                      <Card key={index} className="p-4">
                        <h3 className="font-medium text-[#e94d97] mb-1">{feature.name}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={`/fleet/${currentCar.id}`} className="flex-1">
              <Button variant="outline" className="w-full border-[#e94d97] text-[#e94d97] hover:bg-[#e94d97]/5">
                View Details
                <Info className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/booking?car=${currentCar.id}`} className="flex-1">
              <Button className="w-full bg-[#e94d97] hover:bg-[#d43884] text-white">
                Book This Car
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
