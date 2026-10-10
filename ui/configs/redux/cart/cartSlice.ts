import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { readyStockProducts } from '@/content/readyStock';

export type CartItem = { productId: string; quantity: number };
type CartState = { items: CartItem[]; buyNow: CartItem | null; hydrated: boolean };
export const CART_STORAGE_KEY = 'rs-trade-cart-v1';
export const MAX_QUANTITY = 9999; // Input limit, not a stock or MOQ claim.
const knownProduct = (id: string) => readyStockProducts.some((product) => product.id === id);
export function validQuantity(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? Math.min(value, MAX_QUANTITY)
    : null;
}
export function sanitizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry.productId !== 'string' || !knownProduct(entry.productId)) continue;
    const quantity = validQuantity(entry.quantity);
    if (!quantity) continue;
    const existing = result.find((item) => item.productId === entry.productId);
    if (existing) existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
    else result.push({ productId: entry.productId, quantity });
  }
  return result;
}
const initialState: CartState = { items: [], buyNow: null, hydrated: false };
const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<{ items?: unknown; buyNow?: unknown }>) {
      if (state.hydrated) return;
      state.items = sanitizeCartItems(action.payload.items);
      state.buyNow = sanitizeCartItems([action.payload.buyNow])[0] ?? null;
      state.hydrated = true;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      const item = sanitizeCartItems([action.payload])[0];
      if (!item) return;
      const existing = state.items.find((value) => value.productId === item.productId);
      if (existing) existing.quantity = Math.min(existing.quantity + item.quantity, MAX_QUANTITY);
      else state.items.push(item);
    },
    setQuantity(state, action: PayloadAction<CartItem>) {
      const quantity = validQuantity(action.payload.quantity);
      const item = state.items.find((value) => value.productId === action.payload.productId);
      if (item && quantity) item.quantity = quantity;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    setBuyNow(state, action: PayloadAction<CartItem>) {
      state.buyNow = sanitizeCartItems([action.payload])[0] ?? null;
    },
  },
});
export const { hydrateCart, addItem, setQuantity, removeItem, clearCart, setBuyNow } =
  slice.actions;
export const cartReducer = slice.reducer;
