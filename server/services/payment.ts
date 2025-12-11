import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Create a Razorpay payment order
 */
export async function createPaymentOrder(
  amount: number,
  receiptNumber: string,
  donorName: string,
  donorEmail: string
): Promise<PaymentOrder> {
  try {
    // Razorpay accepts amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptNumber,
      notes: {
        donor_name: donorName,
        donor_email: donorEmail,
        purpose: 'Wildlife Conservation Donation',
      },
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    
    console.log(`✅ Payment order created: ${order.id} for ₹${amount}`);
    
    return {
      id: order.id,
      amount: Number(order.amount) / 100, // Convert back to rupees
      currency: order.currency,
      receipt: order.receipt || receiptNumber,
      status: order.status,
    };
  } catch (error) {
    console.error('❌ Error creating payment order:', error);
    throw new Error('Failed to create payment order');
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    // Create signature string: order_id + "|" + payment_id
    const signatureString = `${orderId}|${paymentId}`;
    
    // Generate HMAC SHA256 hash
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signatureString)
      .digest('hex');
    
    // Compare signatures
    const isValid = expectedSignature === signature;
    
    if (isValid) {
      console.log(`✅ Payment signature verified: ${paymentId}`);
    } else {
      console.error(`❌ Invalid payment signature: ${paymentId}`);
    }
    
    return isValid;
  } catch (error) {
    console.error('❌ Error verifying payment signature:', error);
    return false;
  }
}

/**
 * Get payment details from Razorpay
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    
    return {
      id: payment.id,
      amount: Number(payment.amount) / 100, // Convert paise to rupees
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      createdAt: new Date(payment.created_at * 1000),
    };
  } catch (error) {
    console.error('❌ Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
}

/**
 * Refund a payment
 */
export async function refundPayment(paymentId: string, amount?: number) {
  try {
    const options: any = {
      payment_id: paymentId,
    };
    
    // If partial refund amount is specified
    if (amount) {
      options.amount = Math.round(amount * 100); // Convert to paise
    }
    
    const refund = await razorpay.payments.refund(paymentId, options);
    
    const refundAmount = refund.amount ? Number(refund.amount) / 100 : 0;
    console.log(`✅ Refund processed: ${refund.id} for ₹${refundAmount}`);
    
    return {
      id: refund.id,
      amount: refundAmount,
      status: refund.status,
      paymentId: refund.payment_id,
    };
  } catch (error) {
    console.error('❌ Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
}

/**
 * Check if payment gateway is configured
 */
export function isPaymentGatewayConfigured(): boolean {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}
