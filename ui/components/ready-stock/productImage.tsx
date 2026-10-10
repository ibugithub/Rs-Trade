'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

export function ProductImage({ src, name }: { src: string; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setZoom(1);
          setOpen(true);
        }}
        aria-label={`Enlarge ${name} image`}
        className="relative block aspect-square w-full rounded-2xl border border-gray-200 bg-white focus-visible:outline-blue-600"
      >
        <Image
          src={src}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-8 sm:p-12"
        />
        <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
          <ZoomIn
            size={16}
            aria-hidden="true"
          />
          Zoom image
        </span>
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">
        Click or tap the image to take a closer look.
      </p>
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        aria-labelledby="product-image-title"
        className="max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-4xl overflow-hidden rounded-2xl bg-white p-0 shadow-xl backdrop:bg-gray-950/60"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-4">
          <h2
            id="product-image-title"
            className="truncate text-sm font-semibold"
          >
            {name}
          </h2>
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
            aria-label="Close image"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-gray-50"
          >
            <X
              size={20}
              aria-hidden="true"
            />
          </button>
        </div>
        <div
          className="h-[55dvh] overflow-auto bg-gray-50"
          tabIndex={0}
          aria-label="Enlarged product image. Scroll to view the zoomed image."
        >
          <div
            className="relative min-h-full"
            style={{ width: `${zoom * 100}%`, height: `${zoom * 55}dvh` }}
          >
            <Image
              src={src}
              alt={`${name}, enlarged`}
              fill
              sizes="1500px"
              className="object-contain p-4"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={() => setZoom((value) => value - 0.5)}
            disabled={zoom <= 1}
            aria-label="Zoom out"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30"
          >
            <ZoomOut
              size={19}
              aria-hidden="true"
            />
          </button>
          <span
            aria-live="polite"
            className="w-12 text-center text-sm"
          >
            {zoom * 100}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((value) => value + 0.5)}
            disabled={zoom >= 3}
            aria-label="Zoom in"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30"
          >
            <ZoomIn
              size={19}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="min-h-11 rounded-lg px-3 text-sm text-blue-700 hover:bg-blue-50"
          >
            Reset
          </button>
          <p className="w-full text-center text-xs text-gray-500">
            Scroll or swipe to explore the enlarged image.
          </p>
        </div>
      </dialog>
    </>
  );
}
