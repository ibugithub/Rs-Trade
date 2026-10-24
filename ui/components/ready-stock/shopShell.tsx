import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CompanyFooter } from '@/components/footer/companyFooter';
import { CartSyncStatus } from '@/components/cart/cartSyncStatus';

export function ShopShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="min-h-[calc(100svh_-_64px)] bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 sm:py-12 lg:min-h-[calc(100svh_-_90px)]">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/ready-stock"
            className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-gray-600 hover:text-blue-700"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
            />
            Ready Stock
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">{description}</p>
          <CartSyncStatus />
          {children}
        </div>
      </main>
      <CompanyFooter />
    </>
  );
}
