'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { ReadyStockProduct } from '@/content/readyStock';
import { CatalogError, getProduct } from '@/lib/catalogApi';
import { useAppDispatch } from '@/configs/redux/hooks';
import { rememberProducts } from '@/configs/redux/catalog/catalogSlice';
import { ProductDetails } from './productDetails';
import { ShopShell } from './shopShell';
import { CatalogStatus } from './catalogStatus';

export function ProductFromCatalog() {
  const id = useSearchParams().get('id') ?? '';
  const dispatch = useAppDispatch();
  const [result, setResult] = useState<{
    id: string;
    product?: ReadyStockProduct;
    error?: string;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!/^[1-9]\d{0,18}$/.test(id)) return;
    const controller = new AbortController();
    setResult(null);
    getProduct(id, controller.signal)
      .then((product) => {
        if (controller.signal.aborted) return;
        dispatch(rememberProducts([product]));
        setResult({ id, product });
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({
            id,
            error:
              error instanceof CatalogError && error.status === 404
                ? 'This product is no longer available.'
                : 'Could not load this product. Please try again.',
          });
        }
      });
    return () => controller.abort();
  }, [id, dispatch, attempt]);

  if (result?.id === id && result.product)
    return (
      <ProductDetails
        key={id}
        product={result.product}
      />
    );
  const invalid = !/^[1-9]\d{0,18}$/.test(id);
  const error = invalid
    ? 'Please choose a product from Ready Stock.'
    : result?.id === id
      ? result.error
      : null;
  return (
    <ShopShell
      title="Product Details"
      description="Ready Stock from RS Trade International."
    >
      <CatalogStatus
        loading={!error}
        message={error || 'Loading product...'}
        onRetry={invalid ? undefined : () => setAttempt((value) => value + 1)}
      />
      {error && (
        <Link
          href="/ready-stock"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700"
        >
          Browse Ready Stock
        </Link>
      )}
    </ShopShell>
  );
}
