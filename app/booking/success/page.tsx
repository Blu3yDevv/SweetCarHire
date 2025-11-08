"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Check, Download } from "lucide-react"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookingId) {
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
        console.error("[Fetch Booking Error]:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const formatAmount = (amountMinor: number) => {
    return `€${(amountMinor / 100).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600">Booking not found</p>
            <a href="/" className="text-magenta hover:underline mt-4 inline-block">
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    )
  }

  const reference = `SCH-${booking.id.slice(0, 8).toUpperCase()}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-navy mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">Your booking has been submitted successfully.</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-navy mb-2">Booking Reference</h3>
              <p className="text-2xl font-bold text-magenta">{reference}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-bold text-blue-900 mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-800">Vehicle:</span>
                  <span className="font-semibold text-blue-900">{booking.carName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Pickup:</span>
                  <span className="font-semibold text-blue-900">
                    {formatDate(booking.pickupDate)} at {booking.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Return:</span>
                  <span className="font-semibold text-blue-900">
                    {formatDate(booking.returnDate)} at {booking.returnTime}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-blue-800">Total Amount:</span>
                  <span className="font-bold text-blue-900">{formatAmount(booking.totalAmountMinor)}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-bold text-yellow-900 mb-2">Next Steps</h3>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>✓ Booking confirmed successfully</li>
                <li>✓ Confirmation email sent to {booking.customerEmail}</li>
                <li>• Our team will contact you within 24 hours to arrange payment</li>
                <li>• Bring your booking reference and valid driver's license</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-magenta hover:bg-magenta/90 text-white rounded-xl transition-all"
              >
                <Download className="w-4 h-4" />
                Download Confirmation
              </button>
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-magenta text-magenta hover:bg-magenta hover:text-white rounded-xl transition-all"
              >
                Return to Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
