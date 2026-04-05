import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping Policy for Bhuvika Studio - Delivery times, shipping charges, and serviceable locations.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold text-brand-900">Shipping Policy</h1>
      <p className="mb-6 text-sm text-brand-600">Last updated: April 2026</p>

      <div className="space-y-8 text-brand-700">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">1. Delivery Locations</h2>
          <p>We currently ship to all major cities and towns across India. Enter your pincode at checkout to verify serviceability.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">2. Delivery Time</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>Metro Cities:</strong> 3-5 business days</li>
            <li><strong>Tier 2 Cities:</strong> 5-7 business days</li>
            <li><strong>Remote Areas:</strong> 7-10 business days</li>
          </ul>
          <p className="mt-2 text-sm">*Delivery times may vary during peak seasons, sales, or unforeseen circumstances.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">3. Shipping Charges</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>Free Shipping:</strong> On orders above ₹999</li>
            <li><strong>Standard Shipping:</strong> ₹79 for orders below ₹999</li>
          </ul>
          <p className="mt-2 text-sm">Shipping charges are calculated at checkout based on delivery location and order value.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">4. Order Processing</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Orders are processed within 1-2 business days</li>
            <li>Orders placed on weekends or holidays will be processed on the next business day</li>
            <li>You will receive a tracking number via email/SMS once your order is shipped</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">5. Order Tracking</h2>
          <p>Once shipped, you can track your order using:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>The tracking link sent via email/SMS</li>
            <li>Your account dashboard on our website</li>
            <li>Contacting our customer support</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">6. Shipping Partners</h2>
          <p>We work with trusted courier partners including Delhivery, BlueDart, DTDC, and India Post to ensure safe and timely delivery of your orders.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">7. Delivery Issues</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>If your order is delayed beyond the estimated delivery time, please contact us</li>
            <li>Ensure someone is available to receive the package at the delivery address</li>
            <li>Failed delivery attempts may result in return to origin</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">8. Contact Us</h2>
          <p>For shipping queries, contact us at:</p>
          <p className="mt-2">
            <strong>Bhuvika Studio</strong><br />
            Email: bhuvikastudio@gmail.com<br />
            Phone: +91 9618 111520
          </p>
        </section>
      </div>
    </div>
  );
}
