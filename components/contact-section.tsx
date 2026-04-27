"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react"

export function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone & WhatsApp",
      details: "+248 281 1182",
    },
    {
      icon: Mail,
      title: "Email",
      details: "sweetcarhire@gmail.com",
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Mahé, Seychelles",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "8:00 AM - 6:00 PM",
    },
  ]

  return (
    <section id="contact" className="py-20 section-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl md:text-5xl text-gradient mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your Seychelles adventure? Contact us for bookings, questions, or special requests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-0 bubble-shadow bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-poppins font-bold text-2xl mb-4">Send us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="bg-background/50" />
                  <Input placeholder="Last Name" className="bg-background/50" />
                </div>
                <Input type="email" placeholder="Email" className="bg-background/50" />
                <Input placeholder="Phone (Optional)" className="bg-background/50" />
                <Textarea placeholder="Tell us about your rental needs..." className="bg-background/50 min-h-[100px]" />
                <Button className="w-full bg-[var(--magenta)] hover:bg-[var(--magenta)]/90 text-white font-semibold h-12 transition-colors">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <Card key={info.title} className="card-hover border-0 bubble-shadow bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--magenta)]/10">
                        <IconComponent className="h-5 w-5 text-[var(--magenta)]" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-poppins font-bold text-lg">{info.title}</h4>
                      <p className="font-semibold text-[var(--magenta)]">{info.details}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Quick WhatsApp CTA */}
            <Card className="border-0 bubble-shadow bg-[var(--magenta)]/5">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-10 w-10 text-[var(--magenta)] mx-auto mb-3" />
                <h3 className="font-poppins font-bold text-xl mb-2">Quick WhatsApp Booking</h3>
                <p className="text-muted-foreground mb-4 text-sm">Get instant quotes and book your car in minutes</p>
                <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 transition-colors">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
