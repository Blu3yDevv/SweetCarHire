import { Navigation } from "@/components/navigation"
import { FleetSection } from "@/components/fleet-section"
import { ServicesSection } from "@/components/services-section"
import { LocationsSection } from "@/components/locations-section"
import { AboutSection } from "@/components/about-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { StatsBar } from "@/components/stats-bar"
import { SocialFloat } from "@/components/social-float"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsBar />
      <FleetSection />
      <ServicesSection />
      <LocationsSection />
      <AboutSection />
      <ReviewsSection />
      <Footer />
      <SocialFloat />
    </div>
  )
}
