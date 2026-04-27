"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Check, Download, Calendar, Car, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { generateVoucherHtml } from "@/lib/voucher-template"
import { useCurrency } from "@/lib/currency"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { format: formatPrice, currency } = useCurrency()

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

  const formatAmount = (amountMinor: number) => formatPrice(amountMinor / 100)

  const downloadPDF = () => {
    if (!booking) return

    const reference = `SCH-${booking.id.slice(0, 8).toUpperCase()}`

    const voucherHTML = generateVoucherHtml({
      reference,
      currency,
      issuedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      customer: [
        { label: "Name", value: booking.customerName },
        { label: "Email", value: booking.customerEmail },
        { label: "Phone", value: booking.customerPhone },
      ],
      rental: [
        { label: "Vehicle", value: booking.carName },
        { label: "Category", value: booking.carType || "Standard" },
        { label: "Pickup", value: `${formatDate(booking.pickupDate)} at ${booking.pickupTime}` },
        { label: "Return", value: `${formatDate(booking.returnDate)} at ${booking.returnTime}` },
        { label: "Pickup location", value: booking.pickupLocation },
        { label: "Return location", value: booking.returnLocation },
        { label: "Currency", value: currency },
      ],
      pricing: [
        ...(booking.extras || []).map((extra: any) => ({
          label: extra.name,
          value: formatAmount(extra.price * 100),
        })),
      ],
      total: formatAmount(booking.totalAmountMinor),
      lateFeeNote: `Late returns may incur a fee of ${formatPrice(10)}.`,
    })

    const blob = new Blob([voucherHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Sweet-Car-Hire-Voucher-${reference}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-navy to-magenta rounded-3xl shadow-2xl p-8 md:p-12 text-center text-white mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Booking Confirmed!</h1>
              <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto text-balance">
                Your reservation has been successfully submitted. Get ready for an amazing journey!
              </p>

              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 inline-block">
                <p className="text-sm text-white/80 mb-2 uppercase tracking-wider">Booking Reference</p>
                <p className="text-3xl md:text-4xl font-bold tracking-widest">{reference}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-magenta">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-magenta/10 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-magenta" />
                </div>
                <h3 className="font-bold text-navy text-lg">Vehicle</h3>
              </div>
              <p className="text-2xl font-bold text-navy">{booking.carName}</p>
              <p className="text-gray-600 mt-1">{booking.carType || "Standard Category"}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-navy text-lg">Rental Period</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Pickup</p>
                  <p className="font-semibold text-navy">
                    {formatDate(booking.pickupDate)} at {booking.pickupTime}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Return</p>
                  <p className="font-semibold text-navy">
                    {formatDate(booking.returnDate)} at {booking.returnTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-navy text-lg">Locations</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Pickup</p>
                  <p className="font-semibold text-navy">{booking.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-gray-600">Return</p>
                  <p className="font-semibold text-navy">{booking.returnLocation}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-navy text-lg">Contact</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold text-navy">{booking.customerEmail}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold text-navy">{booking.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-navy to-navy/90 rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wider mb-1">Total Amount</p>
                <p className="text-4xl font-bold">{formatAmount(booking.totalAmountMinor)}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">💳</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 mb-6 border-2 border-orange-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-orange-900 text-lg mb-2">What Happens Next?</h3>
                <div className="space-y-3 text-sm text-orange-800">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p>Booking confirmed and confirmation email sent to {booking.customerEmail}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p>Our team will contact you within 24 hours to arrange payment details</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p>Bring your booking reference and valid driver's license for pickup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadPDF}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-magenta to-pink-600 hover:from-magenta/90 hover:to-pink-600/90 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Download className="w-5 h-5" />
              Download Voucher
            </button>
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-xl transition-all font-semibold"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
