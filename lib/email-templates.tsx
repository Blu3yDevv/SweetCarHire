// Email template types and generators for booking confirmations

export interface BookingEmailData {
  bookingId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
  pickupLocation: string
  dropoffLocation: string
  carName: string
  carImage?: string
  transmission: string
  passengers: number
  luggage: number
  extras?: Array<{ name: string; price: number; quantity?: number }>
  // Support both flat and nested pricing structures
  subtotal?: number
  vat?: number
  total?: number
  depositAmount?: number
  remainingAmount?: number
  pricing?: {
    subtotal: number
    vat: number
    total: number
    depositAmount: number
    remainingAmount: number
  }
  currency?: string
}

// Helper function to safely format prices
function formatPrice(amount: number | undefined, currency = "EUR"): string {
  const value = amount ?? 0
  const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"
  return `${symbol}${value.toFixed(2)}`
}

// Helper function to safely format dates
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "N/A"
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

// Generate beautiful HTML email for customer confirmation
export function generateCustomerConfirmationEmail(booking: BookingEmailData): string {
  const currency = booking.currency || "EUR"

  // Support both flat and nested pricing structures
  const getPricing = () => ({
    subtotal: booking.pricing?.subtotal ?? booking.subtotal ?? 0,
    vat: booking.pricing?.vat ?? booking.vat ?? 0,
    total: booking.pricing?.total ?? booking.total ?? 0,
    depositAmount: booking.pricing?.depositAmount ?? booking.depositAmount ?? 0,
    remainingAmount: booking.pricing?.remainingAmount ?? booking.remainingAmount ?? 0,
  })

  const pricing = getPricing()
  const extras = booking.extras || []

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
           Header 
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Booking Confirmed!</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Thank you for choosing Sweet Car Hire</p>
            </td>
          </tr>

           Booking ID 
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa;">
              <p style="margin: 0; color: #666; font-size: 14px;">Booking Reference</p>
              <p style="margin: 5px 0 0 0; color: #333; font-size: 24px; font-weight: bold;">${booking.bookingId}</p>
            </td>
          </tr>

           Customer Details 
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Customer Details</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px;">Name:</td>
                  <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">${booking.customerName}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Email:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${booking.customerEmail}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Phone:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${booking.customerPhone}</td>
                </tr>
              </table>
            </td>
          </tr>

           Vehicle Details 
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Vehicle Details</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px;">Vehicle:</td>
                  <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">${booking.carName}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Transmission:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${booking.transmission}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Passengers:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${booking.passengers}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Luggage:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${booking.luggage}</td>
                </tr>
              </table>
            </td>
          </tr>

           Rental Period 
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Rental Period</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px;">Pick-up:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${formatDate(booking.pickupDate)} at ${booking.pickupTime}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Drop-off:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${formatDate(booking.dropoffDate)} at ${booking.dropoffTime}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Pick-up Location:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${booking.pickupLocation}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px;">Drop-off Location:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${booking.dropoffLocation}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            extras.length > 0
              ? `
           Extras 
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Extras</h2>
              <table width="100%" cellpadding="8" cellspacing="0">
                ${extras
                  .map(
                    (extra) => `
                <tr>
                  <td style="color: #666; font-size: 14px;">${extra.name}${extra.quantity ? ` (x${extra.quantity})` : ""}:</td>
                  <td style="color: #333; font-size: 14px; text-align: right;">${formatPrice(extra.price, currency)}</td>
                </tr>
                `,
                  )
                  .join("")}
              </table>
            </td>
          </tr>
          `
              : ""
          }

           Pricing Summary 
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Payment Summary</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px;">
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 12px;">Subtotal:</td>
                  <td style="color: #333; font-size: 14px; text-align: right; padding: 12px;">${formatPrice(pricing.subtotal, currency)}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 12px;">VAT (21%):</td>
                  <td style="color: #333; font-size: 14px; text-align: right; padding: 12px;">${formatPrice(pricing.vat, currency)}</td>
                </tr>
                <tr style="border-top: 2px solid #667eea;">
                  <td style="color: #333; font-size: 18px; font-weight: bold; padding: 12px;">Total:</td>
                  <td style="color: #667eea; font-size: 18px; font-weight: bold; text-align: right; padding: 12px;">${formatPrice(pricing.total, currency)}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 12px;">Deposit Paid:</td>
                  <td style="color: #28a745; font-size: 14px; font-weight: bold; text-align: right; padding: 12px;">${formatPrice(pricing.depositAmount, currency)}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 12px;">Remaining Balance:</td>
                  <td style="color: #dc3545; font-size: 14px; font-weight: bold; text-align: right; padding: 12px;">${formatPrice(pricing.remainingAmount, currency)}</td>
                </tr>
              </table>
            </td>
          </tr>

           Important Information 
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px; font-weight: bold;">Important Information:</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #856404; font-size: 13px;">
                  <li>Please bring your driver's license and payment card</li>
                  <li>The remaining balance is due at pick-up</li>
                  <li>Arrive 15 minutes before your scheduled pick-up time</li>
                </ul>
              </div>
            </td>
          </tr>

           Footer 
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Need help? Contact us:</p>
              <p style="margin: 0; color: #667eea; font-size: 14px; font-weight: bold;">bookings@sweetcarhire.com</p>
              <p style="margin: 15px 0 0 0; color: #999; font-size: 12px;">© 2025 Sweet Car Hire. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// Generate plain text email for admin notification
export function generateAdminNotificationEmail(booking: BookingEmailData): string {
  const currency = booking.currency || "EUR"

  // Support both flat and nested pricing structures
  const getPricing = () => ({
    subtotal: booking.pricing?.subtotal ?? booking.subtotal ?? 0,
    vat: booking.pricing?.vat ?? booking.vat ?? 0,
    total: booking.pricing?.total ?? booking.total ?? 0,
    depositAmount: booking.pricing?.depositAmount ?? booking.depositAmount ?? 0,
    remainingAmount: booking.pricing?.remainingAmount ?? booking.remainingAmount ?? 0,
  })

  const pricing = getPricing()
  const extras = booking.extras || []

  return `
NEW BOOKING RECEIVED
====================

Booking Reference: ${booking.bookingId}

CUSTOMER DETAILS
----------------
Name: ${booking.customerName}
Email: ${booking.customerEmail}
Phone: ${booking.customerPhone}

VEHICLE DETAILS
---------------
Vehicle: ${booking.carName}
Transmission: ${booking.transmission}
Passengers: ${booking.passengers}
Luggage: ${booking.luggage}

RENTAL PERIOD
-------------
Pick-up: ${formatDate(booking.pickupDate)} at ${booking.pickupTime}
Drop-off: ${formatDate(booking.dropoffDate)} at ${booking.dropoffTime}
Pick-up Location: ${booking.pickupLocation}
Drop-off Location: ${booking.dropoffLocation}

${
  extras.length > 0
    ? `EXTRAS
-------
${extras.map((extra) => `${extra.name}${extra.quantity ? ` (x${extra.quantity})` : ""}: ${formatPrice(extra.price, currency)}`).join("\n")}

`
    : ""
}PAYMENT SUMMARY
---------------
Subtotal: ${formatPrice(pricing.subtotal, currency)}
VAT (21%): ${formatPrice(pricing.vat, currency)}
Total: ${formatPrice(pricing.total, currency)}
Deposit Paid: ${formatPrice(pricing.depositAmount, currency)}
Remaining Balance: ${formatPrice(pricing.remainingAmount, currency)}

====================
This is an automated notification from Sweet Car Hire booking system.
  `.trim()
}
