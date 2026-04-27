"use client"

import { useState, useEffect } from "react"
import { Calendar, Car, User, Shield, Check, ChevronLeft, ChevronRight, Download } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { computePrice, type BookingInput as PricingInput } from "@/lib/pricing"
import { useCurrency } from "@/lib/currency" // Fixed import to use correct path
import { MobileBookingSummary } from "@/components/mobile-booking-summary"

const carTypes = [
  { id: "suzuki-dzire", name: "Suzuki Dzire", dailyRate: 45, passengers: 4, transmission: "Automatic" },
  { id: "suzuki-fronx", name: "Suzuki Fronx", dailyRate: 60, passengers: 4, transmission: "Automatic" },
]

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

// Removed redundant carTypes definition from here

const steps = ["Details", "Car", "Extras", "Review"]

// Define initial state for form using a reducer for better state management
const initialState = {
  pickupDate: "",
  pickupTime: "",
  dropoffDate: "",
  dropoffTime: "",
  pickupLocation: "",
  dropoffLocation: "",
  customPickupLocation: "",
  customDropoffLocation: "",
  carType: "",
  driverName: "",
  driverEmail: "",
  phoneNumber: "", // Added mandatory phone number
  whatsappNumber: "", // Now optional
  useWhatsApp: false, // Toggle for WhatsApp
  country: "",
  flightNumber: "",
  childSeat: false,
  additionalDriver: false,
  insuranceUpgrade: false,
  agreeToTerms: false,
}

function formReducer(state: typeof initialState, action: { type: string; payload: any }) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, ...action.payload }
    case "RESET_FORM":
      return initialState
    default:
      return state
  }
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const preSelectedCar = searchParams.get("car")
  const preSelectedLocation = searchParams.get("location")
  const customLocationParam = searchParams.get("customLocation")

  const [currentStep, setCurrentStep] = useState(0)

  const getDefaultPickupDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const getDefaultDropoffDate = () => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 8)
    return nextWeek.toISOString().split("T")[0]
  }

  const [formData, setFormData] = useState({
    pickupDate: getDefaultPickupDate(),
    pickupTime: "10:00",
    dropoffDate: getDefaultDropoffDate(),
    dropoffTime: "10:00",
    pickupLocation: preSelectedLocation === "custom" ? "Custom Location" : preSelectedLocation || "",
    dropoffLocation: preSelectedLocation === "custom" ? "Custom Location" : preSelectedLocation || "",
    customPickupLocation: customLocationParam || "",
    customDropoffLocation: customLocationParam || "",
    carType: preSelectedCar || "",
    driverName: "",
    driverEmail: "",
    phoneNumber: "", // Added phone number field
    whatsappNumber: "",
    useWhatsApp: false, // Added WhatsApp toggle
    country: "",
    flightNumber: "",
    childSeat: false,
    additionalDriver: false,
    insuranceUpgrade: false,
    agreeToTerms: false,
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [rentalDays, setRentalDays] = useState(1)
  const [lateFee, setLateFee] = useState(0) // Added lateFee state
  const [errors, setErrors] = useState<Record<string, string>>({}) // Added errors state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  const { format: formatPrice, currency } = useCurrency()
  const [, setForceUpdate] = useState(0)

  useEffect(() => {
    const handleCurrencyChange = () => {
      setForceUpdate((prev) => prev + 1)
    }

    window.addEventListener("currency-changed", handleCurrencyChange)
    return () => window.removeEventListener("currency-changed", handleCurrencyChange)
  }, [])

  useEffect(() => {
    if (preSelectedCar && carTypes.some((car) => car.name === preSelectedCar)) {
      setFormData((prev) => ({ ...prev, carType: preSelectedCar }))
      setCurrentStep(0)
    }
  }, [preSelectedCar])

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getMinDropoffDate = () => {
    if (!formData.pickupDate) return getTodayDate()
    const pickup = new Date(formData.pickupDate)
    pickup.setDate(pickup.getDate() + 1)
    return pickup.toISOString().split("T")[0]
  }

  // Calculate rental days from dates alone (before car is selected)
  useEffect(() => {
    if (formData.pickupDate && formData.pickupTime && formData.dropoffDate && formData.dropoffTime) {
      try {
        const pickupDT = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
        const dropoffDT = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`)
        if (dropoffDT > pickupDT) {
          const hours = (dropoffDT.getTime() - pickupDT.getTime()) / (1000 * 60 * 60)
          setRentalDays(Math.max(1, Math.floor(hours / 24)))
        }
      } catch {}
    }
  }, [formData.pickupDate, formData.pickupTime, formData.dropoffDate, formData.dropoffTime])

  useEffect(() => {
    const selectedCar = carTypes.find((car) => car.name === formData.carType)
    if (!selectedCar) return

    const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`)
    const dropoffDateTime = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`)

    if (dropoffDateTime <= pickupDateTime) {
      return
    }

    const pricingInput: PricingInput = {
      ratePerDay: selectedCar.dailyRate,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      dropoffDate: formData.dropoffDate,
      dropoffTime: formData.dropoffTime,
      childSeat: formData.childSeat,
      additionalDriver: formData.additionalDriver,
    }

    const pricing = computePrice(pricingInput)

    setRentalDays(pricing.rentalDays)
    setLateFee(pricing.lateFee) // Set lateFee state
    setTotalPrice(pricing.total)
  }, [
    formData.carType,
    formData.pickupDate,
    formData.pickupTime,
    formData.dropoffDate,
    formData.dropoffTime,
    formData.childSeat,
    formData.additionalDriver,
  ])

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        const pickupLocationValid = formData.pickupLocation !== "Custom Location" || formData.customPickupLocation
        const dropoffLocationValid = formData.dropoffLocation !== "Custom Location" || formData.customDropoffLocation
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
        } else if (formData.dropoffDate < getMinDropoffDate()) {
          stepErrors.dropoffDate = "Drop-off date must be at least one day after pickup date."
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

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        const pickupLocationValid = formData.pickupLocation !== "Custom Location" || formData.customPickupLocation
        const dropoffLocationValid = formData.dropoffLocation !== "Custom Location" || formData.customDropoffLocation
        return (
          formData.pickupDate &&
          formData.pickupTime &&
          formData.dropoffDate &&
          formData.dropoffTime &&
          pickupLocationValid &&
          dropoffLocationValid &&
          formData.pickupLocation &&
          formData.dropoffLocation
        )
      case 1:
        return formData.carType
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const isValidEmail = emailRegex.test(formData.driverEmail)
        const hasRequiredFields =
          formData.driverName &&
          formData.driverName.trim() !== "" &&
          formData.driverEmail &&
          isValidEmail &&
          formData.phoneNumber &&
          formData.phoneNumber.trim() !== "" &&
          formData.country &&
          formData.country.trim() !== ""

        // If WhatsApp toggle is on, require WhatsApp number
        if (formData.useWhatsApp) {
          return hasRequiredFields && formData.whatsappNumber && formData.whatsappNumber.trim() !== ""
        }

        return hasRequiredFields
      case 3:
        return formData.agreeToTerms
      default:
        return false
    }
  }

  const submitBookingHandler = async () => {
    setIsSubmitting(true)
    setErrors({}) // Clear previous errors

    // Final validation before submission
    if (!canProceed()) {
      alert("Please complete all required fields for the current step.")
      setIsSubmitting(false)
      return
    }

    try {
      const selectedCar = carTypes.find((car) => car.name === formData.carType)
      if (!selectedCar) {
        throw new Error("Please select a car")
      }

      const bookingPayload = {
        customerName: formData.driverName,
        customerEmail: formData.driverEmail,
        phoneNumber: formData.phoneNumber, // Added phone number to payload
        whatsappNumber: formData.useWhatsApp ? formData.whatsappNumber : formData.phoneNumber, // Use phone if WhatsApp not provided
        country: formData.country,
        flightNumber: formData.flightNumber,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        dropoffDate: formData.dropoffDate,
        dropoffTime: formData.dropoffTime,
        pickupLocation:
          formData.pickupLocation === "Custom Location" ? formData.customPickupLocation : formData.pickupLocation,
        dropoffLocation:
          formData.dropoffLocation === "Custom Location" ? formData.customDropoffLocation : formData.dropoffLocation,
        carId: selectedCar.id, // Use car ID
        carName: formData.carType,
        currency: currency, // Use dynamic currency
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
        throw new Error(errorData.message || "Failed to create booking")
      }

      const { bookingId, booking } = await response.json()

      console.log("[v0] Booking created:", bookingId)

      const emailData = {
        bookingId: bookingId,
        bookingDate: new Date().toISOString(),
        customerName: formData.driverName,
        customerEmail: formData.driverEmail,
        customerPhone: formData.phoneNumber, // Changed from phoneNumber to customerPhone
        whatsappNumber: formData.useWhatsApp ? formData.whatsappNumber : "", // Added WhatsApp number
        carName: formData.carType,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        pickupLocation:
          formData.pickupLocation === "Custom Location" ? formData.customPickupLocation : formData.pickupLocation,
        returnDate: formData.dropoffDate,
        returnTime: formData.dropoffTime,
        returnLocation:
          formData.dropoffLocation === "Custom Location" ? formData.customDropoffLocation : formData.dropoffLocation, // Changed from dropoffLocation to returnLocation
        extras: [
          ...(formData.childSeat ? [{ name: "Child Seat", price: 5 }] : []),
          ...(formData.additionalDriver ? [{ name: "Additional Driver", price: 10 }] : []),
        ],
        pricing: {
          subtotal: totalPrice,
          total: totalPrice,
        },
      }

      try {
        await fetch("/api/emails/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: bookingId, // Added missing bookingId
            ...emailData, // Use the structured emailData
            rentalDays: rentalDays, // Use rentalDays state
            // Subtotal and total are already in emailData.pricing
            lateFee: lateFee, // Added lateFee to email payload
            currency: currency,
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
    const selectedCar = carTypes.find((car) => car.name === formData.carType)
    const pickupLocation =
      formData.pickupLocation === "Custom Location" ? formData.customPickupLocation : formData.pickupLocation
    const dropoffLocation =
      formData.dropoffLocation === "Custom Location" ? formData.customDropoffLocation : formData.dropoffLocation

    // Always recompute from source of truth so voucher numbers are consistent
    const pricing = selectedCar
      ? computePrice({
          ratePerDay: selectedCar.dailyRate,
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime,
          dropoffDate: formData.dropoffDate,
          dropoffTime: formData.dropoffTime,
          childSeat: formData.childSeat,
          additionalDriver: formData.additionalDriver,
        })
      : null

    const basePricePerDay = selectedCar ? selectedCar.dailyRate : 0
    const computedDays = pricing ? pricing.rentalDays : rentalDays
    const basePrice = pricing ? pricing.basePrice : basePricePerDay * computedDays
    const childSeatTotal = pricing ? pricing.childSeatFee : 0
    const additionalDriverTotal = pricing ? pricing.additionalDriverFee : 0
    const computedTotal = pricing ? pricing.total : totalPrice
    const computedLateFee = pricing ? pricing.lateFee : lateFee

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
      <div class="info-item"><span class="label">Name:</span> <span class="value">${formData.driverName}</span></div>
      <div class="info-item"><span class="label">Email:</span> <span class="value">${formData.driverEmail}</span></div>
      <div class="info-item"><span class="label">WhatsApp:</span> <span class="value">${formData.whatsappNumber}</span></div>
      <div class="info-item"><span class="label">Country:</span> <span class="value">${formData.country}</span></div>
      ${formData.flightNumber ? `<div class="info-item"><span class="label">Flight:</span> <span class="value">${formData.flightNumber}</span></div>` : ""}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Rental Details</div>
    <div class="info-grid">
      <div class="info-item"><span class="label">Vehicle:</span> <span class="value">${formData.carType}</span></div>
      <div class="info-item"><span class="label">Duration:</span> <span class="value">${computedDays} day${computedDays > 1 ? "s" : ""}</span></div>
      <div class="info-item"><span class="label">Pickup:</span> <span class="value">${formData.pickupDate} at ${formData.pickupTime}</span></div>
      <div class="info-item"><span class="label">Drop-off:</span> <span class="value">${formData.dropoffDate} at ${formData.dropoffTime}</span></div>
      <div class="info-item"><span class="label">Pickup Location:</span> <span class="value">${pickupLocation}</span></div>
      <div class="info-item"><span class="label">Drop-off Location:</span> <span class="value">${dropoffLocation}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Pricing Breakdown</div>
    <div class="pricing">
      <div class="pricing-row">
        <span>Car Rental (€${basePricePerDay}/day × ${computedDays} day${computedDays > 1 ? "s" : ""})</span>
        <span>€${basePrice.toFixed(2)}</span>
      </div>
      ${formData.childSeat ? `<div class="pricing-row"><span>Child Seat (selected extra)</span><span>€${childSeatTotal.toFixed(2)}</span></div>` : ""}
      ${formData.additionalDriver ? `<div class="pricing-row"><span>Additional Driver (selected extra)</span><span>€${additionalDriverTotal.toFixed(2)}</span></div>` : ""}
      <div class="pricing-row total">
        <span>TOTAL AMOUNT</span>
        <span>€${computedTotal.toFixed(2)}</span>
      </div>
    </div>

  ${computedLateFee > 0 ? `<div class="important" style="background-color: #fef3c7; border-left: 4px solid #d97706;">
    <strong>Late Drop-off Fee Notice</strong>
    <p style="margin:10px 0 0 0;">If you return the car after your agreed pickup time (${formData.pickupTime}) on the final day, an additional fee of €${computedLateFee.toFixed(2)} may be charged.</p>
  </div>` : ""}

  <div class="important">
    <strong>✅ Your booking has been confirmed!</strong>
    <p style="margin:10px 0 0 0;">Our team will contact you within 24 hours to arrange payment and finalize details. If you have any questions, please contact us via WhatsApp: +248 2821182</p>
  </div>

  <div class="footer">
    <p><strong>Sweet Car Hire - Seychelles</strong></p>
    <p>Premium Car Rental Services</p>
    <p>Please present this voucher and your valid driver's license at pickup.</p>
  </div>
</body>
</html>`

    const blob = new Blob([voucherHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Sweet-Car-Hire-Voucher-${bookingReference}.html`
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
                <label className="block text-sm font-semibold text-navy mb-2">Pickup Date</label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => updateFormData("pickupDate", e.target.value)}
                  min={getTodayDate()}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                />
                {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Pickup Time</label>
                <input
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => updateFormData("pickupTime", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                />
                {errors.pickupTime && <p className="text-red-500 text-xs mt-1">{errors.pickupTime}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Drop-off Date</label>
                <input
                  type="date"
                  value={formData.dropoffDate}
                  onChange={(e) => updateFormData("dropoffDate", e.target.value)}
                  min={getMinDropoffDate()}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                />
                {errors.dropoffDate && <p className="text-red-500 text-xs mt-1">{errors.dropoffDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Drop-off Time</label>
                <input
                  type="time"
                  value={formData.dropoffTime}
                  onChange={(e) => updateFormData("dropoffTime", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                />
                {errors.dropoffTime && <p className="text-red-500 text-xs mt-1">{errors.dropoffTime}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Pickup Location</label>
                <select
                  value={formData.pickupLocation}
                  onChange={(e) => updateFormData("pickupLocation", e.target.value)}
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
                    placeholder="Please specify pickup location"
                    value={formData.customPickupLocation || ""}
                    onChange={(e) => updateFormData("customPickupLocation", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 mt-2 text-base text-gray-900"
                  />
                )}
                {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>}
                {errors.customPickupLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.customPickupLocation}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Drop-off Location</label>
                <select
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
                    placeholder="Please specify drop-off location"
                    value={formData.customDropoffLocation || ""}
                    onChange={(e) => updateFormData("customDropoffLocation", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 mt-2 text-base text-gray-900"
                  />
                )}
                {errors.dropoffLocation && <p className="text-red-500 text-xs mt-1">{errors.dropoffLocation}</p>}
                {errors.customDropoffLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.customDropoffLocation}</p>
                )}
              </div>
            </div>
            {rentalDays > 0 && formData.pickupDate && formData.dropoffDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 font-medium">
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
            <div className="grid gap-4 md:gap-6">
              {carTypes.map((car) => (
                <div
                  key={car.id} // Use car id as key
                  onClick={() => updateFormData("carType", car.name)}
                  className={`border-2 rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-300 car-card cursor-pointer ${formData.carType === car.name ? "border-magenta bg-magenta/5 shadow-lg selected" : "border-gray-200 hover:border-magenta/50"}`}
                >
                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="w-full">
                      <Image
                        src={`/images/${car.id}.png` || "/placeholder.svg"} // Construct image path
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
                          {car.passengers && (
                            <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium">
                              {car.passengers} seats
                            </span>
                          )}
                          {car.transmission && (
                            <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium">
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
                </div>
              ))}
            </div>
            {errors.carType && <p className="text-red-500 text-xs mt-1">{errors.carType}</p>}
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
                  <label className="block text-sm font-semibold text-navy mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={(e) => updateFormData("driverName", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                    placeholder="Enter your full name"
                  />
                  {errors.driverName && <p className="text-red-500 text-xs mt-1">{errors.driverName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.driverEmail}
                    onChange={(e) => updateFormData("driverEmail", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                    placeholder="your@email.com"
                  />
                  {errors.driverEmail && <p className="text-red-500 text-xs mt-1">{errors.driverEmail}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                    placeholder="+248 xxx xxxx"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">WhatsApp Number (Optional)</label>
                  <div className="space-y-3">
                    <button
                      type="button"
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
                        value={formData.whatsappNumber}
                        onChange={(e) => updateFormData("whatsappNumber", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                        placeholder="+248 xxx xxxx"
                        required={formData.useWhatsApp}
                      />
                    )}
                    {errors.whatsappNumber && <p className="text-red-500 text-xs mt-1">{errors.whatsappNumber}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => updateFormData("country", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all duration-300 text-base text-gray-900"
                    placeholder="Your country"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-navy mb-2">Flight Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.flightNumber}
                    onChange={(e) => updateFormData("flightNumber", e.target.value)}
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
                    checked={formData.childSeat}
                    onChange={(e) => updateFormData("childSeat", e.target.checked)}
                    className="w-5 h-5 text-magenta rounded focus:ring-magenta"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-navy">Child Seat</div>
                    <div className="text-sm text-gray-600">Safety first for your little ones</div>
                  </div>
                  <div className="font-bold text-magenta">{formatPrice(5)}/day</div> {/* Use formatPrice */}
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
                  <div className="font-bold text-magenta">{formatPrice(10)}/day</div> {/* Use formatPrice */}
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
        )
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-navy flex items-center gap-3">
              <Check className="w-5 md:w-6 h-5 md:h-6 text-magenta" />
              Review & Confirm
            </h2>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-navy mb-3">Booking Details</h3>
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
              <h3 className="font-semibold text-navy mb-3">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                <div>
                  <span className="font-semibold">Name:</span> {formData.driverName}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {formData.driverEmail}
                </div>
                <div>
                  <span className="font-semibold">WhatsApp:</span> {formData.whatsappNumber}
                </div>
                <div>
                  <span className="font-semibold">Country:</span> {formData.country}
                </div>
                {formData.flightNumber && (
                  <div>
                    <span className="font-semibold">Flight:</span> {formData.flightNumber}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => updateFormData("agreeToTerms", e.target.checked)}
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
              {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}
            </div>

            <button
              onClick={submitBookingHandler}
              disabled={!formData.agreeToTerms || isSubmitting}
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
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-ocean/10 pb-20 lg:pb-0">
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
          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 md:top-24 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl p-6 border border-white/30 price-summary">
              <h3 className="text-lg md:text-xl font-bold text-navy mb-4">Booking Summary</h3>
              {formData.carType && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>{formData.carType}</span>
                    <span>{formatPrice(carTypes.find((c) => c.name === formData.carType)?.dailyRate || 0)}/day</span>{" "}
                    {/* Use formatPrice */}
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>
                      {formatPrice(carTypes.find((c) => c.name === formData.carType)?.dailyRate || 0)}/day ×{" "}
                      {rentalDays} {/* Use formatPrice */}
                      day
                      {rentalDays > 1 ? "s" : ""}
                    </span>
                    <span>
                      {formatPrice((carTypes.find((c) => c.name === formData.carType)?.dailyRate || 0) * rentalDays)}{" "}
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
              <div className="flex justify-between text-lg md:text-xl font-bold text-magenta pt-4 border-t">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span> {/* Use formatPrice */}
              </div>
              {lateFee > 0 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800 font-semibold mb-1">⚠ Late Drop-off Fee Notice</p>
                  <p className="text-xs text-amber-700">
                    If you return the car after the scheduled pickup time on the final day, an additional fee of {formatPrice(lateFee)} will be charged.
                  </p>
                </div>
              )}
              <div className="mt-6 pt-6 border-t text-sm text-gray-600 space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>Free cancellation up to 24h before pickup</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive insurance included</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>24/7 roadside assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileBookingSummary
        carType={formData.carType}
        dailyRate={carTypes.find((c) => c.name === formData.carType)?.dailyRate || 0}
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
