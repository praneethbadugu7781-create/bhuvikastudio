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
                href="https://www.google.com/maps/place/Bhuvika_studio/@16.493436,80.6651453,17z/data=!3m1!4b1!4m6!3m5!1s0x3a35fb4e758889a9:0x4740f1f3ea7d3b11!8m2!3d16.493436!4d80.6651453" 
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
          <a 
            href="https://www.google.com/maps/place/Bhuvika_studio/@16.493436,80.6651453,17z/data=!3m1!4b1!4m6!3m5!1s0x3a35fb4e758889a9:0x4740f1f3ea7d3b11!8m2!3d16.493436!4d80.6651453"
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg border border-brand-200 bg-brand-100 transition hover:bg-brand-200"
          >
            <div className="flex h-[200px] flex-col items-center justify-center text-center text-brand-700">
              <MapPin className="mb-3 h-10 w-10 text-brand-600" />
              <p className="font-semibold">Bhuvika Studio</p>
              <p className="text-sm text-brand-500">Vijayawada, Andhra Pradesh</p>
              <p className="mt-3 text-sm text-brand-600 underline">Click to open in Google Maps →</p>
            </div>
          </a>

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
