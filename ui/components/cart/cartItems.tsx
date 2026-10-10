'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { readyStockProducts } from '@/content/readyStock';
import type { CartItem } from '@/configs/redux/cart/cartSlice';
import { QuantityInput } from '@/components/ready-stock/quantityInput';

export function CartItems({
  items,
  onChange,
  onRemove,
}: {
  items: CartItem[];
  onChange: (item: CartItem) => void;
  onRemove?: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
      {items.map((item) => {
        const product = readyStockProducts.find((value) => value.id === item.productId);
        if (!product) return null;
        return (
          <li
            key={item.productId}
            className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6"
          >
            <Link
              href={`/product/${product.id}`}
              className="relative h-24 w-24 shrink-0 rounded-lg bg-gray-50"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${product.id}`}
                className="text-base font-semibold hover:text-blue-700"
              >
                {product.name}
              </Link>
              <p className="mt-2 text-sm font-medium text-blue-700">Request Price</p>
              <p className="mt-1 text-xs text-gray-500">Stock and MOQ to be confirmed.</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <QuantityInput
                  value={item.quantity}
                  label={`Quantity for ${product.name}`}
                  onChange={(quantity) => onChange({ productId: product.id, quantity })}
                />
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-gray-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2
                      size={16}
                      aria-hidden="true"
                    />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
