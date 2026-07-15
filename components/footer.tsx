"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, MapPin, ArrowUpRight, Instagram, Facebook } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-magenta/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-5 md:px-8 relative z-10">
        {/* Closing CTA */}
        <div className="py-16 md:py-24 text-center border-b border-white/10">
          <p className="eyebrow text-pink mb-4">Ready when you are</p>
          <h2 className="display-heading text-white text-5xl md:text-7xl lg:text-8xl text-balance max-w-4xl mx-auto">
            Your island is waiting.
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center bg-magenta hover:bg-pink text-white font-display font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 shadow-[0_10px_30px_-8px_rgba(231,44,130,0.5)] hover:-translate-y-0.5"
            >
              Book your car
            </Link>
            <a
              href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-display font-bold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:bg-white/10"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Links + contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 py-14 md:py-16">
          <div className="lg:col-span-2 space-y-6">
            <Image src="/logo.png" alt="Sweet Car Hire" width={140} height={90} className="h-20 w-auto" />
            <p className="text-white/70 max-w-md leading-relaxed text-[15px]">
              Your trusted partner for exploring the beautiful islands of Seychelles. Experience the
              sweetness of island life with our reliable car rental service.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/sweetcarhire.seychelles/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-magenta flex items-center justify-center transition-colors duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/audrey.carhire.5/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-magenta flex items-center justify-center transition-colors duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow text-pink mb-6">Explore</h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "#home" },
                { name: "Our Fleet", href: "#fleet" },
                { name: "Services", href: "#services" },
                { name: "Locations", href: "#locations" },
                { name: "About Us", href: "#about" },
                { name: "Policies", href: "/policies" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-pink mb-6">Contact</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <MapPin className="h-4 w-4 text-magenta mt-1 shrink-0" />
                <span className="text-white/70">Mahé, Seychelles</span>
              </div>
              <div className="flex items-start gap-3.5">
                <Mail className="h-4 w-4 text-magenta mt-1 shrink-0" />
                <a href="mailto:sweetcarhire@gmail.com" className="text-white/70 hover:text-white transition-colors">
                  sweetcarhire@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3.5">
                <Phone className="h-4 w-4 text-magenta mt-1 shrink-0" />
                <a href="tel:+2482821182" className="text-white/70 hover:text-white transition-colors">
                  +248 282 1182
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="select-none pointer-events-none overflow-hidden" aria-hidden="true">
          <p className="display-heading text-outline-white text-[9.5vw] leading-none text-center whitespace-nowrap translate-y-[12%]">
            SWEET CAR HIRE
          </p>
        </div>

        <div className="border-t border-white/10 py-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/50 text-sm">© {currentYear} Sweet Car Hire. All rights reserved.</p>
            <p className="text-white/40 text-sm italic">Escape through the sweetness of the island</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
