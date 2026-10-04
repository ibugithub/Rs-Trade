import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, ChevronRight, ClipboardCheck, Factory, FileSearch, PackageSearch, ShieldCheck, Truck } from 'lucide-react';
import { CompanyFooter } from '@/components/footer/companyFooter';

export const metadata: Metadata = {
  title: 'China Supplier Verification | RS Trade International',
  description: 'Supplier verification support for customers importing from China to Bangladesh. Discuss supplier identity, factory information and capability checks with RS Trade International.',
};

const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
const button = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600';
const quoteLink = '/request-a-quote?service=supplier-verification';
const checks = [
  { icon: FileSearch, title: 'Supplier identity', text: 'Review available company information and supplier details to understand who you are dealing with.' },
  { icon: Factory, title: 'Factory & business information', text: 'Discuss checks on the supplier’s business type, location and factory information. Any site visit is agreed as part of the verification scope.' },
  { icon: ClipboardCheck, title: 'Capability for your order', text: 'Review relevant information about the supplier’s ability to meet your product and quantity requirements.' },
];
const process = [
  { title: 'Send supplier details', text: 'Share the company name, contact information, links and the products you plan to order.' },
  { title: 'Agree the checks', text: 'Discuss your concerns and confirm the scope, arrangements and applicable costs with our team.' },
  { title: 'Review the supplier', text: 'We carry out the agreed checks using the available information and access.' },
  { title: 'Discuss the findings', text: 'Review the findings, any unanswered questions and the next steps before making your purchase decision.' },
];
const requirements = ['Supplier company name and contact details', 'Website, marketplace or product links', 'Product details and estimated order quantity', 'Quotation or company documents, if available', 'Any specific concerns you want us to check'];
const related = [
  { icon: PackageSearch, title: 'China Product Sourcing', text: 'Need a supplier first? Get help finding products and suitable options in China.', href: '/services/china-product-sourcing' },
  { icon: ShieldCheck, title: 'Quality Control & Inspection', text: 'Check the actual products, quantities and packaging before shipment.', href: '/services/quality-control' },
  { icon: Truck, title: 'Door-to-Door Import', text: 'Coordinate collection, shipping, customs formalities and delivery.', href: '/services/door-to-door-import' },
];
const faqs = [
  { question: 'Can you check a supplier I have already found?', answer: 'Yes. Share the supplier details and your order requirements so we can discuss the appropriate verification scope.' },
  { question: 'Does every verification include a factory visit?', answer: 'A factory visit is not assumed for every request. Discuss the location, access and checks required with our team, and confirm any visit in the agreed service scope.' },
  { question: 'Is supplier verification the same as product inspection?', answer: 'No. Verification focuses on the supplier and relevant business information. Product inspection focuses on the goods, quantities and packaging. QC is available as a separate service.' },
  { question: 'What findings will I receive?', answer: 'The information and reporting format depend on the agreed checks. Confirm the expected findings and any available photo or video evidence with our team before the work begins.' },
  { question: 'Does verification guarantee a successful order?', answer: 'Verification helps you make a more informed decision based on the checks performed. It cannot guarantee future supplier performance or the quality of every shipment. Product inspection can address additional concerns about the goods.' },
  { question: 'How much does verification cost and how long does it take?', answer: 'Costs and timing depend on the supplier location, checks required and access to information. These details are confirmed for your request.' },
];

export default function SupplierVerificationPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className={`${container} py-8 sm:py-12`}>
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-700">Home</Link><ChevronRight size={14} aria-hidden="true" />
            <Link href="/#services" className="hover:text-blue-700">Services</Link><ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page" className="text-blue-700">Supplier Verification</span>
          </nav>
          <div className="grid items-center gap-10 pb-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Know your supplier before you order</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Supplier Verification</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">Get a clearer picture of your supplier in China. RS Trade International helps review supplier information and relevant capabilities before you commit to an order.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={quoteLink} className={`${button} bg-yellow-300 text-gray-900 hover:bg-yellow-500`}>Request Supplier Verification <ArrowRight size={18} aria-hidden="true" /></Link>
                <a href="#verification-process" className={`${button} border border-gray-300 bg-white text-blue-700 hover:bg-blue-50`}>How it works</a>
              </div>
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-white p-7 sm:p-8" aria-label="Getting started">
              <ShieldCheck size={32} className="text-blue-700" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold">Start with the supplier you want to check.</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">Send their company details and tell us what you plan to buy. We can then discuss the checks that matter for your request.</p>
              <div className="mt-6 border-t border-gray-200 pt-5"><p className="text-xs font-semibold uppercase tracking-widest text-gray-500">The wider journey</p><p className="mt-2 text-sm font-semibold text-blue-700">Source → Verify → QC → Ship → Deliver</p></div>
            </aside>
          </div>
        </div>
      </section>

      <section className={`${container} py-14 sm:py-20`} aria-labelledby="checks-title">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">What we look at</p>
        <h2 id="checks-title" className="mt-3 text-3xl font-bold tracking-tight">Understand the business behind the offer.</h2>
        <p className="mt-4 max-w-2xl leading-7 text-gray-600">The exact checks are agreed for your supplier and order. These are the areas we can discuss when planning verification.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{checks.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-gray-200 p-6"><Icon size={28} className="text-blue-700" aria-hidden="true" /><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-gray-600">{text}</p></article>
        ))}</div>
      </section>

      <section id="verification-process" className="scroll-mt-28 border-y border-gray-200 bg-gray-50 py-14 sm:py-20" aria-labelledby="process-title">
        <div className={container}><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">How it works</p><h2 id="process-title" className="mt-3 text-3xl font-bold tracking-tight">From supplier details to clearer decisions.</h2>
          <ol className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{process.map(({ title, text }, index) => (
            <li key={title}><span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">0{index + 1}</span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-gray-600">{text}</p></li>
          ))}</ol>
        </div>
      </section>

      <section className={`${container} grid gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16`} aria-labelledby="prepare-title">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Before you inquire</p><h2 id="prepare-title" className="mt-3 text-3xl font-bold tracking-tight">Share the information you already have.</h2><p className="mt-5 max-w-lg leading-7 text-gray-600">Supplier links, quotations and product details help us understand the business you want to check. Tell us about any specific concerns.</p><p className="mt-4 text-sm leading-7 text-gray-500">You do not need every document to start the discussion. Our team can clarify what is needed for the agreed checks.</p></div>
        <ul className="space-y-3">{requirements.map(item => <li key={item} className="flex items-start gap-3 rounded-xl border border-gray-200 p-4"><Check size={20} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" /><span className="text-sm leading-6">{item}</span></li>)}</ul>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20" aria-labelledby="related-title"><div className={container}><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Your next steps</p><h2 id="related-title" className="mt-3 text-3xl font-bold tracking-tight">Connect verification with the rest of your order.</h2><p className="mt-4 leading-7 text-gray-600">Discuss sourcing, product inspection and shipping separately or as part of your complete requirements.</p><div className="mt-8 grid gap-5 md:grid-cols-3">{related.map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Icon size={26} className="text-blue-700" aria-hidden="true" /><h3 className="mt-5 text-lg font-bold group-hover:text-blue-700">{title}</h3><p className="mt-3 text-sm leading-7 text-gray-600">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Explore service <ArrowRight size={16} aria-hidden="true" /></span></Link>)}</div></div></section>

      <section className={`${container} grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-16`} aria-labelledby="faq-title"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Common questions</p><h2 id="faq-title" className="mt-3 text-3xl font-bold tracking-tight">Before you request verification.</h2></div><div className="divide-y divide-gray-200">{faqs.map(({ question, answer }) => <details key={question} className="py-5 first:pt-0"><summary className="cursor-pointer text-lg font-semibold focus-visible:outline-blue-600">{question}</summary><p className="mt-3 text-sm leading-7 text-gray-600">{answer}</p></details>)}</div></section>

      <section className="border-t border-gray-200 bg-blue-50"><div className={`${container} flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-center`}><div><h2 className="text-3xl font-bold">Have a supplier in mind?</h2><p className="mt-3 max-w-xl leading-7 text-gray-600">Share their details and your requirements. Let’s discuss the right verification checks.</p></div><Link href={quoteLink} className={`${button} shrink-0 bg-yellow-300 text-gray-900 hover:bg-yellow-500`}>Request Supplier Verification <ArrowRight size={18} aria-hidden="true" /></Link></div></section>
      <CompanyFooter />
    </main>
  );
}
