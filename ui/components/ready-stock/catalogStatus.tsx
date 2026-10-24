'use client';

import { LoaderCircle } from 'lucide-react';

export function CatalogStatus({
  loading,
  message,
  onRetry,
}: {
  loading?: boolean;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="my-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600"
      role={loading ? 'status' : 'alert'}
    >
      <p className="flex items-center gap-3">
        {loading && (
          <LoaderCircle
            size={18}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
        )}
        {message}
      </p>
      {!loading && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-11 rounded-lg bg-yellow-300 px-5 font-semibold text-gray-900"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
