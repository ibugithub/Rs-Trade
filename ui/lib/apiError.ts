import axios from 'axios';

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;
  if (error.response?.status === 429) {
    const retry = Number(
      error.response.data?.retry_after ?? error.response.headers?.['retry-after'],
    );
    if (Number.isFinite(retry) && retry > 0) {
      const seconds = Math.ceil(retry);
      return `Too many attempts. Please try again in ${seconds} ${seconds === 1 ? 'second' : 'seconds'}.`;
    }
  }
  const data = error.response?.data;
  const detail: unknown = data?.detail ?? data?.error ?? data?.message;
  return typeof detail === 'string' && detail.trim() ? detail.trim() : fallback;
}
