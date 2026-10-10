import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DeliveryAddress = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

type AddressState = {
  owner: string | null;
  hydrated: boolean;
  items: DeliveryAddress[];
  defaultId: string | null;
  storageAvailable: boolean;
};

const initialState: AddressState = {
  owner: null,
  hydrated: false,
  items: [],
  defaultId: null,
  storageAvailable: true,
};

export function addressStorageKey(owner: string) {
  return `rs-trade-addresses-v1:${encodeURIComponent(owner.trim().toLowerCase())}`;
}

export function normalizeAddress(value: unknown): DeliveryAddress | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  const address = {} as DeliveryAddress;
  const fields = [
    'id',
    'label',
    'recipient',
    'phone',
    'street',
    'city',
    'postalCode',
    'country',
  ] as const;
  for (const field of fields) {
    if (typeof candidate[field] !== 'string' || candidate[field].length > 500) return null;
    address[field] = candidate[field].trim();
    if (!address[field] && field !== 'postalCode') return null;
  }
  return address;
}

export function formatDeliveryAddress(address: DeliveryAddress) {
  return [
    address.street,
    [address.city, address.postalCode].filter(Boolean).join(' '),
    address.country,
  ].join(', ');
}

export function selectDeliveryAddress(
  items: DeliveryAddress[],
  selectedId: string | null,
  defaultId: string | null,
) {
  return (
    items.find((item) => item.id === selectedId) ??
    items.find((item) => item.id === defaultId) ??
    items[0] ??
    null
  );
}

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    loadAddresses(
      state,
      action: PayloadAction<{ owner: string | null; saved: unknown; storageAvailable: boolean }>,
    ) {
      state.owner = action.payload.owner;
      state.hydrated = !!action.payload.owner;
      state.storageAvailable = action.payload.storageAvailable;
      state.items = [];
      state.defaultId = null;
      if (!state.owner || !action.payload.saved || typeof action.payload.saved !== 'object') return;
      const saved = action.payload.saved as Record<string, unknown>;
      if (Array.isArray(saved.items)) {
        for (const value of saved.items) {
          const address = normalizeAddress(value);
          if (address && !state.items.some((item) => item.id === address.id))
            state.items.push(address);
        }
      }
      state.defaultId = state.items.some((item) => item.id === saved.defaultId)
        ? (saved.defaultId as string)
        : (state.items[0]?.id ?? null);
    },
    saveAddress(
      state,
      action: PayloadAction<{ owner: string; address: DeliveryAddress; makeDefault: boolean }>,
    ) {
      if (!state.hydrated || state.owner !== action.payload.owner) return;
      const address = normalizeAddress(action.payload.address);
      if (!address) return;
      const index = state.items.findIndex((item) => item.id === address.id);
      if (index === -1) state.items.push(address);
      else state.items[index] = address;
      if (!state.defaultId || action.payload.makeDefault) state.defaultId = address.id;
    },
    removeAddress(state, action: PayloadAction<{ owner: string; id: string }>) {
      if (state.owner !== action.payload.owner) return;
      state.items = state.items.filter((item) => item.id !== action.payload.id);
      if (state.defaultId === action.payload.id) state.defaultId = state.items[0]?.id ?? null;
    },
    setDefaultAddress(state, action: PayloadAction<{ owner: string; id: string }>) {
      if (state.owner !== action.payload.owner) return;
      if (state.items.some((item) => item.id === action.payload.id))
        state.defaultId = action.payload.id;
    },
    addressStorageStatus(state, action: PayloadAction<{ owner: string; available: boolean }>) {
      if (state.owner === action.payload.owner) state.storageAvailable = action.payload.available;
    },
  },
});

export const {
  loadAddresses,
  saveAddress,
  removeAddress,
  setDefaultAddress,
  addressStorageStatus,
} = addressSlice.actions;
export const addressReducer = addressSlice.reducer;
