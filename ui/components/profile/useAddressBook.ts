'use client';

import { useAppSelector } from '@/configs/redux/hooks';

export function useAddressBook() {
  const auth = useAppSelector((state) => state.auth);
  const addresses = useAppSelector((state) => state.addresses);
  const email = auth.loogedInUser?.user?.email || auth.loogedInUser?.email;
  const owner =
    auth.isAuthenticated && auth.status === 'authenticated' && email
      ? email.trim().toLowerCase()
      : null;
  const ready = !!owner && addresses.owner === owner && addresses.hydrated;
  return {
    owner,
    ready,
    items: ready ? addresses.items : [],
    defaultId: ready ? addresses.defaultId : null,
    storageAvailable: ready ? addresses.storageAvailable : true,
  };
}
