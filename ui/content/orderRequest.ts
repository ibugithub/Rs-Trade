import type { ProductCatalog } from './readyStock';
import type { CartItem } from '@/configs/redux/cart/cartSlice';
import { productSubtotal, formatBDT } from './pricing';

export type OrderContact = { name: string; phone: string; address: string; notes: string };
export function formatOrderRequest(
  items: CartItem[],
  contact: OrderContact,
  products: ProductCatalog,
) {
  const lines = items.map((item) => {
    const product = products[item.productId];
    return product
      ? `- ${product.name}: ${item.quantity} requested (${formatBDT(product.price)} per unit)`
      : `- Product #${item.productId}: unavailable`;
  });
  return [
    'RS Trade International - Ready Stock inquiry',
    '',
    ...lines,
    `Product subtotal: ${formatBDT(productSubtotal(items, products))} (delivery excluded)`,
    '',
    `Name: ${contact.name.trim()}`,
    `Phone / WhatsApp: ${contact.phone.trim()}`,
    `Delivery address: ${contact.address.trim()}`,
    ...(contact.notes.trim() ? [`Notes: ${contact.notes.trim()}`] : []),
    '',
    'Please confirm availability, MOQ, final price and delivery charges.',
  ].join('\n');
}
