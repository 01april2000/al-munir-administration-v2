import { CoreApi, Snap } from "midtrans-client";
import crypto from "crypto";

// Initialize Midtrans Core API
export const midtransCore = new CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// Initialize Midtrans Snap API
export const midtransSnap = new Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// Generate order ID
// Midtrans has a 50 character limit for order_id
// So we use a shorter format: TRX-{shortId}-{timestamp}
// where shortId is first 8 chars of tagihanId or a counter
export function generateOrderId(tagihanId: string): string {
  const timestamp = Date.now();
  // Use only first 8 characters of the ID to keep it short
  const shortId = tagihanId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
  return `TRX-${shortId}-${timestamp}`;
}

// Generate order ID for combined payments (multiple tagihan)
export function generateCombinedOrderId(santriNis: string): string {
  const timestamp = Date.now();
  // Use NIS (student ID) which is typically short
  const shortNis = santriNis.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
  return `COMBINED-${shortNis}-${timestamp}`;
}

// Create Snap transaction
export async function createSnapTransaction(params: {
  orderId: string;
  grossAmount: number;
  customerDetails: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
  };
  itemDetails: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  tagihanId: string;
  santriName: string;
  finishRedirectUrl?: string;
}) {
  try {
    // Get webhook URL from environment or use default
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`
      : "http://localhost:3000/api/payment/webhook";

    // Build transaction payload
    const transactionPayload: any = {
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
      },
      customer_details: {
        first_name: params.customerDetails.firstName,
        last_name: params.customerDetails.lastName,
        email: params.customerDetails.email,
        phone: params.customerDetails.phone,
      },
      item_details: params.itemDetails,
      custom_field1: params.tagihanId,
      custom_field2: params.santriName,
      enabled_payments: [
        "credit_card",
        "gopay",
        "shopeepay",
        "bca_va",
        "bni_va",
        "bri_va",
        "mandiri_bill",
        "qris",
      ],
      // Set expiry to 60 minutes — if not paid, Midtrans will send "expire" webhook
      // which triggers handleFailedPayment() to clean up the transaction
      // Format must be: yyyy-MM-dd hh:mm:ss Z (e.g. 2020-06-09 15:07:00 +0700)
      expiry: {
        start_time: (() => {
          const now = new Date();
          const pad = (n: number) => String(n).padStart(2, '0');
          const offset = -now.getTimezoneOffset();
          const offsetHours = Math.floor(Math.abs(offset) / 60);
          const offsetMins = Math.abs(offset) % 60;
          const offsetStr = `${offset >= 0 ? '+' : '-'}${pad(offsetHours)}${pad(offsetMins)}`;
          return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${offsetStr}`;
        })(),
        unit: "minutes",
        duration: 60,
      },
      // Configure webhook notification URL
      notifications: {
        payment_notification_url: webhookUrl,
      },
    };

    // Add finish redirect URL if provided
    // This ensures user is redirected back to the app after payment
    if (params.finishRedirectUrl) {
      transactionPayload.callbacks = {
        finish: params.finishRedirectUrl,
      };
    }

    // @ts-ignore - createTransaction method exists in the Snap class but not in TypeScript types
    const transaction = await (midtransSnap as any).createTransaction(transactionPayload);

    return transaction;
  } catch (error) {
    console.error("Error creating Snap transaction:", error);
    throw error;
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  notificationJson: string,
  signatureKey: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const notification = JSON.parse(notificationJson);
  const orderId = notification.order_id;
  const statusCode = notification.status_code;
  const grossAmount = notification.gross_amount;

  // Calculate signature
  const input = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const calculatedSignature = crypto
    .createHash("sha512")
    .update(input)
    .digest("hex");

  return calculatedSignature === signatureKey.toLowerCase();
}

// Get transaction status
export async function getTransactionStatus(orderId: string) {
  try {
    const status = await midtransCore.transaction.status(orderId);
    return status;
  } catch (error) {
    console.error("Error getting transaction status:", error);
    throw error;
  }
}
