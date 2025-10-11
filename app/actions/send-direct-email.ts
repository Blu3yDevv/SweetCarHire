"use server"

import { z } from "zod"
import nodemailer from "nodemailer"

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

export async function sendDirectEmail(formData: FormData) {
  try {
    // Validate form data
    const validatedData = formSchema.parse(formData)

    // Create a test account using Ethereal Email
    const testAccount = await nodemailer.createTestAccount()

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"${validatedData.firstName} ${validatedData.lastName}" <${validatedData.email}>`,
      to: "totallyblue234@gmail.com",
      subject: `New Contact Form: ${validatedData.subject}`,
      text: `
        Name: ${validatedData.firstName} ${validatedData.lastName}
        Email: ${validatedData.email}
        Phone: ${validatedData.phone || "Not provided"}
        Subject: ${validatedData.subject}
        
        Message:
        ${validatedData.message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      `,
    })

    console.log("Message sent: %s", info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))

    return {
      success: true,
      message: "Your message has been sent successfully!",
      previewUrl: nodemailer.getTestMessageUrl(info),
    }
  } catch (error) {
    console.error("Error sending direct email:", error)

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
