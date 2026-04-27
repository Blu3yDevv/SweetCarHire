# Sweet Car Hire Booking System - Test Plan

## Test Scenarios

### Test 1: Same-Day Booking (09:00→15:00)
**Objective:** Verify that same-day pickup and drop-off counts as 1 day

**Steps:**
1. Navigate to booking page
2. Select pickup date: Today's date
3. Select pickup time: 09:00
4. Select drop-off date: Same day
5. Select drop-off time: 15:00
6. Select Suzuki Dzire (€45/day)
7. Proceed through booking steps

**Expected Result:**
- Duration: 1 day (6 hours < 24 hours)
- Subtotal: €45
- VAT (15%): €6.75
- Total: €51.75

---

### Test 2: Next-Day Booking Under 24 Hours (10:00→09:59)
**Objective:** Verify that bookings under 24 hours count as 1 day

**Steps:**
1. Navigate to booking page
2. Select pickup date: Today's date
3. Select pickup time: 10:00
4. Select drop-off date: Tomorrow
5. Select drop-off time: 09:59
6. Select Suzuki Dzire (€45/day)
7. Proceed through booking steps

**Expected Result:**
- Duration: 1 day (23.98 hours, ceil(23.98/24) = 1)
- Subtotal: €45
- VAT (15%): €6.75
- Total: €51.75

---

### Test 3: Next-Day Booking Over 24 Hours (10:00→10:01)
**Objective:** Verify that bookings over 24 hours count as 2 days

**Steps:**
1. Navigate to booking page
2. Select pickup date: Today's date
3. Select pickup time: 10:00
4. Select drop-off date: Tomorrow
5. Select drop-off time: 10:01
6. Select Suzuki Dzire (€45/day)
7. Proceed through booking steps

**Expected Result:**
- Duration: 2 days (24.02 hours, ceil(24.02/24) = 2)
- Subtotal: €90 (€45 × 2)
- VAT (15%): €13.50
- Total: €103.50

---

### Test 4: 28-Day Booking at €45/day
**Objective:** Verify correct calculation for multi-day booking with VAT

**Steps:**
1. Navigate to booking page
2. Select pickup date: Today's date
3. Select pickup time: 10:00
4. Select drop-off date: 28 days from today
5. Select drop-off time: 10:00
6. Select Suzuki Dzire (€45/day)
7. Proceed through booking steps

**Expected Result:**
- Duration: 28 days
- Subtotal: €1,260 (€45 × 28)
- VAT (15%): €189
- Total: €1,449 ✓

---

### Test 5: Contact Information Delivery & Reply-To
**Objective:** Verify admin receives customer contact information with Reply-To header

**Steps:**
1. Complete a booking with test data:
   - Name: Test Customer
   - Email: test@example.com
   - WhatsApp: +248 1234567
   - Country: Seychelles
2. Submit booking
3. Check admin email (configured in Web3Forms)
4. Click "Reply" in email client

**Expected Result:**
- Admin receives email with subject: "New Car Rental Booking - SCH-XXXXXX"
- Email contains clearly formatted customer contact section at the top:
  - Name: Test Customer
  - Email: test@example.com
  - WhatsApp: +248 1234567
  - Country: Seychelles
- Reply-To header is set to test@example.com (RFC 5322 compliant)
- Clicking "Reply" automatically addresses email to test@example.com
- Email includes complete pricing breakdown with VAT

---

### Test 6: Extras Calculation Per Day
**Objective:** Verify extras are calculated per day and included in subtotal before VAT

**Steps:**
1. Select 7-day booking
2. Select Suzuki Fronx (€60/day)
3. Add Child Seat (€5/day)
4. Add Additional Driver (€10/day)
5. Review pricing

**Expected Result:**
- Car Rental: €60 × 7 = €420
- Child Seat: €5 × 7 = €35
- Additional Driver: €10 × 7 = €70
- Subtotal: €525 (€420 + €35 + €70)
- VAT (15%): €78.75 (€525 × 0.15)
- Total: €603.75

---

### Test 7: Mandatory Fields Validation
**Objective:** Verify all required fields are enforced

**Steps:**
1. Navigate to booking page
2. Try to proceed without filling required fields
3. Attempt to submit with missing:
   - Name
   - Email
   - WhatsApp
   - Country

**Expected Result:**
- Cannot proceed to next step without required fields
- Browser shows validation messages for empty required fields
- Form submission is blocked until all mandatory fields are filled
- HTML5 `required` attribute enforces validation

---

### Test 8: Drop-off Before Pickup Prevention
**Objective:** Verify system prevents drop-off before pickup

**Steps:**
1. Select pickup date: Tomorrow
2. Select pickup time: 14:00
3. Select drop-off date: Today
4. Select drop-off time: 10:00

**Expected Result:**
- System automatically corrects drop-off to be after pickup
- Drop-off date is auto-adjusted to next day at same time
- User cannot submit booking with drop-off before pickup

---

### Test 9: Server-Side Pricing Validation
**Objective:** Verify server re-validates pricing to prevent tampering

**Steps:**
1. Complete a booking normally
2. Server action `submitBooking` is called
3. Server recalculates pricing using shared pricing module

**Expected Result:**
- Server uses same `computePrice` function as client
- Pricing is validated on server before email is sent
- Any discrepancy would result in error
- Booking reference is only generated after successful validation

---

## Web3Forms Configuration Checklist

- [ ] Access key is valid: `ff2074c5-af87-401e-ae78-3398f2644261`
- [ ] Recipient email is configured in Web3Forms dashboard
- [ ] Reply-To field is set to customer email (`replyto` parameter)
- [ ] Email deliverability is tested (check spam folder)
- [ ] Form submission returns success response
- [ ] Admin receives formatted email with all customer details
- [ ] Reply button in email client addresses customer email

---

## Duration Calculation Logic (RFC Reference: MDN JavaScript Date)

\`\`\`typescript
// Test Case 1: Same-day 09:00→15:00
Pickup: 2024-01-15T09:00
Drop-off: 2024-01-15T15:00
Hours: 6 hours
Calculation: Math.max(1, Math.ceil(6 / 24)) = 1 day ✓

// Test Case 2: Next-day 10:00→09:59
Pickup: 2024-01-15T10:00
Drop-off: 2024-01-16T09:59
Hours: 23.98 hours
Calculation: Math.max(1, Math.ceil(23.98 / 24)) = 1 day ✓

// Test Case 3: Next-day 10:00→10:01
Pickup: 2024-01-15T10:00
Drop-off: 2024-01-16T10:01
Hours: 24.02 hours
Calculation: Math.max(1, Math.ceil(24.02 / 24)) = 2 days ✓

// Test Case 4: 28-day booking
Pickup: 2024-01-15T10:00
Drop-off: 2024-02-12T10:00
Hours: 672 hours (28 × 24)
Calculation: Math.max(1, Math.ceil(672 / 24)) = 28 days ✓
\`\`\`

---

## VAT Calculation Formula (15% Tax Rate)

\`\`\`
Subtotal = (dailyRate + extrasPerDay) × rentalDays
VAT = Subtotal × 0.15
Total = Subtotal + VAT

Example 1 (28-day Dzire, no extras):
Subtotal = (€45 + €0) × 28 = €1,260
VAT = €1,260 × 0.15 = €189
Total = €1,260 + €189 = €1,449 ✓

Example 2 (7-day Fronx with extras):
Subtotal = (€60 + €5 + €10) × 7 = €525
VAT = €525 × 0.15 = €78.75
Total = €525 + €78.75 = €603.75 ✓
\`\`\`

---

## Shared Pricing Module

The pricing logic is implemented in `lib/pricing.ts` and used by:
1. **Client-side** (`app/booking/page.tsx`): Real-time price updates as user selects options
2. **Server-side** (`app/actions/booking.ts`): Re-validates pricing before sending confirmation

This ensures:
- Single source of truth for pricing calculations
- Protection against client-side tampering
- Consistent pricing across all touchpoints
- Easy maintenance and updates to pricing logic

---

## Contact Information Flow

1. **Form Collection**: Name, email, WhatsApp, country (all required)
2. **Client Validation**: HTML5 `required` attribute enforces completion
3. **Server Submission**: Server action receives all contact data
4. **Email Generation**: Formatted email with contact section at top
5. **Reply-To Header**: RFC 5322 compliant `replyto` field set to customer email
6. **Admin Notification**: Admin receives email and can reply directly to customer

---

## Notes

- All dates use local time (not UTC) via `datetime-local` input type
- Pricing calculations round to 2 decimal places
- VAT is always 15% and added at checkout (not included in base prices)
- Minimum rental duration is 1 day
- Server-side validation prevents pricing manipulation
- Web3Forms handles email delivery with Reply-To support
