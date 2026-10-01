"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { VEHICLES, PICKUP_LOCATIONS } from "@/lib/fleet"
import { Calendar, Car, User, Shield, Check, ChevronLeft, ChevronRight, Download } from "lucide-react"
import Image from "next/image"
import { computePrice, computeRentalDays } from "@/lib/pricing"
import { useCurrency } from "@/lib/currency" // Fixed import to use correct path
import { MobileBookingSummary } from "@/components/mobile-booking-summary"
import { generateVoucherHtml } from "@/lib/voucher-template"

const carTypes = VEHICLES
const locations = PICKUP_LOCATIONS
const steps = ["Trip", "Car", "Driver", "Extras", "Review"]

function localDate(offset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function validQueryDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return ""
  const date = new Date(`${value}T12:00:00`)
  if (!Number.isFinite(date.getTime()) || value < localDate()) return ""
  const roundTrip = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  return roundTrip === value ? value : ""
}

export default function BookingFlow({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const query = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] ?? null : value ?? null
  }
  const preSelectedCar = query("car")
  const preSelectedLocation = query("location")
  const customLocationParam = query("customLocation")

  const [currentStep, setCurrentStep] = useState(0)
  const [sameReturnLocation, setSameReturnLocation] = useState(true)
  const [submissionError, setSubmissionError] = useState("")
  const [emailStatus, setEmailStatus] = useState("")
  const stepHeading = useRef<HTMLDivElement>(null)
  const pickupFromQuery = validQueryDate(query("pickupDate"))
  const returnFromQuery = validQueryDate(query("dropoffDate"))
  const initialPickup = pickupFromQuery || localDate(1)
  const initialReturn = returnFromQuery > initialPickup ? returnFromQuery : localDate(8)


  const [formData, setFormData] = useState({
    pickupDate: initialPickup,
    pickupTime: "10:00",
    dropoffDate: initialReturn > initialPickup ? initialReturn : (() => { const date = new Date(`${initialPickup}T12:00:00`); date.setDate(date.getDate() + 7); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` })(),
    dropoffTime: "10:00",
    pickupLocation: preSelectedLocation === "custom" ? "Custom Location" : locations.includes(preSelectedLocation || "") ? preSelectedLocation! : "",
    dropoffLocation: preSelectedLocation === "custom" ? "Custom Location" : locations.includes(preSelectedLocation || "") ? preSelectedLocation! : "",
    customPickupLocation: customLocationParam || "",
    customDropoffLocation: customLocationParam || "",
    carType: carTypes.some((car) => car.name === preSelectedCar) ? preSelectedCar! : "",
    driverName: "",
    driverEmail: "",
    phoneNumber: "", // Added phone number field
    whatsappNumber: "",
    useWhatsApp: false, // Added WhatsApp toggle
    country: "",
    flightNumber: "",
    childSeat: false,
    additionalDriver: false,
    agreeToTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({}) // Added errors state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  const { format: formatPrice, currency } = useCurrency()
  const selectedCar = carTypes.find((car) => car.name === formData.carType)
  const isAirportPickup = formData.pickupLocation === "SEZ Airport"
  useEffect(() => {
    if (preSelectedCar && carTypes.some((car) => car.name === preSelectedCar)) {
      console.log("[v0] Pre-selected car from URL:", preSelectedCar)
      setFormData((prev) => ({ ...prev, carType: preSelectedCar }))
      setCurrentStep(0)
    }
  }, [preSelectedCar])

  const getTodayDate = () => localDate()
  const getMinDropoffDate = () => formData.pickupDate || localDate()
  const pricing = useMemo(() => {
    const pickup = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
    const dropoff = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`)
    if (!Number.isFinite(pickup.getTime()) || !Number.isFinite(dropoff.getTime()) || dropoff <= pickup) return null
    const car = selectedCar
    const { days } = computeRentalDays(pickup, dropoff)
    if (!car) return { rentalDays: days, total: 0, lateFee: 0 }
    return computePrice({
      ratePerDay: car.dailyRate,
      pickupDate: formData.pickupDate, pickupTime: formData.pickupTime,
      dropoffDate: formData.dropoffDate, dropoffTime: formData.dropoffTime,
      childSeat: formData.childSeat, additionalDriver: formData.additionalDriver,
    })
  }, [selectedCar, formData.pickupDate, formData.pickupTime, formData.dropoffDate, formData.dropoffTime, formData.childSeat, formData.additionalDriver])
  const totalPrice = pricing?.total ?? 0
  const rentalDays = pricing?.rentalDays ?? 0
  const lateFee = pricing?.lateFee ?? 0

  useEffect(() => {
    if (currentStep > 0) stepHeading.current?.focus()
  }, [currentStep])

  const updateFormData = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({
      ...prev, [field]: value,
      ...(sameReturnLocation && field === "pickupLocation" ? { dropoffLocation: value as string } : {}),
      ...(sameReturnLocation && field === "customPickupLocation" ? { customDropoffLocation: value as string } : {}),
    }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {}
    let isValid = true

    switch (step) {
      case 0:
        if (!formData.pickupDate) {
          stepErrors.pickupDate = "Pickup date is required."
          isValid = false
        }
        if (!formData.pickupTime) {
          stepErrors.pickupTime = "Pickup time is required."
          isValid = false
        }
        if (!formData.dropoffDate) {
          stepErrors.dropoffDate = "Drop-off date is required."
          isValid = false
        } else if (!pricing || formData.pickupDate < localDate()) {
          stepErrors.dropoffDate = "Choose valid dates with return after pickup."
          isValid = false
        }
        if (!formData.dropoffTime) {
          stepErrors.dropoffTime = "Drop-off time is required."
          isValid = false
        }
        if (formData.pickupLocation === "Custom Location" && !formData.customPickupLocation) {
          stepErrors.customPickupLocation = "Please specify custom pickup location."
          isValid = false
        }
        if (formData.dropoffLocation === "Custom Location" && !formData.customDropoffLocation) {
          stepErrors.customDropoffLocation = "Please specify custom drop-off location."
          isValid = false
        }
        if (!formData.pickupLocation) {
          stepErrors.pickupLocation = "Pickup location is required."
          isValid = false
        }
        if (!formData.dropoffLocation) {
          stepErrors.dropoffLocation = "Drop-off location is required."
          isValid = false
        }
        break
      case 1:
        if (!formData.carType) {
          stepErrors.carType = "Please select a car type."
          isValid = false
        }
        break
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.driverName || formData.driverName.trim() === "") {
          stepErrors.driverName = "Driver name is required."
          isValid = false
        }
        if (!formData.driverEmail) {
          stepErrors.driverEmail = "Email address is required."
          isValid = false
        } else if (!emailRegex.test(formData.driverEmail)) {
          stepErrors.driverEmail = "Please enter a valid email address."
          isValid = false
        }
        if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
          stepErrors.phoneNumber = "Phone number is required."
          isValid = false
        }
        if (formData.useWhatsApp && (!formData.whatsappNumber || formData.whatsappNumber.trim() === "")) {
          stepErrors.whatsappNumber = "WhatsApp number is required when toggle is enabled."
          isValid = false
        }
        if (!formData.country || formData.country.trim() === "") {
          stepErrors.country = "Country is required."
          isValid = false
        }
        break
      case 3:
        break
      case 4:
        if (!formData.agreeToTerms) {
          stepErrors.agreeToTerms = "You must agree to the terms and conditions."
          isValid = false
        }
        break
      default:
        isValid = false
    }
    setErrors(stepErrors)
    return isValid
  }

  const submitBookingHandler = async () => {
    setIsSubmitting(true)
    setErrors({}) // Clear previous errors
    setSubmissionError("")

    // Final validation before submission
    for (const step of [0, 1, 2, 4]) {
      if (!validateStep(step)) {
        setCurrentStep(step)
        setSubmissionError("Please check the highlighted fields before submitting.")
        setIsSubmitting(false)
        return
      }
    }

    try {
      if (!selectedCar) {
        throw new Error("Please select a car")
      }

      const bookingPayload = {
        customerName: formData.driverName,
        customerEmail: formData.driverEmail,
        phoneNumber: formData.phoneNumber, // Added phone number to payload
        whatsappNumber: formData.useWhatsApp ? formData.whatsappNumber : formData.phoneNumber, // Use phone if WhatsApp not provided
        country: formData.country,
        flightNumber: isAirportPickup ? formData.flightNumber : "",
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        returnDate: formData.dropoffDate,
        returnTime: formData.dropoffTime,
        pickupLocation:
          formData.pickupLocation === "Custom Location" ? formData.customPickupLocation : formData.pickupLocation,
        dropoffLocation:
          formData.dropoffLocation === "Custom Location" ? formData.customDropoffLocation : formData.dropoffLocation,
        carId: selectedCar.id, // Use car ID
        carName: formData.carType,
        currency: "EUR", // Stored amounts use the base EUR price; display conversions are estimates.
        totalAmountMinor: Math.round(totalPrice * 100),
        childSeat: formData.childSeat,
        additionalDriver: formData.additionalDriver,
      }

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Failed to create booking")
      }

      const { bookingId, booking: preparedBooking } = await response.json()
      if (!bookingId || !preparedBooking) {
        throw new Error("We could not prepare your request. Please try again or contact us directly.")
      }

      const emailData = {
        bookingId: bookingId,
        bookingDate: preparedBooking.createdAt,
        customerName: formData.driverName,
        customerEmail: formData.driverEmail,
        customerPhone: formData.phoneNumber,
        flightNumber: isAirportPickup ? formData.flightNumber : "",
        whatsappNumber: formData.useWhatsApp ? formData.whatsappNumber : formData.phoneNumber,
        carId: selectedCar.id,
        carName: selectedCar.name,
        carType: selectedCar.bodyStyle,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        pickupLocation:
          formData.pickupLocation === "Custom Location" ? formData.customPickupLocation : formData.pickupLocation,
        returnDate: formData.dropoffDate,
        returnTime: formData.dropoffTime,
        returnLocation: formData.dropoffLocation === "Custom Location" ? formData.customDropoffLocation : formData.dropoffLocation,
        childSeat: formData.childSeat,
        additionalDriver: formData.additionalDriver,
        extras: [
          ...(formData.childSeat ? [{ name: "Child Seat", price: 5 }] : []),
          ...(formData.additionalDriver ? [{ name: "Additional Driver", price: 10 }] : []),
        ],
        pricing: {
          subtotal: preparedBooking.totalAmountMinor / 100,
          total: preparedBooking.totalAmountMinor / 100,
        },
      }

      try {
        const emailResponse = await fetch("/api/emails/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailData),
        })
        const emailResult = await emailResponse.json()
        if (!emailResponse.ok || !emailResult.results?.adminEmail?.sent) {
          throw new Error(emailResult.error || "We could not email your request to the team.")
        }
        setEmailStatus(emailResult.results?.customerEmail?.sent
          ? "Your request was emailed to the team, and a receipt was sent to you."
          : "Your request was emailed to the team. We could not send your email receipt; please save your reference.")
      } catch (emailError) {
        throw emailError instanceof Error ? emailError : new Error("We could not send your request by email.")
      }

      try {
        sessionStorage.setItem(`sch-request:${bookingId}`, JSON.stringify(preparedBooking))
      } catch {
        // The confirmation remains visible here, but request details won't persist after leaving this page.
      }

      setBookingReference(bookingId)
      setBookingComplete(true)
    } catch (error) {
      console.error("[v0] Booking submission error:", error)
      setSubmissionError(error instanceof Error ? error.message : "Unable to submit your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateVoucherPDF = () => {
    const pickupLocation =
      formData.pickupLocation === "Custom Location" ? formData.customPickupLocation : formData.pickupLocation
    const dropoffLocation =
      formData.dropoffLocation === "Custom Location" ? formData.customDropoffLocation : formData.dropoffLocation

    const basePricePerDay = selectedCar ? selectedCar.dailyRate : 0
    const basePrice = basePricePerDay * rentalDays
    const childSeatTotal = formData.childSeat ? 5 : 0
    const additionalDriverTotal = formData.additionalDriver ? 10 : 0
    const money = (amount: number) => formatPrice(amount)
    const voucherHTML = generateVoucherHtml({
      reference: bookingReference,
      currency,
      issuedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      customer: [
        { label: "Name", value: formData.driverName },
        { label: "Email", value: formData.driverEmail },
        { label: "Phone", value: formData.phoneNumber },
        { label: "WhatsApp", value: formData.useWhatsApp ? formData.whatsappNumber : "" },
        { label: "Country", value: formData.country },
        { label: "Flight", value: formData.flightNumber },
      ],
      rental: [
        { label: "Vehicle", value: formData.carType },
        { label: "Duration", value: `${rentalDays} day${rentalDays > 1 ? "s" : ""}` },
        { label: "Pickup", value: `${formData.pickupDate} at ${formData.pickupTime}` },
        { label: "Drop-off", value: `${formData.dropoffDate} at ${formData.dropoffTime}` },
        { label: "Pickup location", value: pickupLocation },
        { label: "Drop-off location", value: dropoffLocation },
        { label: "Currency", value: currency },
      ],
      pricing: [
        {
          label: `Car rental (${money(basePricePerDay)}/day x ${rentalDays} day${rentalDays > 1 ? "s" : ""})`,
          value: money(basePrice),
        },
        ...(lateFee > 0 ? [{ label: "Late return fee", value: money(lateFee) }] : []),
        ...(formData.childSeat ? [{ label: "Child seat", value: money(childSeatTotal) }] : []),
        ...(formData.additionalDriver ? [{ label: "Additional driver", value: money(additionalDriverTotal) }] : []),
      ],
      total: money(totalPrice),
      lateFeeNote: "Rental estimate only: insurance is excluded. Confirm availability, the final price, cover and cancellation terms with the team before accepting.",
    })

    const blob = new Blob([voucherHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Sweet-Car-Hire-Request-Summary-${bookingReference}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-navy mb-4">Request submitted</h1>
              <p className="text-gray-600 mb-6">
                Thank you for choosing Sweet Car Hire. Your request is awaiting availability confirmation. The estimate excludes insurance, and this request does not confirm a reservation.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-navy mb-2">Booking Reference</h3>
                <p className="text-2xl font-bold text-magenta">{bookingReference}</p>
              </div>
              <p role="status" className="text-sm text-navy/70 mb-6">{emailStatus}</p>
              <a href="https://wa.me/2482821182" target="_blank" rel="noopener noreferrer" className="inline-block text-magenta font-semibold mb-6">Contact us on WhatsApp</a>
              <div className="mb-5">
                <Link href={`/booking/success?bookingId=${encodeURIComponent(bookingReference)}`} className="text-sm font-semibold text-navy underline underline-offset-4">
                  View request details
                </Link>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-sm text-gray-600">
                  Our team will confirm availability and arrange payment. Your reservation is not confirmed yet.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={generateVoucherPDF}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-magenta hover:bg-magenta/90 text-white rounded-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download Request Summary
                </button>
              </div>
              <div className="mt-8 pt-6 border-t">
                <Link href="/" className="text-magenta hover:underline font-medium">
                  ← Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3">
              <Calendar className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
              Rental Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label htmlFor="booking-pickupDate" className="block text-sm font-semibold text-navy mb-2">Pickup Date</label>
                <input id="booking-pickupDate" aria-invalid={!!errors.pickupDate} aria-describedby={errors.pickupDate ? "error-pickupDate" : undefined}
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => updateFormData("pickupDate", e.target.value)}
                  min={getTodayDate()}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                />
                {errors.pickupDate && <p id="error-pickupDate" className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
              </div>
              <div>
                <label htmlFor="booking-pickupTime" className="block text-sm font-semibold text-navy mb-2">Pickup Time</label>
                <input id="booking-pickupTime" aria-invalid={!!errors.pickupTime} aria-describedby={errors.pickupTime ? "error-pickupTime" : undefined}
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => updateFormData("pickupTime", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                />
                {errors.pickupTime && <p id="error-pickupTime" className="text-red-500 text-xs mt-1">{errors.pickupTime}</p>}
              </div>
              <div>
                <label htmlFor="booking-dropoffDate" className="block text-sm font-semibold text-navy mb-2">Drop-off Date</label>
                <input id="booking-dropoffDate" aria-invalid={!!errors.dropoffDate} aria-describedby={errors.dropoffDate ? "error-dropoffDate" : undefined}
                  type="date"
                  value={formData.dropoffDate}
                  onChange={(e) => updateFormData("dropoffDate", e.target.value)}
                  min={getMinDropoffDate()}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                />
                {errors.dropoffDate && <p id="error-dropoffDate" className="text-red-500 text-xs mt-1">{errors.dropoffDate}</p>}
              </div>
              <div>
                <label htmlFor="booking-dropoffTime" className="block text-sm font-semibold text-navy mb-2">Drop-off Time</label>
                <input id="booking-dropoffTime" aria-invalid={!!errors.dropoffTime} aria-describedby={errors.dropoffTime ? "error-dropoffTime" : undefined}
                  type="time"
                  value={formData.dropoffTime}
                  onChange={(e) => updateFormData("dropoffTime", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                />
                {errors.dropoffTime && <p id="error-dropoffTime" className="text-red-500 text-xs mt-1">{errors.dropoffTime}</p>}
              </div>
              <div>
                <label htmlFor="booking-pickupLocation" className="block text-sm font-semibold text-navy mb-2">Pickup Location</label>
                <select id="booking-pickupLocation" aria-invalid={!!errors.pickupLocation} aria-describedby={errors.pickupLocation ? "error-pickupLocation" : undefined}
                  value={formData.pickupLocation}
                  onChange={(e) => {
                    updateFormData("pickupLocation", e.target.value)
                    if (e.target.value !== "SEZ Airport") updateFormData("flightNumber", "")
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                >
                  <option value="">Select pickup location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {formData.pickupLocation === "Custom Location" && (
                  <input
                    type="text"
                    aria-label="Custom pickup location"
                    placeholder="Please specify pickup location"
                    value={formData.customPickupLocation || ""}
                    onChange={(e) => updateFormData("customPickupLocation", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 mt-2 text-base text-gray-900"
                  />
                )}
                {errors.pickupLocation && <p id="error-pickupLocation" className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>}
                {errors.customPickupLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.customPickupLocation}</p>
                )}
              </div>
              {isAirportPickup && (
                <div className="md:col-span-2">
                  <label htmlFor="booking-flightNumber" className="block text-sm font-semibold text-navy mb-2">Flight number (if arriving by air)</label>
                  <input id="booking-flightNumber" type="text" value={formData.flightNumber} onChange={(e) => updateFormData("flightNumber", e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900" placeholder="e.g. EK705" />
                  <p className="mt-1 text-xs text-muted-foreground">Optional. Helps the team coordinate an airport pickup.</p>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 rounded-xl bg-cream p-4 text-sm font-semibold text-navy">
                  <input type="checkbox" checked={sameReturnLocation} onChange={(e) => {
                    setSameReturnLocation(e.target.checked)
                    if (e.target.checked) setFormData((prev) => ({ ...prev, dropoffLocation: prev.pickupLocation, customDropoffLocation: prev.customPickupLocation }))
                  }} className="w-5 h-5 accent-magenta" />
                  Return to the same location
                </label>
              </div>
              {!sameReturnLocation && <div>
                <label htmlFor="booking-dropoffLocation" className="block text-sm font-semibold text-navy mb-2">Drop-off Location</label>
                <select id="booking-dropoffLocation" aria-invalid={!!errors.dropoffLocation} aria-describedby={errors.dropoffLocation ? "error-dropoffLocation" : undefined}
                  value={formData.dropoffLocation}
                  onChange={(e) => updateFormData("dropoffLocation", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                >
                  <option value="">Select drop-off location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {formData.dropoffLocation === "Custom Location" && (
                  <input
                    type="text"
                    aria-label="Custom return location"
                    placeholder="Please specify drop-off location"
                    value={formData.customDropoffLocation || ""}
                    onChange={(e) => updateFormData("customDropoffLocation", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 mt-2 text-base text-gray-900"
                  />
                )}
                {errors.dropoffLocation && <p id="error-dropoffLocation" className="text-red-500 text-xs mt-1">{errors.dropoffLocation}</p>}
                {errors.customDropoffLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.customDropoffLocation}</p>
                )}
              </div>}
            </div>
            {rentalDays > 0 && formData.pickupDate && formData.dropoffDate && (
              <div className="bg-cream border border-border rounded-xl p-4">
                <p className="text-navy font-medium">
                  Rental Duration: {rentalDays} day{rentalDays > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        )
      case 1:
        return (
          <div className="space-y-4 md:space-y-6 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3">
              <Car className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
              Choose Your Car
              {preSelectedCar && (
                <span className="text-xs md:text-sm text-magenta font-normal">({preSelectedCar} pre-selected)</span>
              )}
            </h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {carTypes.map((car) => (
                <button
                  type="button"
                  aria-pressed={formData.carType === car.name}
                  aria-label={`Select ${car.name}`}
                  key={car.id}
                  onClick={() => updateFormData("carType", car.name)}
                  className={`border-2 rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-300 car-card cursor-pointer text-left ${formData.carType === car.name ? "border-magenta bg-magenta/5 shadow-lg selected" : "border-gray-200 hover:border-magenta/50"}`}
                >
                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="w-full">
                      <Image
                        src={car.image}
                        alt={car.name}
                        width={300}
                        height={200}
                        className="w-full h-32 md:h-40 object-contain rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="eyebrow text-muted-foreground mb-2">{car.bodyStyle}</p>
                        <h3 className="text-lg md:text-xl font-bold text-navy mb-2">{car.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {car.passengers && (
                            <span className="px-2 md:px-3 py-1 bg-cream text-navy rounded-full text-xs md:text-sm font-medium">
                              {car.passengers} seats
                            </span>
                          )}
                          {car.transmission && (
                            <span className="px-2 md:px-3 py-1 bg-cream text-navy rounded-full text-xs md:text-sm font-medium">
                              {car.transmission}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xl md:text-2xl font-bold text-magenta">
                          {formatPrice(car.dailyRate)}/day
                        </div>{" "}
                        {/* Use formatPrice */}
                        {formData.carType === car.name && (
                          <div className="w-5 md:w-6 h-5 md:h-6 bg-magenta rounded-full flex items-center justify-center">
                            <Check className="w-3 md:w-4 h-3 md:h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Need space for luggage or a child seat? Ask us to confirm the fit. Availability is confirmed after your request.</p>
            {errors.carType && <p id="error-carType" className="text-red-500 text-xs mt-1">{errors.carType}</p>}
          </div>
        )
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3 mb-6">
                <User className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
                Driver Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="booking-driverName" className="block text-sm font-semibold text-navy mb-2">Full Name *</label>
                  <input id="booking-driverName" aria-invalid={!!errors.driverName} aria-describedby={errors.driverName ? "error-driverName" : undefined} autoComplete="name"
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={(e) => updateFormData("driverName", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                    placeholder="Enter your full name"
                  />
                  {errors.driverName && <p id="error-driverName" className="text-red-500 text-xs mt-1">{errors.driverName}</p>}
                </div>
                <div>
                  <label htmlFor="booking-driverEmail" className="block text-sm font-semibold text-navy mb-2">Email Address *</label>
                  <input id="booking-driverEmail" aria-invalid={!!errors.driverEmail} aria-describedby={errors.driverEmail ? "error-driverEmail" : undefined} autoComplete="email"
                    type="email"
                    required
                    value={formData.driverEmail}
                    onChange={(e) => updateFormData("driverEmail", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                    placeholder="your@email.com"
                  />
                  {errors.driverEmail && <p id="error-driverEmail" className="text-red-500 text-xs mt-1">{errors.driverEmail}</p>}
                </div>
                <div>
                  <label htmlFor="booking-phoneNumber" className="block text-sm font-semibold text-navy mb-2">Phone Number *</label>
                  <input id="booking-phoneNumber" aria-invalid={!!errors.phoneNumber} aria-describedby={errors.phoneNumber ? "error-phoneNumber" : undefined} autoComplete="tel"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                    placeholder="+248 xxx xxxx"
                  />
                  {errors.phoneNumber && <p id="error-phoneNumber" className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">WhatsApp Number (Optional)</label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      aria-pressed={formData.useWhatsApp}
                      onClick={() => updateFormData("useWhatsApp", !formData.useWhatsApp)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.useWhatsApp
                          ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span className="text-sm font-semibold">
                        {formData.useWhatsApp ? "WhatsApp Enabled ✓" : "Add WhatsApp Number?"}
                      </span>
                    </button>
                    {formData.useWhatsApp && (
                      <input
                        type="tel"
                        aria-label="WhatsApp number"
                        value={formData.whatsappNumber}
                        onChange={(e) => updateFormData("whatsappNumber", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                        placeholder="+248 xxx xxxx"
                        required={formData.useWhatsApp}
                      />
                    )}
                    {errors.whatsappNumber && <p id="error-whatsappNumber" className="text-red-500 text-xs mt-1">{errors.whatsappNumber}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="booking-country" className="block text-sm font-semibold text-navy mb-2">Country *</label>
                  <input id="booking-country" aria-invalid={!!errors.country} aria-describedby={errors.country ? "error-country" : undefined} autoComplete="country-name"
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => updateFormData("country", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                    placeholder="Your country"
                  />
                  {errors.country && <p id="error-country" className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3 mb-6">
                <Shield className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
                Extras
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={formData.childSeat}
                    onChange={(e) => updateFormData("childSeat", e.target.checked)}
                    className="w-5 h-5 text-magenta rounded focus:ring-magenta"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-navy">Child Seat</div>
                    <div className="text-sm text-gray-600">Safety first for your little ones</div>
                  </div>
                  <div className="font-bold text-magenta">{formatPrice(5)} one-time</div> {/* Use formatPrice */}
                </label>
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={formData.additionalDriver}
                    onChange={(e) => updateFormData("additionalDriver", e.target.checked)}
                    className="w-5 h-5 text-magenta rounded focus:ring-magenta"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-navy">Additional Driver</div>
                    <div className="text-sm text-gray-600">Add another authorized driver</div>
                  </div>
                  <div className="font-bold text-magenta">{formatPrice(10)} one-time</div> {/* Use formatPrice */}
                </label>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Requirements:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>Review your request and confirm the current price and terms with the team before accepting the quote. <Link href="/policies" className="underline">Read booking information</Link>.</li>
              </ul>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3">
              <Check className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
              Review your request
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-navy">Trip & vehicle</h3><div className="flex gap-4 text-sm"><button onClick={() => setCurrentStep(0)} className="text-magenta font-semibold">Edit trip</button><button onClick={() => setCurrentStep(1)} className="text-magenta font-semibold">Edit car</button></div></div>
              <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                <div>
                  <span className="font-semibold">Pickup:</span> {formData.pickupDate} at {formData.pickupTime}
                </div>
                <div>
                  <span className="font-semibold">Drop-off:</span> {formData.dropoffDate} at {formData.dropoffTime}
                </div>
                <div>
                  <span className="font-semibold">Pickup Location:</span>{" "}
                  {formData.pickupLocation === "Custom Location"
                    ? formData.customPickupLocation
                    : formData.pickupLocation}
                </div>
                <div>
                  <span className="font-semibold">Drop-off Location:</span>{" "}
                  {formData.dropoffLocation === "Custom Location"
                    ? formData.customDropoffLocation
                    : formData.dropoffLocation}
                </div>
                <div>
                  <span className="font-semibold">Car:</span> {formData.carType}
                </div>
                <div>
                  <span className="font-semibold">Duration:</span> {rentalDays} day{rentalDays > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-navy">Driver details</h3><button onClick={() => setCurrentStep(2)} className="text-magenta text-sm font-semibold">Edit driver</button></div>
              <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                <div>
                  <span className="font-semibold">Name:</span> {formData.driverName}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {formData.driverEmail}
                </div>
                <div>
                  <span className="font-semibold">Phone:</span> {formData.phoneNumber}
                  {formData.useWhatsApp && <span className="block mt-2">WhatsApp: {formData.whatsappNumber}</span>}
                </div>
                <div>
                  <span className="font-semibold">Country:</span> {formData.country}
                </div>
                {isAirportPickup && formData.flightNumber && (
                  <div>
                    <span className="font-semibold">Flight:</span> {formData.flightNumber}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-cream p-4"><div><h3 className="font-semibold text-navy">Extras</h3><p className="text-sm text-muted-foreground">{[formData.childSeat && "Child seat", formData.additionalDriver && "Additional driver"].filter(Boolean).join(", ") || "No extras selected"}</p></div><button onClick={() => setCurrentStep(3)} className="text-magenta text-sm font-semibold">Edit extras</button></div>
            <div className="border-t pt-6">
              <label className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => updateFormData("agreeToTerms", e.target.checked)}
                  className="w-5 h-5 text-magenta rounded focus:ring-magenta mt-1"
                />
                <div className="text-sm md:text-base text-gray-600">
                  I understand this form sends a booking request, not a confirmed reservation. The team will confirm availability, final price, insurance and cancellation terms before the booking is confirmed.
                </div>
              </label>
              {errors.agreeToTerms && <p id="error-agreeToTerms" className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
            </div>

            <button
              onClick={submitBookingHandler}
              disabled={!formData.agreeToTerms || isSubmitting}
              className="w-full bg-magenta hover:bg-magenta/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg md:text-xl"
            >
              {isSubmitting ? "Submitting request..." : "Submit booking request"}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                <strong>What happens next:</strong> Submitting this request does not confirm a reservation or collect payment or a deposit. The team will confirm availability, final price, and whether a deposit is required; any amount and payment method will be provided for you to review before accepting.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="booking-shell min-h-screen bg-cream pb-24 lg:pb-12">
      <header className="border-b border-border bg-white"><div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between"><Link href="/" aria-label="Sweet Car Hire home"><Image src="/logo.png" alt="Sweet Car Hire" width={128} height={80} className="h-12 w-auto" /></Link><Link href="/" className="text-sm font-semibold text-navy">Back to home</Link></div></header>
      <div className="container mx-auto px-4 md:px-4 py-4 md:py-8 max-w-7xl">
        <div className="text-center mb-6 md:mb-8">
          <p className="eyebrow text-magenta mb-3">Your island trip</p>
          <h1 className="display-heading text-4xl md:text-5xl text-navy mb-4">Make it a sweet escape.</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-2">
            Choose your trip, car and extras. Our team will confirm availability.
            {preSelectedCar && <span className="block text-magenta font-semibold mt-2">{preSelectedCar} selected</span>}
            {preSelectedLocation && (
              <span className="block text-blue-600 font-semibold mt-1">
                {preSelectedLocation === "custom"
                  ? `Custom location: ${customLocationParam}`
                  : `Location: ${preSelectedLocation}`}{" "}
                pre-selected
              </span>
            )}
          </p>
        </div>
        <div className="flex justify-center mb-6 md:mb-8 px-4">
          <div className="grid grid-cols-5 gap-2 w-full max-w-xl bg-white rounded-2xl border border-border p-3">
            {steps.map((step, index) => (
              <div key={step} aria-current={index === currentStep ? "step" : undefined} className="flex flex-col items-center gap-2 min-w-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${index <= currentStep ? "bg-magenta text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  <span aria-hidden="true">{index < currentStep ? <Check className="w-4 h-4" /> : index + 1}</span><span className="sr-only">{step}{index === currentStep ? ", current step" : index < currentStep ? ", completed" : ""}</span>
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium transition-all duration-300 ${index <= currentStep ? "text-navy" : "text-gray-400"}`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-border shadow-sm p-5 md:p-8">
              <div ref={stepHeading} tabIndex={-1} className="outline-none"><p className="eyebrow text-muted-foreground mb-6">Step {currentStep + 1} of {steps.length} · {steps[currentStep]}</p></div>
              {submissionError && <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-4 mb-5">{submissionError}</p>}
              {renderStepContent()}

              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                {currentStep < steps.length - 1 && (
                  <button
                    onClick={() => {
                      if (validateStep(currentStep)) {
                        nextStep()
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-magenta hover:bg-magenta/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Pricing Summary */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-3xl shadow-sm p-6 border border-border">
              <h3 className="font-display text-xl font-bold text-navy mb-4">Estimated rental charges</h3>
              {!formData.carType && <p className="text-sm text-muted-foreground mb-5">Choose a car to see your rental estimate.</p>}
              {formData.pickupDate && <p className="text-sm text-muted-foreground mb-5">{formData.pickupDate} → {formData.dropoffDate}<br />{formData.pickupLocation || "Choose a pickup location"}</p>}
              {formData.carType && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>{formData.carType}</span>
                    <span>{formatPrice(selectedCar?.dailyRate || 0)}/day</span>{" "}
                    {/* Use formatPrice */}
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>
                      {formatPrice(selectedCar?.dailyRate || 0)}/day ×{" "}
                      {rentalDays} {/* Use formatPrice */}
                      day
                      {rentalDays > 1 ? "s" : ""}
                    </span>
                    <span>
                      {formatPrice((selectedCar?.dailyRate || 0) * rentalDays)}{" "}
                      {/* Use formatPrice */}
                    </span>
                  </div>
                </div>
              )}
              {(formData.childSeat || formData.additionalDriver) && (
                <div className="space-y-2 mb-6 pb-4 border-b">
                  <h4 className="font-semibold text-navy">Extras:</h4>
                  {formData.childSeat && (
                    <div className="flex justify-between text-sm md:text-base">
                      <span>Child Seat (one-time fee)</span>
                      <span>{formatPrice(5)}</span> {/* Use formatPrice */}
                    </div>
                  )}
                  {formData.additionalDriver && (
                    <div className="flex justify-between text-sm md:text-base">
                      <span>Additional Driver (one-time fee)</span>
                      <span>{formatPrice(10)}</span> {/* Use formatPrice */}
                    </div>
                  )}
                </div>
              )}
              {lateFee > 0 && (
                <div className="mb-4 pb-4 border-b">
                  <div className="flex justify-between text-sm md:text-base text-amber-600">
                    <span>Late Return Fee</span>
                    <span>{formatPrice(lateFee)}</span> {/* Use formatPrice */}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Dropoff time is after pickup time on final day</p>
                </div>
              )}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totalPrice - (lateFee || 0))}</span> {/* Use formatPrice */}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Each started 24-hour period counts as a rental day. Extras are charged once. This estimate uses base EUR rental rates and excludes insurance. Any available cover, its cost and terms are confirmed by the team. Converted amounts are estimates.</p>
              <div className="flex justify-between text-lg md:text-xl font-bold text-navy pt-4 border-t">
                <span>Rental estimate:</span>
                <span>{formData.carType ? formatPrice(totalPrice) : "—"}</span> {/* Use formatPrice */}
              </div>
              {lateFee > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    * Late return fee ({formatPrice(lateFee)}) applies if returning after pickup time on final day. This
                    fee is paid separately upon return.
                  </p>
                </div>
              )}
              <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>Availability, insurance and cancellation terms are confirmed by the team before your request becomes a reservation. <Link href="/policies" className="underline">Read current booking information</Link></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>Insurance coverage, excess and any premium are confirmed in your written quote.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>Submitting a request does not confirm a reservation or take payment.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileBookingSummary
        carType={formData.carType}
        dailyRate={selectedCar?.dailyRate || 0}
        rentalDays={rentalDays}
        childSeat={formData.childSeat}
        additionalDriver={formData.additionalDriver}
        lateFee={lateFee}
        totalPrice={totalPrice}
        formatPrice={formatPrice}
      />
    </div>
  )
}
