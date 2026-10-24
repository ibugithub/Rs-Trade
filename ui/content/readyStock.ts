// Public product information returned by the Django catalog API.
export type ReadyStockProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  image: string | null;
  description: string;
  shortDescription: string;
  price: number;
  stockQuantity: number;
  isFeatured: boolean;
};

export type ProductCatalog = Record<string, ReadyStockProduct>;
export const productPath = (id: string) => `/product/?id=${encodeURIComponent(id)}`;
export const productImage = (product: ReadyStockProduct) =>
  product.image || '/images/product-placeholder.svg';
