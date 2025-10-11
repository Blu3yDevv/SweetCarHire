"use client"

import { useState } from "react"
import { Calendar, Search, MapPin, Car } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BookingForm() {
  const [pickupDate, setPickupDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [carType, setCarType] = useState("")
  const [location, setLocation] = useState("")

  const locations = [
    { value: "airport", label: "Seychelles International Airport" },
    { value: "victoria", label: "Victoria City Center" },
    { value: "beau-vallon", label: "Beau Vallon Beach" },
    { value: "anse-royale", label: "Anse Royale" },
  ]

  const carTypes = [
    { value: "all", label: "All Car Types" },
    { value: "economy", label: "Economy" },
    { value: "compact", label: "Compact" },
    { value: "suv", label: "SUV" },
    { value: "luxury", label: "Luxury" },
  ]

  return (
    <div className="booking-form-container bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#e94d97]" />
            Pick-up Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]"
              >
                {pickupDate ? format(pickupDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl">
              <CalendarComponent
                mode="single"
                selected={pickupDate}
                onSelect={setPickupDate}
                initialFocus
                className="rounded-xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#e94d97]" />
            Return Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]"
              >
                {returnDate ? format(returnDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl">
              <CalendarComponent
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                initialFocus
                className="rounded-xl"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-[#e94d97]" />
            Pick-up Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value} className="rounded-lg my-1">
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Car className="h-4 w-4 mr-2 text-[#e94d97]" />
            Car Type
          </label>
          <Select value={carType} onValueChange={setCarType}>
            <SelectTrigger className="bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]">
              <SelectValue placeholder="All Car Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {carTypes.map((car) => (
                <SelectItem key={car.value} value={car.value} className="rounded-lg my-1">
                  {car.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Link href="/fleet">
        <Button className="w-full bg-[#e94d97] hover:bg-[#d43884] text-white rounded-xl py-3 text-lg font-medium transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-0">
          <Search className="h-5 w-5 mr-2" />
          Search Available Cars
        </Button>
      </Link>
    </div>
  )
}
