"use client"

import { SelectTrigger } from "@/components/ui/select"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, ChevronDown, Instagram, Facebook, Phone, Mail, SearchIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchDialog } from "@/components/search-dialog"
import { cn } from "@/lib/utils"

import { Select, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const mainNavLinks = [
  { href: "/", label: "Home" },
  {
    label: "Our Fleet",
    subLinks: [
      { href: "/fleet", label: "All Vehicles" },
      { href: "/fleet?type=economy", label: "Economy Cars" },
      { href: "/fleet?type=suv", label: "SUVs" },
      { href: "/fleet?type=luxury", label: "Luxury Cars" },
    ],
  },
  { href: "/booking", label: "Book Now" },
  {
    label: "About",
    subLinks: [
      { href: "/about", label: "About Us" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/faq", label: "FAQs" },
    ],
  },
  { href: "/policies", label: "Rental Policies" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [language, setLanguage] = useState("English")
  const [currency, setCurrency] = useState("SCR")
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const NavLink = ({
    href,
    children,
    className,
    ...props
  }: { href: string; children: React.ReactNode; className?: string; [key: string]: any }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : isScrolled ? "text-foreground" : "text-white",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )

  const MobileNavLink = ({
    href,
    children,
    ...props
  }: { href: string; children: React.ReactNode; [key: string]: any }) => (
    <Link
      href={href}
      onClick={() => setIsMobileMenuOpen(false)}
      className={cn(
        "block px-3 py-3 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground",
        pathname === href ? "bg-accent text-accent-foreground" : "text-foreground",
      )}
      {...props}
    >
      {children}
    </Link>
  )

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Top Bar */}
        <div className="bg-secondary text-secondary-foreground py-1.5 sm:py-2 text-xs sm:text-sm">
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a href="tel:+2482821182" className="flex items-center group">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors hidden sm:inline">+248 2821182</span>
                <span className="group-hover:text-primary transition-colors sm:hidden">Call</span>
              </a>
              <a href="mailto:sweetcarhire@gmail.com" className="flex items-center group">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors hidden sm:inline">
                  sweetcarhire@gmail.com
                </span>
                <span className="group-hover:text-primary transition-colors sm:hidden">Email</span>
              </a>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a
                href="https://instagram.com/sweetcarhire"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://facebook.com/sweetcarhire"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              {/* Language and Currency Dropdowns can be simplified or moved to mobile menu for very small screens if needed */}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div
          className={cn(
            "transition-all duration-300",
            isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent",
          )}
        >
          <div className="container mx-auto">
            <div className="flex h-16 sm:h-20 items-center justify-between">
              <Link href="/" className="flex-shrink-0">
                <div className="relative w-[100px] h-[50px] sm:w-[120px] sm:h-[60px]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/swweetcar-T6j2wm53tjW5HlObYtinnOhI9e7T4b.png"
                    alt="Sweet Car Hire Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {mainNavLinks.map((link) =>
                  link.subLinks ? (
                    <DropdownMenu key={link.label}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "text-sm font-medium px-3 py-2 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                            pathname.startsWith(link.subLinks[0].href.split("?")[0])
                              ? "text-primary"
                              : isScrolled
                                ? "text-foreground"
                                : "text-white",
                            "hover:text-primary",
                          )}
                        >
                          {link.label} <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" sideOffset={8} className="w-48">
                        {link.subLinks.map((subLink) => (
                          <DropdownMenuItem key={subLink.href} asChild className="cursor-pointer">
                            <Link href={subLink.href}>{subLink.label}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <NavLink key={link.href} href={link.href} className="px-3 py-2">
                      {link.label}
                    </NavLink>
                  ),
                )}
              </nav>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className={cn(isScrolled ? "text-foreground" : "text-white", "hover:bg-white/10 hover:text-primary")}
                  aria-label="Search"
                >
                  <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Link href="/booking" className="hidden sm:inline-block">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 sm:px-6 text-xs sm:text-sm"
                  >
                    Book Now
                  </Button>
                </Link>

                {/* Mobile Menu Trigger */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        isScrolled ? "text-foreground" : "text-white",
                        "hover:bg-white/10 hover:text-primary",
                      )}
                      aria-label="Toggle Menu"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] p-0">
                    <SheetHeader className="p-4 border-b">
                      <SheetTitle>
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                          <div className="relative w-[100px] h-[50px]">
                            <Image
                              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/swweetcar-T6j2wm53tjW5HlObYtinnOhI9e7T4b.png"
                              alt="Sweet Car Hire Logo"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </Link>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-4 space-y-2">
                      {mainNavLinks.map((link) =>
                        link.subLinks ? (
                          <div key={link.label}>
                            <h4 className="px-3 py-2 text-sm font-semibold text-muted-foreground">{link.label}</h4>
                            {link.subLinks.map((subLink) => (
                              <MobileNavLink key={subLink.href} href={subLink.href} className="ml-3">
                                {subLink.label}
                              </MobileNavLink>
                            ))}
                          </div>
                        ) : (
                          <MobileNavLink key={link.href} href={link.href}>
                            {link.label}
                          </MobileNavLink>
                        ),
                      )}
                      <DropdownMenuSeparator />
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Language & Currency</p>
                        {/* Simplified Language/Currency for mobile menu */}
                        <Select defaultValue={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-full mb-2 h-11">
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Français">Français</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SCR">SCR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="p-4 mt-auto border-t">
                      <Button
                        className="w-full btn-primary"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          window.location.href = "/booking"
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
