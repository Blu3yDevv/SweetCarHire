"use client"

import { useState, useEffect } from "react"
import { Calendar, Car, User, Shield, Check, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import Image from "next/image"
import { useSearchParams } from 'next/navigation'
import { computePrice, type BookingInput as PricingInput, type BookingPrice } from "@/lib/pricing"

interface BookingData {
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
  pickupLocation: string
  dropoffLocation: string
  customPickupLocation?: string
  customDropoffLocation?: string
  carType: string
  driverName: string
  driverEmail: string
  whatsappNumber: string
  country: string
  flightNumber: string
  childSeat: boolean
  additionalDriver: boolean
  insuranceUpgrade: boolean
  agreeToTerms: boolean
}

const locations = [
  "SEZ Airport",
  "Victoria",
  "Beau Vallon",
  "Eden Island",
  "Anse Royale",
  "Baie Lazare",
  "Anse Intendance",
  "Port Launay",
  "Custom Location",
]

const carTypes = [
  {
    name: "Suzuki Fronx",
    price: 60,
    image: "/images/fronx2.png",
    features: ["5 Seats", "Automatic", "A/C", "Compact SUV"],
  },
  {
    name: "Suzuki Dzire",
    price: 45,
    image: "/images/dzire2.png",
    features: ["5 Seats", "Automatic", "A/C", "Sedan"],
  },
]

const steps = ["Details", "Car", "Extras", "Review"]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const preSelectedCar = searchParams.get("car")
  const preSelectedLocation = searchParams.get("location")
  const customLocationParam = searchParams.get("customLocation")

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [bookingData, setBookingData] = useState<BookingData>({
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    pickupLocation: preSelectedLocation === "custom" ? "Custom Location" : preSelectedLocation || "",
    dropoffLocation: preSelectedLocation === "custom" ? "Custom Location" : preSelectedLocation || "",
    customPickupLocation: customLocationParam || "",
    customDropoffLocation: customLocationParam || "",
    carType: preSelectedCar || "",
    driverName: "",
    driverEmail: "",
    whatsappNumber: "",
    country: "",
    flightNumber: "",
    childSeat: false,
    additionalDriver: false,
    insuranceUpgrade: false,
    agreeToTerms: false,
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [rentalDays, setRentalDays] = useState(1)
  const [pricingBreakdown, setPricingBreakdown] = useState<BookingPrice | null>(null)

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getMinDropoffDate = () => {
    if (!bookingData.pickupDate) return getTodayDate()
    const pickup = new Date(bookingData.pickupDate)
    pickup.setDate(pickup.getDate() + 1)
    return pickup.toISOString().split("T")[0]
  }

  useEffect(() => {
    if (preSelectedCar && carTypes.some((car) => car.name === preSelectedCar)) {
      setCurrentStep(0)
    }
  }, [preSelectedCar])

  useEffect(() => {
    if (bookingData.pickupDate && bookingData.pickupTime && bookingData.dropoffDate && bookingData.dropoffTime) {
      try {
        const pickupDateTime = new Date(`${bookingData.pickupDate}T${bookingData.pickupTime}`)
        const dropoffDateTime = new Date(`${bookingData.dropoffDate}T${bookingData.dropoffTime}`)

        if (dropoffDateTime <= pickupDateTime) {
          console.log("[v0] Drop-off time is not after pickup time, skipping calculation")
          return
        }
        // </CHANGE>

        const timeDiffMs = dropoffDateTime.getTime() - pickupDateTime.getTime()
        const hoursDiff = timeDiffMs / (1000 * 60 * 60)

        // Same-day (< 24 hours) = 1 day, otherwise ceil(hours/24)
        const days = Math.max(1, Math.ceil(hoursDiff / 24))

        console.log("[v0] Duration calculation:", {
          pickup: pickupDateTime.toISOString(),
          dropoff: dropoffDateTime.toISOString(),
          hoursDiff: hoursDiff.toFixed(2),
          calculatedDays: days,
        })

        setRentalDays(days)
      } catch (error) {
        console.error("[v0] Date calculation error:", error)
      }
    }
  }, [bookingData.pickupDate, bookingData.pickupTime, bookingData.dropoffDate, bookingData.dropoffTime])

  useEffect(() => {
    if (
      !bookingData.pickupDate ||
      !bookingData.pickupTime ||
      !bookingData.dropoffDate ||
      !bookingData.dropoffTime ||
      !bookingData.carType
    ) {
      return
    }

    const selectedCar = carTypes.find((car) => car.name === bookingData.carType)
    if (!selectedCar) return

    const pickupDateTime = new Date(`${bookingData.pickupDate}T${bookingData.pickupTime}`)
    const dropoffDateTime = new Date(`${bookingData.dropoffDate}T${bookingData.dropoffTime}`)
    
    if (dropoffDateTime <= pickupDateTime) {
      console.log("[v0] Drop-off time is not after pickup time, skipping pricing calculation")
      return
    }
    // </CHANGE>

    const pricingInput: PricingInput = {
      ratePerDay: selectedCar.price,
      pickupDate: bookingData.pickupDate,
      pickupTime: bookingData.pickupTime,
      dropoffDate: bookingData.dropoffDate,
      dropoffTime: bookingData.dropoffTime,
      childSeat: bookingData.childSeat,
      additionalDriver: bookingData.additionalDriver,
      childSeatPerDay: 5,
      additionalDriverPerDay: 10,
      vatRate: 0.15,
    }

    const pricing = computePrice(pricingInput)

    console.log("[v0] Pricing calculation:", pricing)

    setRentalDays(pricing.rentalDays)
    setPricingBreakdown(pricing)
    setTotalPrice(pricing.total)
  }, [
    bookingData.pickupDate,
    bookingData.pickupTime,
    bookingData.dropoffDate,
    bookingData.dropoffTime,
    bookingData.carType,
    bookingData.childSeat,
    bookingData.additionalDriver,
  ])

  const updateBookingData = (field: keyof BookingData, value: any) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
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

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        const pickupLocationValid = bookingData.pickupLocation !== "Custom Location" || bookingData.customPickupLocation
        const dropoffLocationValid =
          bookingData.dropoffLocation !== "Custom Location" || bookingData.customDropoffLocation
        return (
          bookingData.pickupDate &&
          bookingData.pickupTime &&
          bookingData.dropoffDate &&
          bookingData.dropoffTime &&
          pickupLocationValid &&
          dropoffLocationValid
        )
      case 1:
        return bookingData.carType
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const isValidEmail = emailRegex.test(bookingData.driverEmail)
        return (
          bookingData.driverName &&
          bookingData.driverEmail &&
          isValidEmail &&
          bookingData.whatsappNumber &&
          bookingData.country
        )
      case 3:
        return bookingData.agreeToTerms
      default:
        return false
    }
  }

  const submitBookingHandler = async () => {
    setIsSubmitting(true)

    try {
      const selectedCar = carTypes.find((car) => car.name === bookingData.carType)
      if (!selectedCar) {
        throw new Error("Please select a car")
      }

      const bookingPayload = {
        customerName: bookingData.driverName,
        customerEmail: bookingData.driverEmail,
        whatsappNumber: bookingData.whatsappNumber,
        country: bookingData.country,
        flightNumber: bookingData.flightNumber,
        pickupDate: bookingData.pickupDate,
        pickupTime: bookingData.pickupTime,
        returnDate: bookingData.dropoffDate,
        returnTime: bookingData.dropoffTime,
        pickupLocation:
          bookingData.pickupLocation === "Custom Location"
            ? bookingData.customPickupLocation
            : bookingData.pickupLocation,
        dropoffLocation:
          bookingData.dropoffLocation === "Custom Location"
            ? bookingData.customDropoffLocation
            : bookingData.dropoffLocation,
        carId: bookingData.carType,
        carName: bookingData.carType,
        currency: "EUR",
        totalAmountMinor: Math.round(totalPrice * 100),
        childSeat: bookingData.childSeat,
        additionalDriver: bookingData.additionalDriver,
      }

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const { bookingId, booking } = await response.json()

      console.log("[v0] Booking created:", bookingId)

      try {
        await fetch("/api/emails/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...booking,
            rentalDays: pricingBreakdown?.rentalDays,
            subtotal: pricingBreakdown?.subtotal,
            vat: pricingBreakdown?.vat,
            total: pricingBreakdown?.total,
          }),
        })
      } catch (emailError) {
        console.error("[v0] Failed to send confirmation emails:", emailError)
        // Don't fail the booking if email fails
      }

      setBookingReference(bookingId)
      setBookingComplete(true)
    } catch (error) {
      console.error("[v0] Booking submission error:", error)
      alert(
        error instanceof Error
          ? error.message
          : "There was an error submitting your booking. Please try again or contact us directly via WhatsApp: +248 2821182",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateVoucherPDF = () => {
    const selectedCar = carTypes.find((car) => car.name === bookingData.carType)
    const pickupLocation =
      bookingData.pickupLocation === "Custom Location" ? bookingData.customPickupLocation : bookingData.pickupLocation
    const dropoffLocation =
      bookingData.dropoffLocation === "Custom Location"
        ? bookingData.customDropoffLocation
        : bookingData.dropoffLocation

    const breakdown = pricingBreakdown!
    const basePricePerDay = selectedCar ? selectedCar.price : 0
    const basePrice = basePricePerDay * breakdown.rentalDays
    const childSeatTotal = bookingData.childSeat ? 5 * breakdown.rentalDays : 0
    const additionalDriverTotal = bookingData.additionalDriver ? 10 * breakdown.rentalDays : 0

    const voucherHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sweet Car Hire - Booking Voucher</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
    .header { text-align: center; border-bottom: 3px solid #e91e63; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #e91e63; margin-bottom: 10px; }
    .voucher-title { font-size: 24px; color: #1a365d; margin-bottom: 5px; }
    .reference { font-size: 18px; color: #e91e63; font-weight: bold; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: bold; color: #1a365d; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .info-item { margin-bottom: 8px; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .pricing { background: #f8f9fa; padding: 15px; border-radius: 8px; }
    .pricing-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .total { font-size: 20px; font-weight: bold; color: #e91e63; border-top: 2px solid #e91e63; padding-top: 10px; margin-top: 10px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    .important { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin-top: 20px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🚗 SWEET CAR HIRE</div>
    <div class="voucher-title">BOOKING CONFIRMATION</div>
    <div class="reference">Reference: ${bookingReference}</div>
    <div style="color:#666;margin-top:10px">Issued: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</div>
  </div>

  <div class="section">
    <div class="section-title">Customer Details</div>
    <div class="info-grid">
      <div class="info-item"><span class="label">Name:</span> <span class="value">${bookingData.driverName}</span></div>
      <div class="info-item"><span class="label">Email:</span> <span class="value">${bookingData.driverEmail}</span></div>
      <div class="info-item"><span class="label">WhatsApp:</span> <span class="value">${bookingData.whatsappNumber}</span></div>
      <div class="info-item"><span class="label">Country:</span> <span class="value">${bookingData.country}</span></div>
      ${bookingData.flightNumber ? `<div class="info-item"><span class="label">Flight:</span> <span class="value">${bookingData.flightNumber}</span></div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Rental Details</div>
    <div class="info-grid">
      <div class="info-item"><span class="label">Vehicle:</span> <span class="value">${bookingData.carType}</span></div>
      <div class="info-item"><span class="label">Duration:</span> <span class="value">${breakdown.rentalDays} day${breakdown.rentalDays > 1 ? "s" : ""}</span></div>
      <div class="info-item"><span class="label">Pickup:</span> <span class="value">${bookingData.pickupDate} at ${bookingData.pickupTime}</span></div>
      <div class="info-item"><span class="label">Drop-off:</span> <span class="value">${bookingData.dropoffDate} at ${bookingData.dropoffTime}</span></div>
      <div class="info-item"><span class="label">Pickup Location:</span> <span class="value">${pickupLocation}</span></div>
      <div class="info-item"><span class="label">Drop-off Location:</span> <span class="value">${dropoffLocation}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Pricing Breakdown</div>
    <div class="pricing">
      <div class="pricing-row">
        <span>Car Rental (€${basePricePerDay}/day × ${breakdown.rentalDays} day${breakdown.rentalDays > 1 ? "s" : ""})</span>
        <span>€${basePrice}</span>
      </div>
      ${bookingData.childSeat ? `<div class="pricing-row"><span>Child Seat (€5/day × ${breakdown.rentalDays} day${breakdown.rentalDays > 1 ? "s" : ""})</span><span>€${childSeatTotal}</span></div>` : ""}
      ${bookingData.additionalDriver ? `<div class="pricing-row"><span>Additional Driver (€10/day × ${breakdown.rentalDays} day${breakdown.rentalDays > 1 ? "s" : ""})</span><span>€${additionalDriverTotal}</span></div>` : ""}
      <div class="pricing-row" style="border-top:1px solid #ddd;padding-top:8px;margin-top:8px;">
        <span>Subtotal</span>
        <span>€${breakdown.subtotal}</span>
      </div>
      <div class="pricing-row">
        <span>VAT (15%)</span>
        <span>€${breakdown.vat}</span>
      </div>
      <div class="pricing-row total">
        <span>TOTAL AMOUNT</span>
        <span>€${breakdown.total}</span>
      </div>
    </div>
  </div>

  <div class="important">
    <strong>✅ Your booking has been confirmed!</strong>
    <p style="margin:10px 0 0 0;">Our team will contact you within 24 hours to arrange payment and finalize details. If you have any questions, please contact us via WhatsApp: +248 2821182</p>
  </div>

  <div class="footer">
    <p><strong>Sweet Car Hire</strong></p>
    <p>WhatsApp: +248 2821182 | Email: info@sweetcarhire.com</p>
    <p>Mahé, Seychelles</p>
  </div>
</body>
</html>`

    const newWindow = window.open("", "_blank")
    if (newWindow) {
      newWindow.document.write(voucherHTML)
      newWindow.document.close()
      newWindow.onload = () => {
        newWindow.print()
      }
    }
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
              <h1 className="text-3xl font-bold text-navy mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for choosing Sweet Car Hire. Your booking has been submitted successfully.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-navy mb-2">Booking Reference</h3>
                <p className="text-2xl font-bold text-magenta">{bookingReference}</p>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-sm text-gray-600">
                  Our team will contact you within 24 hours to confirm your booking and arrange payment.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={generateVoucherPDF}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-magenta hover:bg-magenta/90 text-white rounded-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Voucher
                </button>
              </div>
              <div className="mt-8 pt-6 border-t">
                <a href="/" className="text-magenta hover:underline font-medium">
                  ← Return to Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-16 md:pt-24">
      <div className="container mx-auto px-4 md:px-4 py-4 md:py-8 max-w-7xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-navy mb-2 md:mb-4">Complete Your Booking</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-2">
            Book your perfect car rental in Seychelles with our simple 4-step process
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
          <div className="flex items-center gap-2 md:gap-4 bg-white/80 backdrop-blur-md rounded-full px-4 md:px-6 py-3 shadow-lg">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${index <= currentStep ? "bg-magenta text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium transition-all duration-300 hidden sm:inline ${index <= currentStep ? "text-navy" : "text-gray-400"}`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 ml-2 md:ml-4" />}
              </div>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8">
              {currentStep === 0 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3">
                    <Calendar className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
                    Rental Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Pickup Date</label>
                      <input
                        type="date"
                        value={bookingData.pickupDate}
                        onChange={(e) => updateBookingData("pickupDate", e.target.value)}
                        min={getTodayDate()}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Pickup Time</label>
                      <input
                        type="time"
                        value={bookingData.pickupTime}
                        onChange={(e) => updateBookingData("pickupTime", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Drop-off Date</label>
                      <input
                        type="date"
                        value={bookingData.dropoffDate}
                        onChange={(e) => updateBookingData("dropoffDate", e.target.value)}
                        min={getMinDropoffDate()}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Drop-off Time</label>
                      <input
                        type="time"
                        value={bookingData.dropoffTime}
                        onChange={(e) => updateBookingData("dropoffTime", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Pickup Location</label>
                      <select
                        value={bookingData.pickupLocation}
                        onChange={(e) => updateBookingData("pickupLocation", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                      >
                        <option value="">Select pickup location</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                      {bookingData.pickupLocation === "Custom Location" && (
                        <input
                          type="text"
                          placeholder="Please specify pickup location"
                          value={bookingData.customPickupLocation || ""}
                          onChange={(e) => updateBookingData("customPickupLocation", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 mt-2 text-base text-gray-900"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Drop-off Location</label>
                      <select
                        value={bookingData.dropoffLocation}
                        onChange={(e) => updateBookingData("dropoffLocation", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                      >
                        <option value="">Select drop-off location</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                      {bookingData.dropoffLocation === "Custom Location" && (
                        <input
                          type="text"
                          placeholder="Please specify drop-off location"
                          value={bookingData.customDropoffLocation || ""}
                          onChange={(e) => updateBookingData("customDropoffLocation", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 mt-2 text-base text-gray-900"
                        />
                      )}
                    </div>
                  </div>
                  {rentalDays > 0 && bookingData.pickupDate && bookingData.dropoffDate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-blue-800 font-medium">
                        Rental Duration: {rentalDays} day{rentalDays > 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {currentStep === 1 && (
                <div className="space-y-4 md:space-y-6 animate-fade-in">
                  <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3">
                    <Car className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
                    Choose Your Car
                    {preSelectedCar && (
                      <span className="text-xs md:text-sm text-magenta font-normal">
                        ({preSelectedCar} pre-selected)
                      </span>
                    )}
                  </h2>
                  <div className="grid gap-4 md:gap-6">
                    {carTypes.map((car) => (
                      <div
                        key={car.name}
                        onClick={() => updateBookingData("carType", car.name)}
                        className={`border-2 rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-300 car-card ${bookingData.carType === car.name ? "border-magenta bg-magenta/5 shadow-lg selected" : "border-gray-200 hover:border-magenta/50"}`}
                      >
                        <div className="flex flex-col gap-4 md:gap-6">
                          <div className="w-full">
                            <Image
                              src={car.image || "/placeholder.svg"}
                              alt={car.name}
                              width={300}
                              height={200}
                              className="w-full h-32 md:h-40 object-contain rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <h3 className="text-lg md:text-xl font-bold text-navy mb-2">{car.name}</h3>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {car.features.map((feature) => (
                                  <span
                                    key={feature}
                                    className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-xl md:text-2xl font-bold text-magenta">€{car.price}/day</div>
                              {bookingData.carType === car.name && (
                                <div className="w-5 md:w-6 h-5 md:h-6 bg-magenta rounded-full flex items-center justify-center">
                                  <Check className="w-3 md:w-4 h-3 md:h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3 mb-6">
                      <User className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
                      Driver Details
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={bookingData.driverName}
                          onChange={(e) => updateBookingData("driverName", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={bookingData.driverEmail}
                          onChange={(e) => updateBookingData("driverEmail", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                          placeholder="your@email.com"
                        />
                        {bookingData.driverEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.driverEmail) && (
                          <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          value={bookingData.whatsappNumber}
                          onChange={(e) => updateBookingData("whatsappNumber", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                          placeholder="+248 xxx xxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">Country *</label>
                        <input
                          type="text"
                          required
                          value={bookingData.country}
                          onChange={(e) => updateBookingData("country", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                          placeholder="Your country"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-navy mb-2">Flight Number (Optional)</label>
                        <input
                          type="text"
                          value={bookingData.flightNumber}
                          onChange={(e) => updateBookingData("flightNumber", e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                          placeholder="e.g., EK123"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3 mb-6">
                      <Shield className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
                      Extras
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300">
                        <input
                          type="checkbox"
                          checked={bookingData.childSeat}
                          onChange={(e) => updateBookingData("childSeat", e.target.checked)}
                          className="w-5 h-5 text-magenta rounded focus:ring-magenta"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-navy">Child Seat</div>
                          <div className="text-sm text-gray-600">Safety first for your little ones</div>
                        </div>
                        <div className="font-bold text-magenta">€5/day</div>
                      </label>
                      <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300">
                        <input
                          type="checkbox"
                          checked={bookingData.additionalDriver}
                          onChange={(e) => updateBookingData("additionalDriver", e.target.checked)}
                          className="w-5 h-5 text-magenta rounded focus:ring-magenta"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-navy">Additional Driver</div>
                          <div className="text-sm text-gray-600">Add another authorized driver</div>
                        </div>
                        <div className="font-bold text-magenta">€10/day</div>
                      </label>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Requirements:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>Minimum driver age: 20 years</li>
                      <li>Valid driving license required</li>
                    </ul>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3">
                    <Check className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
                    Review & Confirm
                  </h2>

                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-navy mb-3">Booking Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                      <div>
                        <span className="font-semibold">Pickup:</span> {bookingData.pickupDate} at{" "}
                        {bookingData.pickupTime}
                      </div>
                      <div>
                        <span className="font-semibold">Drop-off:</span> {bookingData.dropoffDate} at{" "}
                        {bookingData.dropoffTime}
                      </div>
                      <div>
                        <span className="font-semibold">Pickup Location:</span>{" "}
                        {bookingData.pickupLocation === "Custom Location"
                          ? bookingData.customPickupLocation
                          : bookingData.pickupLocation}
                      </div>
                      <div>
                        <span className="font-semibold">Drop-off Location:</span>{" "}
                        {bookingData.dropoffLocation === "Custom Location"
                          ? bookingData.customDropoffLocation
                          : bookingData.dropoffLocation}
                      </div>
                      <div>
                        <span className="font-semibold">Car:</span> {bookingData.carType}
                      </div>
                      <div>
                        <span className="font-semibold">Duration:</span> {rentalDays} day{rentalDays > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-navy mb-3">Customer Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                      <div>
                        <span className="font-semibold">Name:</span> {bookingData.driverName}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span> {bookingData.driverEmail}
                      </div>
                      <div>
                        <span className="font-semibold">WhatsApp:</span> {bookingData.whatsappNumber}
                      </div>
                      <div>
                        <span className="font-semibold">Country:</span> {bookingData.country}
                      </div>
                      {bookingData.flightNumber && (
                        <div>
                          <span className="font-semibold">Flight:</span> {bookingData.flightNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <label className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={bookingData.agreeToTerms}
                        onChange={(e) => updateBookingData("agreeToTerms", e.target.checked)}
                        className="w-5 h-5 text-magenta rounded focus:ring-magenta mt-1"
                      />
                      <div className="text-sm md:text-base text-gray-600">
                        I agree to the{" "}
                        <a href="/policies" className="text-magenta hover:underline">
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/policies" className="text-magenta hover:underline ml-1">
                          Privacy Policy
                        </a>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={submitBookingHandler}
                    disabled={!bookingData.agreeToTerms || isSubmitting}
                    className="w-full bg-magenta hover:bg-magenta/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg md:text-xl"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Payment:</strong> Our team will contact you within 24 hours to arrange payment details and
                      finalize your booking.
                    </p>
                  </div>
                </div>
              )}

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
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-3 bg-magenta hover:bg-magenta/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-20 md:top-24 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl p-6 border border-white/30 price-summary">
              <h3 className="text-lg md:text-xl font-bold text-navy mb-4">Booking Summary</h3>
              {bookingData.carType && pricingBreakdown && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>{bookingData.carType}</span>
                    <span>€{carTypes.find((c) => c.name === bookingData.carType)?.price}/day</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>
                      €{carTypes.find((c) => c.name === bookingData.carType)?.price}/day × {pricingBreakdown.rentalDays}{" "}
                      day
                      {pricingBreakdown.rentalDays > 1 ? "s" : ""}
                    </span>
                    <span>
                      €
                      {(carTypes.find((c) => c.name === bookingData.carType)?.price || 0) * pricingBreakdown.rentalDays}
                    </span>
                  </div>
                </div>
              )}
              {(bookingData.childSeat || bookingData.additionalDriver) && pricingBreakdown && (
                <div className="space-y-2 mb-6 pb-4 border-b">
                  <h4 className="font-semibold text-navy">Extras:</h4>
                  {bookingData.childSeat && (
                    <div className="flex justify-between text-sm md:text-base">
                      <span>Child Seat (€5/day × {pricingBreakdown.rentalDays})</span>
                      <span>€{5 * pricingBreakdown.rentalDays}</span>
                    </div>
                  )}
                  {bookingData.additionalDriver && (
                    <div className="flex justify-between text-sm md:text-base">
                      <span>Additional Driver (€10/day × {pricingBreakdown.rentalDays})</span>
                      <span>€{10 * pricingBreakdown.rentalDays}</span>
                    </div>
                  )}
                </div>
              )}
              {pricingBreakdown && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between font-semibold">
                    <span>Subtotal:</span>
                    <span>€{pricingBreakdown.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>VAT (15%):</span>
                    <span>€{pricingBreakdown.vat}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between text-lg md:text-xl font-bold text-magenta pt-4 border-t">
                <span>Total:</span>
                <span>€{totalPrice}</span>
              </div>
              <div className="mt-4 text-xs md:text-sm text-gray-500 text-center">VAT (15%) added at checkout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
