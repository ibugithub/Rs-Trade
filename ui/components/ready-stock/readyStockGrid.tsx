'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { productImage, productPath } from '@/content/readyStock';
import { getProductPage, type ProductPage } from '@/lib/catalogApi';
import { CatalogStatus } from './catalogStatus';
import { formatBDT } from '@/content/pricing';

export function ReadyStockGrid() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (query === searchQuery) return;
    const timer = setTimeout(() => {
      setSearchQuery(query);
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, searchQuery]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setFailed(false);
    getProductPage(searchQuery, sort, page, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [searchQuery, sort, page, attempt]);
  const products = data?.results ?? [];
  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold">Explore the selection</h2>
          <p
            aria-live="polite"
            className="mt-2 text-sm text-gray-500"
          >
            {loading ? 'Loading products...' : `${data?.count ?? 0} products found`}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div>
            <label
              htmlFor="stock-search"
              className="sr-only"
            >
              Search products
            </label>
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-3.5 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="stock-search"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                placeholder="Search products"
                className="min-h-11 w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-60"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="stock-sort"
              className="sr-only"
            >
              Sort products
            </label>
            <select
              id="stock-sort"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-blue-600"
            >
              <option value="featured">Featured order</option>
              <option value="name">Name: A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <CatalogStatus
          loading
          message="Loading products..."
        />
      ) : failed ? (
        <CatalogStatus
          message="We could not load the products."
          onRetry={() => setAttempt((value) => value + 1)}
        />
      ) : products.length ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <Link
                href={productPath(product.id)}
                aria-label={`View ${product.name}`}
                className="relative block aspect-[4/3] w-full bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600"
              >
                <Image
                  src={productImage(product)}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-7 transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-lg font-bold">
                  <Link
                    href={productPath(product.id)}
                    className="text-left hover:text-blue-700 focus-visible:outline-blue-600"
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">
                  {product.shortDescription || product.description}
                </p>
                <div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Price per unit</p>
                    <p className="mt-1 font-semibold text-blue-700">{formatBDT(product.price)}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {product.stockQuantity > 0
                      ? `${product.stockQuantity} available`
                      : 'Out of stock'}
                  </p>
                </div>
                <Link
                  href={productPath(product.id)}
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 text-sm font-semibold text-blue-700 hover:border-blue-300 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  View Product
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
          <h3 className="text-lg font-bold">
            {query ? 'No products match your search.' : 'No products are available yet.'}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {query ? 'Try a different product name.' : 'Please check back soon.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setPage(1);
            }}
            className="mt-4 text-sm font-semibold text-blue-700 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
      {!loading && !failed && data && data.count > data.pageSize && (
        <nav
          aria-label="Product pages"
          className="mt-8 flex items-center justify-center gap-5"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(data.count / data.pageSize)}
          </span>
          <button
            type="button"
            disabled={!data.nextPage}
            onClick={() => setPage((value) => value + 1)}
            className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}
