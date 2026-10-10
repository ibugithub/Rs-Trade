'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import {
  addressStorageKey,
  addressStorageStatus,
  loadAddresses,
} from '@/configs/redux/addresses/addressSlice';
import { useAddressBook } from './useAddressBook';

export function AddressPersistence() {
  const dispatch = useAppDispatch();
  const { owner } = useAddressBook();
  const addresses = useAppSelector((state) => state.addresses);

  useEffect(() => {
    let saved: unknown = {};
    let storageAvailable = true;
    if (owner) {
      try {
        const stored = localStorage.getItem(addressStorageKey(owner));
        // Corrupt data starts an empty address book; blocked storage is reported separately.
        try {
          saved = stored ? JSON.parse(stored) : {};
        } catch {
          saved = {};
        }
      } catch {
        storageAvailable = false;
      }
    }
    dispatch(loadAddresses({ owner, saved, storageAvailable }));
  }, [dispatch, owner]);

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
