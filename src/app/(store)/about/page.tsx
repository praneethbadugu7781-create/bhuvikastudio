import { Metadata } from "next";
import Link from "next/link";
import { Store, Heart, Truck, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Bhuvika Studio - Your trusted destination for premium ethnic and western wear in Vijayawada, Andhra Pradesh.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-bold text-brand-900">About Bhuvika Studio</h1>
      
      <div className="space-y-8 text-brand-700">
        <section>
          <p className="text-lg leading-relaxed">
            <strong>Bhuvika Studio</strong> is a curated fashion destination based in Vijayawada, Andhra Pradesh. 
            We bring you the finest collection of ethnic and western wear, carefully selected to make every 
            celebration special.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-brand-800">Our Story</h2>
          <p className="leading-relaxed">
            Founded with a passion for fashion, Bhuvika Studio started with a simple mission: to make 
            premium quality clothing accessible to everyone. From traditional sarees and lehengas to 
            contemporary western wear, we offer styles that blend heritage with modern trends.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-brand-800">What We Offer</h2>
          <ul className="ml-5 list-disc space-y-2">
            <li><strong>Sarees</strong> – Elegant designs for every occasion</li>
            <li><strong>Lehengas</strong> – Bridal and festive collections</li>
            <li><strong>Western Wear</strong> – Trendy dresses and tops</li>
            <li><strong>Fusion Wear</strong> – Perfect blend of traditional and modern</li>
            <li><strong>Co-ord Sets</strong> – Stylish matching sets</li>
            <li><strong>Kids Wear</strong> – Adorable outfits for little ones</li>
          </ul>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
            <Store className="mb-3 h-8 w-8 text-brand-600" />
            <h3 className="mb-2 font-semibold text-brand-800">Quality First</h3>
            <p className="text-sm">Every piece is carefully selected for quality, ensuring you get the best value for your purchase.</p>
          </div>
          
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
            <Heart className="mb-3 h-8 w-8 text-brand-600" />
            <h3 className="mb-2 font-semibold text-brand-800">Customer Love</h3>
            <p className="text-sm">Your satisfaction is our priority. We&apos;re committed to making your shopping experience delightful.</p>
          </div>
          
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
            <Truck className="mb-3 h-8 w-8 text-brand-600" />
            <h3 className="mb-2 font-semibold text-brand-800">Pan-India Delivery</h3>
            <p className="text-sm">We deliver across India with trusted courier partners for safe and timely delivery.</p>
          </div>
          
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
            <Shield className="mb-3 h-8 w-8 text-brand-600" />
            <h3 className="mb-2 font-semibold text-brand-800">Secure Payments</h3>
            <p className="text-sm">Shop with confidence using our secure payment gateway powered by Razorpay.</p>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-brand-800">Business Information</h2>
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-6">
            <p><strong>Business Name:</strong> Bhuvika Studio</p>
            <p><strong>Location:</strong> Vijayawada, Andhra Pradesh, India</p>
            <p><strong>Email:</strong> bhuvikastudio@gmail.com</p>
            <p><strong>Phone:</strong> +91 9618 111520</p>
            <p className="mt-4 text-sm text-brand-600">
              For any queries, visit our <Link href="/contact" className="underline hover:text-brand-800">Contact Us</Link> page.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
