"use client"
import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Script from "next/script"
import { Check, AlertCircle, Loader2, Shield, Lock, CreditCard } from "lucide-react"

declare global {
  interface Window {
    paypal?: any
  }
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal")

  const paypalButtonsRef = useRef<HTMLDivElement>(null)
  const paypalInitialized = useRef(false)

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided")
      setLoading(false)
      return
    }

    const fetchBooking = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedBooking = sessionStorage.getItem("currentBooking")
          if (storedBooking) {
            const bookingData = JSON.parse(storedBooking)
            console.log("[v0] Loaded booking from sessionStorage:", bookingData)
            setBooking(bookingData)
            setLoading(false)
            return
          }
        }

        setError("Booking data not found. Please complete the booking form again.")
        setLoading(false)
      } catch (err) {
        console.error("[v0] Error loading booking:", err)
        setError(err instanceof Error ? err.message : "Failed to load booking")
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  useEffect(() => {
    if (paypalLoaded && booking && !paypalInitialized.current) {
      console.log("[v0] Initializing PayPal with booking:", booking)
      initializePayPal()
      paypalInitialized.current = true
    }
  }, [paypalLoaded, booking])

  const initializePayPal = () => {
    if (!window.paypal || !paypalButtonsRef.current || !booking) {
      console.log("[v0] PayPal not ready:", {
        paypal: !!window.paypal,
        ref: !!paypalButtonsRef.current,
        booking: !!booking,
      })
      return
    }

    console.log("[v0] Rendering PayPal buttons")

    // Clear previous buttons
    if (paypalButtonsRef.current) {
      paypalButtonsRef.current.innerHTML = ""
    }

    // Render PayPal Buttons
    window.paypal
      .Buttons({
        createOrder: createOrder,
        onApprove: onApprove,
        onError: (err: any) => {
          console.error("[v0] PayPal Button Error:", err)
          setError("Payment failed. Please try again or contact support.")
        },
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
          height: 45,
        },
      })
      .render(paypalButtonsRef.current)
      .catch((err: any) => {
        console.error("[v0] PayPal Render Error:", err)
        setError("Failed to load PayPal button. Please refresh the page.")
      })
  }

  const createOrder = async () => {
    try {
      console.log("[v0] Creating PayPal order for booking:", bookingId)

      const response = await fetch(`/api/paypal/order/create?bookingId=${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      console.log("[v0] PayPal order created:", data.orderID)
      return data.orderID
    } catch (error) {
      console.error("[v0] PayPal Create Order Error:", error)
      setError(error instanceof Error ? error.message : "Failed to create order")
      throw error
    }
  }

  const onApprove = async (data: any) => {
    setProcessing(true)
    try {
      console.log("[v0] Capturing PayPal order:", data.orderID)

      const response = await fetch("/api/paypal/order/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID, bookingId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to capture payment")
      }

      console.log("[v0] Payment captured successfully:", result)

      // Store payment result
      if (typeof window !== "undefined") {
        sessionStorage.setItem("paymentResult", JSON.stringify(result))
      }

      setPaymentComplete(true)

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push(`/booking/success?bookingId=${bookingId}`)
      }, 2000)
    } catch (error) {
      console.error("[v0] PayPal Capture Error:", error)
      setError(error instanceof Error ? error.message : "Payment capture failed. Please contact support.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-magenta mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Error</h1>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/booking")}
              className="px-6 py-3 bg-magenta text-white rounded-xl hover:bg-magenta/90 transition-all"
            >
              Return to Booking
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-4">Payment Successful!</h1>
            <p className="text-gray-600">Redirecting to confirmation page...</p>
          </div>
        </div>
      </div>
    )
  }

  const totalAmount = booking ? (booking.totalAmountMinor / 100).toFixed(2) : "0.00"
  const depositAmount = booking ? ((booking.totalAmountMinor * 0.15) / 100).toFixed(2) : "0.00"
  const remainingAmount = booking ? ((booking.totalAmountMinor * 0.85) / 100).toFixed(2) : "0.00"

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&components=buttons&currency=${booking?.currency || "EUR"}`}
        onLoad={() => {
          console.log("[v0] PayPal SDK loaded")
          setPaypalLoaded(true)
        }}
        onError={(e) => {
          console.error("[v0] PayPal SDK load error:", e)
          setError("Failed to load PayPal. Please refresh the page.")
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-navy mb-2">Secure Payment</h1>
              <p className="text-gray-600">Complete your booking with a secure 15% deposit</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column - Payment Summary */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-navy mb-4">Payment Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-semibold">€{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deposit (15%)</span>
                      <span className="font-semibold text-magenta">€{depositAmount}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="text-gray-600">Due at Pickup</span>
                      <span className="font-semibold">€{remainingAmount}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-blue-800">
                      <strong>Pay now:</strong> €{depositAmount} (15% deposit)
                    </p>
                    <p className="text-xs text-blue-800 mt-1">
                      <strong>Pay at pickup:</strong> €{remainingAmount} (85% balance)
                    </p>
                  </div>

                  {/* Security Badges */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span>PCI DSS Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Secure Payment Gateway</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Method */}
              <div className="md:col-span-2">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-navy">Payment Method</h2>
                      <p className="text-sm text-gray-600">Choose your preferred payment option</p>
                    </div>
                  </div>

                  {/* PayPal Payment Section */}
                  <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                          alt="PayPal"
                          className="h-6"
                        />
                        <span className="font-semibold text-navy">Pay with PayPal</span>
                      </div>
                      <span className="text-xs text-gray-500">Recommended</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                      Pay securely with your PayPal account or credit/debit card. Your payment information is protected
                      by PayPal's advanced security.
                    </p>

                    {/* PayPal Button Container */}
                    <div ref={paypalButtonsRef} className="min-h-[120px] flex items-center justify-center">
                      {!paypalLoaded && (
                        <div className="text-center py-8">
                          <Loader2 className="animate-spin h-8 w-8 text-magenta mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Loading secure payment...</p>
                        </div>
                      )}
                    </div>

                    {processing && (
                      <div className="mt-4 text-center bg-blue-50 rounded-lg p-4">
                        <Loader2 className="animate-spin h-6 w-6 text-magenta mx-auto mb-2" />
                        <p className="text-sm font-medium text-blue-900">Processing your payment...</p>
                        <p className="text-xs text-blue-700 mt-1">Please do not close this window</p>
                      </div>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-navy text-sm mb-1">Your Security is Our Priority</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          All payments are processed through PayPal's secure payment gateway. We never see or store your
                          card details. Your transaction is protected by 256-bit SSL encryption and is PCI DSS
                          compliant.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 text-sm mb-2">What happens next?</h3>
                  <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Complete your payment securely through PayPal</li>
                    <li>Receive instant booking confirmation via email</li>
                    <li>Pay the remaining 85% when you pick up your vehicle</li>
                    <li>Enjoy your rental with Sweet Car Hire!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
