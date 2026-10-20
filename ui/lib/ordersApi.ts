import axios from 'axios';
import { AxiosReqInstance } from '@/components/accounts/utils/axiosInstance';
import type { DeliveryAddress } from '@/configs/redux/addresses/addressSlice';

export type OrderPayload = {
  requestId: string;
  source: 'cart' | 'buyNow';
  items: { productId: string; quantity: number; unitPrice: number }[];
  address: Pick<
    DeliveryAddress,
    'recipient' | 'phone' | 'street' | 'city' | 'postalCode' | 'country'
  >;
  notes: string;
};

export type OrderReceipt = {
  id: string;
  number: string;
  status: string;
  statusLabel: string;
  subtotal: string;
  phone: string;
  createdAt: string;
  items: { productId: string; name: string; quantity: number; unitPrice: string }[];
};

export async function submitOrder(
  payload: OrderPayload,
  signal: AbortSignal,
): Promise<OrderReceipt> {
  const response = await AxiosReqInstance().post('/api/orders/', payload, {
    signal,
    timeout: 30000,
  });
  return response.data;
}

export async function getOrder(
  id: string,
  byRequest = false,
  signal?: AbortSignal,
): Promise<OrderReceipt | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  try {
    const path = byRequest ? `requests/${encodeURIComponent(id)}` : encodeURIComponent(id);
    const response = await AxiosReqInstance().get(`/api/orders/${path}/`, {
      signal,
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

function errorText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(errorText).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(errorText).join(' ');
  return '';
}

export function orderError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401)
      return 'Your session expired. Please sign in again before retrying.';
    const message = errorText(error.response?.data);
    if (message && error.response?.status !== 500) return message;
  }
  return 'We could not confirm whether your order was received. Retry below; the same request will not create a duplicate order.';
}

export function orderWasRejected(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 400;
}
