export interface BookingEmailData {
  bookingId: string
  bookingDate: string
  customerName: string
  customerEmail: string
  customerPhone: string
  carName: string
  carType?: string
  pickupDate: string
  pickupTime: string
  pickupLocation: string
  returnDate: string
  returnTime: string
  returnLocation: string
  extras?: Array<{ name: string; price: number }>
  specialRequests?: string
  // Support both flat and nested pricing structures
  subtotal?: number
  vat?: number
  total?: number
  pricing?: {
    subtotal: number
    vat: number
    total: number
  }
}

// Helper function to safely format prices
function formatPrice(amount: number | undefined): string {
  if (amount === undefined || amount === null) {
    return "€0.00"
  }
  return `€${amount.toFixed(2)}`
}

// Helper function to format dates
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

// Helper function to get pricing from either flat or nested structure
function getPricing(booking: BookingEmailData): { subtotal: number; vat: number; total: number } {
  return {
    subtotal: booking.pricing?.subtotal ?? booking.subtotal ?? 0,
    vat: booking.pricing?.vat ?? booking.vat ?? 0,
    total: booking.pricing?.total ?? booking.total ?? 0,
  }
}

export function generateCustomerConfirmationEmail(booking: BookingEmailData): string {
  const pricing = getPricing(booking)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #1a365d 0%, #d946aa 100%); color: white; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0 0 10px 0; font-size: 32px; }
    .header p { margin: 0; font-size: 18px; opacity: 0.9; }
    .content { padding: 30px 20px; }
    .section { background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #d946aa; }
    .section-title { font-size: 18px; font-weight: bold; color: #1a365d; margin: 0 0 15px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #6c757d; font-weight: 500; }
    .value { font-weight: bold; color: #1a365d; text-align: right; }
    .total-section { background: #1a365d; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .total-row { display: flex; justify-content: space-between; align-items: center; }
    .total-label { font-size: 18px; }
    .total-value { font-size: 32px; font-weight: bold; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
    @media only screen and (max-width: 600px) {
      .detail-row { flex-direction: column; }
      .value { text-align: left; margin-top: 5px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 Sweet Car Hire</h1>
      <p>Booking Confirmation</p>
    </div>
    
    <div class="content">
      <h2 style="color: #1a365d; margin-top: 0;">Thank You, ${booking.customerName}!</h2>
      <p style="color: #6c757d; font-size: 16px;">Your booking has been confirmed. Here are your reservation details:</p>
      
      <div class="alert">
        <strong>📋 Booking Reference: ${booking.bookingId}</strong>
        <p style="margin: 10px 0 0 0;">Please save this reference number for your records.</p>
      </div>

      <div class="section">
        <div class="section-title">🚗 Vehicle Details</div>
        <div class="detail-row">
          <span class="label">Vehicle:</span>
          <span class="value">${booking.carName}</span>
        </div>
        ${booking.carType ? `<div class="detail-row"><span class="label">Category:</span><span class="value">${booking.carType}</span></div>` : ""}
      </div>

      <div class="section">
        <div class="section-title">📅 Rental Period</div>
        <div class="detail-row">
          <span class="label">Pickup:</span>
          <span class="value">${formatDate(booking.pickupDate)} at ${booking.pickupTime}</span>
        </div>
        <div class="detail-row">
          <span class="label">Return:</span>
          <span class="value">${formatDate(booking.returnDate)} at ${booking.returnTime}</span>
        </div>
        <div class="detail-row">
          <span class="label">Pickup Location:</span>
          <span class="value">${booking.pickupLocation}</span>
        </div>
        <div class="detail-row">
          <span class="label">Return Location:</span>
          <span class="value">${booking.returnLocation}</span>
        </div>
      </div>

      ${
        booking.extras && booking.extras.length > 0
          ? `
      <div class="section">
        <div class="section-title">➕ Additional Extras</div>
        ${booking.extras.map((extra) => `<div class="detail-row"><span class="label">${extra.name}:</span><span class="value">${formatPrice(extra.price)}</span></div>`).join("")}
      </div>
      `
          : ""
      }

      <div class="total-section">
        <div class="total-row">
          <span class="total-label">Total Amount:</span>
          <span class="total-value">${formatPrice(pricing.total)}</span>
        </div>
        <div style="margin-top: 10px; opacity: 0.9; font-size: 14px;">
          <div>Subtotal: ${formatPrice(pricing.subtotal)}</div>
          <div>VAT (18%): ${formatPrice(pricing.vat)}</div>
        </div>
      </div>

      ${
        booking.specialRequests
          ? `
      <div class="section">
        <div class="section-title">💬 Your Special Requests</div>
        <p style="margin: 0; white-space: pre-wrap;">${booking.specialRequests}</p>
      </div>
      `
          : ""
      }

      <div class="alert">
        <strong>⚠️ Important - Next Steps</strong>
        <p style="margin: 10px 0 0 0;">Our team will contact you within 24 hours to arrange payment details and confirm your reservation. Please have your booking reference ready.</p>
      </div>

      <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <strong style="color: #1976d2;">📋 What to Bring:</strong>
        <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #1976d2;">
          <li>This booking confirmation</li>
          <li>Valid driver's license</li>
          <li>Credit card for security deposit</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>Sweet Car Hire</strong></p>
      <p>Malta's Premier Car Rental Service</p>
      <p>📧 info@sweetcarhire.com | 📞 +356 1234 5678</p>
      <p style="margin-top: 15px; font-size: 12px;">
        If you have any questions, please don't hesitate to contact us.
      </p>
    </div>
  </div>
</body>
</html>
`
}

export function generateAdminNotificationEmail(booking: BookingEmailData): string {
  const pricing = getPricing(booking)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a365d 0%, #d946aa 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #d946aa; }
    .section-title { font-size: 18px; font-weight: bold; color: #1a365d; margin-bottom: 15px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #6c757d; font-weight: 500; }
    .value { font-weight: bold; color: #1a365d; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🚗 New Booking Received</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${booking.bookingId}</p>
    </div>
    
    <div class="content">
      <div class="alert">
        <strong>⚠️ Action Required:</strong> Contact customer within 24 hours to arrange payment details.
      </div>

      <div class="section">
        <div class="section-title">📋 Booking Details</div>
        <div class="detail-row">
          <span class="label">Booking ID:</span>
          <span class="value">${booking.bookingId}</span>
        </div>
        <div class="detail-row">
          <span class="label">Booking Date:</span>
          <span class="value">${formatDate(booking.bookingDate)}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">👤 Customer Information</div>
        <div class="detail-row">
          <span class="label">Name:</span>
          <span class="value">${booking.customerName}</span>
        </div>
        <div class="detail-row">
          <span class="label">Email:</span>
          <span class="value"><a href="mailto:${booking.customerEmail}">${booking.customerEmail}</a></span>
        </div>
        <div class="detail-row">
          <span class="label">Phone:</span>
          <span class="value"><a href="tel:${booking.customerPhone}">${booking.customerPhone}</a></span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🚗 Vehicle Details</div>
        <div class="detail-row">
          <span class="label">Vehicle:</span>
          <span class="value">${booking.carName}</span>
        </div>
        ${booking.carType ? `<div class="detail-row"><span class="label">Category:</span><span class="value">${booking.carType}</span></div>` : ""}
      </div>

      <div class="section">
        <div class="section-title">📅 Rental Period</div>
        <div class="detail-row">
          <span class="label">Pickup:</span>
          <span class="value">${formatDate(booking.pickupDate)} at ${booking.pickupTime}</span>
        </div>
        <div class="detail-row">
          <span class="label">Return:</span>
          <span class="value">${formatDate(booking.returnDate)} at ${booking.returnTime}</span>
        </div>
        <div class="detail-row">
          <span class="label">Pickup Location:</span>
          <span class="value">${booking.pickupLocation}</span>
        </div>
        <div class="detail-row">
          <span class="label">Return Location:</span>
          <span class="value">${booking.returnLocation}</span>
        </div>
      </div>

      ${
        booking.extras && booking.extras.length > 0
          ? `
      <div class="section">
        <div class="section-title">➕ Additional Extras</div>
        ${booking.extras.map((extra) => `<div class="detail-row"><span class="label">${extra.name}:</span><span class="value">${formatPrice(extra.price)}</span></div>`).join("")}
      </div>
      `
          : ""
      }

      <div class="section" style="background: #1a365d; color: white; border-left: none;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 14px; opacity: 0.8; margin-bottom: 5px;">Total Amount</div>
            <div style="font-size: 32px; font-weight: bold;">${formatPrice(pricing.total)}</div>
          </div>
          <div style="text-align: right; opacity: 0.9;">
            <div>Subtotal: ${formatPrice(pricing.subtotal)}</div>
            <div>VAT (18%): ${formatPrice(pricing.vat)}</div>
          </div>
        </div>
      </div>

      ${
        booking.specialRequests
          ? `
      <div class="section">
        <div class="section-title">💬 Special Requests</div>
        <p style="margin: 0; white-space: pre-wrap;">${booking.specialRequests}</p>
      </div>
      `
          : ""
      }
    </div>
  </div>
</body>
</html>
`
}
