declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
}

/**
 * Initialize and open Razorpay payment gateway
 */
export function openRazorpayPayment(
  paymentOrder: PaymentOrder,
  donorInfo: { name: string; email: string },
  onSuccess: (response: RazorpayResponse) => void,
  onFailure: (error: Error) => void
) {
  const options: RazorpayOptions = {
    key: paymentOrder.razorpayKeyId,
    amount: Math.round(paymentOrder.amount * 100), // Convert to paise
    currency: paymentOrder.currency,
    name: 'WildGuard',
    description: 'Wildlife Conservation Donation',
    order_id: paymentOrder.id,
    handler: (response: RazorpayResponse) => {
      console.log('✅ Payment successful:', response);
      onSuccess(response);
    },
    prefill: {
      name: donorInfo.name,
      email: donorInfo.email,
    },
    theme: {
      color: '#10b981', // Green theme
    },
    modal: {
      ondismiss: () => {
        onFailure(new Error('Payment cancelled by user'));
      },
    },
  };

  try {
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded. Please refresh the page.');
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('❌ Error opening Razorpay:', error);
    onFailure(error as Error);
  }
}
