"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { sendContactForm } from "../actions/send-email"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean
    message?: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const result = await sendContactForm(formData)

      if (result.success) {
        setSubmitResult({
          success: true,
          message: result.message,
        })
        // Reset form on success
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
        setFormErrors({})
      } else {
        setSubmitResult({
          success: false,
          message: result.message,
        })

        if (result.errors) {
          setFormErrors(result.errors)
        }
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions about our services? Get in touch with our team and we'll be happy to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-[#e94d97]" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>+248 2821182</p>
                <p className="text-sm text-gray-500 mt-1">Available 7 days a week, 8am - 8pm</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-[#e94d97]" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>sweetcarhire@gmail.com</p>
                <p className="text-sm text-gray-500 mt-1">We'll respond as soon as possible</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#e94d97]" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Mahe Island, Seychelles</p>
                <p className="text-sm text-gray-500 mt-1">We offer free delivery across the island</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#e94d97]" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitResult && (
                <Alert
                  className={`mb-6 ${submitResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  {submitResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle className={submitResult.success ? "text-green-800" : "text-red-800"}>
                    {submitResult.success ? "Success" : "Error"}
                  </AlertTitle>
                  <AlertDescription className={submitResult.success ? "text-green-700" : "text-red-700"}>
                    {submitResult.message}
                  </AlertDescription>
                </Alert>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={formErrors.firstName ? "border-red-300 focus:ring-red-500" : ""}
                    />
                    {formErrors.firstName && <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={formErrors.lastName ? "border-red-300 focus:ring-red-500" : ""}
                    />
                    {formErrors.lastName && <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={formErrors.email ? "border-red-300 focus:ring-red-500" : ""}
                    />
                    {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={formErrors.phone ? "border-red-300 focus:ring-red-500" : ""}
                    />
                    {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={handleChange}
                    className={formErrors.subject ? "border-red-300 focus:ring-red-500" : ""}
                  />
                  {formErrors.subject && <p className="text-sm text-red-500 mt-1">{formErrors.subject}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Enter your message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={formErrors.message ? "border-red-300 focus:ring-red-500" : ""}
                  />
                  {formErrors.message && <p className="text-sm text-red-500 mt-1">{formErrors.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#e94d97] hover:bg-[#d43884] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Find Us on the Map</h2>
        <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Map of Mahe Island, Seychelles would be embedded here</p>
        </div>
      </div>
    </div>
  )
}
