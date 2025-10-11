"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function ReviewsSection() {
const reviews = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "Airport meet at SEZ was right on time, the car was spotless, and WhatsApp communication was smooth—perfect start to our Seychelles trip.",
  },
  {
    name: "Michael Chen",
    rating: 5,
    text: "Professional and friendly, they delivered to our Beau Vallon hotel and collected at the airport. Car was in excellent condition the whole week.",
  },
  {
    name: "Emma Thompson",
    rating: 5,
    text: "Quick booking via WhatsApp, fair price, and unlimited mileage made exploring Mahé easy. Best rental experience of our holiday.",
  },
  {
    name: "David Rodriguez",
    rating: 5,
    text: "bann bon konsey lokal e moman fleksib. Ramase fasil Anse Royale e retour san okenn problenm. loto in marse lo semen Sans Souci san okenn problenm.",
  },
  {
    name: "Lisa Anderson",
    rating: 5,
    text: "Reliable and honest—no hidden fees, cold AC, and they arranged a child seat last minute. Driving around the island was stress-free.",
  },
  {
    name: "James Wilson",
    rating: 5,
    text: "Outstanding value. Our flight was delayed and they still waited at arrivals and stayed in touch. Would definitely book Sweet Car Hire again.",
  },
]


  // Duplicate reviews for infinite scroll effect
  const infiniteReviews = [...reviews, ...reviews, ...reviews]

  return (
    <section className="py-12 md:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl text-gradient mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real experiences from travelers who chose Sweet Car Hire for their Seychelles adventure
          </p>
        </div>

        {/* Infinite scrolling carousel */}
        <div className="relative">
          <div className="flex animate-scroll-infinite gap-6">
            {infiniteReviews.map((review, index) => (
              <Card
                key={`${review.name}-${index}`}
                className="flex-shrink-0 w-80 card-hover border-0 bubble-shadow bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">"{review.text}"</p>
                  <div className="font-semibold text-primary">{review.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
