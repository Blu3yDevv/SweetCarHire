"use client"

import { useState } from "react"
import { Calendar, Search, MapPin, Car, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function MultiStepBookingForm() {
  const [step, setStep] = useState(1)
  const [pickupDate, setPickupDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnTime, setReturnTime] = useState("10:00")
  const [carType, setCarType] = useState("")
  const [location, setLocation] = useState("")
  const [insurance, setInsurance] = useState("basic")

  const locations = [
    { value: "airport", label: "Seychelles International Airport" },
    { value: "victoria", label: "Victoria City Center" },
    { value: "beau-vallon", label: "Beau Vallon Beach" },
    { value: "anse-royale", label: "Anse Royale" },
  ]

  const carTypes = [
    { value: "all", label: "All Car Types" },
    { value: "grand-i10", label: "Grand i10 Automatic" },
    { value: "suzuki-fronx", label: "Suzuki Fronx GLX Automatic" },
    { value: "suzuki-dzire", label: "Suzuki Dzire Automatic" },
  ]

  const times = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ]

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSearch = () => {
    // In a real application, this would navigate to search results
    console.log({
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      carType,
      location,
      insurance,
    })
  }

  return (
    <div className="booking-form-container bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#1e3a8a]">Find Your Perfect Car</h2>

      {/* Step indicators */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="flex items-center">
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 1 ? "bg-[#e94d97] text-white" : "bg-gray-200 text-gray-600"}`}
          >
            1
          </div>
          <div className={`h-1 w-8 sm:w-12 ${step > 1 ? "bg-[#e94d97]" : "bg-gray-200"}`}></div>
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 2 ? "bg-[#e94d97] text-white" : "bg-gray-200 text-gray-600"}`}
          >
            2
          </div>
          <div className={`h-1 w-8 sm:w-12 ${step > 2 ? "bg-[#e94d97]" : "bg-gray-200"}`}></div>
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 3 ? "bg-[#e94d97] text-white" : "bg-gray-200 text-gray-600"}`}
          >
            3
          </div>
        </div>
      </div>

      {/* Step 1: Dates and Times */}
      {step === 1 && (
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-800">Rental Dates & Times</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-[#e94d97]" />
                Pick-up Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]"
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
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-[#e94d97]" />
                Pick-up Time
              </label>
              <Select value={pickupTime} onValueChange={setPickupTime}>
                <SelectTrigger className="bg-white border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-[200px]">
                  {times.map((time) => (
                    <SelectItem key={time} value={time} className="rounded-lg my-1">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-[#e94d97]" />
                Return Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]"
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
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) || (pickupDate && date < pickupDate)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-[#e94d97]" />
                Return Time
              </label>
              <Select value={returnTime} onValueChange={setReturnTime}>
                <SelectTrigger className="bg-white border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-[200px]">
                  {times.map((time) => (
                    <SelectItem key={time} value={time} className="rounded-lg my-1">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Location and Vehicle */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Location & Vehicle</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-[#e94d97]" />
                Pick-up Location
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-white border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]">
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
                <SelectTrigger className="bg-white border border-gray-200 hover:border-[#e94d97] rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e94d97]/30 focus:border-[#e94d97]">
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
        </div>
      )}

      {/* Step 3: Insurance Options */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Insurance Options</h3>

          <RadioGroup value={insurance} onValueChange={setInsurance} className="space-y-4">
            <div className="flex items-center space-x-2 border p-4 rounded-xl hover:border-[#e94d97] transition-all cursor-pointer">
              <RadioGroupItem value="basic" id="basic" />
              <Label htmlFor="basic" className="flex-1 cursor-pointer">
                <div className="font-medium">Basic Insurance</div>
                <div className="text-sm text-gray-500">Covers third-party liability</div>
              </Label>
              <div className="font-medium">Included</div>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-xl hover:border-[#e94d97] transition-all cursor-pointer">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="flex-1 cursor-pointer">
                <div className="font-medium">Standard Insurance</div>
                <div className="text-sm text-gray-500">Includes collision damage waiver</div>
              </Label>
              <div className="font-medium">+SCR 200/day</div>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-xl hover:border-[#e94d97] transition-all cursor-pointer">
              <RadioGroupItem value="premium" id="premium" />
              <Label htmlFor="premium" className="flex-1 cursor-pointer">
                <div className="font-medium">Premium Insurance</div>
                <div className="text-sm text-gray-500">Full coverage with zero excess</div>
              </Label>
              <div className="font-medium">+SCR 350/day</div>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6 sm:mt-8">
        {step > 1 ? (
          <Button
            onClick={prevStep}
            variant="outline"
            className="flex items-center space-x-1 sm:space-x-2 border-[#e94d97] text-[#e94d97] hover:bg-[#e94d97]/10 text-sm sm:text-base py-1.5 sm:py-2"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Back</span>
          </Button>
        ) : (
          <div></div>
        )}

        {step < 3 ? (
          <Button onClick={nextStep} className="bg-[#e94d97] hover:bg-[#d43884] text-white flex items-center space-x-2">
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Link href="/fleet">
            <Button
              onClick={handleSearch}
              className="bg-[#e94d97] hover:bg-[#d43884] text-white flex items-center space-x-2"
            >
              <Search className="h-4 w-4 mr-2" />
              <span>Search Available Cars</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
