'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MessageCircle, Search, X } from 'lucide-react';
import { readyStockProducts, type ReadyStockProduct } from '@/content/readyStock';

export function ReadyStockGrid() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState<ReadyStockProduct | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const products = readyStockProducts.filter(product => `${product.name} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (selected && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [selected]);

  return (
    <>
      <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-gray-700"><strong className="text-blue-700">Catalog preview.</strong> These sample items show the new layout. Actual products, prices, minimum quantities and stock will be confirmed before ordering becomes available.</div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><h2 className="text-2xl font-bold">Explore the selection</h2><p aria-live="polite" className="mt-2 text-sm text-gray-500">{products.length} {products.length === 1 ? 'product' : 'products'} shown</p></div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div><label htmlFor="stock-search" className="sr-only">Search products</label><div className="relative"><Search size={18} className="pointer-events-none absolute left-3 top-3.5 text-gray-500" aria-hidden="true" /><input id="stock-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products" className="min-h-11 w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-60" /></div></div>
          <div><label htmlFor="stock-sort" className="sr-only">Sort products</label><select id="stock-sort" value={sort} onChange={event => setSort(event.target.value)} className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-blue-600"><option value="featured">Featured order</option><option value="name">Name: A–Z</option></select></div>
        </div>
      </div>
      {products.length ? <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map(product => <article key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
        <button type="button" onClick={() => setSelected(product)} aria-label={`View ${product.name}`} className="relative block aspect-[4/3] w-full bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600"><Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-contain p-7 transition-transform duration-300 group-hover:scale-105" /></button>
        <div className="flex flex-1 flex-col p-5 sm:p-6"><h3 className="text-lg font-bold"><button type="button" onClick={() => setSelected(product)} className="text-left hover:text-blue-700 focus-visible:outline-blue-600">{product.name}</button></h3><p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{product.description}</p><div className="mt-5 flex items-end justify-between gap-3 border-t border-gray-100 pt-4"><div><p className="text-xs text-gray-500">Price</p><p className="mt-1 font-semibold text-blue-700">Request Price</p></div><p className="text-xs text-gray-500">MOQ: to be confirmed</p></div><button type="button" onClick={() => setSelected(product)} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 text-sm font-semibold text-blue-700 hover:border-blue-300 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">View Product<ArrowUpRight size={16} aria-hidden="true" /></button></div>
      </article>)}</div> : <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center"><h3 className="text-lg font-bold">No products match your search.</h3><p className="mt-2 text-sm text-gray-600">Try a different product name.</p><button type="button" onClick={() => setQuery('')} className="mt-4 text-sm font-semibold text-blue-700 hover:underline">Clear search</button></div>}

      <dialog ref={dialogRef} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }} aria-labelledby="stock-product-title" className="max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-0 text-gray-900 shadow-xl backdrop:bg-gray-950/60">
        {selected && <div className="relative p-6 sm:p-8"><button type="button" autoFocus onClick={() => dialogRef.current?.close()} aria-label="Close product details" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 focus-visible:outline-blue-600"><X size={20} aria-hidden="true" /></button><div className="grid gap-7 md:grid-cols-2"><div className="relative aspect-square rounded-xl bg-gray-50"><Image src={selected.image} alt={selected.name} fill sizes="(min-width: 768px) 350px, 90vw" className="object-contain p-6" /></div><div className="pt-6"><p className="text-xs font-semibold uppercase tracking-widest text-blue-700">Product preview</p><h2 id="stock-product-title" className="mt-3 text-2xl font-bold">{selected.name}</h2><p className="mt-4 text-sm leading-7 text-gray-600">{selected.description}</p><dl className="mt-5 space-y-3 text-sm">{[['Price', 'Request Price'], ['Minimum order quantity', 'To be confirmed'], ['Available quantity', 'To be confirmed'], ['Delivery', 'Charges and timing confirmed before ordering.']].map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="mt-1 text-gray-600">{value}</dd></div>)}</dl></div></div><div className="mt-6 border-t border-gray-200 pt-5"><p id="stock-order-notice" className="text-sm leading-6 text-gray-500">This item is a design preview. Ordering will be available once the product and contact details are confirmed.</p><button type="button" disabled aria-describedby="stock-order-notice" className="mt-4 inline-flex min-h-12 cursor-not-allowed items-center gap-2 rounded-lg bg-yellow-300 px-5 py-3 text-sm font-semibold opacity-60"><MessageCircle size={18} aria-hidden="true" />Inquire About This Product</button></div></div>}
      </dialog>
    </>
  );
}
