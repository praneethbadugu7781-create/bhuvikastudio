"use client";

import { useState } from "react";
import { RazorpayPaymentButton } from "@/components/RazorpayPaymentButton";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const SAMPLE_ITEMS: OrderItem[] = [
  { name: "Silk Saree", price: 4999, quantity: 1 },
];

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");

  const totalAmount = SAMPLE_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentSuccess = async (response: any) => {
    setLoading(true);
    try {
      console.log("Payment verified:", response);
      setPaymentStatus("success");

      // Example: Send order to your backend API
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: "Sample Address",
          paymentMethod: "razorpay",
          items: SAMPLE_ITEMS,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
        }),
      });
    } catch (error) {
      console.error("Failed to save order:", error);
      setPaymentStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment failed:", error);
    setPaymentStatus("error");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {SAMPLE_ITEMS.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus === "success" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✓ Payment successful! Your order has been placed.
        </div>
      )}

      {paymentStatus === "error" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          ✗ Payment failed. Please try again.
        </div>
      )}

      {/* Payment Button */}
      <div className="flex gap-4">
        <RazorpayPaymentButton
          amount={totalAmount}
          orderId={`order_${Date.now()}`}
          customerEmail="customer@example.com"
          customerName="Sample Customer"
          notes={{
            product_type: "saree",
            order_source: "website",
          }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          buttonText={`Pay ₹${totalAmount}`}
        />

        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {/* Test Card Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Test Mode:</strong> Use test card 4111 1111 1111 1111, any future expiry, any CVV
        </p>
      </div>
    </div>
  );
}
