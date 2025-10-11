import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, MapPin, Phone, Mail, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground relative section-padding">
      <div className="absolute inset-0 opacity-5">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kGn9yYNKNqsEu40zdKT6c8pGKQ9Br6.png"
          alt="Seychelles Beach Background"
          fill
          className="object-cover"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and About */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="relative w-[120px] h-[60px] mb-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/swweetcar-T6j2wm53tjW5HlObYtinnOhI9e7T4b.png"
                alt="Sweet Car Hire Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-300/90">
              Sweet Car Hire offers premium car rental services in Seychelles, providing you with the freedom to explore
              the islands at your own pace.
            </p>
            <div className="flex space-x-3 pt-2">
              <Link
                href="https://instagram.com/sweetcarhire"
                className="text-gray-300 hover:text-primary transition-colors bg-white/10 p-2.5 rounded-full"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://facebook.com/sweetcarhire"
                className="text-gray-300 hover:text-primary transition-colors bg-white/10 p-2.5 rounded-full"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/fleet", label: "Our Fleet" },
                { href: "/booking", label: "Book Now" },
                { href: "/policies", label: "Rental Policies" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300/90 hover:text-white flex items-center group">
                    <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-primary/70 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">More</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Blog" },
                { href: "/testimonials", label: "Testimonials" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300/90 hover:text-white flex items-center group">
                    <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-primary/70 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 text-primary/70 flex-shrink-0 mt-1" />
                <span className="text-gray-300/90">Mahe Island, Seychelles</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-primary/70 flex-shrink-0" />
                <span className="text-gray-300/90">+248 2821182</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-primary/70 flex-shrink-0" />
                <span className="text-gray-300/90">sweetcarhire@gmail.com</span>
              </li>
            </ul>

            <h4 className="text-base font-semibold mb-2">Subscribe to our newsletter</h4>
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="form-input-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-grow h-11"
                aria-label="Email for newsletter"
              />
              <Button type="submit" className="btn btn-primary h-11 px-4">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-gray-400/80 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} Sweet Car Hire. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-gray-400/80 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-gray-400/80 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
