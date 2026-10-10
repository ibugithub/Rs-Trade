'use client';

import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';
import { MAX_QUANTITY } from '@/configs/redux/cart/cartSlice';

export function QuantityInput({
  value,
  onChange,
  label = 'Quantity',
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="sr-only"
      >
        {label}
      </label>
      <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= 1}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="flex h-11 w-11 items-center justify-center rounded-l-lg hover:bg-blue-50 disabled:opacity-30"
        >
          <Minus
            size={16}
            aria-hidden="true"
          />
        </button>
        <input
          id={id}
          type="number"
          min={1}
          max={MAX_QUANTITY}
          step={1}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isInteger(next) && next >= 1 && next <= MAX_QUANTITY) onChange(next);
          }}
          className="h-11 w-20 border-x border-gray-200 text-center text-sm focus:outline-blue-600"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={value >= MAX_QUANTITY}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="flex h-11 w-11 items-center justify-center rounded-r-lg hover:bg-blue-50 disabled:opacity-30"
        >
          <Plus
            size={16}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
