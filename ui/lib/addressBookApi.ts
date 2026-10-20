import axios from 'axios';
import { AxiosReqInstance } from '@/components/accounts/utils/axiosInstance';
import {
  addressStorageKey,
  normalizeAddress,
  type DeliveryAddress,
} from '@/configs/redux/addresses/addressSlice';

export type SavedAddressBook = { items: DeliveryAddress[]; defaultId: string | null };
const endpoint = '/api/profile/addresses/';

export async function fetchAddressBook(
  owner: string,
  signal: AbortSignal,
): Promise<SavedAddressBook> {
  const client = AxiosReqInstance();
  const response = await client.get<SavedAddressBook>(endpoint, { signal, timeout: 30000 });
  let legacy: SavedAddressBook = { items: [], defaultId: null };
  const marker = `${addressStorageKey(owner)}:imported`;
  let imported = false;
  try {
    imported = localStorage.getItem(marker) === 'yes';
    const saved = JSON.parse(localStorage.getItem(addressStorageKey(owner)) || '{}');
    if (saved && Array.isArray(saved.items)) {
      legacy = {
        items: saved.items
          .map(normalizeAddress)
          .filter((item: DeliveryAddress | null): item is DeliveryAddress => !!item),
        defaultId: typeof saved.defaultId === 'string' ? saved.defaultId : null,
      };
    }
  } catch {
    // Server addresses remain usable when local storage is unavailable or corrupt.
  }
  const book =
    !imported && legacy.items.length
      ? (await client.post<SavedAddressBook>(endpoint, legacy, { signal, timeout: 30000 })).data
      : response.data;
  if (!signal.aborted) {
    try {
      localStorage.setItem(marker, 'yes');
    } catch {
      /* Browser cache is optional. */
    }
  }
  return book;
}

export async function updateAddressBook(
  action: 'save' | 'remove' | 'default',
  data: { address: DeliveryAddress; makeDefault: boolean } | { id: string },
  signal: AbortSignal,
): Promise<SavedAddressBook> {
  const response = await AxiosReqInstance().request<SavedAddressBook>({
    url: endpoint,
    method: action === 'save' ? 'PUT' : action === 'remove' ? 'DELETE' : 'PATCH',
    data,
    signal,
    timeout: 30000,
  });
  return response.data;
}

export function addressError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return 'Your session expired. Please sign in again.';
    if (error.response?.status === 400) {
      const flatten = (value: unknown): string =>
        typeof value === 'string'
          ? value
          : Array.isArray(value)
            ? value.map(flatten).join(' ')
            : value && typeof value === 'object'
              ? Object.values(value).map(flatten).join(' ')
              : '';
      return flatten(error.response.data) || 'Please check your address details.';
    }
  }
  return 'Could not sync your addresses. Please check your connection and try again.';
}
