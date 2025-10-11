"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4 glass-effect" : "py-6 bg-transparent"
      }`}
    >
      <div className="container-spacious mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-16 w-48">
              <Image
                src="/placeholder.svg?height=64&width=192"
                alt="Sweet Car Hire Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link
              href="/"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium text-lg py-3 px-5"
            >
              Home
            </Link>
            <Link
              href="/book"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium text-lg py-3 px-5"
            >
              Book Now
            </Link>
            <Link
              href="/cars"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium text-lg py-3 px-5"
            >
              Cars
            </Link>
            <Link
              href="/reviews"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium text-lg py-3 px-5"
            >
              Reviews
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium text-lg py-3 px-5"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-3 rounded-full hover:bg-pastel-pink/20 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-effect animate-fade-in">
          <nav className="flex flex-col space-y-6 p-8">
            <Link
              href="/"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium py-3 text-xl"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/book"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium py-3 text-xl"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
            <Link
              href="/cars"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium py-3 text-xl"
              onClick={() => setIsOpen(false)}
            >
              Cars
            </Link>
            <Link
              href="/reviews"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium py-3 text-xl"
              onClick={() => setIsOpen(false)}
            >
              Reviews
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-pastel-pink transition-colors font-medium py-3 text-xl"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
