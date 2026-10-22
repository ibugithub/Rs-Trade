import axios from 'axios';
import { AxiosReqInstance } from '@/components/accounts/utils/axiosInstance';

export type ServiceInquiry = {
  requestId: string;
  services: string[];
  name: string;
  phone: string;
  email: string;
  company: string;
  description: string;
  quantity: string;
  reference_url: string;
  destination: string;
  source_page: string;
};

export type InquiryReceipt = { number: string; services: string[]; status: string };

export async function sendServiceInquiry(
  payload: ServiceInquiry,
  signal: AbortSignal,
): Promise<InquiryReceipt> {
  const client = localStorage.getItem('accessToken')
    ? AxiosReqInstance()
    : axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL });
  const response = await client.post('/api/service-requests/', payload, { signal, timeout: 30000 });
  return response.data;
}

export function inquiryError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401)
      return 'Your sign-in session expired. Please sign in again, or sign out to send a guest inquiry.';
    if (error.response?.status === 429)
      return 'Too many inquiries were sent recently. Please wait before trying again.';
    const flatten = (value: unknown): string =>
      typeof value === 'string'
        ? value
        : Array.isArray(value)
          ? value.map(flatten).join(' ')
          : value && typeof value === 'object'
            ? Object.values(value).map(flatten).join(' ')
            : '';
    if (error.response && error.response.status < 500)
      return flatten(error.response.data) || 'Please check your inquiry details.';
  }
  return 'We could not confirm whether your inquiry was received. Retry below to send the same details safely.';
}
