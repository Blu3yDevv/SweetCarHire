"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestBrevoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  const testBrevoApi = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-brevo")
      const data = await response.json()

      setResult({
        success: response.ok,
        message: data.message || "Test completed",
        details: data.error ? JSON.stringify(data.error) : undefined,
      })
    } catch (error) {
      console.error("Error testing Brevo API:", error)
      setResult({
        success: false,
        message: "Error testing Brevo API",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Brevo Email API</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            This page tests your Brevo API configuration by sending a test email to totallyblue234@gmail.com.
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
                {result.details && (
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{result.details}</pre>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={testBrevoApi}
            disabled={isLoading}
            className="w-full bg-[#e94d97] hover:bg-[#d43884] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing...
              </>
            ) : (
              "Send Test Email"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
