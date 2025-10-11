"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarSpec {
  icon: React.ReactNode
  name: string
  value: string
  color?: string
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
  color: string
}

interface FuturisticCarShowcaseProps {
  cars: Car[]
  initialCarIndex?: number
}

export function FuturisticCarShowcase({ cars, initialCarIndex = 0 }: FuturisticCarShowcaseProps) {
  const [currentCarIndex, setCurrentCarIndex] = useState(initialCarIndex)
  const [selectedSpec, setSelectedSpec] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const currentCar = cars[currentCarIndex]

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const nextCar = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentCarIndex((prev) => (prev + 1) % cars.length)
    setSelectedSpec(null)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevCar = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentCarIndex((prev) => (prev - 1 + cars.length) % cars.length)
    setSelectedSpec(null)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const toggleSpec = (index: number) => {
    setSelectedSpec(selectedSpec === index ? null : index)
  }

  // Particle effect for background
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }[] = []

    const createParticles = () => {
      const particleCount = 50
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255,
          )}, 0.5)`,
        })
      }
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      }

      requestAnimationFrame(animateParticles)
    }

    createParticles()
    animateParticles()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-3xl bg-gradient-to-b from-gray-900 to-[#1e3a8a]">
      {/* Particle background */}
      <canvas id="particle-canvas" className="absolute inset-0 w-full h-full opacity-30" />

      {/* Car image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCarIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="relative w-[80%] h-[60%]">
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

      {/* Car info */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-8 text-white z-20"
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end">
            <div>
              <motion.div
                key={`category-${currentCarIndex}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-block bg-[#e94d97] px-3 py-1 rounded-full text-sm font-medium mb-2"
              >
                {currentCar.category}
              </motion.div>
              <motion.h2
                key={`name-${currentCarIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                {currentCar.name}
              </motion.h2>
              <motion.p
                key={`desc-${currentCarIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-gray-300 max-w-2xl text-sm md:text-base"
              >
                {currentCar.description}
              </motion.p>
            </div>
            <motion.div
              key={`price-${currentCarIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-right mt-4 md:mt-0"
            >
              <p className="text-sm text-gray-300">from</p>
              <p className="text-2xl md:text-3xl font-bold text-[#e94d97]">{currentCar.price}</p>
              <p className="text-xs text-gray-300">per day</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating specs */}
      <div
        className={`absolute ${isMobile ? "top-4 right-4 left-4 flex flex-wrap justify-end gap-2" : "top-1/4 right-8 space-y-4"} z-30`}
      >
        {currentCar.specs.map((spec, index) => (
          <motion.div
            key={`${currentCar.id}-spec-${index}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            onClick={() => toggleSpec(index)}
            className={`cursor-pointer backdrop-blur-md rounded-xl overflow-hidden transition-all duration-300 ${
              selectedSpec === index
                ? "bg-white/20 border border-white/40 shadow-lg shadow-[#e94d97]/20"
                : "bg-white/10 border border-white/20 hover:bg-white/15"
            } ${isMobile ? "flex-shrink-0" : ""}`}
            style={{
              boxShadow:
                selectedSpec === index ? `0 0 20px 2px ${spec.color || "#e94d97"}40` : "0 4px 12px rgba(0, 0, 0, 0.1)",
              maxWidth: isMobile ? "48%" : "none",
            }}
          >
            <div className="p-3">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: spec.color || "#e94d97" }}
                >
                  {spec.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm md:text-base truncate">{spec.name}</p>
                  {selectedSpec === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs md:text-sm text-gray-200 mt-1 truncate"
                    >
                      {spec.value}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-32 right-8 z-30"
      >
        <Button
          onClick={() => setShowFeatures(!showFeatures)}
          className="bg-[#e94d97] hover:bg-[#d43884] text-white rounded-full px-4 md:px-6 py-2"
        >
          {showFeatures ? <X className="mr-2 h-4 w-4" /> : <Info className="mr-2 h-4 w-4" />}
          <span className="hidden md:inline">{showFeatures ? "Close" : "Features"}</span>
        </Button>
      </motion.div>

      {/* Features panel */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 bottom-0 w-full md:w-1/3 bg-black/80 backdrop-blur-md p-6 z-40 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-white">Key Features</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFeatures(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              {currentCar.features.map((feature, index) => (
                <motion.div
                  key={`feature-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className="bg-white/10 border border-white/20 rounded-lg p-4"
                >
                  <h4 className="text-lg font-medium text-[#e94d97] mb-2">{feature.name}</h4>
                  <p className="text-gray-300 text-sm md:text-base">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="absolute bottom-1/2 left-4 transform translate-y-1/2 z-30">
        <Button
          onClick={prevCar}
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 mb-4"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute bottom-1/2 right-4 transform translate-y-1/2 z-30">
        <Button
          onClick={nextCar}
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 mb-4"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Car indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {cars.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentCarIndex(index)
              setSelectedSpec(null)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentCarIndex === index ? "bg-[#e94d97] w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`View car ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
