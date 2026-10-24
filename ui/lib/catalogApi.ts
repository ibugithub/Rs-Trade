import type { ReadyStockProduct } from '@/content/readyStock';

export type ProductPage = {
  results: ReadyStockProduct[];
  count: number;
  page: number;
  pageSize: number;
  nextPage: number | null;
};

export class CatalogError extends Error {
  constructor(public status: number) {
    super(status === 404 ? 'Product not found.' : 'Could not load products. Please try again.');
  }
}

async function getCatalog<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort);
  const timeout = setTimeout(abort, 30000);
  const base = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '').replace(/\/$/, '');
  try {
    const response = await fetch(`${base}/api/catalog/products/${path}`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) throw new CatalogError(response.status);
    return await response.json();
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export function getProductPage(
  query: string,
  ordering: string,
  page: number,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({ q: query, ordering, page: String(page) });
  return getCatalog<ProductPage>(`?${params}`, signal);
}

export function getProduct(id: string, signal?: AbortSignal) {
  return getCatalog<ReadyStockProduct>(`${encodeURIComponent(id)}/`, signal);
}

export async function getSelectedProducts(ids: string[], signal?: AbortSignal) {
  const results: ReadyStockProduct[] = [];
  for (let offset = 0; offset < ids.length; offset += 100) {
    const params = new URLSearchParams({ ids: ids.slice(offset, offset + 100).join(',') });
    const data = await getCatalog<{ results: ReadyStockProduct[] }>(`?${params}`, signal);
    results.push(...data.results);
  }
  return results;
}
