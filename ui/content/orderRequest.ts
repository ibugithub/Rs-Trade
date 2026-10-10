import { readyStockProducts } from './readyStock';
import type { CartItem } from '@/configs/redux/cart/cartSlice';

export type OrderContact = { name: string; phone: string; address: string; notes: string };
export function formatOrderRequest(items: CartItem[], contact: OrderContact) {
  const lines = items
    .map((item) => {
      const product = readyStockProducts.find((value) => value.id === item.productId);
      return product ? `- ${product.name}: ${item.quantity} requested` : null;
    })
    .filter(Boolean);
  return [
    'RS Trade International - Ready Stock inquiry',
    '',
    ...lines,
    '',
    `Name: ${contact.name.trim()}`,
    `Phone / WhatsApp: ${contact.phone.trim()}`,
    `Delivery address: ${contact.address.trim()}`,
    ...(contact.notes.trim() ? [`Notes: ${contact.notes.trim()}`] : []),
    '',
    'Please confirm availability, MOQ, final price and delivery charges.',
  ].join('\n');
}
