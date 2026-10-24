'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import {
  addressStorageKey,
  beginAddressLoad,
  addressLoadFailed,
  addressStorageStatus,
  loadAddresses,
} from '@/configs/redux/addresses/addressSlice';
import { useAddressBook } from './useAddressBook';
import { fetchAddressBook, addressError } from '@/lib/addressBookApi';

export function AddressPersistence() {
  const dispatch = useAppDispatch();
  const { owner } = useAddressBook();
  const addresses = useAppSelector((state) => state.addresses);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(beginAddressLoad(owner));
    if (!owner) return () => controller.abort();
    void fetchAddressBook(owner, controller.signal)
      .then((saved) => {
        if (!controller.signal.aborted)
          dispatch(loadAddresses({ owner, saved, storageAvailable: true }));
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          dispatch(addressLoadFailed({ owner, error: addressError(error) }));
      });
    return () => controller.abort();
  }, [dispatch, owner, addresses.reload]);

  useEffect(() => {
    // Never save one account's addresses under another account's key during a session change.
    if (!owner || addresses.owner !== owner || !addresses.hydrated) return;
    let available = true;
    try {
      localStorage.setItem(
        addressStorageKey(owner),
        JSON.stringify({ items: addresses.items, defaultId: addresses.defaultId }),
      );
    } catch {
      available = false;
    }
    dispatch(addressStorageStatus({ owner, available }));
  }, [dispatch, owner, addresses.owner, addresses.hydrated, addresses.items, addresses.defaultId]);
  return null;
}
