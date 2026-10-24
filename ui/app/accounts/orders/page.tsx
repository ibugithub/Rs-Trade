import type { Metadata } from 'next';
import { MyOrders } from '@/components/profile/myOrders';

export const metadata: Metadata = {
  title: 'My Orders | RS Trade International',
  robots: { index: false, follow: true },
};

export default function OrdersPage() {
  return <MyOrders />;
}
