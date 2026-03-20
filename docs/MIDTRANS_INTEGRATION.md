# Midtrans Payment Gateway Integration

This document describes the Midtrans payment gateway integration for the Al-Munir Administration system.

## Overview

The Midtrans integration allows santri (students) to pay their bills (tagihan) through various payment methods including:
- Credit Card
- GoPay
- ShopeePay
- Bank Transfer (BCA, BNI, BRI, Mandiri)
- QRIS

## Architecture

### Components

1. **Midtrans API Utility** ([`lib/midtrans.ts`](../lib/midtrans.ts))
   - Handles communication with Midtrans API
   - Creates Snap transactions
   - Verifies webhook signatures

2. **Payment Creation API** ([`app/api/payment/create/route.ts`](../app/api/payment/create/route.ts))
   - Creates payment transaction with Midtrans
   - Generates Snap token for frontend
   - Creates/update transaksi record

3. **Webhook Handler** ([`app/api/payment/webhook/route.ts`](../app/api/payment/webhook/route.ts))
   - Handles payment notifications from Midtrans
   - Updates transaction status based on payment result
   - Verifies webhook signature for security

4. **Payment Dialog Component** ([`components/santri/payment-dialog.tsx`](../components/santri/payment-dialog.tsx))
   - Displays payment confirmation dialog
   - Loads Midtrans Snap script
   - Opens Snap popup for payment

5. **Santri Dashboard** ([`app/santri/smk/page.tsx`](../app/santri/smk/page.tsx), [`app/santri/smp/page.tsx`](../app/santri/smp/page.tsx))
   - Displays bills and transactions
   - Shows payment status
   - Provides "Bayar" button for unpaid bills

### Database Schema

The following models are used:

1. **Tagihan** - Stores bill information (SPP, Syahriah)
2. **Transaksi** - Stores transaction records
3. **MidtransTransaction** - Stores Midtrans payment details

## Setup

### 1. Get Midtrans Credentials

1. Sign up at [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Create a new application
3. Get your Server Key and Client Key

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and update the Midtrans credentials:

```bash
cp .env.example .env
```

Update the following variables:

```env
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
NEXT_PUBLIC_MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/snap.js
```

### 3. Configure Webhook in Midtrans Dashboard

1. Go to Midtrans Dashboard → Settings → Configuration
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Save the configuration

## Payment Flow

### 1. Santri Initiates Payment

1. Santri logs into their dashboard
2. Sees unpaid bills (tagihan) or transactions
3. Clicks "Bayar" button
4. Payment dialog opens with bill details
5. Clicks "Bayar Sekarang"

### 2. Payment Creation

1. Frontend calls `/api/payment/create` with `tagihanId` or `transaksiId`
2. Backend validates the request
3. Creates or updates transaksi record with `PENDING` status
4. Creates Midtrans Snap transaction
5. Returns Snap token to frontend

### 3. Midtrans Snap Popup

1. Frontend loads Midtrans Snap script
2. Opens Snap popup with the token
3. Santri selects payment method
4. Completes payment

### 4. Payment Completion

1. Midtrans sends webhook notification to `/api/payment/webhook`
2. Backend verifies webhook signature
3. Updates transaction status:
   - `LUNAS` - Payment successful
   - `PENDING` - Payment pending
   - `DITOLAK` - Payment failed/cancelled
4. Updates tagihan status if applicable

### 5. Dashboard Update

1. Santri dashboard refreshes
2. Shows updated payment status
3. Paid bills show "Lunas" status

## Payment Methods

The following payment methods are enabled:

| Method | Description |
|--------|-------------|
| Credit Card | Visa, Mastercard, JCB, Amex |
| GoPay | QRIS-based payment |
| ShopeePay | QRIS-based payment |
| BCA VA | Virtual account BCA |
| BNI VA | Virtual account BNI |
| BRI VA | Virtual account BRI |
| Mandiri Bill | Mandiri bill payment |
| QRIS | Standard QRIS payment |

## Security

### Webhook Signature Verification

All webhook notifications are verified using Midtrans signature verification:

```typescript
const signatureKey = request.headers.get("x-signature-key");
const isValid = verifyWebhookSignature(notificationJson, signatureKey);
```

### Environment Variables

Sensitive credentials are stored in environment variables and never exposed to the frontend:

- `MIDTRANS_SERVER_KEY` - Backend only
- `MIDTRANS_CLIENT_KEY` - Exposed to frontend as `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`

## Testing

### Sandbox Mode

For testing, use sandbox mode:

```env
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
```

Use sandbox payment credentials for testing:
- Credit Card: `4811 1111 1111 1114` (any expiry, CVV)
- Bank Transfer: Follow instructions in Snap popup

### Production Mode

For production:

```env
MIDTRANS_IS_PRODUCTION=true
MIDTRANS_SERVER_KEY=Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxx
```

## Troubleshooting

### Payment Not Processing

1. Check if Midtrans credentials are correct
2. Verify webhook URL is accessible
3. Check server logs for errors
4. Ensure transaction status is not already `LUNAS`

### Webhook Not Receiving

1. Verify webhook URL is correct in Midtrans Dashboard
2. Check if server is accessible from internet
3. Verify firewall allows incoming requests
4. Check server logs for webhook requests

### Snap Popup Not Loading

1. Check if `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` is set
2. Verify Snap script URL is correct
3. Check browser console for errors
4. Ensure payment token is valid

## API Endpoints

### POST /api/payment/create

Creates a new payment transaction.

**Request Body:**
```json
{
  "tagihanId": "string (optional)",
  "transaksiId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "token": "string",
  "redirectUrl": "string",
  "orderId": "string",
  "transaksiId": "string"
}
```

### POST /api/payment/webhook

Handles payment notifications from Midtrans.

**Headers:**
- `x-signature-key`: Midtrans signature for verification

**Request Body:**
```json
{
  "order_id": "string",
  "transaction_status": "string",
  "fraud_status": "string",
  "transaction_id": "string",
  "payment_type": "string",
  "transaction_time": "string",
  "settlement_time": "string",
  "gross_amount": "number"
}
```

**Response:**
```json
{
  "success": true
}
```

## Support

For issues related to:
- **Midtrans API**: Contact Midtrans Support
- **Integration**: Check the code in `lib/midtrans.ts`
- **Webhook**: Check `app/api/payment/webhook/route.ts`
- **Frontend**: Check `components/santri/payment-dialog.tsx`

## References

- [Midtrans Documentation](https://midtrans.com/docs/)
- [Midtrans Snap Integration](https://midtrans.com/docs/snap/integration-guide)
- [Midtrans Webhook](https://midtrans.com/docs/snap/webhook)
