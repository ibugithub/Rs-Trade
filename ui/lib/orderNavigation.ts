export type OrderPath = '/checkout' | '/buy_now';
const SIGN_IN_RETURN_KEY = 'rs-trade-sign-in-return';

export function catalogReviewPath(pathname: string) {
  const path = pathname.replace(/\/+$/, '');
  return ['/cart', '/checkout', '/buy_now', '/cart/add-to-cart'].includes(path) ? path : '';
}

export function orderReturnPath(search: string): OrderPath | null {
  const path = new URLSearchParams(search).get('returnTo');
  return path === '/checkout' || path === '/buy_now' ? path : null;
}

export function profileAddressPath(orderPath: OrderPath) {
  return `/accounts/profile?returnTo=${encodeURIComponent(orderPath)}#addresses`;
}

export function orderAddressDestination(
  authStatus: string,
  addressesReady: boolean,
  addressCount: number,
  orderPath: OrderPath,
) {
  if (authStatus === 'unauthenticated') return '/accounts/signin';
  if (authStatus === 'authenticated' && addressesReady && addressCount === 0) {
    return profileAddressPath(orderPath);
  }
  return null;
}

export function rememberAddressSignIn(orderPath: OrderPath) {
  try {
    sessionStorage.setItem(SIGN_IN_RETURN_KEY, profileAddressPath(orderPath));
  } catch {
    /* Sign in still works without session storage. */
  }
}

export function consumeSignInReturn() {
  try {
    const destination = sessionStorage.getItem(SIGN_IN_RETURN_KEY);
    sessionStorage.removeItem(SIGN_IN_RETURN_KEY);
    // A finite allowlist prevents external or unexpected redirect destinations.
    return destination === profileAddressPath('/checkout') ||
      destination === profileAddressPath('/buy_now')
      ? destination
      : '/';
  } catch {
    return '/';
  }
}
