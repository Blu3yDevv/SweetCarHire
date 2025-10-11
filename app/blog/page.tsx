import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BlogPage() {
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
          <h1 className="text-5xl font-bold mb-4 text-white text-center">Our Blog</h1>
          <p className="text-xl text-white max-w-3xl mx-auto text-center">
            Tips, guides, and insights for your Seychelles adventure
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Top 10 Beaches to Visit in Seychelles",
                excerpt: "Discover the most beautiful and secluded beaches across Mahe, Praslin, and La Digue islands.",
                image: "/placeholder.svg?height=200&width=400",
                date: "April 15, 2023",
                author: "Sarah Johnson",
                category: "Travel Guide",
              },
              {
                title: "Driving in Seychelles: Tips for First-Timers",
                excerpt:
                  "Everything you need to know about driving on Seychelles' winding roads and navigating like a local.",
                image: "/placeholder.svg?height=200&width=400",
                date: "March 22, 2023",
                author: "Michael Roberts",
                category: "Driving Tips",
              },
              {
                title: "Best Hiking Trails in Mahe Island",
                excerpt:
                  "Explore the lush mountains and forests of Mahe with these scenic hiking trails for all experience levels.",
                image: "/placeholder.svg?height=200&width=400",
                date: "February 10, 2023",
                author: "Emma Wilson",
                category: "Activities",
              },
              {
                title: "Local Cuisine: Must-Try Seychellois Dishes",
                excerpt:
                  "A culinary journey through the flavors of Seychelles, from fresh seafood to creole specialties.",
                image: "/placeholder.svg?height=200&width=400",
                date: "January 28, 2023",
                author: "David Chen",
                category: "Food & Dining",
              },
              {
                title: "Family-Friendly Activities in Seychelles",
                excerpt:
                  "Planning a family trip? Discover the best activities and attractions for visitors of all ages.",
                image: "/placeholder.svg?height=200&width=400",
                date: "December 15, 2022",
                author: "Lisa Thompson",
                category: "Family Travel",
              },
              {
                title: "Choosing the Right Car for Your Seychelles Trip",
                excerpt:
                  "From compact cars to SUVs, find out which vehicle best suits your travel plans and island exploration.",
                image: "/placeholder.svg?height=200&width=400",
                date: "November 30, 2022",
                author: "James Wilson",
                category: "Car Rental Guide",
              },
            ].map((post, index) => (
              <Card key={index} className="overflow-hidden shadow-md border border-gray-100">
                <div className="h-48 relative">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4 bg-[#e94d97] text-white px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.date}</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link
                    href={`/blog/post-${index + 1}`}
                    className="text-[#e94d97] font-medium flex items-center hover:underline"
                  >
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-[#e94d97] text-[#e94d97]">
              Load More Articles
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
