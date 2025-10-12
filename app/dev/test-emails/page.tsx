"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Mail, Send } from "lucide-react"

export default function TestEmailsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Sample booking data for testing
  const [testData, setTestData] = useState({
    bookingId: `SCH-${Date.now()}-TEST`,
    customerName: "John Doe",
    customerEmail: "test@example.com",
    customerPhone: "+248 123 4567",
    customerCountry: "Seychelles",
    carMake: "Suzuki",
    carModel: "Dzire",
    carImage: "/cars/dzire.jpg",
    dailyRate: 45,
    pickupDate: new Date().toISOString().split("T")[0],
    pickupTime: "10:00",
    pickupLocation: "Seychelles International Airport",
    dropoffDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dropoffTime: "10:00",
    dropoffLocation: "Seychelles International Airport",
    rentalDays: 7,
    childSeat: true,
    additionalDriver: false,
    subtotal: 325,
    vat: 48.75,
    total: 373.75,
    depositAmount: 56.06,
    remainingAmount: 317.69,
  })

  const handleSendTestEmail = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/emails/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Test emails sent successfully! Check both customer and admin inboxes.",
        })
      } else {
        setResult({
          success: false,
          message: `Failed to send emails: ${data.error || "Unknown error"}`,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setTestData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Mail className="h-6 w-6 text-blue-600" />
              Email & Booking Test Page
            </CardTitle>
            <CardDescription>
              Test the email confirmation system and booking flow without processing real payments
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Test Data Form */}
        <Card>
          <CardHeader>
            <CardTitle>Test Booking Data</CardTitle>
            <CardDescription>Modify the test data below and send test emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={testData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Customer Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={testData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  value={testData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookingId">Booking ID</Label>
                <Input id="bookingId" value={testData.bookingId} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carMake">Car Make</Label>
                <Input
                  id="carMake"
                  value={testData.carMake}
                  onChange={(e) => handleInputChange("carMake", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carModel">Car Model</Label>
                <Input
                  id="carModel"
                  value={testData.carModel}
                  onChange={(e) => handleInputChange("carModel", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate (€)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  value={testData.dailyRate}
                  onChange={(e) => handleInputChange("dailyRate", Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentalDays">Rental Days</Label>
                <Input
                  id="rentalDays"
                  type="number"
                  value={testData.rentalDays}
                  onChange={(e) => handleInputChange("rentalDays", Number.parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Booking Summary</Label>
              <div className="rounded-lg border bg-gray-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">€{testData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%):</span>
                  <span className="font-semibold">€{testData.vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">€{testData.total.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2 text-blue-600">
                  <span>Deposit (15%):</span>
                  <span className="font-semibold">€{testData.depositAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Due at pickup (85%):</span>
                  <span className="font-semibold">€{testData.remainingAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Test Email Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleSendTestEmail}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending Test Emails...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Emails
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Customer Email (Resend):</strong> Sent to the customer email address above with a professional
              HTML template including all booking details.
            </p>
            <p>
              <strong>Admin Email (Web3Forms):</strong> Sent to the configured admin email with customer details and
              Reply-To set to customer email.
            </p>
            <p className="text-blue-700">
              <strong>Note:</strong> Make sure RESEND_API_KEY and WEB3FORMS_KEY are configured in your environment
              variables.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
