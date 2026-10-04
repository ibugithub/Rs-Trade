import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Check, ChevronRight, ClipboardList, Factory, PackageSearch, Search, ShieldCheck, Truck } from 'lucide-react';
import { CompanyFooter } from '@/components/footer/companyFooter';

export const metadata: Metadata = {
  title: 'China Product Sourcing | RS Trade International',
  description: 'Find suitable products and suppliers in China with RS Trade International. Sourcing support for businesses, importers and individual buyers in Bangladesh.',
};

const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
const button = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600';
const quoteLink = '/request-a-quote?service=china-product-sourcing';

const support = [
  { icon: PackageSearch, title: 'Find the right product', text: 'Share a description, reference link or specifications. We help look for products that match your requirements.' },
  { icon: Factory, title: 'Find suitable suppliers', text: 'We help identify suppliers in China for your product and quantity needs. Dedicated supplier verification is available as a separate service.' },
  { icon: ClipboardList, title: 'Support your purchase', text: 'Review the available options and discuss your requirements with our team before confirming the next steps.' },
];
const process = [
  { title: 'Share your requirements', text: 'Tell us what you need, how many pieces you want and the specifications that matter.' },
  { title: 'Find suitable options', text: 'We look for products and suppliers in China based on your requirements.' },
  { title: 'Review the options', text: 'Discuss the available options with our team and clarify the product and order details.' },
  { title: 'Confirm the next steps', text: 'Agree the sourcing arrangements and discuss any verification, QC or shipping support you need.' },
];
const requirements = ['Product name, description or reference link', 'Estimated quantity or order size', 'Important specifications, sizes or materials', 'Delivery destination in Bangladesh'];
const related = [
  { icon: Factory, title: 'Supplier Verification', text: 'Learn more about your supplier before placing an order.', href: '/services/supplier-verification' },
  { icon: ShieldCheck, title: 'Quality Control & Inspection', text: 'Check products, quantities and packaging before shipment.', href: '/services/quality-control' },
  { icon: Truck, title: 'Door-to-Door Import', text: 'Coordinate collection, shipping, customs and final delivery.', href: '/services/door-to-door-import' },
];
const faqs = [
  { question: 'Who can request product sourcing?', answer: 'Wholesalers, importers, small businesses and individual buyers can share their requirements. The suitable order quantity depends on the product and supplier.' },
  { question: 'Can I send a product link or photo?', answer: 'Yes. A reference link or photo helps explain what you are looking for. Include the quantity and any important specifications when discussing your request with our team.' },
  { question: 'Is there a fixed minimum order quantity?', answer: 'There is no single minimum quantity stated for every sourcing request. The MOQ depends on the product and supplier and needs to be confirmed for your requirements.' },
  { question: 'Are supplier verification and QC the same as sourcing?', answer: 'They are separate services. Sourcing helps find products and suppliers. Verification checks the supplier, while QC checks the products before shipment. Discuss which services your order needs.' },
  { question: 'How are prices and delivery times confirmed?', answer: 'Pricing and delivery arrangements depend on the product, quantity and services required. Confirm the applicable details with our team before committing to an order.' },
];

export default function ChinaProductSourcingPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className={`${container} py-8 sm:py-12`}>
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-700">Home</Link><ChevronRight size={14} aria-hidden="true" />
            <Link href="/#services" className="hover:text-blue-700">Services</Link><ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page" className="text-blue-700">China Product Sourcing</span>
          </nav>
          <div className="grid items-center gap-10 pb-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Products from China. Support for your business.</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">China Product Sourcing</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">Find suitable products and suppliers in China with RS Trade International. Share what you need, and we’ll help you explore your options and coordinate the next steps.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={quoteLink} className={`${button} bg-yellow-300 text-gray-900 hover:bg-yellow-500`}>Request Product Sourcing <ArrowRight size={18} aria-hidden="true" /></Link>
                <a href="#how-it-works" className={`${button} border border-gray-300 bg-white text-blue-700 hover:bg-blue-50`}>How it works</a>
              </div>
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-white p-7 sm:p-8" aria-label="Getting started">
              <Search size={32} className="text-blue-700" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold">Start with your product idea.</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">A clear description and estimated quantity give us a useful starting point for your sourcing request.</p>
              <div className="mt-6 border-t border-gray-200 pt-5"><p className="text-xs font-semibold uppercase tracking-widest text-gray-500">The wider journey</p><p className="mt-2 text-sm font-semibold text-blue-700">Source → Verify → QC → Ship → Deliver</p></div>
            </aside>
          </div>
        </div>
      </section>

      <section className={`${container} py-14 sm:py-20`} aria-labelledby="support-title">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">What we help with</p>
        <h2 id="support-title" className="mt-3 text-3xl font-bold tracking-tight">From requirements to suitable options.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{support.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-2xl border border-gray-200 p-6"><Icon size={28} className="text-blue-700" aria-hidden="true" /><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-gray-600">{text}</p></article>
        ))}</div>
        <p className="mt-7 text-sm leading-7 text-gray-600">For wholesalers, importers, small businesses and individual buyers. Product availability and minimum quantities are confirmed for each request.</p>
      </section>

      <section id="how-it-works" className="scroll-mt-28 border-y border-gray-200 bg-gray-50 py-14 sm:py-20" aria-labelledby="process-title">
        <div className={container}><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">How it works</p><h2 id="process-title" className="mt-3 text-3xl font-bold tracking-tight">A clear starting point for your order.</h2>
          <ol className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{process.map(({ title, text }, index) => (
            <li key={title}><span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">0{index + 1}</span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-gray-600">{text}</p></li>
          ))}</ol>
        </div>
      </section>

      <section className={`${container} grid gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16`} aria-labelledby="prepare-title">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Before you inquire</p><h2 id="prepare-title" className="mt-3 text-3xl font-bold tracking-tight">Tell us what you’re looking for.</h2><p className="mt-5 max-w-lg leading-7 text-gray-600">You do not need a long brief. Start with the details you have so we can understand your requirements.</p><p className="mt-4 text-sm leading-7 text-gray-500">If you have a target budget or additional requirements, include those too.</p></div>
        <ul className="space-y-3">{requirements.map(item => <li key={item} className="flex items-start gap-3 rounded-xl border border-gray-200 p-4"><Check size={20} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" /><span className="text-sm leading-6">{item}</span></li>)}</ul>
      </section>

      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20" aria-labelledby="related-title"><div className={container}><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Beyond sourcing</p><h2 id="related-title" className="mt-3 text-3xl font-bold tracking-tight">Support for the next steps.</h2><p className="mt-4 text-gray-600">Discuss these services separately or as part of your complete import requirements.</p><div className="mt-8 grid gap-5 md:grid-cols-3">{related.map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><Icon size={26} className="text-blue-700" aria-hidden="true" /><h3 className="mt-5 text-lg font-bold group-hover:text-blue-700">{title}</h3><p className="mt-3 text-sm leading-7 text-gray-600">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Explore service <ArrowRight size={16} aria-hidden="true" /></span></Link>)}</div></div></section>

      <section className={`${container} grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-16`} aria-labelledby="faq-title"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Common questions</p><h2 id="faq-title" className="mt-3 text-3xl font-bold tracking-tight">Before you start sourcing.</h2></div><div className="divide-y divide-gray-200">{faqs.map(({ question, answer }) => <details key={question} className="py-5 first:pt-0"><summary className="cursor-pointer text-lg font-semibold focus-visible:outline-blue-600">{question}</summary><p className="mt-3 text-sm leading-7 text-gray-600">{answer}</p></details>)}</div></section>

      <section className="border-t border-gray-200 bg-blue-50"><div className={`${container} flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-center`}><div><h2 className="text-3xl font-bold">Have a product in mind?</h2><p className="mt-3 max-w-xl leading-7 text-gray-600">Share your product details and quantity. Let’s discuss how RS Trade can help.</p></div><Link href={quoteLink} className={`${button} shrink-0 bg-yellow-300 text-gray-900 hover:bg-yellow-500`}>Request Product Sourcing <ArrowRight size={18} aria-hidden="true" /></Link></div></section>
      <CompanyFooter />
    </main>
  );
}
