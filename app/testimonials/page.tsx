import Image from "next/image"
import { Star, Quote } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TestimonialsPage() {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <div className="relative h-[250px] mb-16">
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kGn9yYNKNqsEu40zdKT6c8pGKQ9Br6.png"
            alt="Seychelles Beach"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white text-center">Customer Testimonials</h1>
          <p className="text-xl text-white max-w-3xl mx-auto text-center">
            See what our customers have to say about their experience with Sweet Car Hire
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Featured Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 relative">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-[#e94d97]/10" />
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-[#e94d97] rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-br from-[#e94d97] to-[#d43884]"></span>
                  <span className="relative">S</span>
                  <div className="absolute bottom-0 right-0 w-6 h-4 overflow-hidden">
                    <div className="w-6 h-4 bg-[#00247d] relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-white"></div>
                        <div className="h-4 w-0.5 bg-white absolute"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-[#cf142b] rotate-45 origin-center"></div>
                        <div className="w-6 h-0.5 bg-[#cf142b] -rotate-45 origin-center"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">Sarah Thompson</h3>
                  <p className="text-gray-500 flex items-center">
                    <span className="mr-1">United Kingdom</span>
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-lg italic mb-4">
                "Sweet Car Hire made our Seychelles vacation perfect! The car was delivered to our hotel on time, and
                the return process was just as smooth. The vehicle was clean, well-maintained, and perfect for
                navigating the island's winding roads. The staff were incredibly friendly and gave us great tips on
                places to visit. Highly recommend!"
              </p>
              <p className="text-gray-500">Visited: March 2023</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 relative">
              <Quote className="absolute top-6 right-6 h-12 w-12 text-[#e94d97]/10" />
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-[#e94d97] rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 relative overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-br from-[#e94d97] to-[#d43884]"></span>
                  <span className="relative">J</span>
                  <div className="absolute bottom-0 right-0 w-6 h-4 overflow-hidden">
                    <div className="w-6 h-4 bg-white relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-4 bg-[#002654] absolute left-0"></div>
                        <div className="w-2 h-4 bg-[#ce1126] absolute right-0"></div>
                        <div className="w-2 h-4 bg-[#0055a4] absolute left-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">Jean Pierre</h3>
                  <p className="text-gray-500 flex items-center">
                    <span className="mr-1">France</span>
                  </p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-lg italic mb-4">
                "Service exceptionnel! La voiture était propre et en parfait état. Le personnel était très serviable et
                a répondu à toutes nos questions sur la conduite à Mahé. Nous avons loué un SUV qui était parfait pour
                les routes montagneuses. Je recommande vivement Sweet Car Hire pour votre séjour aux Seychelles!"
              </p>
              <p className="text-gray-500">Visited: February 2023</p>
            </div>
          </div>

          {/* More Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                name: "Michael Klein",
                country: "Germany",
                countryCode: "DE",
                rating: 5,
                text: "We rented an SUV for a week and it was the best decision. The roads in Seychelles can be steep, and having a good car from Sweet Car Hire made all the difference. The free delivery to our hotel was a great bonus!",
                date: "April 2023",
              },
              {
                name: "Anna Petrova",
                country: "Russia",
                countryCode: "RU",
                rating: 5,
                text: "Excellent service from start to finish. The booking process was simple, and the car was delivered on time. We had a small issue with the air conditioning, but they quickly replaced the car with a better model at no extra cost.",
                date: "January 2023",
              },
              {
                name: "David Chen",
                country: "Singapore",
                countryCode: "SG",
                rating: 4,
                text: "Very good experience overall. The car was clean and well-maintained. The only reason for 4 stars instead of 5 is that the pickup was slightly delayed, but the staff were very apologetic and professional.",
                date: "March 2023",
              },
              {
                name: "Emma Wilson",
                country: "Australia",
                countryCode: "AU",
                rating: 5,
                text: "Fantastic service! We rented a compact car for 10 days and it was perfect for exploring Mahe. The unlimited mileage was great as we drove all around the island. The staff were friendly and helpful with recommendations.",
                date: "December 2022",
              },
              {
                name: "Marco Rossi",
                country: "Italy",
                countryCode: "IT",
                rating: 5,
                text: "Servizio eccellente! Auto nuova e pulita, consegna puntuale e personale cordiale. Abbiamo noleggiato una Kia Picanto che era perfetta per le strade delle Seychelles. Altamente raccomandato!",
                date: "February 2023",
              },
              {
                name: "Sophia Lee",
                country: "South Korea",
                countryCode: "KR",
                rating: 5,
                text: "The best car rental experience I've had. The process was smooth from booking to return. The car was in excellent condition and the price was reasonable. I appreciated the local tips from the staff about driving in Seychelles.",
                date: "March 2023",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#e94d97] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 relative overflow-hidden">
                      <span className="absolute inset-0 bg-gradient-to-br from-[#e94d97] to-[#d43884]"></span>
                      <span className="relative">{testimonial.name.charAt(0)}</span>
                      <div className="absolute bottom-0 right-0 w-4 h-3 overflow-hidden">
                        {/* Simple flag indicator */}
                        <div className="w-4 h-3 bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.country}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-base italic mb-3">"{testimonial.text}"</p>
                  <p className="text-gray-500 text-sm">Visited: {testimonial.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2a4cad] text-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Service?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our satisfied customers and book your perfect rental car for your Seychelles adventure today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#e94d97] hover:bg-[#d43884] text-white text-lg h-14 px-8">
                Book Your Car Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/20 text-lg h-14 px-8"
              >
                View Our Fleet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
