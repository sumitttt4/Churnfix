import React from 'react';
import Link from 'next/link';
import Logo from '../components/Logo';

export const metadata = {
  title: 'Terms of Service - Churnfix',
  description: 'Terms of Service for using Churnfix.',
};

export default function TermsOfService() {
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
        <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-slate prose-a:text-[#10B981] hover:prose-a:text-[#059669] prose-headings:font-display">
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Churnfix platform (the "Service") operated by Churnfix ("us", "we", or "our").
          </p>
          <p>
            By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
          </p>

          <h2>1. Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            The Service allows you to monitor and recover failed transactions via third-party billing providers (e.g., Stripe, Paddle, Lemon Squeezy). You agree to only use the Service for lawful purposes and in accordance with the terms of your respective payment providers.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Churnfix and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>

          <h2>4. Termination</h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall Churnfix, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <strong>support@churnfix.com</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}
