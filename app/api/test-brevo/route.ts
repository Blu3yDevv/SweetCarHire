import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.BREVO_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "API key not found",
        },
        { status: 500 },
      )
    }

    console.log("Testing Brevo API with key:", apiKey.substring(0, 5) + "...")

    // Prepare email content for test
    const emailData = {
      sender: {
        name: "Sweet Car Hire Support",
        email: "totallyblue234@gmail.com", // Your verified Gmail address
      },
      to: [
        {
          email: "totallyblue234@gmail.com", // Where you want to receive the test email
          name: "Sweet Car Hire",
        },
      ],
      subject: "Test Email from Sweet Car Hire Website",
      htmlContent: `
        <h2>This is a test email</h2>
        <p>If you're receiving this, your Brevo API integration is working correctly.</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      `,
    }

    console.log("Sending test email with data:", JSON.stringify(emailData, null, 2))

    // Send email via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(emailData),
      cache: "no-store",
    })

    const responseData = await response.json().catch(() => ({}))
    console.log("Brevo API test response:", response.status, responseData)

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send test email",
          status: response.status,
          error: responseData,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
    })
  } catch (error) {
    console.error("Error in test-brevo API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
