import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Bhuvika Studio - Get in touch with us for orders, queries, or support. Located in Vijayawada, Andhra Pradesh.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold text-brand-900">Contact Us</h1>
      <p className="mb-8 text-brand-600">
        We&apos;d love to hear from you! Reach out to us for any queries, orders, or support.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-brand-100 p-3">
              <Phone className="h-6 w-6 text-brand-700" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-800">Phone</h3>
              <p className="text-brand-600">+91 9618 111520</p>
              <p className="text-sm text-brand-500">Mon - Sat, 10 AM - 7 PM</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-brand-100 p-3">
              <Mail className="h-6 w-6 text-brand-700" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-800">Email</h3>
              <p className="text-brand-600">bhuvikastudio@gmail.com</p>
              <p className="text-sm text-brand-500">We respond within 24 hours</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-brand-100 p-3">
              <MapPin className="h-6 w-6 text-brand-700" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-800">Business Address</h3>
              <p className="text-brand-600">
                Bhuvika Studio<br />
                Vijayawada, Andhra Pradesh<br />
                India - 520001
              </p>
              <a 
                href="https://www.google.com/maps/place/Bhuvika_studio/@16.493436,80.6625704,17z" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-brand-600 underline hover:text-brand-800"
              >
                View on Google Maps →
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-brand-100 p-3">
              <Clock className="h-6 w-6 text-brand-700" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-800">Business Hours</h3>
              <p className="text-brand-600">Monday - Saturday: 10:00 AM - 7:00 PM</p>
              <p className="text-brand-600">Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-brand-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.2!2d80.6625704!3d16.493436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fb4e758889a9%3A0x4740f1f3ea7d3b11!2sBhuvika%20studio!5e0!3m2!1sen!2sin!4v1712300000000!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bhuvika Studio Location"
            ></iframe>
          </div>

          <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-brand-800">Quick Support</h2>
            <div className="space-y-4 text-brand-700">
              <p>
                <strong>Order Related:</strong><br />
                For order status, tracking, or delivery queries, please have your order number ready.
              </p>
              <p>
                <strong>Returns & Refunds:</strong><br />
                Initiate returns within 7 days of delivery. See our <a href="/refund-policy" className="text-brand-600 underline hover:text-brand-800">Refund Policy</a>.
              </p>
              <p>
                <strong>WhatsApp:</strong><br />
                Message us on WhatsApp at +91 9618 111520 for quick responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
