import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readyStockProducts } from '@/content/readyStock';
import { ProductDetails } from '@/components/ready-stock/productDetails';

export const dynamicParams = false;
export function generateStaticParams() {
  return readyStockProducts.map((product) => ({ id: product.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = readyStockProducts.find((item) => item.id === id);
  return {
    title: product ? `${product.name} | RS Trade International` : 'Product not found',
    description: product?.description,
  };
}
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = readyStockProducts.find((item) => item.id === id);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
