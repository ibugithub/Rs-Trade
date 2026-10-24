'use client';

import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import { retryCartSync } from '@/configs/redux/cart/cartSlice';

export function CartSyncStatus() {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const busy = cart.syncStatus === 'loading' || cart.syncStatus === 'saving';
  return (
    <div
      className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600"
      role="status"
      aria-live="polite"
    >
      <p className="flex items-center gap-2">
        {busy && (
          <LoaderCircle
            size={16}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
        )}
        {cart.syncStatus === 'error' ? (
          cart.notice
        ) : cart.owner ? (
          busy ? (
            cart.syncStatus === 'loading' ? (
              'Loading your account cart...'
            ) : (
              'Saving your cart...'
            )
          ) : (
            'Cart saved to your account.'
          )
        ) : busy ? (
          'Loading your cart...'
        ) : (
          <>
            <Link
              href="/accounts/signin"
              className="font-semibold text-blue-700"
            >
              Sign in
            </Link>{' '}
            to save your cart across devices.
          </>
        )}
      </p>
      {cart.syncStatus === 'error' && (
        <button
          type="button"
          onClick={() => dispatch(retryCartSync())}
          className="mt-3 min-h-11 rounded-lg bg-yellow-300 px-4 font-semibold text-gray-900"
        >
          Retry Cart Sync
        </button>
      )}
      {cart.notice && cart.syncStatus !== 'error' && (
        <p className="mt-2 text-amber-800">{cart.notice}</p>
      )}
      {!cart.storageAvailable && (
        <p className="mt-2 text-amber-800">
          Browser storage is unavailable. Keep this page open until your account cart finishes
          saving.
        </p>
      )}
    </div>
  );
}
