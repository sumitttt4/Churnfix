import React from 'react';
import Link from 'next/link';
import Logo from '../components/Logo';

export const metadata = {
  title: 'Privacy Policy - Churnfix',
  description: 'Privacy Policy for Churnfix, the automated failed payment recovery platform.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-body">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-slate prose-a:text-[#10B981] hover:prose-a:text-[#059669] prose-headings:font-display">
          <p>
            At Churnfix ("we", "our", or "us"), we are committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Churnfix.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create or modify your account, request support, or otherwise communicate with us. This information may include:
          </p>
          <ul>
            <li>Name and contact data (email address).</li>
            <li>Credentials (passwords or security information used for authentication).</li>
            <li>Payment data (processed securely by our payment providers like Stripe or Lemon Squeezy).</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our platform.</li>
            <li>Process transactions and send related information including confirmations and invoices.</li>
            <li>Send technical notices, updates, security alerts, and support messages.</li>
            <li>Monitor and analyze trends and usage in connection with our services.</li>
          </ul>

          <h2>3. Data Processing for Your Customers</h2>
          <p>
            As a payment recovery tool, Churnfix processes limited data regarding your end-customers (such as email addresses and failed transaction details) purely to provide the recovery service. We act as a Data Processor for this information, and you remain the Data Controller. We do not sell or use your customers' data for marketing purposes.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures designed to protect your personal information against unauthorized access, destruction, loss, alteration, or misuse. However, no security system is impenetrable, and we cannot guarantee the absolute security of your data.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <strong>support@churnfix.com</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}
