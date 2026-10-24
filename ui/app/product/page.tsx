import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductFromCatalog } from '@/components/ready-stock/productFromCatalog';
import { ShopShell } from '@/components/ready-stock/shopShell';
import { CatalogStatus } from '@/components/ready-stock/catalogStatus';

export const metadata: Metadata = {
  title: 'Product Details | RS Trade International',
  description: 'View product details, prices and availability from RS Trade International.',
};

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <ShopShell
          title="Product Details"
          description="Ready Stock products"
        >
          <CatalogStatus
            loading
            message="Loading product..."
          />
        </ShopShell>
      }
    >
      <ProductFromCatalog />
    </Suspense>
  );
}
