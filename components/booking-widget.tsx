"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin } from "lucide-react"

export function BookingWidget() {
  const [pickupDate, setPickupDate] = useState("")
  const [dropoffDate, setDropoffDate] = useState("")

  const locations = ["SEZ Airport", "Victoria", "Beau Vallon", "Eden Island", "Other Location"]

  return (
    <Card className="glass-card p-6 w-full max-w-2xl mx-auto shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Pickup Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--charcoal)] flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Pickup Date
          </label>
          <Input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="bg-white/70 border-white/30"
          />
        </div>

        {/* Return Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--charcoal)] flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Return Date
          </label>
          <Input
            type="date"
            value={dropoffDate}
            onChange={(e) => setDropoffDate(e.target.value)}
            className="bg-white/70 border-white/30"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--charcoal)] flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </label>
          <Select>
            <SelectTrigger className="bg-white/70 border-white/30">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-center">
        <Button className="premium-button bg-[var(--magenta)] hover:bg-[var(--magenta)]/90 text-white font-semibold px-12 py-4 text-lg rounded-full shadow-lg">
          Check Availability
        </Button>
        <p className="text-white/80 text-sm mt-3">
          Or contact us directly via{" "}
          <button className="text-[var(--sunshine)] font-medium hover:underline">WhatsApp +248 281 1182</button>
        </p>
      </div>
    </Card>
  )
}
