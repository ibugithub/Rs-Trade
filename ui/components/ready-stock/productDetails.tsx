'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import { addItem, setBuyNow } from '@/configs/redux/cart/cartSlice';
import type { ReadyStockProduct } from '@/content/readyStock';
import { ProductImage } from './productImage';
import { QuantityInput } from './quantityInput';
import { ShopShell } from './shopShell';

export function ProductDetails({ product }: { product: ReadyStockProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const hydrated = useAppSelector((state) => state.cart.hydrated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <ShopShell
      title={product.name}
      description="Selected Ready Stock from RS Trade International."
    >
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <ProductImage
            src={product.image}
            name={product.name}
          />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Catalog preview
          </span>
          <p className="mt-5 text-base leading-8 text-gray-600">{product.description}</p>
          <p className="mt-6 text-xs text-gray-500">Price</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">Request Price</p>
          <dl className="mt-6 space-y-4 border-y border-gray-200 py-5 text-sm">
            {[
              ['Minimum order quantity', 'To be confirmed'],
              ['Available quantity', 'To be confirmed'],
              ['Delivery', 'Charges and timing confirmed with our team.'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-semibold">{label}</dt>
                <dd className="mt-1 leading-6 text-gray-500">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mb-3 mt-6 text-sm font-semibold">Requested quantity</p>
          <QuantityInput
            value={quantity}
            onChange={(value) => {
              setQuantity(value);
              setAdded(false);
            }}
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!hydrated}
              onClick={() => {
                dispatch(addItem({ productId: product.id, quantity }));
                setAdded(true);
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
            >
              <ShoppingBag
                size={18}
                aria-hidden="true"
              />
              Add to Cart
            </button>
            <button
              type="button"
              disabled={!hydrated}
              onClick={() => {
                dispatch(setBuyNow({ productId: product.id, quantity }));
                router.push('/buy_now');
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-yellow-300 px-4 text-sm font-semibold hover:bg-yellow-500 disabled:opacity-50"
            >
              Buy Now
              <ArrowRight
                size={18}
                aria-hidden="true"
              />
            </button>
          </div>
          <div aria-live="polite">
            {added && (
              <p className="mt-4 flex items-center gap-2 text-sm text-green-800">
                <Check
                  size={16}
                  aria-hidden="true"
                />
                Added to your cart.{' '}
                <Link
                  href="/cart"
                  className="font-semibold text-blue-700 underline"
                >
                  View Cart
                </Link>
              </p>
            )}
          </div>
          <p className="mt-5 text-xs leading-6 text-gray-500">
            This sample product is for preview. Your selection is saved for review; price, stock and
            the final order must be confirmed with our team. No online payment.
          </p>
        </div>
      </div>
    </ShopShell>
  );
}
