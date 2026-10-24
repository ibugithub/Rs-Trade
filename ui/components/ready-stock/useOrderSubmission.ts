'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getOrder,
  orderError,
  orderWasRejected,
  submitOrder,
  type OrderPayload,
  type OrderReceipt,
} from '@/lib/ordersApi';

function pendingKey(owner: string, source: string) {
  return `rs-trade-pending-order:${encodeURIComponent(owner)}:${source}`;
}

function readPending(key: string): OrderPayload | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    return value &&
      typeof value.requestId === 'string' &&
      Array.isArray(value.items) &&
      value.address
      ? (value as OrderPayload)
      : null;
  } catch {
    return null;
  }
}

function savePending(key: string, value: OrderPayload | null) {
  try {
    if (value) sessionStorage.setItem(key, JSON.stringify(value));
    else sessionStorage.removeItem(key);
  } catch {
    // The request ID still protects retries while this page remains open.
  }
}

export function useOrderSubmission(
  owner: string | null,
  source: 'cart' | 'buyNow',
  onSaved: () => void,
) {
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [pending, setPending] = useState<OrderPayload | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [recovering, setRecovering] = useState(true);
  const [scopeOwner, setScopeOwner] = useState(owner);
  const ownerRef = useRef(owner);
  ownerRef.current = owner;
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const router = useRouter();
  const path = source === 'cart' ? '/checkout' : '/buy_now';

  useEffect(() => {
    const abort = new AbortController();
    controller.current?.abort();
    controller.current = abort;
    busy.current = false;
    setScopeOwner(owner);
    setReceipt(null);
    setPending(null);
    setError('');
    setSubmitting(false);
    setRecovering(Boolean(owner));
    if (!owner) return () => abort.abort();
    const cached = readPending(pendingKey(owner, source));
    const savedId = new URLSearchParams(window.location.search).get('order');
    setPending(cached);
    const recover = async () => {
      try {
        const order = cached
          ? await getOrder(cached.requestId, true, abort.signal)
          : savedId
            ? await getOrder(savedId, false, abort.signal)
            : null;
        if (abort.signal.aborted) return;
        if (order) {
          setReceipt(order);
          setPending(null);
          savePending(pendingKey(owner, source), null);
          if (cached) onSaved();
          router.replace(`${path}?order=${encodeURIComponent(order.id)}`);
        } else if (savedId) {
          setError('This order could not be found for your account.');
        }
      } catch (failure) {
        if (!abort.signal.aborted) setError(orderError(failure));
      } finally {
        if (!abort.signal.aborted) setRecovering(false);
      }
    };
    void recover();
    return () => abort.abort();
  }, [owner, source, onSaved, path, router]);

  const place = async (payload: OrderPayload) => {
    if (!owner || busy.current || recovering) return;
    const requestOwner = owner;
    const abort = controller.current ?? new AbortController();
    busy.current = true;
    setSubmitting(true);
    setError('');
    setPending(payload);
    savePending(pendingKey(owner, source), payload);
    try {
      const order = await submitOrder(payload, abort.signal);
      if (ownerRef.current !== requestOwner || abort.signal.aborted) return;
      setReceipt(order);
      setPending(null);
      savePending(pendingKey(owner, source), null);
      onSaved();
      router.replace(`${path}?order=${encodeURIComponent(order.id)}`);
    } catch (failure) {
      if (ownerRef.current !== requestOwner || abort.signal.aborted) return;
      setError(orderError(failure));
      if (orderWasRejected(failure)) {
        setPending(null);
        savePending(pendingKey(owner, source), null);
      }
    } finally {
      if (ownerRef.current === requestOwner && !abort.signal.aborted) {
        busy.current = false;
        setSubmitting(false);
      }
    }
  };

  const matchesOwner = scopeOwner === owner;
  return {
    receipt: matchesOwner ? receipt : null,
    pending: matchesOwner ? pending : null,
    error: matchesOwner ? error : '',
    submitting: matchesOwner && submitting,
    recovering: !matchesOwner || recovering,
    place,
  };
}
