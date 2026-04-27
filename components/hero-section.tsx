"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { BenefitsCarousel } from "@/components/benefits-carousel"
import { ChevronDown, Sparkles } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToFleet = () => {
    const element = document.getElementById("fleet")
    if (element) {
      const headerHeight = 100
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <section
      id="home"
      className="beach-hero-bg min-h-[110vh] flex items-center justify-center px-4 pt-20 md:pt-20 mobile-header-spacing relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-[10%] w-[500px] h-[500px] bg-magenta/8 rounded-full blur-[100px] animate-subtle-float" />
        <div
          className="absolute bottom-32 right-[10%] w-[600px] h-[600px] bg-navy/8 rounded-full blur-[120px] animate-subtle-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto text-center relative z-10 max-w-6xl">
        <div className="mb-10 md:mb-16">
          <div
            className={`relative inline-block mb-8 md:mb-12 transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12"
            }`}
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Sweet Car Hire"
                width={400}
                height={250}
                className="h-36 sm:h-44 md:h-52 lg:h-60 xl:h-72 w-auto mx-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <div className="relative mb-8 md:mb-12 space-y-6">
            <h1
              className={`font-poppins font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] text-white text-balance leading-[0.95] tracking-tight drop-shadow-2xl transition-all duration-1000 delay-200 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              Drive Mahé
              <span className="block text-white drop-shadow-[0_2px_10px_rgba(231,44,130,0.6)]">Your Way</span>
            </h1>
            <p
              className={`font-poppins text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 text-balance leading-relaxed drop-shadow-lg max-w-3xl mx-auto transition-all duration-1000 delay-400 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              Escape through the Sweetness of the Island
            </p>
          </div>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-5 md:gap-6 justify-center items-center mb-16 md:mb-20 px-4 transition-all duration-1000 delay-600 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <Link
            href="/booking"
            className="group relative w-full sm:w-auto bg-magenta text-white font-bold text-lg md:text-xl px-10 md:px-14 py-5 rounded-full transition-all duration-500 shadow-[0_8px_30px_-6px_rgba(231,44,130,0.5)] hover:shadow-[0_12px_40px_-6px_rgba(231,44,130,0.6)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Book Your Adventure
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-magenta via-pink to-magenta opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          <a
            href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full sm:w-auto bg-green-500 text-white font-bold text-lg md:text-xl px-10 md:px-14 py-5 rounded-full transition-all duration-500 shadow-[0_8px_30px_-6px_rgba(34,197,94,0.5)] hover:shadow-[0_12px_40px_-6px_rgba(34,197,94,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
          >
            <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
            </svg>
            <span className="relative z-10">Quick Contact</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>
        </div>

        {/* Benefits Carousel */}
        <div
          className={`transition-all duration-1000 delay-800 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <BenefitsCarousel />
        </div>
      </div>

      <button
        onClick={scrollToFleet}
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-all duration-500 cursor-pointer group ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Scroll to fleet"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore
          </span>
          <ChevronDown className="w-8 h-8 md:w-10 md:h-10 animate-bounce" />
        </div>
      </button>

      <div className="section-blur-overlay absolute bottom-0 left-0 right-0 h-24" />
    </section>
  )
}
