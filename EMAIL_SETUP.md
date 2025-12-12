# Email Configuration Guide

This guide explains how to set up email notifications for Sweet Car Hire bookings.

## Overview

The system sends two types of emails after successful payment:
1. **Customer Confirmation Email** - Sent to the customer with booking details (via Brevo)
2. **Admin Notification Email** - Sent to the admin with booking information (via Web3Forms)

## Quick Start (Recommended for Testing)

**The simplest way to get emails working:**

1. **Create Brevo Account**
   - Go to [brevo.com](https://www.brevo.com/) and sign up (free, no credit card)

2. **Get API Key**
   - Go to [app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)
   - Click "Generate a new API key"
   - Copy the key

3. **Verify Your Personal Email**
   - Go to [app.brevo.com/settings/senders](https://app.brevo.com/settings/senders)
   - Click "Add a new sender"
   - Enter your personal email (e.g., your Gmail address)
   - Check your email and click the verification link
   - ✅ **This takes 30 seconds and requires no DNS setup!**

4. **Add Environment Variables**
   \`\`\`env
   BREVO_API_KEY="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   BREVO_SENDER_EMAIL="youremail@gmail.com"
   BREVO_SENDER_NAME="Sweet Car Hire"
   \`\`\`

5. **Test It**
   - Go to `/dev/test-emails`
   - Click "Send Test Emails"
   - Check your inbox!

**That's it!** Emails will be sent from your personal email address. No DNS records needed.

---

## Advanced Setup (Custom Domain Email)

If you want emails to come from `bookings@sweetcarhire.com` instead of your personal email, you'll need to add DNS records. **This is optional and only needed for production.**

### DNS Records Required

Brevo will ask you to add these DNS records to your domain (sweetcarhire.com):

1. **Brevo Code Value** (TXT Record)
   - Type: `TXT`
   - Name: `@` or `sweetcarhire.com`
   - Value: `brevo-code:60e8e7936b190c5b35dd4055e30635be`
   - Purpose: Verifies you own the domain

2. **DKIM1** (CNAME Record)
   - Type: `CNAME`
   - Name: `mail._domainkey`
   - Value: `b1.sweetcarhire-com.dkim.brevo.com`
   - Purpose: Email authentication (prevents spam)

3. **DKIM2** (CNAME Record)
   - Type: `CNAME`
   - Name: `mail2._domainkey`
   - Value: `b2.sweetcarhire-com.dkim.brevo.com`
   - Purpose: Backup email authentication

4. **DMARC** (TXT Record)
   - Type: `TXT`
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`
   - Purpose: Email policy and reporting

### How to Add DNS Records

**Where to add these records depends on your domain registrar:**

- **Namecheap**: Dashboard → Domain List → Manage → Advanced DNS
- **GoDaddy**: My Products → Domains → DNS → Manage Zones
- **Cloudflare**: Dashboard → DNS → Records
- **Google Domains**: My Domains → DNS → Custom records

**Steps:**
1. Log in to your domain registrar
2. Find the DNS settings page
3. Add each record one by one
4. Wait 5-60 minutes for DNS propagation
5. Return to Brevo and click "Verify" on the sender email

**Note:** DNS changes can take up to 48 hours to fully propagate, but usually work within 5-60 minutes.

### Environment Variables for Custom Domain

\`\`\`env
BREVO_API_KEY="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
BREVO_SENDER_EMAIL="bookings@sweetcarhire.com"
BREVO_SENDER_NAME="Sweet Car Hire"
\`\`\`

---

## Email Services

### Brevo (Customer Emails) - FREE

Brevo (formerly Sendinblue) is used to send professional confirmation emails to customers.

**Benefits:**
- ✅ Completely free (300 emails/day = 9,000/month)
- ✅ Works from server-side (no browser restrictions)
- ✅ Simple REST API (just fetch)
- ✅ Excellent deliverability
- ✅ Supports HTML emails
- ✅ No complex SMTP configuration
- ✅ Works reliably in all environments including v0

**Setup Steps:**

1. **Create Brevo Account**
   - Go to [brevo.com](https://www.brevo.com/)
   - Sign up for a free account (no credit card required)
   - Free tier: 300 emails/day (9,000/month)

2. **Create API Key**
   - Go to Settings > SMTP & API > API Keys
   - Or visit directly: [app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)
   - Click "Generate a new API key"
   - Name it "Sweet Car Hire Bookings"
   - Copy the API key (you won't be able to see it again!)

3. **Verify Sender Email** (Required)
   
   **Option A: Simple (Personal Email) - Recommended for Testing**
   - Go to [app.brevo.com/settings/senders](https://app.brevo.com/settings/senders)
   - Add your personal email (e.g., youremail@gmail.com)
   - Check your email for verification link
   - Click the link to verify
   - ✅ **Done! No DNS records needed.**
   
   **Option B: Advanced (Custom Domain Email) - For Production**
   - Go to [app.brevo.com/settings/senders](https://app.brevo.com/settings/senders)
   - Add bookings@sweetcarhire.com
   - Brevo will show DNS records you need to add
   - Add the DNS records to your domain (see "Advanced Setup" above)
   - Wait for DNS propagation (5-60 minutes)
   - Return to Brevo and verify the sender
   
   **⚠️ CRITICAL: Emails will NOT be delivered until sender is verified!**
   - Brevo API will return success (201) even if sender is not verified
   - But emails will be silently dropped and not delivered
   - Always verify sender email before testing

4. **Add to Environment Variables**
   \`\`\`env
   BREVO_API_KEY="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   BREVO_SENDER_EMAIL="youremail@gmail.com"  # or bookings@sweetcarhire.com
   BREVO_SENDER_NAME="Sweet Car Hire"
   \`\`\`
   
   **Important:** These are server-side secrets. Do NOT use the `NEXT_PUBLIC_` prefix.

**Email Template:**
- Professional HTML email with Sweet Car Hire branding
- Includes booking reference, vehicle details, pickup/return info
- Shows complete payment summary (subtotal, VAT, total, deposit paid, balance due)
- Contains important information and contact details
- Responsive design that works on all devices

### Web3Forms (Admin Notifications) - FREE

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

- `BREVO_API_KEY` and `WEB3FORMS_KEY` are **server-side secrets**
- Never use the `NEXT_PUBLIC_` prefix for these variables
- These credentials should never be exposed to the client-side code
- They are only used in server-side API routes (`/api/emails/send-confirmation`)
- Keep your Brevo API key secure - treat it like a password

## Email Flow

\`\`\`
Customer completes booking
         ↓
Payment captured successfully
         ↓
/api/paypal/order/capture calls /api/emails/send-confirmation
         ↓
┌────────────────────────────────────┐
│  Send Customer Confirmation Email  │ → Brevo API
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
- ✓ Vehicle details with daily rate
- ✓ Pickup date, time, and location
- ✓ Return date, time, and location
- ✓ Selected extras (child seat, additional driver) with prices
- ✓ **Complete payment summary:**
  - Subtotal (always shown, never nil)
  - VAT 23% (always shown, never nil)
  - Total (always shown, never nil)
  - Deposit paid 15% (always shown, never nil)
  - Remaining balance 85% (always shown, never nil)
- ✓ Important information and next steps
- ✓ Contact information (email)

### Admin Notification Email Includes:
- ✓ Booking reference
- ✓ Customer contact details (name, email, phone)
- ✓ Vehicle and rental period
- ✓ Complete payment breakdown
- ✓ Reply-To set to customer's email for easy response

## Testing

Use the dev test page at `/dev/test-emails` to test email functionality:

1. Navigate to `https://sweetcarhire.com/dev/test-emails`
2. Review the pre-filled test booking data
3. Edit any fields if needed
4. Click "Send Test Emails"
5. Check both customer and admin inboxes

### Test Customer Email:
1. Complete a test booking with your email address
2. Complete payment through PayPal
3. Check your inbox for confirmation email
4. Verify all details are correct and prices are shown

### Test Admin Email:
1. Complete a test booking
2. Check admin email inbox
3. Verify booking notification received with all details

## Troubleshooting

### Customer Email Not Received:
- **⚠️ MOST COMMON ISSUE: Sender email not verified in Brevo**
  - Go to [Brevo Senders](https://app.brevo.com/settings/senders)
  - Verify that your sender email shows as "Verified" (green checkmark)
  - If not verified, click "Verify" and check your email for verification link
  - **Brevo will accept emails via API but NOT deliver them until sender is verified**
- Check spam/junk folder
- Verify `BREVO_API_KEY` is set correctly
- Verify `BREVO_SENDER_EMAIL` matches the verified email in Brevo
- Check Brevo dashboard > Logs for email status
- Check server logs for error messages (`console.log("[v0] ...")`)
- Ensure you haven't exceeded the 300 emails/day limit

### Brevo API Errors:
- **401 Unauthorized**: API key is invalid or not set
- **403 Forbidden**: Sender email not verified (verify in Brevo dashboard)
- **429 Too Many Requests**: Exceeded rate limit (300 emails/day on free tier)

### Admin Email Not Received:
- Check spam/junk folder
- Verify `WEB3FORMS_KEY` is set
- Check Web3Forms dashboard for submission
- Verify recipient email in Web3Forms settings

### "Cannot read properties of undefined (reading 'subtotal')" Error:
- This has been fixed with proper null checks in email templates
- All prices now default to €0.00 if undefined
- Email templates handle both flat and nested pricing structures

### Email Sending Fails:
- Check server logs for detailed error messages
- Verify all environment variables are set in the Vars section
- Ensure `APP_BASE_URL` is set correctly
- Test Brevo API key in their dashboard

## Production Checklist

- [ ] Brevo account created
- [ ] Brevo API key created
- [ ] Sender email verified in Brevo (personal email OR custom domain)
- [ ] If using custom domain: DNS records added and verified
- [ ] Brevo API key added to environment variables
- [ ] Sender email and name configured in environment variables
- [ ] Web3Forms account created and access key added
- [ ] Admin email configured in Web3Forms
- [ ] Environment variables set correctly (without NEXT_PUBLIC_ prefix)
- [ ] Test booking completed successfully via `/dev/test-emails`
- [ ] Customer confirmation email received with all price details
- [ ] Admin notification email received
- [ ] Email templates reviewed and approved
- [ ] Spam folder checked (emails not going to spam)
- [ ] Reply-To functionality tested (admin can reply to customer)

## Email Deliverability Tips

1. **Verify Sender Email**: Always verify your sender email in Brevo
2. **Use Personal Email for Testing**: Start with a verified personal email (Gmail, etc.)
3. **Add DNS Records for Production**: Only add DNS records when ready for production
4. **Monitor Logs**: Check Brevo Logs dashboard regularly
5. **Test Regularly**: Send test bookings to different email providers (Gmail, Outlook, Yahoo, etc.)
6. **Avoid Spam Triggers**: The templates are designed to avoid spam filters
7. **Keep Content Professional**: Avoid excessive use of promotional language

## Comparison: Personal Email vs. Custom Domain

| Feature | Personal Email (Gmail, etc.) | Custom Domain (bookings@sweetcarhire.com) |
|---------|------------------------------|-------------------------------------------|
| **Setup Time** | 30 seconds | 30-60 minutes |
| **DNS Records** | ❌ Not needed | ✅ Required (4 records) |
| **Verification** | ✅ Click email link | ✅ Click email link + DNS |
| **Deliverability** | ✅ Excellent | ✅ Excellent (after DNS) |
| **Professional Look** | ⚠️ Shows personal email | ✅ Shows business email |
| **Best For** | Testing, development | Production |

**Recommendation:** Start with a personal email for testing, then switch to custom domain for production.

## Support

If you encounter issues with email delivery:
- Check Brevo documentation: [developers.brevo.com](https://developers.brevo.com/)
- Check Web3Forms documentation: [web3forms.com/docs](https://web3forms.com/docs)
- Review server logs for detailed error messages (`console.log("[v0] ...")`)
- Use the `/dev/test-emails` page for debugging
- Verify all environment variables are set in the Vars section of v0
- Check Brevo Logs dashboard for email delivery status

## Why Brevo?

Brevo (formerly Sendinblue) is the best choice because:

1. **Works Server-Side**: Unlike EmailJS which only works in browsers
2. **No Runtime Issues**: Unlike nodemailer which has runtime errors in v0
3. **Simple Verification**: Just verify sender email, DNS optional for testing
4. **Simple API**: Just a fetch call, no SDK or complex configuration
5. **Reliable**: Industry-standard email service with excellent deliverability
6. **Generous Free Tier**: 300 emails/day (3x more than SendGrid)
7. **Good Documentation**: Easy to set up and troubleshoot
8. **No Credit Card Required**: Completely free to start
9. **Flexible**: Use personal email for testing, custom domain for production
\`\`\`

\`\`\`env file="" isHidden
