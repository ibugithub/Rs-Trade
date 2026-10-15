'use client';

import Link from 'next/link';
import { LoaderCircle, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import { clearCart, removeItem, setQuantity } from '@/configs/redux/cart/cartSlice';
import { CartItems } from './cartItems';
import { CartAvailability } from './cartAvailability';
import { ShopShell } from '@/components/ready-stock/shopShell';
import { productSubtotal, formatBDT, invalidCartItems } from '@/content/pricing';

export const Cart = () => {
  const { items, hydrated, owner, syncStatus } = useAppSelector((state) => state.cart);
  const { products, cartStatus } = useAppSelector((state) => state.catalog);
  const ready =
    (!owner || syncStatus === 'saved') &&
    cartStatus === 'succeeded' &&
    invalidCartItems(items, products).length === 0;
  const dispatch = useAppDispatch();
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  return (
    <ShopShell
      title="Your Cart"
      description="Keep your selected products together, adjust quantities and prepare an order request."
    >
      {!hydrated && syncStatus === 'error' ? null : !hydrated ? (
        <p
          role="status"
          className="mt-8 flex items-center gap-2 text-sm text-gray-500"
        >
          <LoaderCircle
            size={18}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
          Loading your cart...
        </p>
      ) : !items.length ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <ShoppingBag
            size={36}
            className="mx-auto text-blue-600"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-3 text-sm text-gray-500">
            Choose a product from Ready Stock to get started.
          </p>
          <Link
            href="/ready-stock"
            className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-yellow-300 px-5 text-sm font-semibold"
          >
            Browse Ready Stock
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-7 lg:grid-cols-[1fr_340px]">
          <div>
            <p
              aria-live="polite"
              className="mb-4 text-sm text-gray-600"
            >
              {items.length} products · {quantity} requested units
            </p>
            <CartAvailability items={items} />
            <CartItems
              items={items}
              onChange={(item) => dispatch(setQuantity(item))}
              onRemove={(id) => dispatch(removeItem(id))}
            />
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="mt-4 min-h-11 rounded-lg px-3 text-sm text-gray-500 hover:text-red-700"
            >
              Clear Cart
            </button>
          </div>
          <aside className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Request summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt>Requested units</dt>
                <dd>{quantity}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Product subtotal</dt>
                <dd className="font-semibold text-blue-700">
                  {cartStatus === 'succeeded'
                    ? formatBDT(productSubtotal(items, products))
                    : 'Checking...'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd>To be confirmed</dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-gray-200 pt-5 text-xs leading-6 text-gray-500">
              Delivery is excluded. Confirm availability, MOQ and your final order with our team. No
              payment is collected here.
            </p>
            {ready ? (
              <Link
                href="/checkout"
                className="mt-5 flex min-h-12 items-center justify-center rounded-lg bg-yellow-300 px-4 text-sm font-semibold hover:bg-yellow-500"
              >
                Review Order Request
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-lg bg-gray-100 px-4 text-sm font-semibold text-gray-400"
              >
                Review Order Request
              </button>
            )}
            <Link
              href="/ready-stock"
              className="mt-3 flex min-h-11 items-center justify-center text-sm font-medium text-blue-700 hover:underline"
            >
              Continue Browsing
            </Link>
          </aside>
        </div>
      )}
    </ShopShell>
  );
};
