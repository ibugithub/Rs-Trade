'use client';

import { useEffect, useRef } from 'react';
import { useStore } from 'react-redux';
import { usePathname } from 'next/navigation';
import { nanoid } from '@reduxjs/toolkit';
import type { RootState } from '@/configs/redux/store';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import {
  CART_STORAGE_KEY,
  accountCartKey,
  beginCartSession,
  loadCartSession,
  acknowledgeCartOperation,
  cartSyncError,
  cartStorageStatus,
  sanitizeCartItems,
  sanitizeOperations,
  sanitizeUnselectedIds,
} from '@/configs/redux/cart/cartSlice';
import { getAccountCart, sendCartOperation } from '@/lib/accountCartApi';
import { catalogReviewPath } from '@/lib/orderNavigation';
import { retryCartSync } from '@/configs/redux/cart/cartSlice';

function readStorage(key: string): Record<string, unknown> {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function CartPersistence() {
  const store = useStore<RootState>();
  const dispatch = useAppDispatch();
  const reviewPage = catalogReviewPath(usePathname());
  const auth = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);
  const email = auth.loogedInUser?.user?.email || auth.loogedInUser?.email;
  const owner = auth.isAuthenticated && email ? email.trim().toLowerCase() : null;
  const scope =
    !auth.isAuthenticated && ['idle', 'loading'].includes(auth.status)
      ? 'pending'
      : (owner ?? 'guest');
  const guestId = useRef(nanoid());
  const flushRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (!owner) return;
    const refresh = () => {
      const current = store.getState().cart;
      if (current.owner === owner && current.hydrated && !current.pending.length) {
        dispatch(retryCartSync());
      }
    };
    if (reviewPage) refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, [dispatch, owner, reviewPage, store]);

  useEffect(() => {
    if (scope === 'pending') return;
    const before = store.getState().cart;
    const guest = readStorage(CART_STORAGE_KEY);
    const storedGuestId =
      typeof guest.mergeId === 'string' && /^[A-Za-z0-9_-]{21,64}$/.test(guest.mergeId)
        ? guest.mergeId
        : nanoid();
    guestId.current = storedGuestId;
    dispatch(beginCartSession(owner));
    const session = store.getState().cart.session;
    const controller = new AbortController();
    const matches = () => {
      const current = store.getState().cart;
      return !controller.signal.aborted && current.owner === owner && current.session === session;
    };

    if (!owner) {
      const available = writeStorage(CART_STORAGE_KEY, { ...guest, mergeId: storedGuestId });
      dispatch(
        loadCartSession({
          owner: null,
          session,
          items: guest.items,
          buyNow: guest.buyNow,
          unselectedIds: guest.unselectedIds,
          storageAvailable: available,
        }),
      );
      return () => controller.abort();
    }

    const cached = readStorage(accountCartKey(owner));
    const pending = sanitizeOperations(
      before.owner === owner && before.hydrated ? before.pending : cached.pending,
    );
    const guestItems = sanitizeCartItems(
      before.owner === null && before.hydrated ? before.items : guest.items,
    );
    const guestBuyNow = before.owner === null && before.hydrated ? before.buyNow : guest.buyNow;
    const unselectedIds = sanitizeUnselectedIds([
      ...sanitizeUnselectedIds(
        before.owner === owner && before.hydrated ? before.unselectedIds : cached.unselectedIds,
      ),
      ...sanitizeUnselectedIds(
        before.owner === null && before.hydrated ? before.unselectedIds : guest.unselectedIds,
      ).filter((id) => guestItems.some((item) => item.productId === id)),
    ]);
    const buyNow =
      guestBuyNow ?? (before.owner === owner && before.hydrated ? before.buyNow : cached.buyNow);
    if (guestItems.length && !pending.some((operation) => operation.id === storedGuestId)) {
      pending.push({ id: storedGuestId, kind: 'merge', items: guestItems });
    }
    // Persist the transfer before removing guest data. Pending operations survive reloads.
    const available = writeStorage(accountCartKey(owner), { pending, buyNow, unselectedIds });
    if (available) writeStorage(CART_STORAGE_KEY, { items: [], buyNow: null, mergeId: nanoid() });

    let running = false;
    const flush = async () => {
      if (running || !matches()) return;
      running = true;
      try {
        while (matches()) {
          const current = store.getState().cart;
          const operation = current.pending[0];
          if (!current.hydrated || current.syncStatus === 'error' || !operation) break;
          writeStorage(accountCartKey(owner), {
            pending: current.pending,
            buyNow: current.buyNow,
            unselectedIds: current.unselectedIds,
          });
          try {
            const response = await sendCartOperation(operation, controller.signal);
            if (!matches()) break;
            dispatch(acknowledgeCartOperation({ owner, session, id: operation.id, ...response }));
          } catch {
            if (matches())
              dispatch(
                cartSyncError({
                  owner,
                  session,
                  message:
                    'Your latest cart changes are not synced. Check your connection and retry.',
                }),
              );
            break;
          }
        }
      } finally {
        running = false;
      }
    };
    flushRef.current = flush;
    getAccountCart(controller.signal)
      .then((response) => {
        if (!matches()) return;
        dispatch(
          loadCartSession({
            owner,
            session,
            items: response.items,
            buyNow,
            pending,
            unselectedIds,
            storageAvailable: available,
          }),
        );
      })
      .catch(() => {
        if (matches())
          dispatch(
            cartSyncError({
              owner,
              session,
              message:
                'We could not load your account cart. Please retry. Account cart setup may still be pending.',
            }),
          );
      });
    return () => {
      controller.abort();
      if (flushRef.current === flush) flushRef.current = null;
    };
  }, [dispatch, store, scope, owner, cart.reloadToken]);

  useEffect(() => {
    if (!cart.hydrated || scope === 'pending' || cart.owner !== owner) return;
    const available = owner
      ? writeStorage(accountCartKey(owner), {
          pending: cart.pending,
          buyNow: cart.buyNow,
          unselectedIds: cart.unselectedIds,
        })
      : writeStorage(CART_STORAGE_KEY, {
          items: cart.items,
          buyNow: cart.buyNow,
          unselectedIds: cart.unselectedIds,
          mergeId: guestId.current,
        });
    dispatch(cartStorageStatus(available));
  }, [
    dispatch,
    scope,
    owner,
    cart.owner,
    cart.hydrated,
    cart.items,
    cart.pending,
    cart.buyNow,
    cart.unselectedIds,
  ]);

  useEffect(() => {
    if (
      !owner ||
      !cart.hydrated ||
      cart.owner !== owner ||
      !cart.pending.length ||
      cart.syncStatus === 'error'
    )
      return;
    const timer = setTimeout(() => {
      void flushRef.current?.();
    }, 300);
    return () => clearTimeout(timer);
  }, [owner, cart.owner, cart.hydrated, cart.pending.length, cart.syncStatus, cart.session]);
  return null;
}
