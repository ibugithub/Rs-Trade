import { readyStockProducts } from './readyStock';
import type { CartItem } from '@/configs/redux/cart/cartSlice';
import { demoSubtotal, formatBDT } from './pricing';

export type OrderContact = { name: string; phone: string; address: string; notes: string };
export function formatOrderRequest(items: CartItem[], contact: OrderContact) {
  const lines = items
    .map((item) => {
      const product = readyStockProducts.find((value) => value.id === item.productId);
      return product
        ? `- ${product.name}: ${item.quantity} requested (${formatBDT(product.demoPrice)} per unit, demo price)`
        : null;
    })
    .filter(Boolean);
  return [
    'RS Trade International - Ready Stock inquiry',
    '',
    ...lines,
    `Demo subtotal: ${formatBDT(demoSubtotal(items))} (preview only; not a final quote)`,
    '',
    `Name: ${contact.name.trim()}`,
    `Phone / WhatsApp: ${contact.phone.trim()}`,
    `Delivery address: ${contact.address.trim()}`,
    ...(contact.notes.trim() ? [`Notes: ${contact.notes.trim()}`] : []),
    '',
    'Please confirm availability, MOQ, final price and delivery charges.',
  ].join('\n');
}
