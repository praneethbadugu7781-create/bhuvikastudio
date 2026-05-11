"use client";

import { useState } from "react";

interface RazorpayPaymentProps {
  amount: number;
  orderId?: string;
  customerEmail?: string;
  customerName?: string;
  notes?: Record<string, string>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  buttonText?: string;
}

export function RazorpayPaymentButton({
  amount,
  orderId,
  customerEmail,
  customerName,
  notes,
  onSuccess,
  onError,
  buttonText = "Pay Now",
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay script");
      }

      // Create order via your API
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: orderId || `order_${Date.now()}`,
          notes: notes || {},
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bhuvika Studio",
        description: "Payment for your order",
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify payment signature
            const verifyResponse = await fetch("/api/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const verified = await verifyResponse.json();
            onSuccess?.(verified);
          } catch (error) {
            onError?.(error);
          }
        },
        prefill: {
          email: customerEmail,
          name: customerName,
        },
        theme: {
          color: "#000000",
        },
      };

      // @ts-ignore - Razorpay is loaded globally
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || amount <= 0}
      className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Processing..." : buttonText}
    </button>
  );
}
