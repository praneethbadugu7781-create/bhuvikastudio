import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Bhuvika Studio - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold text-brand-900">Privacy Policy</h1>
      <p className="mb-6 text-sm text-brand-600">Last updated: April 2026</p>

      <div className="space-y-8 text-brand-700">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">1. Information We Collect</h2>
          <p className="mb-2">We collect information you provide directly to us, including:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Name, email address, phone number, and shipping address when you place an order</li>
            <li>Payment information (processed securely through Razorpay)</li>
            <li>Account information when you create an account</li>
            <li>Communication data when you contact us</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">2. How We Use Your Information</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Improve our website and services</li>
            <li>Send promotional communications (with your consent)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">3. Cookies</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">4. Data Protection</h2>
          <p>We implement appropriate security measures to protect your personal information. Payment transactions are encrypted and processed through Razorpay&apos;s secure payment gateway. We do not store your credit/debit card details on our servers.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">5. Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information only with:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Shipping partners to deliver your orders</li>
            <li>Payment processors to complete transactions</li>
            <li>Service providers who assist our operations</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">6. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. Contact us at owner@bhuvikastudio.com for any privacy-related requests.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">7. Contact Us</h2>
          <p>For privacy concerns, contact us at:</p>
          <p className="mt-2">
            <strong>Bhuvika Studio</strong><br />
            Vijayawada, Andhra Pradesh, India<br />
            Email: owner@bhuvikastudio.com<br />
            Phone: +91 93917 81748
          </p>
        </section>
      </div>
    </div>
  );
}
