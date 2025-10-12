export interface BookingEmailData {
  bookingId: string
  customerName: string
  customerEmail: string
  whatsappNumber: string
  carName: string
  pickupDate: string
  pickupTime: string
  pickupLocation: string
  returnDate: string
  returnTime: string
  dropoffLocation: string
  totalAmountMinor: number
  depositAmountMinor: number
  currency: string
  childSeat: boolean
  additionalDriver: boolean
  flightNumber?: string
}

export function generateCustomerConfirmationEmail(data: BookingEmailData): string {
  const formatAmount = (amountMinor: number) => {
    const symbol = data.currency === "EUR" ? "€" : data.currency === "GBP" ? "£" : "$"
    return `${symbol}${(amountMinor / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const remainingBalance = data.totalAmountMinor - data.depositAmountMinor

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Sweet Car Hire</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
           Header 
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Sweet Car Hire</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Booking Confirmation</p>
            </td>
          </tr>

           Success Message 
          <tr>
            <td style="padding: 40px 30px 20px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 30px;">✓</span>
              </div>
              <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px;">Booking Confirmed!</h2>
              <p style="margin: 0; color: #6b7280; font-size: 16px;">Thank you for choosing Sweet Car Hire, ${data.customerName}!</p>
            </td>
          </tr>

           Booking Reference 
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Booking Reference</p>
                <p style="margin: 0; color: #764ba2; font-size: 28px; font-weight: bold; letter-spacing: 2px;">${data.bookingId}</p>
              </div>
            </td>
          </tr>

           Vehicle Details 
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Vehicle Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Vehicle:</td>
                  <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${data.carName}</td>
                </tr>
              </table>
            </td>
          </tr>

           Pickup Details 
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Pickup Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Date:</td>
                  <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${formatDate(data.pickupDate)}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Time:</td>
                  <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${data.pickupTime}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Location:</td>
                  <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${data.pickupLocation}</td>
                </tr>
              </table>
            </td>
          </tr>

           Return Details 
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Return Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Date:</td>
                  <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${formatDate(data.returnDate)}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Time:</td>
                  <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${data.returnTime}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Location:</td>
                  <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${data.dropoffLocation}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            data.childSeat || data.additionalDriver
              ? `
           Extras 
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Extras</h3>
              <table width="100%" cellpadding="8" cellspacing="0">
                ${data.childSeat ? '<tr><td style="color: #1f2937; font-size: 14px;">✓ Child Seat</td></tr>' : ""}
                ${data.additionalDriver ? '<tr><td style="color: #1f2937; font-size: 14px;">✓ Additional Driver</td></tr>' : ""}
              </table>
            </td>
          </tr>
          `
              : ""
          }

           Payment Summary 
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">Payment Summary</h3>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #1e40af; font-size: 14px;">Total Amount:</td>
                    <td style="color: #1e40af; font-size: 14px; font-weight: 600; text-align: right;">${formatAmount(data.totalAmountMinor)}</td>
                  </tr>
                  <tr>
                    <td style="color: #10b981; font-size: 14px;">Deposit Paid (15%):</td>
                    <td style="color: #10b981; font-size: 14px; font-weight: 600; text-align: right;">${formatAmount(data.depositAmountMinor)}</td>
                  </tr>
                  <tr style="border-top: 2px solid #3b82f6;">
                    <td style="color: #1e40af; font-size: 16px; font-weight: bold; padding-top: 12px;">Balance Due at Pickup:</td>
                    <td style="color: #1e40af; font-size: 16px; font-weight: bold; text-align: right; padding-top: 12px;">${formatAmount(remainingBalance)}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

           Important Information 
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">Important Information</h3>
                <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <li>Please bring your booking reference number</li>
                  <li>Valid driver's license required</li>
                  <li>Remaining balance payable at pickup (cash or card)</li>
                  <li>Arrive 15 minutes before pickup time</li>
                  ${data.flightNumber ? `<li>Flight Number: ${data.flightNumber}</li>` : ""}
                </ul>
              </div>
            </td>
          </tr>

           Contact Information 
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Need help? Contact us:</p>
              <p style="margin: 0; color: #1f2937; font-size: 14px;">
                <strong>WhatsApp:</strong> <a href="https://wa.me/2482510510" style="color: #764ba2; text-decoration: none;">+248 251 0510</a><br>
                <strong>Email:</strong> <a href="mailto:info@sweetcarhire.com" style="color: #764ba2; text-decoration: none;">info@sweetcarhire.com</a>
              </p>
            </td>
          </tr>

           Footer 
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px;">© 2025 Sweet Car Hire. All rights reserved.</p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">Seychelles</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function generateAdminNotificationEmail(data: BookingEmailData): string {
  const formatAmount = (amountMinor: number) => {
    const symbol = data.currency === "EUR" ? "€" : data.currency === "GBP" ? "£" : "$"
    return `${symbol}${(amountMinor / 100).toFixed(2)}`
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Booking - Sweet Car Hire</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #764ba2;">New Booking Received</h2>
  
  <h3>Booking Reference: ${data.bookingId}</h3>
  
  <h4>Customer Information:</h4>
  <ul>
    <li><strong>Name:</strong> ${data.customerName}</li>
    <li><strong>Email:</strong> ${data.customerEmail}</li>
    <li><strong>WhatsApp:</strong> ${data.whatsappNumber}</li>
    ${data.flightNumber ? `<li><strong>Flight Number:</strong> ${data.flightNumber}</li>` : ""}
  </ul>
  
  <h4>Booking Details:</h4>
  <ul>
    <li><strong>Vehicle:</strong> ${data.carName}</li>
    <li><strong>Pickup:</strong> ${data.pickupDate} at ${data.pickupTime} - ${data.pickupLocation}</li>
    <li><strong>Return:</strong> ${data.returnDate} at ${data.returnTime} - ${data.dropoffLocation}</li>
    ${data.childSeat ? "<li><strong>Extra:</strong> Child Seat</li>" : ""}
    ${data.additionalDriver ? "<li><strong>Extra:</strong> Additional Driver</li>" : ""}
  </ul>
  
  <h4>Payment Information:</h4>
  <ul>
    <li><strong>Total Amount:</strong> ${formatAmount(data.totalAmountMinor)}</li>
    <li><strong>Deposit Paid:</strong> ${formatAmount(data.depositAmountMinor)}</li>
    <li><strong>Balance Due:</strong> ${formatAmount(data.totalAmountMinor - data.depositAmountMinor)}</li>
  </ul>
  
  <p style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-left: 4px solid #764ba2;">
    <strong>Action Required:</strong> Prepare vehicle for pickup on ${data.pickupDate}
  </p>
</body>
</html>
  `
}
