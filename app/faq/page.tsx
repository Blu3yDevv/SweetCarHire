import Image from "next/image"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
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
          <h1 className="text-5xl font-bold mb-4 text-white text-center">Frequently Asked Questions</h1>
          <p className="text-xl text-white max-w-3xl mx-auto text-center">
            Find answers to common questions about our car rental services in Seychelles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-12">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-xl font-medium">
                  What documents do I need to rent a car?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg">
                  <p>To rent a car in Seychelles, you'll need:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>A valid driving license (held for at least 1 year)</li>
                    <li>Passport or ID card</li>
                    <li>Credit card for the security deposit</li>
                    <li>Visitors need their passport and return ticket</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-xl font-medium">What is your cancellation policy?</AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg">
                  <p>
                    We offer free cancellation up to 24 hours before your scheduled pickup time. Cancellations made less
                    than 24 hours before pickup may be subject to a cancellation fee equivalent to one day's rental.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-xl font-medium">
                  Is there a security deposit required?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg">
                  <p>
                    Yes, we require a security deposit which varies depending on the vehicle category. The deposit is
                    typically between SCR 5,000 and SCR 10,000 and will be pre-authorized on your credit card at the
                    time of pickup. The deposit will be released upon the safe return of the vehicle.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-xl font-medium">
                  Do you offer free delivery and pickup?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg">
                  <p>
                    Yes, we offer free delivery and pickup services to any location on Mahe Island, including hotels,
                    guesthouses, and the airport. For deliveries to Praslin or La Digue, additional fees may apply.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-xl font-medium">
                  What is included in the rental price?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg">
                  <p>Our rental prices include:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Comprehensive insurance</li>
                    <li>Unlimited mileage</li>
                    <li>24/7 roadside assistance</li>
                    <li>Free delivery and pickup on Mahe Island</li>
                    <li>VAT and local taxes</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-xl font-medium">
                  Can I take the rental car to other islands?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg">
                  <p>
                    Our vehicles are primarily for use on Mahe Island. If you wish to take the car to Praslin via the
                    ferry, you must inform us in advance and additional insurance may be required. Please note that not
                    all vehicles are permitted on the ferry.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-xl font-medium">What happens if I have an accident?</AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg">
                  <p>In case of an accident:</p>
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>Ensure everyone's safety and call emergency services if needed</li>
                    <li>Contact our 24/7 emergency number immediately</li>
                    <li>Take photos of the damage and accident scene</li>
                    <li>Exchange information with other parties involved</li>
                    <li>File a police report for any accident, regardless of severity</li>
                  </ol>
                  <p className="mt-2">
                    Your comprehensive insurance covers most damages, but the excess/deductible will apply unless you've
                    purchased our Super CDW option.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-xl font-medium">Do you offer additional drivers?</AccordionTrigger>
                <AccordionContent className="text-gray-600 text-lg">
                  <p>
                    Yes, you can add additional drivers to your rental agreement. Each additional driver must meet our
                    standard requirements and present their valid driving license. There is a small fee of SCR 100 per
                    additional driver for the entire rental period.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-[#1e3a8a] text-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                <p className="text-lg mb-6">
                  Our friendly team is here to help you with any other questions you might have about renting a car in
                  Seychelles.
                </p>
                <div className="flex space-x-4">
                  <Button className="bg-[#e94d97] hover:bg-[#d43884] text-white">
                    <Mail className="mr-2 h-4 w-4" /> Contact Us
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/20">
                    Call +248 2821122
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-auto">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kGn9yYNKNqsEu40zdKT6c8pGKQ9Br6.png"
                  alt="Seychelles Beach"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
