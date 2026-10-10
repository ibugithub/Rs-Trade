'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useAppSelector } from '@/configs/redux/hooks';

export function CartLink({ onNavigate }: { onNavigate?: () => void }) {
  const { items, hydrated } = useAppSelector((state) => state.cart);
  const count = hydrated ? items.reduce((total, item) => total + item.quantity, 0) : 0;
  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label={`Cart, ${count} items`}
      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-blue-600"
    >
      <ShoppingBag
        size={20}
        aria-hidden="true"
      />
      {count > 0 && (
        <span className="absolute right-0 top-0 rounded-full bg-blue-600 px-1.5 text-[10px] font-bold leading-5 text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
