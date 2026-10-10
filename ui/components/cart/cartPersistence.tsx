'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import { CART_STORAGE_KEY, hydrateCart } from '@/configs/redux/cart/cartSlice';

export function CartPersistence() {
  const dispatch = useAppDispatch();
  const { items, buyNow, hydrated } = useAppSelector((state) => state.cart);
  useEffect(() => {
    let saved = {};
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '{}');
      if (parsed && typeof parsed === 'object') saved = parsed;
    } catch {
      /* Start empty when browser storage is unavailable or corrupt. */
    }
    dispatch(hydrateCart(saved));
  }, [dispatch]);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, buyNow }));
    } catch {
      /* The cart still works in memory when storage is unavailable. */
    }
  }, [items, buyNow, hydrated]);
  return null;
}
