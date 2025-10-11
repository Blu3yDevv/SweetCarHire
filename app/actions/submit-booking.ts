"use server"

import { z } from "zod"

// Form validation schema
const bookingSchema = z.object({
  pickupDate: z.string().min(1, { message: "Pickup date is required" }),
  returnDate: z.string().min(1, { message: "Return date is required" }),
  pickupTime: z.string().optional(),
  returnTime: z.string().optional(),
  vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  pickupLocation: z.string().optional(),
  returnLocation: z.string().optional(),
  flightNumber: z.string().optional(),
  hotelName: z.string().optional(),
  specialRequests: z.string().optional(),
  agreeToTerms: z.boolean().optional(),
})

type BookingData = z.infer<typeof bookingSchema>

export async function submitBooking(formData: BookingData) {
  try {
    // Validate form data
    const validatedData = bookingSchema.parse(formData)

    // Get Brevo API key
    const apiKey = process.env.BREVO_API_KEY

    if (!apiKey) {
      console.error("BREVO_API_KEY is not defined in environment variables")
      throw new Error("API key not configured")
    }

    console.log("Sending booking email with Brevo API key:", apiKey.substring(0, 5) + "...")

    // Format pickup location
    let pickupLocationFormatted = "Not specified"

    // Map location codes to readable names
    const locationMap: Record<string, string> = {
      airport: "Seychelles International Airport (Arrival Hall)",
      office: "Sweet Car Hire Office (Victoria)",
      "beau-vallon": "Beau Vallon Beach Area",
      "beau-vallon-savoy": "Savoy Resort & Spa (Beau Vallon)",
      "beau-vallon-coral-strand": "Coral Strand Hotel (Beau Vallon)",
      "beau-vallon-fishermans-cove": "Fisherman's Cove Resort (Beau Vallon)",
      "eden-island": "Eden Island",
      "eden-island-marina": "Eden Island Marina",
      "anse-royale": "Anse Royale",
      "anse-royale-fairyland": "Fairyland Hotel (Anse Royale)",
      "baie-lazare": "Baie Lazare",
      "baie-lazare-kempinski": "Kempinski Resort (Baie Lazare)",
      "port-glaud": "Port Glaud",
      "port-glaud-constance-ephelia": "Constance Ephelia Resort (Port Glaud)",
      "grand-anse": "Grand Anse",
      custom: "Other location (specified in special requests)",
    }

    if (validatedData.pickupLocation && locationMap[validatedData.pickupLocation]) {
      pickupLocationFormatted = locationMap[validatedData.pickupLocation]
    }

    // Format return location
    let returnLocationFormatted = "Not specified"

    if (validatedData.returnLocation === "same") {
      returnLocationFormatted = "Same as pickup location"
    } else if (validatedData.returnLocation && locationMap[validatedData.returnLocation]) {
      returnLocationFormatted = locationMap[validatedData.returnLocation]
    }

    // Format vehicle type
    let vehicleTypeFormatted = validatedData.vehicleType || "Not specified"

    const vehicleMap: Record<string, string> = {
      "kia-picanto": "Kia Picanto (Economy) - Manual",
      "hyundai-i10": "Hyundai i10 (Economy) - Automatic",
      "suzuki-swift": "Suzuki Swift (Compact) - Manual",
      "toyota-yaris": "Toyota Yaris (Compact) - Automatic",
      "suzuki-jimny": "Suzuki Jimny (Mini SUV) - Manual 4x4",
      "daihatsu-terios": "Daihatsu Terios (SUV) - Automatic 4x4",
      "kia-sportage": "Kia Sportage (SUV) - Automatic 4x4",
    }

    if (vehicleMap[vehicleTypeFormatted]) {
      vehicleTypeFormatted = vehicleMap[vehicleTypeFormatted]
    }

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
      subject: `New Car Booking Request - ${vehicleTypeFormatted}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1e3a8a; margin: 0;">Sweet Car Hire</h1>
            <p style="color: #666; margin: 5px 0 0;">Mahe Island, Seychelles</p>
          </div>
          
          <div style="background-color: #e94d97; color: white; padding: 10px; text-align: center; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="margin: 0;">New Car Booking Request</h2>
          </div>
          
          <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            <p><strong>Hotel/Accommodation:</strong> ${validatedData.hotelName || "Not specified"}</p>
          </div>
          
          <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Booking Details</h3>
            <p><strong>Vehicle:</strong> ${vehicleTypeFormatted}</p>
            <p><strong>Pickup Date:</strong> ${new Date(validatedData.pickupDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p><strong>Pickup Time:</strong> ${validatedData.pickupTime || "Not specified"}</p>
            <p><strong>Return Date:</strong> ${new Date(validatedData.returnDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p><strong>Return Time:</strong> ${validatedData.returnTime || "Not specified"}</p>
          </div>
          
          <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Pickup & Return Details</h3>
            <p><strong>Pickup Location:</strong> ${pickupLocationFormatted}</p>
            <p><strong>Return Location:</strong> ${returnLocationFormatted}</p>
            <p><strong>Flight Number:</strong> ${validatedData.flightNumber || "Not provided"}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Additional Information</h3>
            <p><strong>Special Requests:</strong> ${validatedData.specialRequests || "None"}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; font-size: 12px; color: #666;">
            <p style="margin-top: 0;">This booking was submitted from the Sweet Car Hire website on ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
            <p style="margin-bottom: 0;">Please contact the customer to confirm this booking.</p>
          </div>
        </div>
      `,
      replyTo: {
        email: validatedData.email,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
      },
    }

    console.log("Sending booking email with data:", JSON.stringify(emailData, null, 2))

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
    console.log("Brevo API booking response:", response.status, responseData)

    if (!response.ok) {
      console.error("Brevo API error:", response.status, responseData)
      throw new Error(`Email service error: ${response.status}`)
    }

    // Generate a booking reference
    const bookingRef = `SCH-${Math.floor(100000 + Math.random() * 900000)}`

    // Add booking reference to email content
    emailData.htmlContent = emailData.htmlContent.replace(
      `<p style="margin-bottom: 0;">Please contact the customer to confirm this booking.</p>`,
      `<p style="margin-bottom: 0;">Please contact the customer to confirm this booking.</p>
      <p style="margin-top: 10px;"><strong>Booking Reference:</strong> ${bookingRef}</p>`,
    )

    return {
      success: true,
      message:
        "Your booking request has been submitted successfully! We'll contact you shortly to confirm your reservation.",
      bookingRef,
    }
  } catch (error) {
    console.error("Error submitting booking:", error)

    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        success: false,
        message: "Please check your booking details",
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
      message: "Failed to submit your booking. Please try again later.",
    }
  }
}
