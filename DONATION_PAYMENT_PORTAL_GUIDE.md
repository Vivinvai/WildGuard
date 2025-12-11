# Donation Payment Portal Setup Guide

## 🎯 Overview
The WildGuard donation system is now fully integrated with **Razorpay** payment gateway, supporting multiple payment methods including:
- Credit/Debit Cards (Visa, Mastercard, RuPay)
- UPI (Google Pay, PhonePe, Paytm, BHIM)
- Net Banking
- Wallets (Paytm, Mobikwik, etc.)

## 📋 Features Implemented

### Backend Features ✅
- **Payment Gateway Integration**: Razorpay payment order creation
- **Payment Verification**: Secure signature verification using HMAC SHA256
- **Email Receipts**: Automated donation receipts with beautiful HTML templates
- **Tax Certificates**: Ready for Section 80G tax certificate generation
- **Donation Tracking**: Complete donation history with payment status
- **Receipt Management**: Unique receipt numbers for each donation

### Frontend Features ✅
- **Donation Tiers**: Pre-defined amounts (₹500, ₹1000, ₹2500, ₹5000)
- **Custom Amounts**: Support for any donation amount (minimum ₹100)
- **Razorpay Integration**: Seamless payment modal with prefilled donor details
- **Payment Status**: Real-time payment processing status
- **Receipt Display**: Donation confirmation with receipt number
- **Tax Information**: Section 80G tax benefit information

### Database Features ✅
- **Donations Table**: Complete schema with payment tracking
- **Payment Status**: Tracks pending/completed/failed payments
- **Transaction IDs**: Razorpay transaction tracking
- **Receipt Numbers**: Unique receipt generation (WG-TIMESTAMP-RANDOM)
- **Tax Certificates**: Boolean flag for certificate issuance

## 🔧 Setup Instructions

### Step 1: Create Razorpay Account
1. Visit [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Sign up with your email and phone number
3. Complete KYC verification (required for live mode)
4. Navigate to **Settings → API Keys**

### Step 2: Get API Keys

#### Test Mode (For Development)
1. In Razorpay Dashboard, go to **Settings → API Keys**
2. Click "Generate Test Key" (if not already generated)
3. Copy both:
   - **Key ID**: `rzp_test_xxxxxx`
   - **Key Secret**: `xxxxxxxxxx` (click "Download Key Details")

#### Live Mode (For Production)
1. Complete KYC verification
2. Activate your account
3. Go to **Settings → API Keys**
4. Click "Generate Live Key"
5. Copy both:
   - **Key ID**: `rzp_live_xxxxxx`
   - **Key Secret**: `xxxxxxxxxx`

### Step 3: Configure Environment Variables

Create a `.env` file in the project root (if it doesn't exist):

```bash
# Copy from .env.example
cp .env.example .env
```

Add Razorpay credentials:

```env
# Payment Gateway Configuration (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### Step 4: Configure Email Service (Optional)

For automatic donation receipts via email:

```env
# Email Service Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
EMAIL_FROM=WildGuard <noreply@wildguard.org>
```

#### Gmail App Password Setup:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to **App Passwords**
4. Generate a password for "Mail"
5. Use this password in `SMTP_PASSWORD`

### Step 5: Test the Integration

1. **Start the servers**:
```bash
npm run dev
```

2. **Navigate to donation page**:
```
http://localhost:5000/donate
```

3. **Test with Razorpay test cards**:
   - **Successful Payment**: `4111 1111 1111 1111`
   - **Failed Payment**: `4111 1111 1111 1234`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Name: Any name

4. **Check email for receipt** (if email service configured)

### Step 6: Webhook Configuration (Optional)

For production, configure webhooks for payment notifications:

1. In Razorpay Dashboard, go to **Settings → Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/donations/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret
5. Add to `.env`:
```env
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

## 💳 Payment Flow

### Complete Payment Flow:
```
User fills donation form
    ↓
Frontend calls /api/donations/create
    ↓
Backend creates Razorpay payment order
    ↓
Backend saves donation (status: pending)
    ↓
Backend returns order_id to frontend
    ↓
Frontend opens Razorpay payment modal
    ↓
User completes payment
    ↓
Razorpay returns payment_id + signature
    ↓
Frontend calls /api/donations/verify
    ↓
Backend verifies signature
    ↓
Backend updates donation (status: completed)
    ↓
Backend sends email receipt
    ↓
User receives confirmation
```

## 🧪 Testing Checklist

- [ ] Test Mode API keys configured
- [ ] Payment modal opens correctly
- [ ] Test card payment successful
- [ ] Payment verification works
- [ ] Donation saved to database
- [ ] Email receipt sent (if configured)
- [ ] Receipt number generated correctly
- [ ] Payment status updated to 'completed'
- [ ] Error handling for failed payments
- [ ] Cancellation handling works

## 🚀 Going Live

### Before Production:
1. ✅ Complete Razorpay KYC verification
2. ✅ Replace test API keys with live keys
3. ✅ Configure production email service
4. ✅ Set up webhook endpoint
5. ✅ Test with small real payments
6. ✅ Enable HTTPS/SSL certificate
7. ✅ Set up monitoring and alerts

### Security Checklist:
- [ ] API keys stored in environment variables (not in code)
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS enabled for production
- [ ] Payment signature verification enabled
- [ ] Rate limiting configured
- [ ] SQL injection protection (using Drizzle ORM)
- [ ] XSS protection enabled

## 📊 Database Schema

```typescript
donations = {
  id: UUID (primary key)
  name: string (donor name)
  email: string (donor email)
  amount: number (donation amount)
  message: string (optional message)
  paymentMethod: string (card/upi/netbanking)
  paymentStatus: string (pending/completed/failed)
  transactionId: string (Razorpay payment_id)
  receiptNumber: string (unique, e.g., WG-1234567890-ABC123)
  taxCertificateIssued: boolean (false by default)
  createdAt: timestamp
}
```

## 📧 Email Receipt Template

The system automatically sends a beautiful HTML email receipt with:
- WildGuard branding
- Donation amount and receipt number
- Donor information
- Payment details
- Impact statement
- Tax benefit information (Section 80G)
- Thank you message

## 🛠️ Troubleshooting

### Payment Modal Not Opening
- **Check**: Razorpay script loaded in `index.html`
- **Check**: `RAZORPAY_KEY_ID` configured in `.env`
- **Check**: Browser console for errors

### Payment Verification Failed
- **Check**: `RAZORPAY_KEY_SECRET` is correct
- **Check**: Signature verification in backend logs
- **Check**: Payment ID matches order ID

### Email Not Sending
- **Check**: SMTP credentials in `.env`
- **Check**: Gmail app password (not regular password)
- **Check**: Email service enabled in backend logs

### Database Errors
- **Check**: PostgreSQL connection
- **Check**: Database migrations run
- **Check**: Donations table exists

## 📝 API Endpoints

### Create Donation
```
POST /api/donations/create
Body: {
  name: string,
  email: string,
  amount: number,
  message?: string,
  paymentMethod: string
}
Response: {
  donation: {...},
  paymentOrder: {
    id: string,
    amount: number,
    currency: string,
    razorpayKeyId: string
  }
}
```

### Verify Payment
```
POST /api/donations/verify
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}
Response: {
  success: boolean,
  donation: {...}
}
```

### Get Donations
```
GET /api/donations
Query: ?email=user@example.com (optional)
Response: [donations...]
```

### Get Donation Stats
```
GET /api/donations/stats
Response: {
  totalAmount: number,
  totalDonations: number,
  averageDonation: number
}
```

## 🎨 Customization

### Donation Tiers
Edit `client/src/pages/donate.tsx`:
```typescript
const DONATION_TIERS = [
  { amount: 500, title: "Protector", icon: Shield, ... },
  // Add more tiers
];
```

### Email Template
Edit `server/services/email.ts` → `generateReceiptHTML()` function

### Payment Gateway Theme
Edit `client/src/lib/razorpay.ts`:
```typescript
theme: {
  color: '#10b981', // Change color
}
```

## 💰 Razorpay Pricing

- **Transaction Fee**: 2% per transaction
- **International Cards**: 3% + ₹3 per transaction
- **Setup Fee**: Free
- **Minimum Fee**: No minimum
- **Settlement**: T+3 days (3 working days)

## 🔗 Useful Links

- [Razorpay Dashboard](https://dashboard.razorpay.com)
- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Section 80G Tax Benefits](https://www.incometax.gov.in)

## ✅ Status

- ✅ Backend payment integration complete
- ✅ Frontend Razorpay modal integration complete
- ✅ Email receipt service complete
- ✅ Database schema implemented
- ✅ Payment verification complete
- ✅ Error handling implemented
- ⏳ Awaiting Razorpay API keys configuration
- ⏳ Email service configuration pending

## 🎉 Success Metrics

Once live, you can track:
- Total donations received
- Number of donors
- Average donation amount
- Payment success rate
- Popular donation tiers
- Email receipt delivery rate

---

**Note**: Always test thoroughly in test mode before going live with real payments!
