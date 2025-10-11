"use server"

import { z } from "zod"

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

type FormData = z.infer<typeof formSchema>

export async function sendContactForm(formData: FormData) {
  try {
    // Validate form data
    const validatedData = formSchema.parse(formData)

    // Get Brevo API key
    const apiKey = process.env.BREVO_API_KEY

    if (!apiKey) {
      console.error("BREVO_API_KEY is not defined in environment variables")
      throw new Error("API key not configured")
    }

    console.log("Sending email with Brevo API key:", apiKey.substring(0, 5) + "...")

    // Prepare email content
    const emailData = {
      sender: {
        name: "Sweet Car Hire Support",
        email: "totallyblue234@gmail.com", // Your verified Gmail address
      },
      to: [
        {
          email: "totallyblue234@gmail.com", // Where you want to receive notifications
          name: "Sweet Car Hire",
        },
      ],
      subject: `New Contact Form: ${validatedData.subject}`,
      htmlContent: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: {
        email: validatedData.email,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
      },
    }

    console.log("Sending email with data:", JSON.stringify(emailData, null, 2))

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
    console.log("Brevo API response:", response.status, responseData)

    if (!response.ok) {
      console.error("Brevo API error:", response.status, responseData)
      throw new Error(`Email service error: ${response.status}`)
    }

    return { success: true, message: "Your message has been sent successfully!" }
  } catch (error) {
    console.error("Error sending email:", error)

    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        success: false,
        message: "Please check your form inputs",
        errors: error.errors.reduce(
          (acc, curr) => {
            const path = curr.path[0] as string
            acc[path] = curr.message
            return acc
          },
          {} as Record<string, string>,
        ),
      }
    }

    return {
      success: false,
      message: "Failed to send your message. Please try again later.",
    }
  }
}
