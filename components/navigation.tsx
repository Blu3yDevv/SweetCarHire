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
      const headerHeight = 80
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

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
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
      {/* Desktop Navigation - unchanged */}
      <nav
        className={`hidden md:block fixed top-3 md:top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs sm:max-w-2xl md:max-w-6xl px-3 md:px-5 transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div
          className={`rounded-full transition-all duration-500 ${
            isScrolled
              ? "bg-white/90 backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(13,43,95,0.15)] border border-navy/5"
              : "bg-black/10 backdrop-blur-xl shadow-lg border border-white/10"
          }`}
        >
          <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Sweet Car Hire" width={80} height={56} className="h-10 md:h-12 w-auto" />
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`${isScrolled ? "text-navy" : textColor} hover:text-magenta font-medium transition-all duration-300 relative group text-[15px]`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-magenta transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all duration-300 ${
                    isScrolled ? "bg-navy/5 hover:bg-navy/10 text-navy" : "bg-white/10 hover:bg-white/20 text-white"
                  } font-medium text-sm`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLanguage}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isLanguageOpen && (
                  <div className="absolute top-14 right-0 w-48 bg-white rounded-2xl shadow-xl border border-navy/5 overflow-hidden animate-scale-in">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream transition-all duration-300 text-left"
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
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all duration-300 ${
                    isScrolled ? "bg-navy/5 hover:bg-navy/10 text-navy" : "bg-white/10 hover:bg-white/20 text-white"
                  } font-medium text-sm notranslate`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{currency}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isCurrencyOpen && (
                  <div className="absolute top-14 right-0 w-48 bg-white rounded-2xl shadow-xl border border-navy/5 overflow-hidden animate-scale-in">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => handleCurrencyChange(curr.code)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream transition-all duration-300 text-left notranslate"
                      >
                        <span className="text-navy font-bold w-6">{curr.symbol}</span>
                        <div>
                          <div className="text-navy font-medium text-sm">{curr.code}</div>
                          <div className="text-muted-foreground text-xs">{curr.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                WhatsApp
              </a>

              <a
                href="/booking"
                className="bg-magenta hover:bg-pink text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg hover:-translate-y-0.5 text-sm"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        {/* Mini Header Bar */}
        <div
          className={`transition-all duration-300 ${
            isScrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-navy/5" : "bg-navy/80 backdrop-blur-xl"
          }`}
        >
          <div className="flex items-center justify-between px-3 py-2.5">
            {/* Logo */}
            <Image src="/logo.png" alt="Sweet Car Hire" width={48} height={32} className="h-8 w-auto" />

            {/* Quick Actions - Unified design */}
            <div className="flex items-center gap-2">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-sm"
                aria-label="WhatsApp"
              >
                <svg className="w-[18px] h-[18px] text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
              </a>

              {/* Book Now Button */}
              <a
                href="/booking"
                className="h-9 px-4 rounded-xl bg-magenta text-white text-sm font-semibold shadow-sm flex items-center justify-center"
              >
                Book
              </a>

              {/* Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isScrolled ? "bg-navy/10 text-navy" : "bg-white/20 text-white"
                }`}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/98 backdrop-blur-2xl border-b border-navy/10 shadow-xl">
            <div className="p-4 space-y-1">
              {/* Nav Links */}
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block text-navy font-medium py-3 px-4 rounded-xl hover:bg-cream transition-all duration-200 ${
                    isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
                  }`}
                  style={{ transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms" }}
                >
                  {item.name}
                </a>
              ))}

              {/* Divider */}
              <div className="h-px bg-navy/10 my-3" />

              {/* Language & Currency Row */}
              <div className="flex gap-2 px-2">
                {/* Language Selector */}
                <div className="relative flex-1">
                  <button
                    onClick={() => {
                      setIsLanguageOpen(!isLanguageOpen)
                      setIsCurrencyOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cream text-navy font-medium text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{currentLanguage}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-navy/10 overflow-hidden z-50">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cream transition-colors text-left text-sm"
                        >
                          <span>{lang.flag}</span>
                          <span className="text-navy">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Currency Selector */}
                <div className="relative flex-1">
                  <button
                    onClick={() => {
                      setIsCurrencyOpen(!isCurrencyOpen)
                      setIsLanguageOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cream text-navy font-medium text-sm notranslate"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{currency}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isCurrencyOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isCurrencyOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-navy/10 overflow-hidden z-50">
                      {currencies.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => handleCurrencyChange(curr.code)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cream transition-colors text-left text-sm notranslate"
                        >
                          <span className="text-navy font-bold">{curr.symbol}</span>
                          <span className="text-navy">{curr.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
