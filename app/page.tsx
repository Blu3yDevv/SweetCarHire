import { Navigation } from "@/components/navigation"
import { FleetSection } from "@/components/fleet-section"
import { ServicesSection } from "@/components/services-section"
import { LocationsSection } from "@/components/locations-section"
import { AboutSection } from "@/components/about-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { IslandDivider } from "@/components/island-divider"
import { PhotoGallery } from "@/components/photo-gallery"

export default function Home() {
  return (
    <div className="home-page min-h-screen">
      <Navigation />
      <HeroSection />
      <IslandDivider topDark />
      <PhotoGallery />
      <IslandDivider />
      <FleetSection />
      <IslandDivider bottomDark />
      <ServicesSection />
      <IslandDivider topDark />
      <LocationsSection />
      <IslandDivider />
      <AboutSection />
      <IslandDivider />
      <ReviewsSection />
      <IslandDivider bottomDark />
      <Footer />
    </div>
  )
}
