import axios from 'axios';

function messageText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(messageText).filter(Boolean).join(' ');
  return '';
}

export function signInError(error: unknown): string {
  const fallback = 'We could not sign you in. Please try again.';
  if (!axios.isAxiosError(error)) return fallback;
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'Sign-in took too long. Please try again.';
  }
  if (!error.response) {
    return 'We could not connect to the sign-in service. Check your connection and try again.';
  }
  const { status, data } = error.response;
  if (status >= 500) return 'Sign-in is temporarily unavailable. Please try again shortly.';
  if (status === 429) return 'Too many sign-in attempts. Please wait a moment and try again.';
  if (status === 401) return 'The email or password is incorrect.';
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    for (const key of ['error', 'detail', 'non_field_errors', 'email', 'password']) {
      const message = messageText(data[key]);
      if (!message) continue;
      if (message === 'Invalid credentials') return 'The email or password is incorrect.';
      return message;
    }
  }
  return fallback;
}
