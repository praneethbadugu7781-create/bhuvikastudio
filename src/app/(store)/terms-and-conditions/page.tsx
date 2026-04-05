import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for Bhuvika Studio - Read our terms of service, ordering policies, and usage guidelines.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold text-brand-900">Terms &amp; Conditions</h1>
      <p className="mb-6 text-sm text-brand-600">Last updated: April 2026</p>

      <div className="space-y-8 text-brand-700">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">1. Introduction</h2>
          <p>Welcome to Bhuvika Studio. By accessing or using our website (bhuvikastudio.com), you agree to be bound by these Terms and Conditions. Please read them carefully before placing any order.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">2. Use of Website</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>You must be at least 18 years old to make purchases</li>
            <li>You agree to provide accurate and complete information</li>
            <li>You are responsible for maintaining account confidentiality</li>
            <li>Unauthorized use may result in account termination</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">3. Orders and Pricing</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>All prices are listed in Indian Rupees (INR) and include applicable taxes</li>
            <li>We reserve the right to modify prices without prior notice</li>
            <li>Orders are subject to availability and confirmation</li>
            <li>We reserve the right to refuse or cancel any order</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">4. Payment Terms</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>We accept payments via UPI, credit/debit cards, and net banking through Razorpay</li>
            <li>Payment must be completed before order processing</li>
            <li>All transactions are secure and encrypted</li>
            <li>In case of payment failure, please retry or contact support</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">5. Product Information</h2>
          <p>We strive to display accurate product images and descriptions. However, actual colors may vary slightly due to screen settings. Minor variations in handcrafted items are natural and not considered defects.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">6. Intellectual Property</h2>
          <p>All content on this website, including images, text, logos, and designs, is the property of Bhuvika Studio and protected by copyright laws. Unauthorized use is prohibited.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">7. Limitation of Liability</h2>
          <p>Bhuvika Studio shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">8. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Vijayawada, Andhra Pradesh.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">9. Contact</h2>
          <p>For questions regarding these terms, contact us at:</p>
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
