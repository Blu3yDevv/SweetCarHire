"use client"

import Image from "next/image"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image src="/logo.png" alt="Sweet Car Hire" width={120} height={80} className="h-16 w-auto mb-4" />
            <p className="text-white/80 mb-6 max-w-md leading-relaxed">
              Your trusted partner for exploring the beautiful islands of Seychelles. Experience the sweetness of island
              life with our reliable car rental service.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span>+248 282 1182</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-accent" />
                <span>WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/80 hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#fleet" className="text-white/80 hover:text-accent transition-colors">
                  Our Fleet
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-accent transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#locations" className="text-white/80 hover:text-accent transition-colors">
                  Locations
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-poppins font-bold text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm">Mahé, Seychelles</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm">sweetcarhire@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm">+248 282 1182</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 Sweet Car Hire. All rights reserved. | Escape through the sweetness of the island
          </p>
        </div>
      </div>
    </footer>
  )
}
