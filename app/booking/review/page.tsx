"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, AlertCircle, ChevronRight } from "lucide-react"

export default function ReviewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided")
      setLoading(false)
      return
    }

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`)
        if (!response.ok) {
          throw new Error("Booking not found")
        }
        const data = await response.json()
        setBooking(data.booking)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const proceedToPayment = () => {
    router.push(`/booking/payment?bookingId=${bookingId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Error</h1>
            </div>
            <p className="text-gray-600 mb-6">{error || "Booking not found"}</p>
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

  const depositAmount = booking ? (booking.depositAmountMinor / 100).toFixed(2) : "0.00"
  const totalAmount = booking ? (booking.totalAmountMinor / 100).toFixed(2) : "0.00"
  const remainingAmount = booking ? ((booking.totalAmountMinor - booking.depositAmountMinor) / 100).toFixed(2) : "0.00"

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-navy mb-8 text-center">Review Your Booking</h1>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-navy mb-6">Booking Details</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-semibold">{booking?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">{booking?.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">WhatsApp:</span>
                <span className="font-semibold">{booking?.whatsappNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="font-semibold">{booking?.country}</span>
              </div>
              {booking?.flightNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight Number:</span>
                  <span className="font-semibold">{booking.flightNumber}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-6 space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-semibold">{booking?.carName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup:</span>
                <span className="font-semibold">
                  {booking && `${formatDate(booking.pickupDate)} at ${booking.pickupTime}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return:</span>
                <span className="font-semibold">
                  {booking && `${formatDate(booking.returnDate)} at ${booking.returnTime}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Location:</span>
                <span className="font-semibold">{booking?.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Drop-off Location:</span>
                <span className="font-semibold">{booking?.dropoffLocation}</span>
              </div>
            </div>

            {(booking?.childSeat || booking?.additionalDriver) && (
              <div className="border-t pt-6 space-y-2 mb-6">
                <h3 className="font-semibold text-navy mb-2">Extras:</h3>
                {booking.childSeat && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Child Seat</span>
                  </div>
                )}
                {booking.additionalDriver && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Additional Driver</span>
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-6 space-y-3">
              <div className="flex justify-between text-lg">
                <span>Total Amount:</span>
                <span className="font-bold">€{totalAmount}</span>
              </div>
              <div className="flex justify-between text-lg text-magenta">
                <span>Deposit (15%):</span>
                <span className="font-bold">€{depositAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Remaining (due at pickup):</span>
                <span className="font-semibold">€{remainingAmount}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-blue-900 mb-2">Next Step: Payment</h3>
            <p className="text-blue-800 text-sm mb-2">
              You will pay <strong>15% deposit (€{depositAmount})</strong> securely via PayPal.
            </p>
            <p className="text-blue-800 text-sm">
              The remaining <strong>85% (€{remainingAmount})</strong> is due at pickup (cash/card accepted).
            </p>
          </div>

          <button
            onClick={proceedToPayment}
            className="w-full bg-magenta hover:bg-magenta/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg flex items-center justify-center gap-2"
          >
            Proceed to Payment
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
