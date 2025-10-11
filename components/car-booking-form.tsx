"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DatePicker } from "@/components/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitBooking } from "@/app/actions/submit-booking"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CarBookingFormProps {
  preselectedVehicle?: string
}

export function CarBookingForm({ preselectedVehicle }: CarBookingFormProps) {
  // Get car from URL parameter
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)

  useEffect(() => {
    // Get URL parameters
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setSearchParams(params)

      // If car parameter exists, set it as the selected vehicle
      const carParam = params.get("car")
      if (carParam) {
        setVehicleType(carParam)
      } else if (preselectedVehicle) {
        setVehicleType(preselectedVehicle)
      }
    }
  }, [preselectedVehicle])

  const [pickupDate, setPickupDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [vehicleType, setVehicleType] = useState(preselectedVehicle || "")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    pickupTime: "",
    returnLocation: "",
    returnTime: "",
    flightNumber: "",
    hotelName: "",
    specialRequests: "",
    agreeToTerms: false,
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean
    message?: string
    bookingRef?: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }))

    if (formErrors.agreeToTerms) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.agreeToTerms
        return newErrors
      })
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}

    if (!pickupDate || !returnDate) {
      newErrors.dates = "Both pickup and return dates are required"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const bookingData = {
        pickupDate: pickupDate?.toISOString() || "",
        returnDate: returnDate?.toISOString() || "",
        vehicleType: vehicleType || "Not specified",
        ...formData,
      }

      const result = await submitBooking(bookingData)

      if (result.success) {
        setSubmitResult({
          success: true,
          message: result.message,
          bookingRef: result.bookingRef,
        })
        // Reset form on success
        setPickupDate(undefined)
        setReturnDate(undefined)
        setVehicleType(preselectedVehicle || "")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          pickupLocation: "",
          pickupTime: "",
          returnLocation: "",
          returnTime: "",
          flightNumber: "",
          hotelName: "",
          specialRequests: "",
          agreeToTerms: false,
        })
        setFormErrors({})
      } else {
        setSubmitResult({
          success: false,
          message: result.message,
        })

        if (result.errors) {
          setFormErrors(result.errors)
        }
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      {!submitResult && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#e94d97] h-2.5 rounded-full"
              style={{
                width:
                  pickupDate && returnDate
                    ? formData.firstName && formData.lastName && formData.email
                      ? "75%"
                      : "50%"
                    : "25%",
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Dates</span>
            <span>Vehicle</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </div>
      )}

      {submitResult && submitResult.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Booking Successful!</h3>
          <p className="text-green-700 mb-4">{submitResult.message}</p>
          {submitResult.bookingRef && (
            <div className="bg-white p-3 rounded-md border border-green-200 inline-block">
              <p className="text-sm text-gray-500">Your booking reference</p>
              <p className="text-xl font-bold text-[#e94d97]">{submitResult.bookingRef}</p>
            </div>
          )}
          <p className="text-sm text-green-700 mt-4">A confirmation email has been sent to your email address.</p>
        </div>
      )}

      {submitResult && !submitResult.success && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Booking Error</AlertTitle>
          <AlertDescription className="text-red-700">{submitResult.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleBookingSubmit} className="space-y-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[#1e3a8a] flex items-center">
              <div className="w-1 h-6 bg-[#e94d97] mr-2"></div>
              Rental Dates & Times
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>
                    Our office hours are 8:00 AM to 8:00 PM. For pickups outside these hours, please specify in special
                    requests.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <DatePicker
              date={pickupDate}
              setDate={setPickupDate}
              label="Pick-up Date"
              className="bg-white shadow-sm border-gray-200 hover:border-[#e94d97] transition-colors"
            />
            <DatePicker
              date={returnDate}
              setDate={setReturnDate}
              label="Return Date"
              className="bg-white shadow-sm border-gray-200 hover:border-[#e94d97] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="pickupTime" className="text-sm font-medium">
                Pick-up Time
              </label>
              <Select
                value={formData.pickupTime}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, pickupTime: value }))}
              >
                <SelectTrigger id="pickupTime">
                  <SelectValue placeholder="Select pickup time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00 AM</SelectItem>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">01:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                  <SelectItem value="17:00">05:00 PM</SelectItem>
                  <SelectItem value="18:00">06:00 PM</SelectItem>
                  <SelectItem value="19:00">07:00 PM</SelectItem>
                  <SelectItem value="20:00">08:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="returnTime" className="text-sm font-medium">
                Return Time
              </label>
              <Select
                value={formData.returnTime}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, returnTime: value }))}
              >
                <SelectTrigger id="returnTime">
                  <SelectValue placeholder="Select return time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00 AM</SelectItem>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">01:00 PM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                  <SelectItem value="17:00">05:00 PM</SelectItem>
                  <SelectItem value="18:00">06:00 PM</SelectItem>
                  <SelectItem value="19:00">07:00 PM</SelectItem>
                  <SelectItem value="20:00">08:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formErrors.dates && <p className="text-sm text-red-500 mt-2">{formErrors.dates}</p>}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#1e3a8a] flex items-center">
              <div className="w-1 h-6 bg-[#e94d97] mr-2"></div>
              Vehicle Selection
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>All vehicles include comprehensive insurance, unlimited mileage, and 24/7 roadside assistance.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Type</label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger className="h-[50px]">
                <SelectValue placeholder="Select Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grand-i10">Grand i10 (Compact) - Automatic</SelectItem>
                <SelectItem value="suzuki-fronx">Suzuki Fronx GLX (SUV) - Automatic</SelectItem>
                <SelectItem value="suzuki-dzire">Suzuki Dzire (Sedan) - Automatic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#1e3a8a] flex items-center">
              <div className="w-1 h-6 bg-[#e94d97] mr-2"></div>
              Personal Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                className={formErrors.firstName ? "border-red-300 focus:ring-red-500" : ""}
              />
              {formErrors.firstName && <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                className={formErrors.lastName ? "border-red-300 focus:ring-red-500" : ""}
              />
              {formErrors.lastName && <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? "border-red-300 focus:ring-red-500" : ""}
              />
              {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number (with country code)
              </label>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g., +44 7123 456789"
                value={formData.phone}
                onChange={handleChange}
                className={formErrors.phone ? "border-red-300 focus:ring-red-500" : ""}
              />
              {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#1e3a8a] flex items-center">
              <div className="w-1 h-6 bg-[#e94d97] mr-2"></div>
              Pickup & Return Details
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>We offer free delivery and pickup anywhere on Mahe Island.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label htmlFor="pickupLocation" className="text-sm font-medium">
                Pickup Location
              </label>
              <Select
                value={formData.pickupLocation}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, pickupLocation: value }))}
              >
                <SelectTrigger id="pickupLocation">
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airport">Seychelles International Airport (Arrival Hall)</SelectItem>
                  <SelectItem value="office">Sweet Car Hire Office (Victoria)</SelectItem>
                  <SelectItem value="beau-vallon">Beau Vallon Beach Area</SelectItem>
                  <SelectItem value="beau-vallon-savoy">Savoy Resort & Spa (Beau Vallon)</SelectItem>
                  <SelectItem value="beau-vallon-coral-strand">Coral Strand Hotel (Beau Vallon)</SelectItem>
                  <SelectItem value="beau-vallon-fishermans-cove">Fisherman's Cove Resort (Beau Vallon)</SelectItem>
                  <SelectItem value="eden-island">Eden Island</SelectItem>
                  <SelectItem value="eden-island-marina">Eden Island Marina</SelectItem>
                  <SelectItem value="anse-royale">Anse Royale</SelectItem>
                  <SelectItem value="anse-royale-fairyland">Fairyland Hotel (Anse Royale)</SelectItem>
                  <SelectItem value="baie-lazare">Baie Lazare</SelectItem>
                  <SelectItem value="baie-lazare-kempinski">Kempinski Resort (Baie Lazare)</SelectItem>
                  <SelectItem value="port-glaud">Port Glaud</SelectItem>
                  <SelectItem value="port-glaud-constance-ephelia">Constance Ephelia Resort (Port Glaud)</SelectItem>
                  <SelectItem value="grand-anse">Grand Anse</SelectItem>
                  <SelectItem value="custom">Other location (specify in special requests)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="returnLocation" className="text-sm font-medium">
                Return Location
              </label>
              <Select
                value={formData.returnLocation}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, returnLocation: value }))}
              >
                <SelectTrigger id="returnLocation">
                  <SelectValue placeholder="Select return location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same">Same as pickup location</SelectItem>
                  <SelectItem value="airport">Seychelles International Airport (Departure Area)</SelectItem>
                  <SelectItem value="office">Sweet Car Hire Office (Victoria)</SelectItem>
                  <SelectItem value="beau-vallon">Beau Vallon Beach Area</SelectItem>
                  <SelectItem value="beau-vallon-savoy">Savoy Resort & Spa (Beau Vallon)</SelectItem>
                  <SelectItem value="beau-vallon-coral-strand">Coral Strand Hotel (Beau Vallon)</SelectItem>
                  <SelectItem value="beau-vallon-fishermans-cove">Fisherman's Cove Resort (Beau Vallon)</SelectItem>
                  <SelectItem value="eden-island">Eden Island</SelectItem>
                  <SelectItem value="eden-island-marina">Eden Island Marina</SelectItem>
                  <SelectItem value="anse-royale">Anse Royale</SelectItem>
                  <SelectItem value="anse-royale-fairyland">Fairyland Hotel (Anse Royale)</SelectItem>
                  <SelectItem value="baie-lazare">Baie Lazare</SelectItem>
                  <SelectItem value="baie-lazare-kempinski">Kempinski Resort (Baie Lazare)</SelectItem>
                  <SelectItem value="port-glaud">Port Glaud</SelectItem>
                  <SelectItem value="port-glaud-constance-ephelia">Constance Ephelia Resort (Port Glaud)</SelectItem>
                  <SelectItem value="grand-anse">Grand Anse</SelectItem>
                  <SelectItem value="custom">Other location (specify in special requests)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#1e3a8a] flex items-center">
              <div className="w-1 h-6 bg-[#e94d97] mr-2"></div>
              Additional Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor="flightNumber" className="text-sm font-medium">
                Flight Number (for airport pickups)
              </label>
              <Input
                id="flightNumber"
                name="flightNumber"
                placeholder="e.g., HM054, EK705"
                value={formData.flightNumber}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="hotelName" className="text-sm font-medium">
                Hotel/Accommodation Name
              </label>
              <Input
                id="hotelName"
                name="hotelName"
                placeholder="If not selecting from the list above"
                value={formData.hotelName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="specialRequests" className="text-sm font-medium">
              Special Requests
            </label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              placeholder="Child seat, specific pickup instructions, etc."
              rows={3}
              value={formData.specialRequests}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="bg-[#f8f9fa] p-6 rounded-lg border border-gray-100">
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={formData.agreeToTerms} onCheckedChange={handleCheckboxChange} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the rental terms and conditions
              </label>
            </div>
            {formErrors.agreeToTerms && <p className="text-sm text-red-500 mt-1">{formErrors.agreeToTerms}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Important Information:</h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
              <li>A valid driver's license and passport will be required at pickup</li>
              <li>Minimum driver age: 23 years</li>
              <li>Security deposit: SCR 5,000 - 10,000 (depending on vehicle)</li>
              <li>Free delivery and pickup anywhere on Mahe Island</li>
              <li>All vehicles include comprehensive insurance and unlimited mileage</li>
              <li>Fuel policy: Full to Full (vehicle provided with full tank)</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#e94d97] hover:bg-[#d43884] text-white h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] relative overflow-hidden"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="absolute inset-0 bg-[#d43884] flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
                <span className="opacity-0">Book Your Car Now</span>
              </>
            ) : (
              "Book Your Car Now"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
