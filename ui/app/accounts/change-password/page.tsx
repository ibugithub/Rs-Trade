import type { Metadata } from 'next';
import { ChangePassword } from '@/components/accounts/changePassword';

export const metadata: Metadata = {
  title: 'Change Password | RS Trade International',
  robots: { index: false, follow: true },
};

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
