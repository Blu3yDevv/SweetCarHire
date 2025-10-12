# Email Configuration Guide

This guide explains how to set up email notifications for Sweet Car Hire bookings.

## Overview

The system sends two types of emails after successful payment:
1. **Customer Confirmation Email** - Sent to the customer with booking details
2. **Admin Notification Email** - Sent to the admin with booking information

## Email Services

### Resend (Customer Emails)

Resend is used to send professional confirmation emails to customers.

**Setup Steps:**

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account (100 emails/day free tier)

2. **Get API Key**
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Verify Domain (Recommended for Production)**
   - Go to Domains section
   - Add your domain: `sweetcarhire.com`
   - Follow DNS verification steps
   - This improves deliverability and allows sending from `bookings@sweetcarhire.com`

4. **Add to Environment Variables**
   \`\`\`env
   RESEND_API_KEY="re_your_actual_api_key_here"
   \`\`\`
   
   **Important:** This is a server-side secret. Do NOT use the `NEXT_PUBLIC_` prefix.

**Email Template:**
- Professional HTML email with Sweet Car Hire branding
- Includes booking reference, vehicle details, pickup/return info
- Shows payment summary (deposit paid, balance due)
- Contains important information and contact details

### Web3Forms (Admin Notifications)

Web3Forms is used to send admin notifications to your email.

**Setup Steps:**

1. **Create Web3Forms Account**
   - Go to [web3forms.com](https://web3forms.com)
   - Sign up for a free account

2. **Get Access Key**
   - Create a new form
   - Copy the access key

3. **Add to Environment Variables**
   \`\`\`env
   WEB3FORMS_KEY="your_web3forms_access_key"
   \`\`\`
   
   **Important:** This is a server-side secret. Do NOT use the `NEXT_PUBLIC_` prefix.

4. **Configure Recipient**
   - Set your admin email in Web3Forms dashboard
   - This is where booking notifications will be sent

## Security Notes

⚠️ **Important Security Information:**

- Both `RESEND_API_KEY` and `WEB3FORMS_KEY` are **server-side secrets**
- Never use the `NEXT_PUBLIC_` prefix for these variables
- These keys should never be exposed to the client-side code
- They are only used in server-side API routes (`/api/emails/send-confirmation`)

## Email Flow

\`\`\`
Customer completes booking
         ↓
Payment captured successfully
         ↓
/api/paypal/order/capture calls /api/emails/send-confirmation
         ↓
┌────────────────────────────────────┐
│  Send Customer Confirmation Email  │ → Resend API
│  (Professional HTML template)      │
└────────────────────────────────────┘
         ↓
┌────────────────────────────────────┐
│  Send Admin Notification Email     │ → Web3Forms API
│  (Booking details for admin)       │
└────────────────────────────────────┘
         ↓
Customer redirected to success page
\`\`\`

## Email Content

### Customer Confirmation Email Includes:
- ✓ Booking reference number
- ✓ Customer name and contact info
- ✓ Vehicle details
- ✓ Pickup date, time, and location
- ✓ Return date, time, and location
- ✓ Selected extras (child seat, additional driver)
- ✓ Payment summary (total, deposit paid, balance due)
- ✓ Important information and next steps
- ✓ Contact information (WhatsApp, email)

### Admin Notification Email Includes:
- ✓ Booking reference
- ✓ Customer contact details
- ✓ Vehicle and rental period
- ✓ Payment information
- ✓ Action required notice

## Testing

### Test Customer Email:
1. Complete a test booking with your email address
2. Complete payment through PayPal
3. Check your inbox for confirmation email
4. Verify all details are correct

### Test Admin Email:
1. Complete a test booking
2. Check admin email inbox
3. Verify booking notification received

## Troubleshooting

### Customer Email Not Received:
- Check spam/junk folder
- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard for delivery status
- Verify domain is verified (for production)

### Admin Email Not Received:
- Check spam/junk folder
- Verify WEB3FORMS_KEY is set
- Check Web3Forms dashboard for submission
- Verify recipient email in Web3Forms settings

### Email Sending Fails:
- Check server logs for error messages
- Verify API keys are valid
- Check rate limits (Resend: 100/day free tier)
- Ensure APP_BASE_URL is set correctly

## Production Checklist

- [ ] Resend account created and API key added
- [ ] Domain verified in Resend (sweetcarhire.com)
- [ ] Web3Forms account created and access key added
- [ ] Admin email configured in Web3Forms
- [ ] Environment variables set correctly (without NEXT_PUBLIC_ prefix)
- [ ] Test booking completed successfully
- [ ] Customer confirmation email received
- [ ] Admin notification email received
- [ ] Email templates reviewed and approved
- [ ] Spam folder checked (emails not going to spam)

## Email Deliverability Tips

1. **Verify Your Domain**: Always verify your domain in Resend for better deliverability
2. **SPF/DKIM Records**: Resend provides these automatically when you verify your domain
3. **Monitor Bounce Rates**: Check Resend dashboard for bounced emails
4. **Test Regularly**: Send test bookings to different email providers (Gmail, Outlook, etc.)
5. **Avoid Spam Triggers**: The templates are designed to avoid spam filters

## Support

If you encounter issues with email delivery:
- Check Resend documentation: [resend.com/docs](https://resend.com/docs)
- Check Web3Forms documentation: [web3forms.com/docs](https://web3forms.com/docs)
- Review server logs for detailed error messages
- Contact support if issues persist
