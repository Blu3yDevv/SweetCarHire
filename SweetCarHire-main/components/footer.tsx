"use client"

import Image from "next/image"
import { Phone, Mail, MapPin, ArrowUpRight, Instagram, Facebook } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-magenta/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Image src="/logo.png" alt="Sweet Car Hire" width={140} height={90} className="h-20 w-auto" />
            <p className="text-white/70 max-w-md leading-relaxed text-[15px]">
              Your trusted partner for exploring the beautiful islands of Seychelles. Experience the sweetness of island
              life with our reliable car rental service.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="tel:+2482821182"
                className="group flex items-center gap-2 text-white/80 hover:text-magenta transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-magenta/20 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">+248 282 1182</span>
              </a>
              <a
                href="https://wa.me/2482821182"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-white/80 hover:text-green-400 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                </div>
                <span className="font-medium">WhatsApp</span>
              </a>
            </div>

            <div className="pt-4">
              <p className="text-white/50 text-sm mb-4 font-medium uppercase tracking-wider">Follow Our Journey</p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/sweetcarhire.seychelles/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="https://www.facebook.com/audrey.carhire.5/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-poppins font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "#home" },
                { name: "Our Fleet", href: "#fleet" },
                { name: "Services", href: "#services" },
                { name: "Locations", href: "#locations" },
                { name: "About Us", href: "#about" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-white/70 hover:text-magenta transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-poppins font-bold text-lg mb-6">Contact Info</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-magenta" />
                </div>
                <div>
                  <span className="text-white/90 font-medium block">Location</span>
                  <span className="text-white/60 text-sm">Mahé, Seychelles</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-magenta" />
                </div>
                <div>
                  <span className="text-white/90 font-medium block">Email</span>
                  <a
                    href="mailto:sweetcarhire@gmail.com"
                    className="text-white/60 text-sm hover:text-magenta transition-colors"
                  >
                    sweetcarhire@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-magenta" />
                </div>
                <div>
                  <span className="text-white/90 font-medium block">Phone</span>
                  <a href="tel:+2482821182" className="text-white/60 text-sm hover:text-magenta transition-colors">
                    +248 282 1182
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {currentYear} Sweet Car Hire. All rights reserved.
            </p>
            <p className="text-white/40 text-sm italic">Escape through the sweetness of the island</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
