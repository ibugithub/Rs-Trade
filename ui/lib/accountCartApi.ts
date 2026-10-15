import axios from 'axios';
import { AxiosReqInstance } from '@/components/accounts/utils/axiosInstance';
import type { CartItem, CartOperation } from '@/configs/redux/cart/cartSlice';

export type AccountCartResponse = { items: CartItem[]; notice?: string };

export async function getAccountCart(signal: AbortSignal): Promise<AccountCartResponse> {
  const response = await AxiosReqInstance().get('/api/cart/', { signal, timeout: 30000 });
  return response.data;
}

function messageFrom(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(messageFrom).join(' ');
  return 'Could not save this change. Please review your cart.';
}

export async function sendCartOperation(
  operation: CartOperation,
  signal: AbortSignal,
): Promise<AccountCartResponse> {
  try {
    const response = await AxiosReqInstance().post('/api/cart/', operation, {
      signal,
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 400 &&
      Array.isArray(error.response.data?.items) &&
      error.response.data?.detail !== undefined
    ) {
      return { items: error.response.data.items, notice: messageFrom(error.response.data.detail) };
    }
    throw error;
  }
}
