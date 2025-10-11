"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Search, Car, User, CheckCircle, FileCheck } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

type FormData = {
  pickupDate?: Date
  returnDate?: Date
  pickupTime: string
  returnTime: string
  vehicleType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  pickupLocation: string
  returnLocation: string
  flightNumber: string
  hotelName: string
  specialRequests: string
  agreeToTerms: boolean
}

const STEPS = [
  {
    id: 1,
    title: "Dates",
    subtitle: "When do you need the car?",
    icon: CalendarIcon,
  },
  {
    id: 2,
    title: "Location",
    subtitle: "Where and what type of car?",
    icon: Car,
  },
  {
    id: 3,
    title: "Your Details",
    subtitle: "Tell us about yourself",
    icon: User,
  },
  {
    id: 4,
    title: "Confirm",
    subtitle: "Review and confirm",
    icon: CheckCircle,
  },
]

export function EnhancedBookingForm() {
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLDivElement>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    pickupTime: "10:00",
    returnTime: "10:00",
    vehicleType: searchParams.get("car") || "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupLocation: "airport",
    returnLocation: "same",
    flightNumber: "",
    hotelName: "",
    specialRequests: "",
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof FormData, boolean>>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bookingRef, setBookingRef] = useState("")

  // Generate time options
  const timeOptions = Array.from({ length: 26 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = (i % 2) * 30
    if (hour > 20) return null
    const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    return { value: timeString, label: timeString }
  }).filter(Boolean) as { value: string; label: string }[]

  const locations = [
    { value: "airport", label: "🛬 Seychelles Airport" },
    { value: "victoria", label: "🏙️ Victoria City" },
    { value: "beau-vallon", label: "🏖️ Beau Vallon" },
    { value: "praslin-jetty", label: "⛵ Praslin Jetty" },
    { value: "ladigue-jetty", label: "🚢 La Digue Jetty" },
    { value: "hotel-delivery", label: "🏨 Hotel Delivery" },
  ]

  const carTypes = [
    { value: "grand-i10", label: "Hyundai Grand i10", price: "€35/day" },
    { value: "suzuki-fronx", label: "Suzuki Fronx GLX", price: "€45/day" },
    { value: "suzuki-dzire", label: "Suzuki Dzire", price: "€40/day" },
    { value: "kia-picanto", label: "Kia Picanto", price: "€30/day" },
    { value: "suzuki-swift", label: "Suzuki Swift", price: "€35/day" },
    { value: "suzuki-jimny", label: "Suzuki Jimny", price: "€50/day" },
  ]

  useEffect(() => {
    const carParam = searchParams.get("car")
    if (carParam) {
      setFormData((prev) => ({ ...prev, vehicleType: carParam }))
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)
    }
  }, [searchParams])

  const validateField = (name: keyof FormData, value: any): string | undefined => {
    switch (name) {
      case "pickupDate":
        return !value ? "Pick-up date is required" : undefined
      case "returnDate":
        if (!value) return "Return date is required"
        if (formData.pickupDate && value < formData.pickupDate) {
          return "Return date cannot be before pick-up date"
        }
        return undefined
      case "pickupTime":
      case "returnTime":
        return !value ? "Time is required" : undefined
      case "vehicleType":
        return !value ? "Please select a vehicle" : undefined
      case "pickupLocation":
      case "returnLocation":
        return !value ? "Location is required" : undefined
      case "firstName":
      case "lastName":
        return !value?.trim() ? `${name === "firstName" ? "First" : "Last"} name is required` : undefined
      case "email":
        if (!value?.trim()) return "Email is required"
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email address"
        return undefined
      case "phone":
        return !value?.trim() ? "Phone number is required" : undefined
      case "agreeToTerms":
        return currentStep === 4 && !value ? "You must agree to the terms" : undefined
      default:
        return undefined
    }
  }

  const validateStep = (stepId: number): boolean => {
    const fieldsToValidate = {
      1: ["pickupDate", "returnDate", "pickupTime", "returnTime"],
      2: ["pickupLocation", "returnLocation", "vehicleType"],
      3: ["firstName", "lastName", "email", "phone"],
      4: ["agreeToTerms"],
    }[stepId] as (keyof FormData)[]

    let isValid = true
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field])
      setErrors((prev) => ({ ...prev, [field]: error }))
      setTouchedFields((prev) => ({ ...prev, [field]: true }))
      if (error) isValid = false
    })
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    const newValue = type === "checkbox" ? checked : value

    setFormData((prev) => ({ ...prev, [name]: newValue }))

    if (touchedFields[name as keyof FormData]) {
      const error = validateField(name as keyof FormData, newValue)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touchedFields[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleDateChange = (name: "pickupDate" | "returnDate", date?: Date) => {
    setFormData((prev) => ({ ...prev, [name]: date }))

    if (touchedFields[name]) {
      const error = validateField(name, date)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleNativeDateChange = (name: "pickupDate" | "returnDate", value: string) => {
    const date = value ? new Date(value) : undefined
    handleDateChange(name, date)
  }

  const handleBlur = (name: keyof FormData) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(4)) {
      // Generate a booking reference
      const ref = `SCH-${Math.floor(100000 + Math.random() * 900000)}`
      setBookingRef(ref)
      setIsSubmitted(true)
    }
  }

  const resetForm = () => {
    setFormData({
      pickupTime: "10:00",
      returnTime: "10:00",
      vehicleType: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pickupLocation: "airport",
      returnLocation: "same",
      flightNumber: "",
      hotelName: "",
      specialRequests: "",
      agreeToTerms: false,
    })
    setErrors({})
    setTouchedFields({})
    setCurrentStep(1)
    setIsSubmitted(false)
    setBookingRef("")
  }

  const progress = (currentStep / STEPS.length) * 100

  // Get car name from vehicle type
  const getCarName = () => {
    const car = carTypes.find((c) => c.value === formData.vehicleType)
    return car ? car.label : "Selected vehicle"
  }

  // Get location name from location value
  const getLocationName = (value: string) => {
    if (value === "same") return "Same as pick-up location"
    const location = locations.find((l) => l.value === value)
    return location ? location.label : value
  }

  // Calculate rental duration in days
  const getRentalDuration = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0
    const diffTime = Math.abs(formData.returnDate.getTime() - formData.pickupDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div ref={formRef} className="w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto mb-16">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center bg-gradient-to-r from-[#e94d97] to-[#d43884]">
          <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">Book Your Dream Car</h1>
          <p className="text-sm text-white/90">
            Experience the beauty of Seychelles with our premium car rental service.
          </p>
        </div>

        {!isSubmitted ? (
          <>
            {/* Progress Steps */}
            <div className="px-6 py-4 bg-gray-50/80">
              <div className="flex justify-between items-center mb-4">
                {STEPS.map((step) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all",
                          isCompleted && "bg-green-500 text-white",
                          isActive && "bg-[#e94d97] text-white",
                          !isActive && !isCompleted && "bg-gray-300 text-gray-600",
                        )}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <p className="text-sm mt-2 text-center max-w-[60px] text-gray-700 font-medium">{step.title}</p>
                    </div>
                  )
                })}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-[#e94d97] to-[#d43884] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Form Content - Fixed Height */}
            <div className="p-6 h-[380px] overflow-y-auto">
              {/* Step 1: Dates & Times */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Dates & Times</h2>
                    <p className="text-sm text-gray-600">When do you need the car?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Pick-up Date *</Label>
                      <Input
                        type="date"
                        value={formData.pickupDate ? format(formData.pickupDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => handleNativeDateChange("pickupDate", e.target.value)}
                        onBlur={() => handleBlur("pickupDate")}
                        className={cn(
                          "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                          errors.pickupDate && touchedFields.pickupDate && "border-red-500",
                        )}
                        min={format(new Date(), "yyyy-MM-dd")}
                      />
                      {errors.pickupDate && touchedFields.pickupDate && (
                        <p className="text-sm text-red-500">{errors.pickupDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Pick-up Time *</Label>
                      <Select
                        value={formData.pickupTime}
                        onValueChange={(value) => handleSelectChange("pickupTime", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                            errors.pickupTime && touchedFields.pickupTime && "border-red-500",
                          )}
                          onBlur={() => handleBlur("pickupTime")}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.pickupTime && touchedFields.pickupTime && (
                        <p className="text-sm text-red-500">{errors.pickupTime}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Return Date *</Label>
                      <Input
                        type="date"
                        value={formData.returnDate ? format(formData.returnDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => handleNativeDateChange("returnDate", e.target.value)}
                        onBlur={() => handleBlur("returnDate")}
                        className={cn(
                          "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                          errors.returnDate && touchedFields.returnDate && "border-red-500",
                        )}
                        min={
                          formData.pickupDate
                            ? format(formData.pickupDate, "yyyy-MM-dd")
                            : format(new Date(), "yyyy-MM-dd")
                        }
                      />
                      {errors.returnDate && touchedFields.returnDate && (
                        <p className="text-sm text-red-500">{errors.returnDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Return Time *</Label>
                      <Select
                        value={formData.returnTime}
                        onValueChange={(value) => handleSelectChange("returnTime", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                            errors.returnTime && touchedFields.returnTime && "border-red-500",
                          )}
                          onBlur={() => handleBlur("returnTime")}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.returnTime && touchedFields.returnTime && (
                        <p className="text-sm text-red-500">{errors.returnTime}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location & Vehicle */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Location & Vehicle</h2>
                    <p className="text-sm text-gray-600">Where and what type of car?</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Pick-up Location *</Label>
                      <Select
                        value={formData.pickupLocation}
                        onValueChange={(value) => handleSelectChange("pickupLocation", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                            errors.pickupLocation && touchedFields.pickupLocation && "border-red-500",
                          )}
                          onBlur={() => handleBlur("pickupLocation")}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.value} value={location.value}>
                              {location.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.pickupLocation && touchedFields.pickupLocation && (
                        <p className="text-sm text-red-500">{errors.pickupLocation}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Return Location *</Label>
                      <Select
                        value={formData.returnLocation}
                        onValueChange={(value) => handleSelectChange("returnLocation", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                            errors.returnLocation && touchedFields.returnLocation && "border-red-500",
                          )}
                          onBlur={() => handleBlur("returnLocation")}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same">📍 Same as pick-up</SelectItem>
                          {locations.map((location) => (
                            <SelectItem key={location.value} value={location.value}>
                              {location.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.returnLocation && touchedFields.returnLocation && (
                        <p className="text-sm text-red-500">{errors.returnLocation}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Vehicle Type *</Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value) => handleSelectChange("vehicleType", value)}
                      >
                        <SelectTrigger
                          className={cn(
                            "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                            errors.vehicleType && touchedFields.vehicleType && "border-red-500",
                          )}
                          onBlur={() => handleBlur("vehicleType")}
                        >
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {carTypes.map((car) => (
                            <SelectItem key={car.value} value={car.value}>
                              <div className="flex justify-between items-center w-full">
                                <span>{car.label}</span>
                                <span className="text-[#e94d97] font-medium ml-2">{car.price}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.vehicleType && touchedFields.vehicleType && (
                        <p className="text-sm text-red-500">{errors.vehicleType}</p>
                      )}
                    </div>

                    {formData.pickupLocation === "hotel-delivery" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Hotel Details</Label>
                        <Input
                          name="hotelName"
                          value={formData.hotelName}
                          onChange={handleInputChange}
                          placeholder="Hotel name and room number"
                          className="h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Personal Details */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>
                    <p className="text-sm text-gray-600">Tell us about yourself</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">First Name *</Label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("firstName")}
                          placeholder="John"
                          className={cn(
                            "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                            errors.firstName && touchedFields.firstName && "border-red-500",
                          )}
                        />
                        {errors.firstName && touchedFields.firstName && (
                          <p className="text-sm text-red-500">{errors.firstName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Last Name *</Label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("lastName")}
                          placeholder="Doe"
                          className={cn(
                            "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                            errors.lastName && touchedFields.lastName && "border-red-500",
                          )}
                        />
                        {errors.lastName && touchedFields.lastName && (
                          <p className="text-sm text-red-500">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Email Address *</Label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("email")}
                        placeholder="you@example.com"
                        className={cn(
                          "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                          errors.email && touchedFields.email && "border-red-500",
                        )}
                      />
                      {errors.email && touchedFields.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Phone Number *</Label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("phone")}
                        placeholder="+248 123 4567"
                        className={cn(
                          "h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97] focus:ring-[#e94d97]/20",
                          errors.phone && touchedFields.phone && "border-red-500",
                        )}
                      />
                      {errors.phone && touchedFields.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Confirm Booking</h2>
                    <p className="text-sm text-gray-600">Review and confirm</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Flight Number (Optional)</Label>
                      <Input
                        name="flightNumber"
                        value={formData.flightNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., EK705"
                        className="h-11 text-sm rounded-lg border-gray-300 focus:border-[#e94d97]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Special Requests (Optional)</Label>
                      <Textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Child seat, GPS, etc."
                        className="text-sm rounded-lg border-gray-300 focus:border-[#e94d97] min-h-[80px]"
                      />
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <Checkbox
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => {
                          setFormData((prev) => ({ ...prev, agreeToTerms: Boolean(checked) }))
                          if (touchedFields.agreeToTerms) {
                            const error = validateField("agreeToTerms", Boolean(checked))
                            setErrors((prev) => ({ ...prev, agreeToTerms: error }))
                          }
                        }}
                        onBlur={() => handleBlur("agreeToTerms")}
                        className={cn(
                          "mt-1 border-[#e94d97] data-[state=checked]:bg-[#e94d97]",
                          errors.agreeToTerms && touchedFields.agreeToTerms && "border-red-500",
                        )}
                      />
                      <div className="space-y-2">
                        <Label
                          htmlFor="agreeToTerms"
                          className={cn(
                            "text-sm cursor-pointer font-medium",
                            errors.agreeToTerms && touchedFields.agreeToTerms && "text-red-500",
                          )}
                        >
                          I agree to the rental terms and conditions *
                        </Label>
                        <p className="text-sm text-gray-600">
                          By checking this box, you agree to our{" "}
                          <Link href="/policies" className="text-[#e94d97] hover:underline font-medium" target="_blank">
                            terms
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-[#e94d97] hover:underline font-medium" target="_blank">
                            privacy policy
                          </Link>
                          .
                        </p>
                        {errors.agreeToTerms && touchedFields.agreeToTerms && (
                          <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50/50">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="h-11 px-6 text-sm rounded-lg border-gray-300 hover:border-[#e94d97] font-medium"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={nextStep}
                  className="h-11 px-8 text-sm bg-[#e94d97] hover:bg-[#d43884] text-white rounded-lg shadow-md font-medium"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="h-11 px-8 text-sm bg-[#e94d97] hover:bg-[#d43884] text-white rounded-lg shadow-md font-medium"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Confirm
                </Button>
              )}
            </div>
          </>
        ) : (
          // Booking Confirmation Page
          <div className="flex flex-col">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
              <p className="text-sm text-gray-600 mb-2">
                Thank you for choosing Sweet Car Hire. Your booking has been received.
              </p>
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-gray-700">Booking Reference</p>
                <p className="text-lg font-bold text-[#e94d97]">{bookingRef}</p>
              </div>
            </div>

            <div className="px-6 pb-6 flex-grow overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-[#e94d97]" />
                    Rental Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pick-up Date:</span>
                      <span className="font-medium">
                        {formData.pickupDate ? format(formData.pickupDate, "dd MMM yyyy") : ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pick-up Time:</span>
                      <span className="font-medium">{formData.pickupTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Return Date:</span>
                      <span className="font-medium">
                        {formData.returnDate ? format(formData.returnDate, "dd MMM yyyy") : ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Return Time:</span>
                      <span className="font-medium">{formData.returnTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{getRentalDuration()} days</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Car className="w-4 h-4 mr-2 text-[#e94d97]" />
                    Vehicle & Location
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">{getCarName()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pick-up Location:</span>
                      <span className="font-medium">{getLocationName(formData.pickupLocation)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Return Location:</span>
                      <span className="font-medium">{getLocationName(formData.returnLocation)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2 text-[#e94d97]" />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50/50">
              <p className="text-xs text-gray-500 text-center mb-4">
                A confirmation email has been sent to {formData.email}. Please check your inbox.
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={resetForm}
                  className="h-11 px-8 text-sm bg-[#e94d97] hover:bg-[#d43884] text-white rounded-lg shadow-md font-medium"
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
