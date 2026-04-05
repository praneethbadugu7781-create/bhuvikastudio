import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Refund and Cancellation Policy for Bhuvika Studio - Learn about returns, refunds, and order cancellations.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold text-brand-900">Refund &amp; Cancellation Policy</h1>
      <p className="mb-6 text-sm text-brand-600">Last updated: April 2026</p>

      <div className="space-y-8 text-brand-700">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">1. Order Cancellation</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Orders can be cancelled within 24 hours of placing the order</li>
            <li>Once the order is shipped, cancellation is not possible</li>
            <li>To cancel an order, contact us at owner@bhuvikastudio.com or call +91 93917 81748</li>
            <li>Full refund will be processed for successfully cancelled orders</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">2. Returns</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Returns are accepted within 7 days of delivery</li>
            <li>Products must be unused, unwashed, and in original packaging with tags intact</li>
            <li>Items marked as &quot;Non-returnable&quot; or on sale cannot be returned</li>
            <li>Return shipping costs are borne by the customer unless the product is defective</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">3. Return Process</h2>
          <ol className="ml-5 list-decimal space-y-1">
            <li>Contact us within 7 days of delivery with your order number and reason for return</li>
            <li>Once approved, pack the item securely and ship to our address</li>
            <li>After receiving and inspecting the item, we will process your refund</li>
          </ol>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">4. Refunds</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Refunds will be processed within 7-10 business days after approval</li>
            <li>Amount will be credited to the original payment method</li>
            <li>For COD orders, refund will be made via bank transfer (NEFT/IMPS)</li>
            <li>Shipping charges are non-refundable unless the return is due to our error</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">5. Damaged or Defective Products</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Report damaged or defective items within 48 hours of delivery</li>
            <li>Share photos/videos of the damage for verification</li>
            <li>We will arrange a free pickup and full refund or replacement</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">6. Non-Returnable Items</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Customized or altered products</li>
            <li>Intimate wear and swimwear</li>
            <li>Items marked as final sale</li>
            <li>Products without original tags or packaging</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">7. Contact for Returns</h2>
          <p>For return or refund requests, contact us at:</p>
          <p className="mt-2">
            <strong>Bhuvika Studio</strong><br />
            Email: owner@bhuvikastudio.com<br />
            Phone: +91 93917 81748<br />
            Address: Vijayawada, Andhra Pradesh, India
          </p>
        </section>
      </div>
    </div>
  );
}
