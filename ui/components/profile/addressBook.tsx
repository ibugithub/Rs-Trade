'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/configs/redux/hooks';
import {
  formatDeliveryAddress,
  loadAddresses,
  retryAddressLoad,
  type DeliveryAddress,
} from '@/configs/redux/addresses/addressSlice';
import { orderReturnPath, type OrderPath } from '@/lib/orderNavigation';
import { useAddressBook } from './useAddressBook';
import { validatePhoneNumber } from '@/lib/phoneNumber';
import { addressError, updateAddressBook } from '@/lib/addressBookApi';

const emptyAddress: DeliveryAddress = {
  id: '',
  label: '',
  recipient: '',
  phone: '',
  street: '',
  city: '',
  postalCode: '',
  country: 'Bangladesh',
};

const fields = [
  {
    key: 'label',
    label: 'Address label',
    placeholder: 'Home, Office or Warehouse',
    autocomplete: 'off',
    limit: 60,
  },
  {
    key: 'recipient',
    label: 'Recipient name',
    placeholder: 'Full name',
    autocomplete: 'shipping name',
    limit: 120,
  },
  {
    key: 'phone',
    label: 'Phone / WhatsApp number',
    placeholder: '01712345678 or +8801712345678',
    autocomplete: 'shipping tel',
    limit: 30,
  },
  {
    key: 'street',
    label: 'Street address',
    placeholder: 'House, road, area and any delivery directions',
    autocomplete: 'shipping street-address',
    limit: 500,
  },
  {
    key: 'city',
    label: 'City / district',
    placeholder: 'Dhaka',
    autocomplete: 'shipping address-level2',
    limit: 120,
  },
  {
    key: 'postalCode',
    label: 'Postal code (optional)',
    placeholder: 'Postal code',
    autocomplete: 'shipping postal-code',
    limit: 30,
  },
  {
    key: 'country',
    label: 'Country',
    placeholder: 'Bangladesh',
    autocomplete: 'shipping country-name',
    limit: 120,
  },
] as const;

export function AddressBook() {
  const { owner, ready, items, defaultId, storageAvailable, error: loadError } = useAddressBook();
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState<DeliveryAddress>(emptyAddress);
  const [editing, setEditing] = useState(false);
  const [makeDefault, setMakeDefault] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [working, setWorking] = useState(false);
  const [syncError, setSyncError] = useState('');
  const busy = useRef(false);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);
  const [phoneError, setPhoneError] = useState('');
  const [returnTo, setReturnTo] = useState<OrderPath | null>(null);
  const labelInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const destination = orderReturnPath(window.location.search);
    setReturnTo(destination);
    if (destination) document.getElementById('addresses')?.scrollIntoView();
  }, []);

  useEffect(() => {
    if (editing) labelInput.current?.focus();
  }, [editing]);

  function startEditing(address?: DeliveryAddress) {
    setDraft(address ?? emptyAddress);
    setMakeDefault(address ? address.id === defaultId : items.length === 0);
    setRemovingId(null);
    setMessage('');
    setPhoneError('');
    setEditing(true);
  }

  async function sync(
    action: 'save' | 'remove' | 'default',
    data: { address: DeliveryAddress; makeDefault: boolean } | { id: string },
  ) {
    if (!owner || !ready || busy.current) return false;
    const controller = new AbortController();
    request.current = controller;
    busy.current = true;
    setWorking(true);
    setSyncError('');
    setMessage('');
    try {
      const saved = await updateAddressBook(action, data, controller.signal);
      if (controller.signal.aborted) return false;
      dispatch(loadAddresses({ owner, saved, storageAvailable }));
      return true;
    } catch (error) {
      if (!controller.signal.aborted) setSyncError(addressError(error));
      return false;
    } finally {
      busy.current = false;
      if (!controller.signal.aborted) setWorking(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!owner || !ready) return;
    if (fields.some((field) => field.key !== 'postalCode' && !draft[field.key].trim())) {
      setMessage('Please fill in all required address details.');
      return;
    }
    const phone = validatePhoneNumber(draft.phone, draft.country);
    if (phone.error) {
      setPhoneError(phone.error);
      document.getElementById('address-phone')?.focus();
      return;
    }
    const address = { ...draft, phone: phone.number, id: draft.id || window.crypto.randomUUID() };
    // Keep the reference when retrying a request whose response was interrupted.
    setDraft(address);
    if (!(await sync('save', { address, makeDefault }))) return;
    setEditing(false);
    setDraft(emptyAddress);
    setMessage('Address saved.');
  }

  if (!owner) return null;

  return (
    <section
      id="addresses"
      aria-labelledby="addresses-title"
      className="mt-6 scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <fieldset
        disabled={working}
        className="min-w-0"
        aria-label="Saved address controls"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="addresses-title"
              className="flex items-center gap-2 text-xl font-semibold"
            >
              <MapPin
                size={20}
                className="text-blue-700"
                aria-hidden="true"
              />
              Saved addresses
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Save delivery details and choose a default for your orders.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Saved to your account and available across your devices.
            </p>
          </div>
          <button
            type="button"
            disabled={!ready}
            onClick={() => startEditing()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-yellow-300 px-4 text-sm font-semibold hover:bg-yellow-500 disabled:opacity-50"
          >
            <Plus
              size={16}
              aria-hidden="true"
            />
            Add Address
          </button>
        </div>

        {returnTo && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-gray-700">
            <p>
              {items.length
                ? 'Your addresses are ready. Continue to choose one for this order.'
                : 'Add a delivery address to continue with your order. Your products are still saved.'}
            </p>
            {ready && items.length > 0 && !editing && (
              <Link
                href={returnTo}
                className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-yellow-300 px-4 font-semibold text-gray-900"
              >
                Continue to {returnTo === '/buy_now' ? 'Buy Now' : 'Checkout'}
              </Link>
            )}
          </div>
        )}
        {!storageAvailable && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-gray-700"
          >
            Browser caching is unavailable. Your addresses are saved securely to your account.
          </p>
        )}
        {loadError && (
          <div
            role="alert"
            className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {loadError}
            <button
              type="button"
              onClick={() => dispatch(retryAddressLoad())}
              className="ml-2 min-h-11 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}
        {!ready ? (
          !loadError && (
            <p
              role="status"
              className="mt-6 text-sm text-gray-500"
            >
              Loading saved addresses...
            </p>
          )
        ) : !items.length && !editing ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-6 text-center">
            <p className="font-semibold">No saved addresses yet</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Add your first address. It will become your default delivery address.
            </p>
            <button
              type="button"
              onClick={() => startEditing()}
              className="mt-3 min-h-11 text-sm font-semibold text-blue-700 hover:underline"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {items.map((address) => (
              <li
                key={address.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="break-words font-semibold">{address.label}</h3>
                  {address.id === defaultId && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-3 break-words text-sm font-medium">{address.recipient}</p>
                <p className="mt-1 break-words text-sm leading-6 text-gray-600">
                  {formatDeliveryAddress(address)}
                </p>
                <p className="mt-1 text-sm text-gray-600">{address.phone}</p>
                {validatePhoneNumber(address.phone, address.country).error && (
                  <p className="mt-2 text-xs text-red-700">
                    This phone number needs correction. Edit this address before placing an order.
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => startEditing(address)}
                    aria-label={`Edit ${address.label} address`}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700"
                  >
                    <Pencil
                      size={15}
                      aria-hidden="true"
                    />
                    Edit
                  </button>
                  {address.id !== defaultId && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (await sync('default', { id: address.id }))
                          setMessage(`${address.label} is now your default address.`);
                      }}
                      className="min-h-11 text-sm font-semibold text-blue-700"
                    >
                      Make Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setRemovingId(address.id)}
                    aria-label={`Remove ${address.label} address`}
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-gray-500 hover:text-red-700"
                  >
                    <Trash2
                      size={15}
                      aria-hidden="true"
                    />
                    Remove
                  </button>
                </div>
                {removingId === address.id && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm">
                      Remove this address?{' '}
                      {address.id === defaultId && items.length > 1
                        ? 'Another saved address will become your default.'
                        : ''}
                    </p>
                    <div className="mt-2 flex gap-4">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!(await sync('remove', { id: address.id }))) return;
                          setRemovingId(null);
                          if (draft.id === address.id) setEditing(false);
                          setMessage('Address removed.');
                        }}
                        className="min-h-11 text-sm font-semibold text-red-700"
                      >
                        Remove Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setRemovingId(null)}
                        className="min-h-11 text-sm text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {editing && (
          <form
            onSubmit={handleSave}
            className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5"
          >
            <h3 className="font-semibold">{draft.id ? 'Edit address' : 'Add a new address'}</h3>
            {fields.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={`address-${field.key}`}
                  className="mb-2 block text-sm font-medium"
                >
                  {field.label}
                </label>
                <input
                  ref={field.key === 'label' ? labelInput : undefined}
                  id={`address-${field.key}`}
                  type={field.key === 'phone' ? 'tel' : 'text'}
                  inputMode={field.key === 'phone' ? 'tel' : undefined}
                  aria-invalid={field.key === 'phone' && Boolean(phoneError)}
                  aria-describedby={
                    field.key === 'phone' ? 'address-phone-help address-phone-error' : undefined
                  }
                  required={field.key !== 'postalCode'}
                  maxLength={field.limit}
                  autoComplete={field.autocomplete}
                  placeholder={field.placeholder}
                  value={draft[field.key]}
                  onChange={(event) => {
                    setDraft((value) => ({ ...value, [field.key]: event.target.value }));
                    if (field.key === 'phone' || field.key === 'country') setPhoneError('');
                  }}
                  onBlur={
                    field.key === 'phone'
                      ? () => setPhoneError(validatePhoneNumber(draft.phone, draft.country).error)
                      : undefined
                  }
                  className="min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {field.key === 'phone' && (
                  <>
                    <p
                      id="address-phone-help"
                      className="mt-2 text-xs leading-6 text-gray-500"
                    >
                      Bangladesh mobile: 01712345678. For other countries, include + and the country
                      code.
                    </p>
                    <p
                      id="address-phone-error"
                      role="alert"
                      className="mt-1 text-sm text-red-700"
                    >
                      {phoneError}
                    </p>
                  </>
                )}
              </div>
            ))}
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={makeDefault}
                onChange={(event) => setMakeDefault(event.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
              Use as my default address
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="min-h-11 rounded-lg bg-yellow-300 px-5 text-sm font-semibold hover:bg-yellow-500"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setDraft(emptyAddress);
                  setMessage('');
                }}
                className="min-h-11 rounded-lg px-4 text-sm text-gray-600 hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </fieldset>
      {syncError && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {syncError}
        </p>
      )}
      {working && (
        <p
          role="status"
          className="mt-4 text-sm text-blue-700"
        >
          Saving address changes...
        </p>
      )}
      <p
        role="status"
        className="mt-4 text-sm text-blue-700"
      >
        {message}
      </p>
    </section>
  );
}
