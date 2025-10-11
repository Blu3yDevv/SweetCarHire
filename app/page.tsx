import { Navigation } from "@/components/navigation"
import { BenefitsCarousel } from "@/components/benefits-carousel"
import { FleetSection } from "@/components/fleet-section"
import { ServicesSection } from "@/components/services-section"
import { LocationsSection } from "@/components/locations-section"
import { AboutSection } from "@/components/about-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section
        id="home"
        className="beach-hero-bg min-h-[110vh] flex items-center justify-center px-4 pt-20 md:pt-20 mobile-header-spacing relative"
      >
        <div className="container mx-auto text-center">
          <div className="mb-8 md:mb-12">
            <div className="relative inline-block mb-6 md:mb-8">
              <Image
                src="/logo.png"
                alt="Sweet Car Hire"
                width={400}
                height={250}
                className="h-32 sm:h-40 md:h-48 lg:h-56 xl:h-9xl w-auto mx-auto"
              />
            </div>

            <div className="relative mb-6 md:mb-8">
              <h1 className="font-poppins font-black text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl text-white mb-4 md:mb-6 text-balance leading-tight drop-shadow-2xl">
                Drive Mahé Your Way
              </h1>
              <p className="font-poppins text-xl sm:text-2xl md:text-3xl text-white/90 text-balance leading-relaxed drop-shadow-lg">
                Escape through the Sweetness of the Island
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-8 md:mb-12 px-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto bg-[var(--magenta)] hover:bg-[var(--magenta)]/90 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl border-2 border-white/20 backdrop-blur-sm inline-block text-center"
            >
              Book Now!
            </Link>
            <a
              href="https://wa.me/2482821182?text=Hello%2C%20I%27m%20interested%20in%20renting%20a%20car%20from%20Sweet%20Car%20Hire"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl border-2 border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
              </svg>
              WhatsApp
            </a>
          </div>

          <BenefitsCarousel />
        </div>

        <div className="section-blur-overlay absolute bottom-0 left-0 right-0 h-20"></div>
      </section>

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
