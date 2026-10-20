import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import { fetchLoggedInUser, signOut } from '@/configs/redux/auth/authSlice';

export type CartItem = { productId: string; quantity: number };
export type CartOperation = {
  id: string;
  kind: 'add' | 'set' | 'remove' | 'clear' | 'merge';
  productId?: string;
  quantity?: number;
  items?: CartItem[];
};
export type CartState = {
  items: CartItem[];
  unselectedIds: string[];
  buyNow: CartItem | null;
  hydrated: boolean;
  owner: string | null;
  session: number;
  pending: CartOperation[];
  syncStatus: 'loading' | 'guest' | 'saving' | 'saved' | 'error';
  notice: string;
  storageAvailable: boolean;
  reloadToken: number;
};
export const CART_STORAGE_KEY = 'rs-trade-cart-v2';
export const accountCartKey = (owner: string) =>
  `rs-trade-account-cart-v1:${encodeURIComponent(owner)}`;
export const MAX_QUANTITY = 9999;
export const MAX_CART_ITEMS = 100;
const validProductId = (id: string) => /^[1-9]\d{0,18}$/.test(id);

export function sanitizeUnselectedIds(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter((id): id is string => typeof id === 'string' && validProductId(id)),
        ),
      ].slice(0, MAX_CART_ITEMS)
    : [];
}

export function selectedCartItems(cart: Pick<CartState, 'items' | 'unselectedIds'>) {
  return cart.items.filter((item) => !cart.unselectedIds.includes(item.productId));
}

export function validQuantity(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? Math.min(value, MAX_QUANTITY)
    : null;
}

export function sanitizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry.productId !== 'string' || !validProductId(entry.productId)) continue;
    const quantity = validQuantity(entry.quantity);
    if (!quantity) continue;
    const existing = result.find((item) => item.productId === entry.productId);
    if (existing) existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
    else if (result.length < MAX_CART_ITEMS) result.push({ productId: entry.productId, quantity });
  }
  return result;
}

export function sanitizeOperations(value: unknown): CartOperation[] {
  if (!Array.isArray(value)) return [];
  return value.filter((operation) => {
    if (
      !operation ||
      typeof operation.id !== 'string' ||
      !/^[A-Za-z0-9_-]{21,64}$/.test(operation.id)
    )
      return false;
    if (operation.kind === 'clear') return true;
    if (operation.kind === 'merge')
      return (
        Array.isArray(operation.items) &&
        sanitizeCartItems(operation.items).length === operation.items.length
      );
    if (typeof operation.productId !== 'string' || !validProductId(operation.productId))
      return false;
    if (operation.kind === 'remove') return true;
    return (
      ['add', 'set'].includes(operation.kind) &&
      validQuantity(operation.quantity) === operation.quantity
    );
  });
}

export function replayCartOperations(items: CartItem[], operations: CartOperation[]) {
  let result = sanitizeCartItems(items);
  for (const operation of operations) {
    if (operation.kind === 'clear') {
      result = [];
      continue;
    }
    if (operation.kind === 'merge') {
      result = sanitizeCartItems([...result, ...(operation.items ?? [])]);
      continue;
    }
    if (operation.kind === 'remove') {
      result = result.filter((item) => item.productId !== operation.productId);
      continue;
    }
    const quantity = validQuantity(operation.quantity);
    if (!quantity || !operation.productId || !validProductId(operation.productId)) continue;
    const existing = result.find((item) => item.productId === operation.productId);
    if (existing)
      existing.quantity =
        operation.kind === 'add' ? Math.min(existing.quantity + quantity, MAX_QUANTITY) : quantity;
    else if (result.length < MAX_CART_ITEMS)
      result.push({ productId: operation.productId, quantity });
  }
  return result;
}

const initialState: CartState = {
  items: [],
  unselectedIds: [],
  buyNow: null,
  hydrated: false,
  owner: null,
  session: 0,
  pending: [],
  syncStatus: 'loading',
  notice: '',
  storageAvailable: true,
  reloadToken: 0,
};
function beginSession(state: CartState, owner: string | null) {
  state.items = [];
  state.unselectedIds = [];
  state.buyNow = null;
  state.pending = [];
  state.hydrated = false;
  state.owner = owner;
  state.session += 1;
  state.syncStatus = 'loading';
  state.notice = '';
}
function mutate(state: CartState, operation: CartOperation) {
  if (!state.hydrated) return;
  state.items = replayCartOperations(state.items, [operation]);
  state.unselectedIds = state.unselectedIds.filter((id) =>
    state.items.some((item) => item.productId === id),
  );
  if (operation.kind === 'add') {
    state.unselectedIds = state.unselectedIds.filter((id) => id !== operation.productId);
  }
  if (state.owner) {
    state.pending.push(operation);
    state.syncStatus = 'saving';
    state.notice = '';
  }
}
const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItemSelected(state, action: PayloadAction<{ productId: string; selected: boolean }>) {
      if (
        !state.hydrated ||
        !state.items.some((item) => item.productId === action.payload.productId)
      )
        return;
      state.unselectedIds = state.unselectedIds.filter((id) => id !== action.payload.productId);
      if (!action.payload.selected) state.unselectedIds.push(action.payload.productId);
    },
    setAllSelected(state, action: PayloadAction<boolean>) {
      if (!state.hydrated) return;
      state.unselectedIds = action.payload ? [] : state.items.map((item) => item.productId);
    },
    beginCartSession(state, action: PayloadAction<string | null>) {
      beginSession(state, action.payload);
    },
    loadCartSession(
      state,
      action: PayloadAction<{
        owner: string | null;
        session: number;
        items: unknown;
        buyNow?: unknown;
        pending?: unknown;
        unselectedIds?: unknown;
        storageAvailable: boolean;
      }>,
    ) {
      const payload = action.payload;
      if (state.owner !== payload.owner || state.session !== payload.session) return;
      state.pending = sanitizeOperations(payload.pending);
      state.items = replayCartOperations(sanitizeCartItems(payload.items), state.pending);
      state.unselectedIds = sanitizeUnselectedIds(payload.unselectedIds).filter((id) =>
        state.items.some((item) => item.productId === id),
      );
      state.buyNow = sanitizeCartItems([payload.buyNow])[0] ?? null;
      state.hydrated = true;
      state.storageAvailable = payload.storageAvailable;
      state.syncStatus = state.owner ? (state.pending.length ? 'saving' : 'saved') : 'guest';
    },
    acknowledgeCartOperation(
      state,
      action: PayloadAction<{
        owner: string;
        session: number;
        id: string;
        items: unknown;
        notice?: string;
      }>,
    ) {
      const payload = action.payload;
      if (state.owner !== payload.owner || state.session !== payload.session) return;
      state.pending = state.pending.filter((operation) => operation.id !== payload.id);
      state.items = replayCartOperations(sanitizeCartItems(payload.items), state.pending);
      state.syncStatus = state.pending.length ? 'saving' : 'saved';
      if (payload.notice) state.notice = payload.notice;
    },
    cartSyncError(
      state,
      action: PayloadAction<{ owner: string; session: number; message: string }>,
    ) {
      if (state.owner !== action.payload.owner || state.session !== action.payload.session) return;
      state.syncStatus = 'error';
      state.notice = action.payload.message;
    },
    retryCartSync(state) {
      state.reloadToken += 1;
    },
    cartStorageStatus(state, action: PayloadAction<boolean>) {
      state.storageAvailable = action.payload;
    },
    addItem: {
      prepare(item: CartItem) {
        return { payload: { ...item, operationId: nanoid() } };
      },
      reducer(state, action: PayloadAction<CartItem & { operationId: string }>) {
        if (!sanitizeCartItems([action.payload]).length) return;
        mutate(state, {
          id: action.payload.operationId,
          kind: 'add',
          productId: action.payload.productId,
          quantity: action.payload.quantity,
        });
      },
    },
    setQuantity: {
      prepare(item: CartItem) {
        return { payload: { ...item, operationId: nanoid() } };
      },
      reducer(state, action: PayloadAction<CartItem & { operationId: string }>) {
        if (!sanitizeCartItems([action.payload]).length) return;
        mutate(state, {
          id: action.payload.operationId,
          kind: 'set',
          productId: action.payload.productId,
          quantity: action.payload.quantity,
        });
      },
    },
    removeItem: {
      prepare(productId: string) {
        return { payload: { productId, operationId: nanoid() } };
      },
      reducer(state, action: PayloadAction<{ productId: string; operationId: string }>) {
        mutate(state, {
          id: action.payload.operationId,
          kind: 'remove',
          productId: action.payload.productId,
        });
      },
    },
    clearCart: {
      prepare() {
        return { payload: nanoid() };
      },
      reducer(state, action: PayloadAction<string>) {
        mutate(state, { id: action.payload, kind: 'clear' });
      },
    },
    clearBuyNow(state) {
      state.buyNow = null;
    },
    setBuyNow(state, action: PayloadAction<CartItem>) {
      if (state.hydrated) state.buyNow = sanitizeCartItems([action.payload])[0] ?? null;
    },
  },
  extraReducers(builder) {
    builder.addCase(signOut, (state) => {
      beginSession(state, null);
    });
    builder.addCase(fetchLoggedInUser.rejected, (state) => {
      if (state.owner) beginSession(state, null);
    });
    builder.addCase(fetchLoggedInUser.fulfilled, (state, action) => {
      const email = action.payload?.user?.email || action.payload?.email;
      if (state.owner && state.owner !== email?.trim().toLowerCase()) beginSession(state, null);
    });
  },
});
export const {
  setItemSelected,
  setAllSelected,
  beginCartSession,
  loadCartSession,
  acknowledgeCartOperation,
  cartSyncError,
  retryCartSync,
  cartStorageStatus,
  addItem,
  setQuantity,
  removeItem,
  clearCart,
  setBuyNow,
  clearBuyNow,
} = slice.actions;
export const cartReducer = slice.reducer;
