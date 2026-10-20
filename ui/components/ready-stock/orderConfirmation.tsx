import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { formatBDT } from '@/content/pricing';
import type { OrderReceipt } from '@/lib/ordersApi';

export function OrderConfirmation({ order }: { order: OrderReceipt }) {
  return (
    <section
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
      aria-labelledby="order-received-title"
    >
      <CheckCircle2
        size={40}
        className="text-green-600"
        aria-hidden="true"
      />
      <p className="mt-5 text-sm font-semibold text-blue-700">Order {order.number}</p>
      <h2
        id="order-received-title"
        className="mt-2 text-2xl font-bold"
      >
        {order.status === 'cancelled'
          ? 'Your order was cancelled'
          : order.status === 'delivered'
            ? 'Your order was delivered'
            : 'Your order has been received'}
      </h2>
      <p className="mt-3 text-sm leading-7 text-gray-600">
        {order.status === 'pending' ? (
          <>
            Our team will contact you at <strong>{order.phone}</strong> to confirm the details and
            delivery charges.
          </>
        ) : (
          <>
            Contact number for this order: <strong>{order.phone}</strong>.
          </>
        )}{' '}
        No online payment has been taken.
      </p>
      <dl className="mt-6 grid gap-4 rounded-xl bg-gray-50 p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-gray-500">Current status</dt>
          <dd className="mt-1 font-semibold">{order.statusLabel}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Product subtotal</dt>
          <dd className="mt-1 font-semibold">{formatBDT(Number(order.subtotal))}</dd>
        </div>
      </dl>
      <ul className="mt-6 divide-y divide-gray-200">
        {order.items.map((item) => (
          <li
            key={item.productId}
            className="flex justify-between gap-4 py-4 text-sm"
          >
            <span>
              {item.name} <span className="text-gray-500">× {item.quantity}</span>
            </span>
            <strong>{formatBDT(Number(item.unitPrice) * item.quantity)}</strong>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-6 text-gray-500">
        Keep your order number for follow-up. Delivery charges are excluded from this subtotal.
      </p>
      <Link
        href="/ready-stock"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-yellow-300 px-5 text-sm font-semibold hover:bg-yellow-500"
      >
        Continue shopping
      </Link>
    </section>
  );
}
