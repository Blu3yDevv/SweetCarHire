"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Car } from "lucide-react"

export function StickyBookButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="md:hidden">
      <Link href="/book" className="sticky-book-btn animate-pulse-soft">
        <Car className="h-5 w-5" />
        <span>Book Now</span>
      </Link>
    </div>
  )
}
