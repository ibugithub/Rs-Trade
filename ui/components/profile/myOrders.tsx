'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, LoaderCircle, Package, RefreshCw } from 'lucide-react';
import { useAppSelector } from '@/configs/redux/hooks';
import { listOrders, type OrderPage, type OrderReceipt } from '@/lib/ordersApi';
import { formatBDT } from '@/content/pricing';

export function MyOrders() {
  const { isAuthenticated, status, loogedInUser: account } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const owner = (account?.user?.email ?? account?.email)?.trim().toLowerCase();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/accounts/signin');
  }, [status, router]);

  return (
    <main className="min-h-[calc(100svh_-_90px)] bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/accounts/profile/"
          className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-gray-500 hover:text-blue-700"
        >
          <ArrowLeft
            size={16}
            aria-hidden="true"
          />
          Back to profile
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">My orders</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Follow your orders and view updates from RS Trade.
        </p>
        {isAuthenticated && status === 'authenticated' && owner ? (
          <OrderList key={owner} />
        ) : (
          <p
            role="status"
            className="mt-8 text-sm text-gray-600"
          >
            {status === 'unauthenticated' ? 'Returning to Sign In...' : 'Checking your session...'}
          </p>
        )}
      </div>
    </main>
  );
}

function OrderList() {
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<OrderPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setSessionExpired(false);
    void listOrders(page, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((failure) => {
        if (controller.signal.aborted) return;
        const responseStatus = axios.isAxiosError(failure) ? failure.response?.status : undefined;
        setSessionExpired(responseStatus === 401);
        setError(
          responseStatus === 401
            ? 'Your session has expired. Please sign in again.'
            : responseStatus === 503
              ? 'Orders are temporarily unavailable. Please try again shortly.'
              : 'We could not load your orders. Please try again.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, refresh]);

  return (
    <div className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          {!loading && !error && data
            ? `${data.count} ${data.count === 1 ? 'order' : 'orders'}`
            : 'Order history'}
        </p>
        <button
          type="button"
          disabled={loading}
          onClick={() => setRefresh((value) => value + 1)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            aria-hidden="true"
          />
          Refresh status
        </button>
      </div>
      {loading ? (
        <p
          role="status"
          className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-16 text-sm text-gray-600"
        >
          <LoaderCircle
            size={20}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
          Loading your orders...
        </p>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          {error}
          {sessionExpired ? (
            <Link
              href="/accounts/signin"
              className="ml-2 font-semibold underline"
            >
              Sign in
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setRefresh((value) => value + 1)}
              className="ml-2 min-h-11 font-semibold underline"
            >
              Try again
            </button>
          )}
        </div>
      ) : data?.results.length ? (
        <>
          <div className="space-y-4">
            {data.results.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
          {data.pages > 1 && (
            <nav
              aria-label="Order pages"
              className="mt-6 flex items-center justify-center gap-4"
            >
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setPage(data.page - 1)}
                className="min-h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {data.page} of {data.pages}
              </span>
              <button
                type="button"
                disabled={data.page >= data.pages}
                onClick={() => setPage(data.page + 1)}
                className="min-h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
          <Package
            size={36}
            className="mx-auto text-blue-600"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-lg font-semibold">Your orders will appear here</h2>
          <p className="mt-2 text-sm text-gray-500">
            Once you place an order, you can follow its status here.
          </p>
          <Link
            href="/ready-stock/"
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-yellow-300 px-5 text-sm font-semibold hover:bg-yellow-500"
          >
            Browse products
          </Link>
        </div>
      )}
    </div>
  );
}

function dateLabel(value: string) {
  return new Date(value).toLocaleString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function OrderCard({ order }: { order: OrderReceipt }) {
  const statusClass =
    order.status === 'cancelled'
      ? 'bg-red-50 text-red-700'
      : order.status === 'delivered'
        ? 'bg-green-50 text-green-700'
        : 'bg-blue-50 text-blue-700';
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <header className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold">{order.number}</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Placed {dateLabel(order.createdAt)}
          </p>
        </div>
        <span className={`rounded-full px-3 py-2 text-xs font-semibold ${statusClass}`}>
          {order.statusLabel}
        </span>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
        <p className="min-w-0 text-sm text-gray-600">
          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {order.items[0]?.name}
          {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
        </p>
        <p className="shrink-0 text-sm font-semibold">
          Subtotal {formatBDT(Number(order.subtotal))}
        </p>
      </div>
      {order.customerUpdate && (
        <div className="mx-5 mb-4 rounded-xl bg-blue-50 p-4 sm:mx-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Update from RS Trade
          </h3>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
            {order.customerUpdate}
          </p>
        </div>
      )}
      <details className="group border-t border-gray-100">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-blue-600 sm:px-6">
          View order details
          <ChevronDown
            size={16}
            className="transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="border-t border-gray-100 p-5 sm:p-6">
          <ul className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex items-start gap-4 py-4 first:pt-0"
              >
                <ProductImage
                  src={item.image}
                  name={item.name}
                />
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold">{item.name}</p>
                  {item.sku && (
                    <p className="mt-1 break-all text-xs text-gray-500">SKU: {item.sku}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {item.quantity} × {formatBDT(Number(item.unitPrice))}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatBDT(Number(item.unitPrice) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2">
            <section>
              <h3 className="text-sm font-semibold">Delivery details</h3>
              <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                {order.customerName}
                <br />
                {order.phone}
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                {order.deliveryAddress}
              </p>
            </section>
            <section>
              <h3 className="text-sm font-semibold">Your order notes</h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                {order.notes || 'No notes added.'}
              </p>
            </section>
          </div>
          <p className="mt-5 text-xs text-gray-500">Last updated {dateLabel(order.updatedAt)}</p>
          {order.status === 'pending' && (
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Our team will call you to confirm availability and delivery. Your order is awaiting
              confirmation.
            </p>
          )}
        </div>
      </details>
    </article>
  );
}

function ProductImage({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      src={src}
      alt={name}
      width={64}
      height={64}
      unoptimized
      onError={() => setFailed(true)}
      className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover"
    />
  ) : (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <Package
        size={24}
        aria-hidden="true"
      />
      <span className="sr-only">{name}</span>
    </span>
  );
}
