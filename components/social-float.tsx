"use client"

import { useState } from "react"
import { Instagram, Facebook, X, Share2 } from "lucide-react"

export function SocialFloat() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2">
      {/* Social Links - shown when expanded */}
      <div
        className={`flex flex-col gap-2 transition-all duration-300 ease-out ${
          isExpanded ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <a
          href="https://www.instagram.com/sweetcarhire.seychelles/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
          aria-label="Follow us on Instagram"
        >
          <Instagram className="w-5 h-5 text-white" />
        </a>

        <a
          href="https://www.facebook.com/audrey.carhire.5/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-xl bg-[#1877F2] flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
          aria-label="Follow us on Facebook"
        >
          <Facebook className="w-5 h-5 text-white" />
        </a>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
          isExpanded
            ? "bg-navy rotate-0"
            : "bg-gradient-to-br from-magenta via-pink to-orange-400 hover:shadow-xl hover:scale-105"
        }`}
        aria-label={isExpanded ? "Close social menu" : "Follow us on social media"}
      >
        {isExpanded ? <X className="w-5 h-5 text-white" /> : <Share2 className="w-5 h-5 text-white" />}
      </button>
    </div>
  )
}
