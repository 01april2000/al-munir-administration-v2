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
export function generateOrderId(tagihanId: string): string {
  const timestamp = Date.now();
  return `ORDER-${tagihanId}-${timestamp}`;
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
}) {
  try {
    // Get webhook URL from environment or use default
    const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`
      : "http://localhost:3000/api/payment/webhook";

    // @ts-ignore - createTransaction method exists in the Snap class but not in TypeScript types
    const transaction = await (midtransSnap as any).createTransaction({
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
      // Configure webhook notification URL
      notifications: {
        payment_notification_url: webhookUrl,
      },
    });

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
