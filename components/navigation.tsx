"use client"

import type React from "react"
import Image from "next/image"
import { Menu, X, Globe, DollarSign, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useCurrency } from "@/lib/currency"

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("EN")
  const [isTranslateReady, setIsTranslateReady] = useState(false)
  const [textColor, setTextColor] = useState("text-white")

  const { currency, setCurrency } = useCurrency()

  const [exchangeRates, setExchangeRates] = useState({ EUR: 0.85, GBP: 0.79, USD: 1, JPY: 110, SCR: 13.5 })

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Fleet", href: "#fleet" },
    { name: "Services", href: "#services" },
    { name: "Locations", href: "#locations" },
    { name: "About", href: "#about" },
  ]

  const languages = [
    { code: "EN", name: "English", flag: "🇺🇸", googleCode: "en" },
    { code: "FR", name: "Français", flag: "🇫🇷", googleCode: "fr" },
    { code: "AR", name: "العربية", flag: "🇸🇦", googleCode: "ar" },
    { code: "ZH", name: "中文", flag: "🇨🇳", googleCode: "zh" },
    { code: "RU", name: "Русский", flag: "🇷🇺", googleCode: "ru" },
    { code: "ES", name: "Español", flag: "🇪🇸", googleCode: "es" },
  ]

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "SCR", symbol: "SR", name: "Seychelles Rupee" },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    const element = document.querySelector(href)
    if (element) {
      const headerHeight = 80 // Reduced for mobile
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
    setIsMenuOpen(false)
  }

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode)
    setIsLanguageOpen(false)

    const selectedLang = languages.find((lang) => lang.code === langCode)
    if (!selectedLang) return

    if (selectedLang.googleCode !== "en") {
      const translatePage = () => {
        if (!isTranslateReady) {
          setTimeout(translatePage, 1000)
          return
        }

        try {
          const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement

          if (selectElement) {
            if (selectElement.value !== "en") {
              selectElement.value = "en"
              selectElement.dispatchEvent(new Event("change"))

              setTimeout(() => {
                selectElement.value = selectedLang.googleCode
                selectElement.dispatchEvent(new Event("change"))
              }, 1000)
            } else {
              selectElement.value = selectedLang.googleCode
              selectElement.dispatchEvent(new Event("change"))
            }
          }
        } catch (error) {
          console.error("[v0] Error changing language:", error)
        }
      }

      translatePage()
    } else {
      const selectElement = document.querySelector(".goog-te-combo") as HTMLSelectElement
      if (selectElement && selectElement.value !== "en") {
        selectElement.value = "en"
        selectElement.dispatchEvent(new Event("change"))
      }
    }
  }

  const handleCurrencyChange = (currencyCode: string) => {
    setCurrency(currencyCode)
    setIsCurrencyOpen(false)
  }

  // Dynamic color change based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      // Check if we're over a light background section
      const servicesSection = document.getElementById("services")
      const locationsSection = document.getElementById("locations")
      const aboutSection = document.getElementById("about")

      let isOverLightSection = false

      if (servicesSection || locationsSection || aboutSection) {
        const sections = [servicesSection, locationsSection, aboutSection].filter(Boolean)

        for (const section of sections) {
          const rect = section.getBoundingClientRect()
          const headerHeight = 100

          if (rect.top <= headerHeight && rect.bottom >= 0) {
            isOverLightSection = true
            break
          }
        }
      }

      setTextColor(isOverLightSection ? "text-navy" : "text-white")
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
        if (response.ok) {
          const data = await response.json()
          setExchangeRates({
            EUR: data.rates.EUR || 0.85,
            GBP: data.rates.GBP || 0.79,
            USD: 1,
            JPY: data.rates.JPY || 110,
            SCR: data.rates.SCR || 13.5,
          })
        }
      } catch (error) {
        console.log("[v0] Using fallback exchange rates")
      }
    }
    fetchExchangeRates()
  }, [])

  // Google Translate
  useEffect(() => {
    const handleTranslateReady = () => {
      setIsTranslateReady(true)
    }

    window.addEventListener("googleTranslateReady", handleTranslateReady)

    if (typeof window !== "undefined" && window.google?.translate?.TranslateElement) {
      setIsTranslateReady(true)
    }

    return () => {
      window.removeEventListener("googleTranslateReady", handleTranslateReady)
    }
  }, [])

  // Header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      console.log("[v0] Scroll position:", currentScrollY, "Last scroll:", lastScrollY)

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        console.log("[v0] Showing header")
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        console.log("[v0] Hiding header")
        setIsVisible(false)
      }

      setIsScrolled(currentScrollY > 20)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <div>
      {/* Desktop Navigation */}
      <nav
        className={`hidden md:block fixed top-2 md:top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs sm:max-w-2xl md:max-w-6xl px-2 md:px-4 transition-all duration-300 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div
          className={`glass-header rounded-full transition-all duration-300 ${
            isScrolled
              ? "bg-black/20 backdrop-blur-xl shadow-2xl scale-105"
              : "bg-black/10 backdrop-blur-md shadow-lg scale-100"
          }`}
        >
          <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Sweet Car Hire" width={80} height={56} className="h-10 md:h-14 w-auto" />
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`${textColor} hover:text-magenta font-medium transition-all duration-300 hover:scale-110 relative group hover:drop-shadow-lg`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-magenta transition-all duration-300 group-hover:w-full shadow-sm"></span>
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 ${textColor} font-medium backdrop-blur-sm hover:scale-105`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{currentLanguage}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isLanguageOpen && (
                  <div className="absolute top-12 right-0 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 overflow-hidden animate-scale-in">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-magenta/10 transition-all duration-300 text-left hover:scale-105"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-navy font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 ${textColor} font-medium backdrop-blur-sm hover:scale-105 notranslate`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">{currency}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isCurrencyOpen && (
                  <div className="absolute top-12 right-0 w-44 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 overflow-hidden animate-scale-in">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-magenta/10 transition-all duration-300 text-left hover:scale-105 notranslate"
                      >
                        <span className="text-navy font-bold">{curr.symbol}</span>
                        <div>
                          <div className="text-navy font-medium text-sm">{curr.code}</div>
                          <div className="text-gray-500 text-xs">{curr.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <a
                href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm hover:scale-105 hover:shadow-xl"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                WhatsApp
              </a>

              <a
                href="/booking"
                className="bg-[var(--magenta)] hover:bg-[var(--magenta)]/90 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:scale-105"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/15 backdrop-blur-xl border-b border-white/20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Sweet Car Hire" width={60} height={42} className="h-8 w-auto" />
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 text-white text-sm backdrop-blur-sm flex items-center justify-center"
              >
                <Globe className="w-4 h-4" />
              </button>

              {isLanguageOpen && (
                <div className="absolute top-8 right-0 w-40 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 overflow-hidden animate-scale-in">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-magenta/10 transition-all duration-300 text-left text-sm"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-navy">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 text-white text-sm backdrop-blur-sm flex items-center justify-center"
              >
                <DollarSign className="w-4 h-4" />
              </button>

              {isCurrencyOpen && (
                <div className="absolute top-8 right-0 w-36 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 overflow-hidden animate-scale-in">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleCurrencyChange(curr.code)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-magenta/10 transition-all duration-300 text-left text-sm"
                    >
                      <span className="text-navy font-bold text-xs">{curr.symbol}</span>
                      <span className="text-navy text-xs">{curr.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-10 h-10 rounded-full bg-white/30 backdrop-blur-md shadow-lg border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isMenuOpen ? "scale-110 rotate-90" : "scale-100 rotate-0"
              }`}
            >
              {isMenuOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4 text-white" />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/20 backdrop-blur-xl border-t border-white/30">
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block text-white hover:text-magenta font-medium py-3 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 ${
                    isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 0.1}s` : "0s",
                  }}
                >
                  {item.name}
                </a>
              ))}

              <div className="border-t border-white/30 mt-4 pt-4 space-y-3">
                <a
                  href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                  WhatsApp
                </a>

                <a
                  href="/booking"
                  className="w-full bg-[var(--magenta)] hover:bg-[var(--magenta)]/90 text-white font-semibold px-4 py-3 rounded-full transition-all duration-300 shadow-lg block text-center hover:scale-105"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
