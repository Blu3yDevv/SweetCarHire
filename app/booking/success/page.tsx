"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Download, Calendar, Car, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { generateVoucherHtml } from "@/lib/voucher-template"
import { useCurrency } from "@/lib/currency"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const { format: formatPrice, currency } = useCurrency()

  useEffect(() => {
    if (!bookingId) {
      setLoading(false)
      return
    }

    try {
      const request = sessionStorage.getItem(`sch-request:${bookingId}`)
      if (!request) throw new Error("Request details are only available in the browser session used to submit the request. Check your email or contact the team for help.")
      setBooking(JSON.parse(request))
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Request details are not available in this browser session.")
    } finally {
      setLoading(false)
    }
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

    const reference = booking.id

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
        { label: "Flight", value: booking.flightNumber },
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
        ...(booking.childSeat ? [{ label: "Child seat", value: formatPrice(5) }] : []),
        ...(booking.additionalDriver ? [{ label: "Additional driver", value: formatPrice(10) }] : []),
      ],
      total: formatAmount(booking.totalAmountMinor),
      lateFeeNote: "Rental estimate only: insurance is excluded. Confirm the final price and terms with the team before accepting.",
    })

    const blob = new Blob([voucherHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Sweet-Car-Hire-Request-Summary-${reference}.html`
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
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">{loadError || "Request details are not available in this browser session."}</p>
            <Link href="/" className="text-magenta hover:underline mt-4 inline-block">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const reference = booking.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-navy to-magenta rounded-3xl shadow-2xl p-8 md:p-12 text-center text-white mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ">
                <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Request submitted</h1>
              <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto text-balance">
                Your request has been received. This does not confirm a reservation or collect payment or a deposit.
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
                <p className="text-white/80 text-sm uppercase tracking-wider mb-1">Estimated rental charges · insurance excluded</p>
                <p className="text-4xl font-bold">{formatAmount(booking.totalAmountMinor)}</p>
                <p className="mt-3 text-sm text-white/80">This request is not a confirmed reservation. The team will confirm availability, final price, and current insurance and cancellation terms.</p>
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
                    <p>Your request is awaiting confirmation. Contact us if you have not received an email.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p>Our team will confirm availability and whether a deposit is required. Any amount and payment method will be shared for you to review before accepting.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p>Wait for the team&apos;s written confirmation and instructions before pickup</p>
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
              Download Request Summary
            </button>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-3 px-8 py-4 border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-xl transition-all font-semibold"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
