import type { ProductCatalog } from './readyStock';
import type { CartItem } from '@/configs/redux/cart/cartSlice';

export function formatBDT(amount: number) {
  return `BDT ${new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function productSubtotal(items: CartItem[], products: ProductCatalog) {
  const cents = items.reduce((total, item) => {
    const product = products[item.productId];
    return total + Math.round((product?.price ?? 0) * 100) * item.quantity;
  }, 0);
  return cents / 100;
}

export function invalidCartItems(items: CartItem[], products: ProductCatalog) {
  return items.filter((item) => {
    const product = products[item.productId];
    return !product || item.quantity > product.stockQuantity;
  });
}
