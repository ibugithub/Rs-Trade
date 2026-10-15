'use client';

import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import { fetchCartProducts } from '@/configs/redux/catalog/catalogSlice';
import { CatalogStatus } from '@/components/ready-stock/catalogStatus';
import { invalidCartItems } from '@/content/pricing';
import type { CartItem } from '@/configs/redux/cart/cartSlice';

export function CartAvailability({ items }: { items: CartItem[] }) {
  const { products, cartStatus } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  if (cartStatus === 'failed') {
    return (
      <CatalogStatus
        message="We could not check current prices and availability."
        onRetry={() => dispatch(fetchCartProducts(items.map((item) => item.productId)))}
      />
    );
  }
  if (cartStatus !== 'succeeded')
    return (
      <CatalogStatus
        loading
        message="Checking current prices and availability..."
      />
    );
  if (invalidCartItems(items, products).length) {
    return (
      <CatalogStatus message="Some products are unavailable or exceed current stock. Adjust their quantities or remove them before continuing." />
    );
  }
  return null;
}
