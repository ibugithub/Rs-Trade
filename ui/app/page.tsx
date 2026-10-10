import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Factory,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const services = [
  {
    number: '01',
    title: 'China Product Sourcing',
    description:
      'Tell us what you need. We help find suitable products and suppliers in China and support the purchasing process.',
    href: '/services/china-product-sourcing',
    icon: Search,
  },
  {
    number: '02',
    title: 'Supplier Verification',
    description:
      'Get a clearer picture of your supplier before committing to an order through supplier and factory checks.',
    href: '/services/supplier-verification',
    icon: Factory,
  },
  {
    number: '03',
    title: 'Quality Control & Inspection',
    description:
      'Check product quality, quantities and packaging before shipment, with photo and video reporting.',
    href: '/services/quality-control',
    icon: ShieldCheck,
  },
  {
    number: '04',
    title: 'Shipping & Door-to-Door Import',
    description:
      'From collection in China to your address in Bangladesh, we handle shipping, documentation and customs formalities.',
    href: '/services/door-to-door-import',
    icon: Truck,
  },
];
const steps = ['Source', 'Verify', 'QC', 'Ship', 'Deliver'];
const qcChecks = [
  'Factory / supplier verification',
  'Product inspection',
  'Quantity check',
  'Packaging check',
  'Photo / video report',
  'Shipment approval',
];
const faqs = [
  {
    question: 'Who can use your services?',
    answer:
      'We work with wholesalers, importers, small businesses and individual buyers. Share your product and quantity requirements so we can discuss the right approach.',
  },
  {
    question: 'Can you help with the full import process?',
    answer:
      'Yes. Our door-to-door service covers collection, shipping, required documentation, customs formalities and final delivery from China to Bangladesh. Costs and delivery arrangements are confirmed in your quotation.',
  },
  {
    question: 'How do I order a Ready Stock product?',
    answer:
      'Browse Ready Stock, then contact our team through WhatsApp or phone to confirm availability, price and delivery. Online payment is not part of the current ordering process.',
  },
  {
    question: 'What should I prepare for a sourcing inquiry?',
    answer:
      'Share a product description or reference link, the quantity you need and any important specifications. These details help us understand your requirements.',
  },
];
const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
const action =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700';

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="overflow-hidden bg-blue-50/60">
        <div
          className={`${container} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24`}
        >
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Your connection from China to Bangladesh
            </p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Source with confidence.
              <br />
              <span className="text-blue-700">Import with support.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              From finding the right product to checking its quality and delivering it to your door.
              RS Trade International helps you manage the complete journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/request-a-quote"
                className={`${action} bg-yellow-300 text-gray-900 hover:bg-yellow-500`}
              >
                Request a Quote{' '}
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/ready-stock"
                className={`${action} border border-blue-200 bg-white text-blue-800 hover:bg-blue-50`}
              >
                Browse Ready Stock
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              For businesses, importers, wholesalers and individual buyers.
            </p>
          </div>
          <div className="relative rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  One connected journey
                </p>
                <p className="mt-2 text-xl font-bold">
                  China{' '}
                  <span
                    className="px-2 text-blue-600"
                    aria-hidden="true"
                  >
                    →
                  </span>{' '}
                  Bangladesh
                </p>
              </div>
              <span className="rounded-xl bg-yellow-300 p-3">
                <Package
                  size={26}
                  aria-hidden="true"
                />
              </span>
            </div>
            <ol className="mt-6 space-y-0">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-4 py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                    0{index + 1}
                  </span>
                  <span className="font-semibold">{step}</span>
                  <span className="ml-auto text-xs text-slate-500">
                    {
                      [
                        'Product & supplier sourcing',
                        'Supplier checks',
                        'Inspection & reporting',
                        'Shipping & clearance',
                        'To your address',
                      ][index]
                    }
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-xl bg-blue-700 px-5 py-4 text-sm font-medium text-white">
              Sourcing, verification, QC and delivery support.
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className={`${container} py-16 sm:py-20`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">What we do</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
            Support at every step of your import.
          </h2>
          <p className="max-w-sm leading-relaxed text-slate-600">
            Discuss a specific service or let us help with the complete process.
          </p>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ number, title, description, href, icon: Icon }) => (
            <article
              key={number}
              className="flex flex-col rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between">
                <Icon
                  className="text-blue-700"
                  size={28}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-slate-400">{number}</span>
              </div>
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{description}</p>
              <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"
              >
                Explore service{' '}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                />
                <span className="sr-only">: {title}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 text-slate-900 sm:py-20">
        <div className={`${container} grid gap-10 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              Quality before shipment
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Know what is being shipped.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-slate-600">
              Quality control is a dedicated service. We check products, quantities and packaging,
              and provide photo and video reports to support shipment decisions.
            </p>
            <Link
              href="/services/quality-control"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline"
            >
              Our QC process{' '}
              <ArrowRight
                size={18}
                aria-hidden="true"
              />
            </Link>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {qcChecks.map((check, index) => (
              <li
                key={check}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
              >
                <span className="text-xs font-bold text-blue-700">0{index + 1}</span>
                <span className="text-sm font-medium">{check}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${container} grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20`}>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-7 sm:p-9">
          <Truck
            size={36}
            className="text-blue-700"
            aria-hidden="true"
          />
          <h3 className="mt-5 text-2xl font-bold">From supplier to your doorstep.</h3>
          <ul className="mt-6 space-y-4">
            {[
              'Collection from the supplier in China',
              'Shipping and required documentation',
              'Customs clearance and duty/tax formalities',
              'Final delivery to your address in Bangladesh',
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-6 text-slate-700"
              >
                <Check
                  size={20}
                  className="shrink-0 text-blue-700"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="self-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Door-to-door import
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            One team to coordinate the full journey.
          </h2>
          <p className="mt-5 leading-7 text-slate-600">
            We handle the necessary requirements from China to Bangladesh. Share your product
            details and delivery destination so we can discuss your import needs.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Pricing inclusions and delivery arrangements are confirmed with your quotation.
          </p>
          <Link
            href="/services/door-to-door-import"
            className={`${action} mt-7 bg-blue-700 text-white hover:bg-blue-800`}
          >
            Explore Door-to-Door Import{' '}
            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div
          className={`${container} flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-center`}
        >
          <div className="flex items-start gap-4">
            <Package
              size={32}
              className="mt-1 shrink-0 text-blue-700"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                Selected Ready Stock
              </p>
              <h2 className="mt-2 text-2xl font-bold">Looking for products already in stock?</h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-600">
                Browse our product selection. Availability, price and delivery are confirmed through
                WhatsApp or phone.
              </p>
            </div>
          </div>
          <Link
            href="/ready-stock"
            className={`${action} shrink-0 border border-blue-200 bg-white text-blue-800 hover:bg-blue-50`}
          >
            Browse products{' '}
            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <section
        className={`${container} grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-20`}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Before you get started
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight">A few common questions.</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group py-5 first:pt-0"
            >
              <summary className="cursor-pointer text-lg font-semibold focus-visible:outline-blue-700">
                {question}
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-blue-50 text-gray-900">
        <div
          className={`${container} flex flex-col justify-between gap-7 py-14 sm:flex-row sm:items-center`}
        >
          <div>
            <ClipboardCheck
              size={28}
              className="mb-4 text-blue-700"
              aria-hidden="true"
            />
            <h2 className="text-3xl font-bold">Tell us what you need.</h2>
            <p className="mt-3 max-w-xl leading-7 text-gray-600">
              Share your product, quantity and requirements. Let’s discuss the next steps for your
              sourcing or import.
            </p>
          </div>
          <Link
            href="/request-a-quote"
            className={`${action} shrink-0 bg-yellow-300 text-blue-950 hover:bg-yellow-200 focus-visible:outline-blue-700`}
          >
            Request a Quote{' '}
            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-300">
        <div className={`${container} flex flex-col justify-between gap-8 py-10 sm:flex-row`}>
          <div>
            <p className="text-lg font-bold text-white">RS Trade International</p>
            <p className="mt-3 max-w-md text-sm leading-6">
              China product sourcing, supplier verification, quality control and door-to-door import
              support.
            </p>
          </div>
          <nav
            aria-label="Homepage footer"
            className="flex flex-wrap items-start gap-x-6 gap-y-3 text-sm"
          >
            <Link
              href="/#services"
              className="hover:text-white"
            >
              Our Services
            </Link>
            <Link
              href="/ready-stock"
              className="hover:text-white"
            >
              Ready Stock
            </Link>
            <Link
              href="/request-a-quote"
              className="hover:text-white"
            >
              Request a Quote
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
