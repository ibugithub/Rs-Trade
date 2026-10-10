import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, MessageCircle, Package, Truck } from 'lucide-react';
import { ReadyStockGrid } from '@/components/ready-stock/readyStockGrid';
import { CompanyFooter } from '@/components/footer/companyFooter';

export const metadata: Metadata = {
  title: 'Selected Ready Stock | RS Trade International',
  description:
    'Explore selected products from RS Trade International. Orders are confirmed through WhatsApp or phone, with price and delivery agreed before purchase.',
};
const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

export default function ReadyStockPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className={`${container} py-8 sm:py-12`}>
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-sm text-gray-600"
          >
            <Link
              href="/"
              className="hover:text-blue-700"
            >
              Home
            </Link>
            <ChevronRight
              size={14}
              aria-hidden="true"
            />
            <span
              aria-current="page"
              className="text-blue-700"
            >
              Ready Stock
            </span>
          </nav>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                Selected products. Personal service.
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Ready Stock</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                A focused selection for your next purchase. Explore the products, then confirm
                price, quantity and delivery with our team.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm">
              <MessageCircle
                size={24}
                className="shrink-0 text-blue-700"
                aria-hidden="true"
              />
              <span>
                Orders confirmed through
                <br />
                <strong>WhatsApp or phone</strong>
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className={`${container} py-10 sm:py-14`}>
        <ReadyStockGrid />
      </div>
      <section
        className="border-y border-gray-200 bg-gray-50 py-12 sm:py-16"
        aria-labelledby="order-title"
      >
        <div className={container}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">How to order</p>
          <h2
            id="order-title"
            className="mt-3 text-3xl font-bold tracking-tight"
          >
            A simple conversation before you buy.
          </h2>
          <ol className="mt-8 grid gap-7 md:grid-cols-3">
            {[
              {
                icon: Package,
                title: 'Choose your product',
                text: 'Review product details and the quantity you need.',
              },
              {
                icon: MessageCircle,
                title: 'Confirm with our team',
                text: 'Discuss availability, minimum order quantity and final price through WhatsApp or phone.',
              },
              {
                icon: Truck,
                title: 'Agree delivery',
                text: 'Confirm the address, charges and timing before your order is finalized.',
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <li key={title}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    0{index + 1}
                  </span>
                  <Icon
                    size={23}
                    className="text-blue-700"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-gray-600">
            No online payment is collected on this website.
          </p>
        </div>
      </section>
      <section
        className={`${container} flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-center`}
      >
        <div>
          <h2 className="text-2xl font-bold">Looking for something else?</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600">
            Our China Product Sourcing service can help you explore products and suppliers.
          </p>
        </div>
        <Link
          href="/services/china-product-sourcing"
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          Explore Product Sourcing
        </Link>
      </section>
      <CompanyFooter />
    </main>
  );
}
