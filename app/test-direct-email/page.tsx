"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { sendDirectEmail } from "../actions/send-direct-email"

export default function TestDirectEmailPage() {
  const [formData, setFormData] = useState({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "1234567890",
    subject: "Test Email",
    message: "This is a test message from the direct email test page.",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    previewUrl?: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const result = await sendDirectEmail(formData)
      setResult(result)
    } catch (error) {
      console.error("Error sending direct email:", error)
      setResult({
        success: false,
        message: "Error sending direct email: " + (error instanceof Error ? error.message : "Unknown error"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test Direct Email Sending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            This page tests email sending using Nodemailer with Ethereal Email (a test email service).
          </p>

          {result && (
            <Alert className={`mb-6 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle className={result.success ? "text-green-800" : "text-red-800"}>
                {result.success ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
                {result.message}
                {result.previewUrl && (
                  <p className="mt-2">
                    <a
                      href={result.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Test Email
                    </a>
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone
                </label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-[#e94d97] hover:bg-[#d43884] text-white">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                </>
              ) : (
                "Send Test Email"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
