# PayPal Live Integration Setup

## Environment Variables

Add these to your Vercel project environment variables:

### Required Variables

\`\`\`env
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
PAYPAL_ENV=live
PAYPAL_WEBHOOK_ID=your_webhook_id
APP_BASE_URL=https://sweetcarhire.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
\`\`\`

## Webhook Setup

1. Go to PayPal Developer Dashboard: https://developer.paypal.com/dashboard/
2. Navigate to Apps & Credentials → Live
3. Select your app
4. Scroll to "Webhooks" section
5. Click "Add Webhook"
6. Enter webhook URL: `https://sweetcarhire.com/api/webhooks/paypal`
7. Select these event types:
   - `CHECKOUT.ORDER.APPROVED`
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
8. Save and copy the Webhook ID
9. Add the Webhook ID to your environment variables as `PAYPAL_WEBHOOK_ID`

## Testing Checklist

### Before Going Live

- [ ] Switch `PAYPAL_ENV` from `sandbox` to `live`
- [ ] Update `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` with live credentials
- [ ] Update `NEXT_PUBLIC_PAYPAL_CLIENT_ID` with live client ID
- [ ] Set `APP_BASE_URL` to `https://sweetcarhire.com`
- [ ] Configure webhook at `https://sweetcarhire.com/api/webhooks/paypal`
- [ ] Add `PAYPAL_WEBHOOK_ID` to environment variables
- [ ] Test payment flow with a small amount
- [ ] Verify webhook events are received and processed
- [ ] Check email notifications are sent correctly
- [ ] Verify booking status updates correctly

### Security Checklist

- [x] All API calls use HTTPS
- [x] PayPal credentials stored in environment variables (not in code)
- [x] Webhook signature verification implemented
- [x] Idempotency implemented (PayPal-Request-Id headers)
- [x] Duplicate event detection (event ID tracking)
- [x] Server-side amount validation
- [x] PCI DSS compliant (no card data on our servers)
- [x] SSL/TLS encryption for all communications

### Payment Flow

1. **Client**: User completes booking form
2. **Server**: Create booking with PENDING status
3. **Client**: Redirect to payment page
4. **Client**: Load PayPal SDK with live credentials
5. **Client**: User clicks PayPal button
6. **Server**: Create PayPal order (15% deposit)
7. **PayPal**: User completes payment in PayPal UI
8. **Server**: Capture payment
9. **Server**: Update booking status to DEPOSIT_PAID
10. **Webhook**: Receive PAYMENT.CAPTURE.COMPLETED event
11. **Server**: Send confirmation emails
12. **Client**: Redirect to success page

### API Endpoints

- `POST /api/bookings/create` - Create booking
- `POST /api/paypal/order/create` - Create PayPal order
- `POST /api/paypal/order/capture` - Capture payment
- `POST /api/webhooks/paypal` - Handle PayPal webhooks
- `POST /api/payments/refund` - Refund payment (admin only)

### Webhook Events

- `CHECKOUT.ORDER.APPROVED` - Order approved (log only)
- `PAYMENT.CAPTURE.COMPLETED` - Payment captured successfully
- `PAYMENT.CAPTURE.DENIED` - Payment denied/failed

### Support

For issues or questions:
- PayPal Developer Support: https://developer.paypal.com/support/
- PayPal Integration Guide: https://developer.paypal.com/docs/checkout/
