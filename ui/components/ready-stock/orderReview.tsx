'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clipboard, LoaderCircle, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import { setQuantity, setBuyNow } from '@/configs/redux/cart/cartSlice';
import { formatOrderRequest, type OrderContact } from '@/content/orderRequest';
import { CartItems } from '@/components/cart/cartItems';
import { ShopShell } from './shopShell';

export function OrderReview({ mode }: { mode: 'cart' | 'buyNow' }) {
  const { items: cartItems, buyNow, hydrated } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const items = mode === 'buyNow' ? (buyNow ? [buyNow] : []) : cartItems;
  const [contact, setContact] = useState<OrderContact>({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [reviewed, setReviewed] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [copying, setCopying] = useState(false);
  useEffect(() => {
    setReviewed(false);
    setCopyStatus('');
  }, [cartItems, buyNow]);
  const summary = formatOrderRequest(items, contact);
  const copy = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus('Request copied. Share it with our team to confirm your order.');
    } catch {
      setCopyStatus('Could not copy automatically. Select and copy the request below.');
    } finally {
      setCopying(false);
    }
  };
  const inputClass =
    'min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100';
  return (
    <ShopShell
      title={mode === 'buyNow' ? 'Buy Now' : 'Review Your Request'}
      description="Confirm your selection and prepare a request for our team. Final price and delivery are agreed before an order is confirmed."
    >
      {!hydrated ? (
        <p
          role="status"
          className="mt-8 flex items-center gap-2 text-sm text-gray-600"
        >
          <LoaderCircle
            size={18}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
          Loading your selection...
        </p>
      ) : !items.length ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <ShoppingBag
            size={32}
            className="mx-auto text-blue-600"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-xl font-semibold">No product selected</h2>
          <p className="mt-3 text-sm text-gray-500">Choose a Ready Stock product to continue.</p>
          <Link
            href="/ready-stock"
            className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-yellow-300 px-5 text-sm font-semibold"
          >
            Browse Ready Stock
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-7 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Your selection</h2>
            <CartItems
              items={items}
              onChange={(item) => dispatch(mode === 'buyNow' ? setBuyNow(item) : setQuantity(item))}
            />
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-gray-600">
              <p className="font-semibold text-gray-900">Price and delivery: to be confirmed</p>
              <p className="mt-2">
                These are sample products. Preparing a request does not reserve stock, place an
                order or take payment.
              </p>
            </div>
            <Link
              href="/cart"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 hover:underline"
            >
              View Your Cart
            </Link>
          </div>
          <section
            className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
            aria-labelledby="order-contact-title"
          >
            <h2
              id="order-contact-title"
              className="text-xl font-semibold"
            >
              Your contact and delivery details
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Use the request summary to discuss your order with our team.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setReviewed(true);
                setCopyStatus('');
              }}
            >
              {(
                [
                  { key: 'name', label: 'Full name', autocomplete: 'name' },
                  { key: 'phone', label: 'Phone / WhatsApp number', autocomplete: 'tel' },
                  { key: 'address', label: 'Delivery address', autocomplete: 'street-address' },
                ] as const
              ).map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={`order-${field.key}`}
                    className="mb-2 block text-sm font-medium"
                  >
                    {field.label}
                  </label>
                  {field.key === 'address' ? (
                    <textarea
                      id={`order-${field.key}`}
                      autoComplete={field.autocomplete}
                      required
                      rows={3}
                      value={contact[field.key]}
                      onChange={(event) => {
                        setContact((value) => ({ ...value, [field.key]: event.target.value }));
                        setReviewed(false);
                      }}
                      className={inputClass}
                    />
                  ) : (
                    <input
                      id={`order-${field.key}`}
                      type={field.key === 'phone' ? 'tel' : 'text'}
                      autoComplete={field.autocomplete}
                      required
                      value={contact[field.key]}
                      onChange={(event) => {
                        setContact((value) => ({ ...value, [field.key]: event.target.value }));
                        setReviewed(false);
                      }}
                      className={inputClass}
                    />
                  )}
                </div>
              ))}
              <div>
                <label
                  htmlFor="order-notes"
                  className="mb-2 block text-sm font-medium"
                >
                  Notes <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <textarea
                  id="order-notes"
                  rows={2}
                  value={contact.notes}
                  onChange={(event) => {
                    setContact((value) => ({ ...value, notes: event.target.value }));
                    setReviewed(false);
                  }}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                className="min-h-12 w-full rounded-lg bg-yellow-300 px-5 text-sm font-semibold hover:bg-yellow-500"
              >
                Prepare Order Request
              </button>
            </form>
            {reviewed && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <p
                  role="status"
                  className="text-sm font-semibold text-blue-700"
                >
                  Your request is ready to review. It has not been sent.
                </p>
                <label
                  htmlFor="order-summary"
                  className="mb-2 mt-4 block text-sm font-medium"
                >
                  Request summary
                </label>
                <textarea
                  id="order-summary"
                  readOnly
                  rows={10}
                  value={summary}
                  className={`${inputClass} leading-6`}
                />
                <button
                  type="button"
                  onClick={() => void copy()}
                  disabled={copying}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-blue-700 disabled:opacity-50"
                >
                  <Clipboard
                    size={16}
                    aria-hidden="true"
                  />
                  {copying ? 'Copying...' : 'Copy Request'}
                </button>
                <p className="mt-3 text-xs leading-6 text-gray-500">
                  Direct WhatsApp/phone ordering will be connected once the official contact details
                  are confirmed.
                </p>
                <p
                  role="status"
                  className="mt-3 text-sm text-gray-600"
                >
                  {copyStatus}
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </ShopShell>
  );
}
