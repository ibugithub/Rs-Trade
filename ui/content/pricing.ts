import { readyStockProducts } from './readyStock';
import type { CartItem } from '@/configs/redux/cart/cartSlice';

// Demo amounts are for design preview only, never final selling prices.
export function formatBDT(amount: number) {
  return `BDT ${new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function demoSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => {
    const product = readyStockProducts.find((value) => value.id === item.productId);
    return total + (product?.demoPrice ?? 0) * item.quantity;
  }, 0);
}
