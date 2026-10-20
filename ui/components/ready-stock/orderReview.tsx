'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoaderCircle, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import {
  setQuantity,
  setBuyNow,
  removeItem,
  clearBuyNow,
  selectedCartItems,
  retryCartSync,
} from '@/configs/redux/cart/cartSlice';
import { useOrderSubmission } from './useOrderSubmission';
import { OrderConfirmation } from './orderConfirmation';
import { validatePhoneNumber } from '@/lib/phoneNumber';
import { CartItems } from '@/components/cart/cartItems';
import { CartAvailability } from '@/components/cart/cartAvailability';
import { ShopShell } from './shopShell';
import { productSubtotal, formatBDT, invalidCartItems } from '@/content/pricing';
import { useAddressBook } from '@/components/profile/useAddressBook';
import {
  formatDeliveryAddress,
  selectDeliveryAddress,
} from '@/configs/redux/addresses/addressSlice';
import {
  orderAddressDestination,
  profileAddressPath,
  rememberAddressSignIn,
} from '@/lib/orderNavigation';

export function OrderReview({ mode }: { mode: 'cart' | 'buyNow' }) {
  const {
    items: cartItems,
    buyNow,
    hydrated,
    owner: cartOwner,
    syncStatus,
    unselectedIds,
  } = useAppSelector((state) => state.cart);
  const { products, cartStatus } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const {
    owner,
    ready: addressesReady,
    items: addresses,
    defaultId,
    storageAvailable,
  } = useAddressBook();
  const orderPath = mode === 'buyNow' ? '/buy_now' : '/checkout';
  const addressPage = profileAddressPath(orderPath);
  const items =
    mode === 'buyNow'
      ? buyNow
        ? [buyNow]
        : []
      : selectedCartItems({ items: cartItems, unselectedIds });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const selectedAddress = selectDeliveryAddress(addresses, selectedId, defaultId);
  const phone = validatePhoneNumber(selectedAddress?.phone ?? '', selectedAddress?.country);
  const onOrderSaved = useCallback(() => {
    if (mode === 'buyNow') dispatch(clearBuyNow());
    dispatch(retryCartSync());
  }, [dispatch, mode]);
  const order = useOrderSubmission(owner, mode, onOrderSaved);
  useEffect(() => {
    setSelectedId(null);
    setNotes('');
  }, [owner]);
  useEffect(() => {
    if (!hydrated || !items.length || order.receipt || order.pending || order.recovering) return;
    const destination = orderAddressDestination(
      authStatus,
      addressesReady,
      addresses.length,
      orderPath,
    );
    if (!destination) return;
    if (destination === '/accounts/signin') rememberAddressSignIn(orderPath);
    router.replace(destination);
  }, [
    hydrated,
    items.length,
    authStatus,
    addressesReady,
    addresses.length,
    orderPath,
    addressPage,
    router,
    order.receipt,
    order.pending,
    order.recovering,
  ]);
  const placeOrder = () => {
    if (!selectedAddress || !owner || !items.length || order.submitting || phone.error) return;
    void order.place({
      requestId: crypto.randomUUID(),
      source: mode,
      items: items.map((item) => ({ ...item, unitPrice: products[item.productId].price })),
      address: { ...selectedAddress, phone: phone.number },
      notes,
    });
  };
  const inputClass =
    'min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100';
  return (
    <ShopShell
      title={mode === 'buyNow' ? 'Buy Now' : 'Review Your Order'}
      description="Review your products and delivery details, then place your order. Our team will call you to confirm delivery and the next steps."
    >
      {order.error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
        >
          {order.error}
        </p>
      )}
      {order.receipt ? (
        <OrderConfirmation order={order.receipt} />
      ) : order.recovering ? (
        <p
          role="status"
          className="mt-8 text-sm text-gray-600"
        >
          Checking your order...
        </p>
      ) : order.pending ? (
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            {order.submitting ? 'Submitting your order...' : 'Confirm your order submission'}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            {order.pending.items.length} products for {order.pending.address.recipient}. Contact
            number: {order.pending.address.phone}.
          </p>
          <p className="mt-2 text-sm leading-7 text-gray-600">
            If your connection was interrupted, retry this same submission. An order that was
            already received will be shown without placing it twice.
          </p>
          <button
            type="button"
            disabled={order.submitting}
            onClick={() => {
              if (order.pending) void order.place(order.pending);
            }}
            className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-yellow-300 px-5 text-sm font-semibold disabled:opacity-60"
          >
            {order.submitting && (
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            )}
            {order.submitting ? 'Submitting...' : 'Retry Order Submission'}
          </button>
        </section>
      ) : !hydrated && syncStatus === 'error' ? null : !hydrated ||
        (items.length > 0 && (!addressesReady || !selectedAddress)) ? (
        <p
          role="status"
          className="mt-8 flex items-center gap-2 text-sm text-gray-600"
        >
          <LoaderCircle
            size={18}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
          {!hydrated
            ? 'Loading your selection...'
            : authStatus === 'unauthenticated'
              ? 'Returning to Sign In...'
              : addressesReady
                ? 'Opening your profile to add an address...'
                : 'Loading your saved addresses...'}
        </p>
      ) : !items.length ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <ShoppingBag
            size={32}
            className="mx-auto text-blue-600"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-xl font-semibold">No product selected</h2>
          <p className="mt-3 text-sm text-gray-500">
            {mode === 'cart' && cartItems.length
              ? 'Select the products you want to include from your cart.'
              : 'Choose a Ready Stock product to continue.'}
          </p>
          <Link
            href={mode === 'cart' && cartItems.length ? '/cart' : '/ready-stock'}
            className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-yellow-300 px-5 text-sm font-semibold"
          >
            {mode === 'cart' && cartItems.length ? 'Select Cart Products' : 'Browse Ready Stock'}
          </Link>
        </div>
      ) : (cartOwner && syncStatus !== 'saved') ||
        cartStatus !== 'succeeded' ||
        invalidCartItems(items, products).length ? (
        <div>
          <CartAvailability items={items} />
          <CartItems
            items={items}
            onChange={(item) => dispatch(mode === 'buyNow' ? setBuyNow(item) : setQuantity(item))}
            onRemove={(id) => dispatch(mode === 'buyNow' ? clearBuyNow() : removeItem(id))}
          />
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
              <p className="font-semibold text-gray-900">
                Product subtotal: {formatBDT(productSubtotal(items, products))}
              </p>
              <p className="mt-2 text-xs">
                Delivery charges are excluded and will be confirmed separately.
              </p>
              <p className="mt-2">
                Submitting an order does not reserve stock. Our team will call you, and stock is
                allocated only after admin confirmation. No online payment is collected.
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
              Delivery address
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Choose a saved address for this order. Your default is selected automatically.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!selectedAddress) return;
                placeOrder();
              }}
            >
              <fieldset className="space-y-3">
                <legend className="sr-only">Choose your delivery address</legend>
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${selectedAddress?.id === address.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <input
                      type="radio"
                      name="delivery-address"
                      value={address.id}
                      checked={selectedAddress?.id === address.id}
                      onChange={() => {
                        setSelectedId(address.id);
                      }}
                      className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                    />
                    <span className="min-w-0 text-sm">
                      <span className="block font-semibold">
                        {address.label}
                        {address.id === defaultId && (
                          <span className="ml-2 text-xs font-normal text-blue-700">Default</span>
                        )}
                      </span>
                      <span className="mt-2 block break-words">{address.recipient}</span>
                      <span className="mt-1 block break-words leading-6 text-gray-600">
                        {formatDeliveryAddress(address)}
                      </span>
                      <span className="mt-1 block text-gray-600">{address.phone}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <Link
                href={addressPage}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 hover:underline"
              >
                Add or Edit Addresses
              </Link>
              {phone.error && (
                <p
                  role="alert"
                  className="text-sm leading-6 text-red-700"
                >
                  {phone.error} Edit the selected address to correct its phone number before
                  ordering.
                </p>
              )}
              {!storageAvailable && (
                <p
                  role="alert"
                  className="text-sm leading-6 text-gray-600"
                >
                  These addresses may not survive a reload because browser storage is unavailable.
                </p>
              )}

              <label
                className="block text-sm font-medium"
                htmlFor="order-notes"
              >
                Notes for our team <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea
                id="order-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                maxLength={2000}
                className={inputClass}
                placeholder="Delivery instructions or anything we should know"
              />
              <p className="text-xs leading-6 text-gray-500">
                Please check your phone number. Our team will use it to contact you about this
                order. Delivery charges will be confirmed separately.
              </p>
              <button
                type="submit"
                disabled={Boolean(phone.error)}
                className="min-h-12 w-full rounded-lg bg-yellow-300 px-5 text-sm font-semibold hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Place Order
              </button>
            </form>
          </section>
        </div>
      )}
    </ShopShell>
  );
}
