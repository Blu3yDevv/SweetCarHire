import { Navigation } from "@/components/navigation"
import { FleetSection } from "@/components/fleet-section"
import { ServicesSection } from "@/components/services-section"
import { LocationsSection } from "@/components/locations-section"
import { AboutSection } from "@/components/about-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { StatsBar } from "@/components/stats-bar"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <HeroSection />

      <StatsBar />

      <div className="section-fade-wrapper">
        <div id="fleet" className="section-fade section-blur-enhanced">
          <FleetSection />
        </div>
        <div id="services" className="section-fade section-blur-enhanced">
          <ServicesSection />
        </div>
        <div id="locations" className="section-fade section-blur-enhanced">
          <LocationsSection />
        </div>
        <div id="about" className="section-fade section-blur-enhanced">
          <AboutSection />
        </div>
        <div className="section-fade section-blur-enhanced">
          <ReviewsSection />
        </div>
        <Footer />
      </div>
    </div>
  )
}
