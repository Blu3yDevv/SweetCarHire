export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto mb-4"></div>
        <p className="text-gray-600">Loading payment page...</p>
      </div>
    </div>
  )
}
