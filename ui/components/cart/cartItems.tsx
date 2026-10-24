'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { productImage, productPath } from '@/content/readyStock';
import { useAppSelector } from '@/configs/redux/hooks';
import { formatBDT } from '@/content/pricing';
import type { CartItem } from '@/configs/redux/cart/cartSlice';
import { QuantityInput } from '@/components/ready-stock/quantityInput';

export function CartItems({
  items,
  onChange,
  onRemove,
  selectedIds,
  onToggle,
}: {
  items: CartItem[];
  onChange: (item: CartItem) => void;
  onRemove?: (id: string) => void;
  selectedIds?: string[];
  onToggle?: (id: string, selected: boolean) => void;
}) {
  const { products, cartStatus } = useAppSelector((state) => state.catalog);
  const selectionControl = (item: CartItem, name: string) =>
    onToggle && (
      <label className="inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center self-start">
        <input
          type="checkbox"
          checked={selectedIds?.includes(item.productId) ?? false}
          onChange={(event) => onToggle(item.productId, event.target.checked)}
          aria-label={`Select ${name} for checkout`}
          className="h-5 w-5 rounded border-gray-300 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        />
      </label>
    );
  return (
    <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
      {items.map((item) => {
        const product = products[item.productId];
        if (!product)
          return (
            <li
              key={item.productId}
              className="p-5 text-sm text-gray-600"
            >
              {selectionControl(item, `product #${item.productId}`)}
              <p>
                {cartStatus === 'succeeded'
                  ? `Product #${item.productId} is unavailable.`
                  : `Checking product #${item.productId}...`}
              </p>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.productId)}
                  className="mt-3 min-h-11 text-red-700"
                >
                  Remove product
                </button>
              )}
            </li>
          );
        return (
          <li
            key={item.productId}
            className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6"
          >
            {selectionControl(item, product.name)}
            <Link
              href={productPath(product.id)}
              className="relative h-24 w-24 shrink-0 rounded-lg bg-gray-50"
            >
              <Image
                src={productImage(product)}
                alt={product.name}
                fill
                sizes="96px"
                className="object-contain p-2"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={productPath(product.id)}
                className="text-base font-semibold hover:text-blue-700"
              >
                {product.name}
              </Link>
              <p className="mt-2 text-sm font-medium text-blue-700">
                {formatBDT(product.price)}{' '}
                <span className="text-xs font-normal text-gray-500">/ unit</span>
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Line total: {formatBDT(product.price * item.quantity)}
              </p>
              <p
                className={`mt-1 text-xs ${item.quantity > product.stockQuantity ? 'text-red-700' : 'text-gray-500'}`}
              >
                {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <QuantityInput
                  value={item.quantity}
                  maximum={product.stockQuantity}
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
