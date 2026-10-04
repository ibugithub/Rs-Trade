import type { Metadata } from 'next';
import { Suspense } from 'react';
import { QuoteForm } from '@/components/inquiries/quoteForm';
import { CompanyFooter } from '@/components/footer/companyFooter';

export const metadata: Metadata = {
  title: 'Request a Quote | RS Trade International',
  description: 'Discuss China sourcing, supplier verification, quality inspection and door-to-door import with RS Trade International.',
};

export default function RequestQuotePage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Tell us what you need</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Request a Quote</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">Ask about one or more of our four services. Online inquiry submission will be available soon.</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <Suspense fallback={<p role="status">Loading inquiry form…</p>}><QuoteForm /></Suspense>
        <aside>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold">How inquiries will work</h2>
            <ol className="mt-6 space-y-5 text-sm leading-7 text-gray-600">
              <li><span className="font-semibold text-blue-700">1. Share your requirements.</span><br />Once submissions are available, you can send your product and service needs to our team.</li>
              <li><span className="font-semibold text-blue-700">2. Discuss the details.</span><br />We contact you using the details you provide and clarify your requirements.</li>
              <li><span className="font-semibold text-blue-700">3. Receive a quotation.</span><br />Scope, pricing and applicable delivery arrangements are confirmed for your request.</li>
            </ol>
            <p className="mt-6 border-t border-gray-200 pt-5 text-sm leading-7 text-gray-600">This is an inquiry, not a confirmed order. No payment is collected through this form.</p>
          </div>
        </aside>
      </div>
      <CompanyFooter />
    </main>
  );
}
