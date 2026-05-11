import { useState } from "react";
import type { RazorpayPaymentResponse } from "@/types/razorpay";

interface UseRazorpayPaymentProps {
  amount: number;
  orderId?: string;
  notes?: Record<string, string>;
}

interface UseRazorpayPaymentReturn {
  isLoading: boolean;
  error: string | null;
  processPayment: () => Promise<RazorpayPaymentResponse | null>;
}

export function useRazorpayPayment({
  amount,
  orderId,
  notes,
}: UseRazorpayPaymentProps): UseRazorpayPaymentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processPayment = async (): Promise<RazorpayPaymentResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (amount < 100) {
        throw new Error("Minimum order amount is ₹1");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay. Please refresh and try again.");
      }

      // Create order
      const createOrderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: orderId || `order_${Date.now()}`,
          notes: notes || {},
        }),
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await createOrderResponse.json();

      return new Promise((resolve, reject) => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Bhuvika Studio",
          description: "Purchase from Bhuvika Studio",
          order_id: orderData.id,
          handler: async (response: any) => {
            try {
              const verifyResponse = await fetch("/api/payments/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });

              if (!verifyResponse.ok) {
                throw new Error("Payment verification failed");
              }

              const verified = await verifyResponse.json();
              resolve({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled"));
            },
          },
          theme: {
            color: "#000000",
          },
        };

        // @ts-ignore - Razorpay is loaded globally
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, processPayment };
}
