"use client"

import { useEffect, useRef } from "react"

interface SweetTextProps {
  text: string
  className?: string
  color?: string
  size?: string
}

export function SweetText({ text, className = "", color = "#e94d97", size = "text-5xl md:text-7xl" }: SweetTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = textRef.current
    if (element) {
      // Add a subtle animation effect
      element.style.animation = "sweetBounce 5s ease-in-out infinite"
    }
  }, [])

  return (
    <span
      ref={textRef}
      className={`font-sweet inline-block ${size} ${className}`}
      style={{
        color,
        transform: "rotate(-5deg)",
        display: "inline-block",
        textShadow: "3px 3px 6px rgba(0, 0, 0, 0.25)",
        letterSpacing: "0.05em",
      }}
    >
      {text}
    </span>
  )
}
