'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import { fetchCartProducts } from '@/configs/redux/catalog/catalogSlice';
import { catalogReviewPath } from '@/lib/orderNavigation';

export function CartCatalogLoader() {
  const { items, buyNow, hydrated } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const reviewPage = catalogReviewPath(pathname);
  const key = [
    ...new Set([...items.map((item) => item.productId), ...(buyNow ? [buyNow.productId] : [])]),
  ]
    .sort()
    .join(',');

  useEffect(() => {
    if (!hydrated || !key || !reviewPage) return;
    const request = dispatch(fetchCartProducts(key.split(',')));
    return () => request.abort();
  }, [dispatch, hydrated, key, reviewPage]);
  return null;
}
