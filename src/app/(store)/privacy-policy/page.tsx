import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Bhuvika Studio - Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold text-brand-900">Privacy Policy</h1>
      <p className="mb-6 text-sm text-brand-600">Last updated: May 2026</p>

      <div className="space-y-8 text-brand-700">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">1. Information We Collect</h2>
          <p className="mb-2">We collect information you provide directly to us, including:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Name, email address, phone number, and shipping address when you place an order</li>
            <li>Payment information (processed securely through Razorpay)</li>
            <li>Account information when you create an account</li>
            <li>Communication data when you contact us</li>
            <li>Product reviews and ratings</li>
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
            <li>Maintain audit trails for security and compliance</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">3. Cookies & Tracking</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings. We only load analytics (Google Analytics) if you explicitly accept cookies on our banner.</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">4. Data Protection</h2>
          <p>We implement appropriate security measures to protect your personal information. Payment transactions are encrypted and processed through Razorpay's secure payment gateway. We do not store your credit/debit card details on our servers. All user passwords are hashed securely.</p>
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
          <h2 className="mb-3 text-xl font-semibold text-brand-800">6. Your Rights (GDPR / DPDP / CCPA)</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>Access your data:</strong> Download a copy of all your personal data</li>
            <li><strong>Data portability:</strong> Request your data in a portable format</li>
            <li><strong>Delete your data:</strong> Request complete account deletion and anonymization</li>
            <li><strong>Update your data:</strong> Correct or update your personal information</li>
            <li><strong>Opt-out of marketing:</strong> Unsubscribe from promotional emails</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">7. Account Deletion & Data Retention</h2>
          <p className="mb-2">When you delete your account:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Your personal information (name, email, phone) is immediately anonymized</li>
            <li>Orders are retained for transaction history and tax/legal compliance</li>
            <li>Reviews and wishlists are deleted</li>
            <li>Anonymized data is retained for 30 days in audit logs, then permanently purged</li>
            <li>Backups containing your data are deleted within 30 days</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">8. Contact & Privacy Requests</h2>
          <p>For privacy-related requests (data access, deletion, portability):</p>
          <p className="mt-2">
            <strong>Bhuvika Studio</strong><br />
            Vijayawada, Andhra Pradesh, India<br />
            Email: bhuvikastudio@gmail.com<br />
            Phone: +91 9618 111520<br />
            Response time: Within 15 days
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">9. Compliance</h2>
          <p>We comply with:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>GDPR:</strong> General Data Protection Regulation (EU users)</li>
            <li><strong>DPDP:</strong> Digital Personal Data Protection (India users)</li>
            <li><strong>CCPA/CPRA:</strong> California Consumer Privacy Act (US users)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-brand-800">10. Data Security & Breach Notification</h2>
          <p>In the unlikely event of a data breach, we will notify affected users within 15 days as required by law. We use industry-standard encryption and regular security audits to protect your data.</p>
        </section>
      </div>
    </div>
  );
}
