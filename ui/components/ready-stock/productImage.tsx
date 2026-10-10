'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch';

function ZoomControls({ scale, reducedMotion }: { scale: number; reducedMotion: boolean }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const duration = reducedMotion ? 0 : 180;
  const buttonStyle =
    'flex h-11 items-center justify-center rounded-xl border border-white/20 px-3 text-white hover:bg-white/10 focus-visible:outline-yellow-400 disabled:opacity-30';

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => zoomOut(0.5, duration)}
        disabled={scale <= 1.01}
        aria-label="Zoom out"
        className={buttonStyle}
      >
        <ZoomOut
          size={20}
          aria-hidden="true"
        />
      </button>
      <output className="w-14 text-center text-sm tabular-nums text-white">
        {Math.round(scale * 100)}%
      </output>
      <button
        type="button"
        onClick={() => zoomIn(0.5, duration)}
        disabled={scale >= 3.99}
        aria-label="Zoom in"
        className={buttonStyle}
      >
        <ZoomIn
          size={20}
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        onClick={() => resetTransform(duration)}
        className={buttonStyle}
      >
        <RotateCcw
          size={16}
          aria-hidden="true"
          className="mr-2"
        />
        Reset
      </button>
    </div>
  );
}

export function ProductImage({ src, name }: { src: string; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!open) return;
    const viewer = dialog.current;
    viewer?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      viewer?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function magnifyAtPointer(event: PointerEvent<HTMLButtonElement>) {
    if (
      event.pointerType !== 'mouse' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setHoverPoint({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  }

  return (
    <>
      <button
        type="button"
        onPointerMove={magnifyAtPointer}
        onPointerLeave={() => setHoverPoint(null)}
        onBlur={() => setHoverPoint(null)}
        onClick={() => {
          setHoverPoint(null);
          setScale(1);
          setOpen(true);
        }}
        aria-label={`Open full-screen image of ${name}`}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-gray-200 bg-white focus-visible:outline-blue-600"
      >
        <Image
          src={src}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-8 sm:p-12"
          style={{
            transform: hoverPoint ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: hoverPoint ? `${hoverPoint.x}% ${hoverPoint.y}%` : 'center',
          }}
        />
        <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 text-xs text-gray-600">
          <ZoomIn
            size={16}
            aria-hidden="true"
          />
          View full screen
        </span>
      </button>
      <p className="mt-3 text-center text-xs text-gray-500">
        Hover to zoom. Tap or click for a closer look.
      </p>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        aria-labelledby="product-image-title"
        aria-describedby="product-image-help"
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-gray-950 p-0 text-white backdrop:bg-gray-950"
      >
        <header className="flex h-20 items-center justify-between gap-4 border-b border-white/10 px-5 sm:px-8">
          <h2
            id="product-image-title"
            className="truncate text-sm font-semibold sm:text-base"
          >
            {name}
          </h2>
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
            aria-label="Close image viewer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 focus-visible:outline-yellow-400"
          >
            <X
              size={22}
              aria-hidden="true"
            />
          </button>
        </header>
        {open && (
          <TransformWrapper
            minScale={1}
            maxScale={4}
            centerOnInit
            onTransform={(_, state) => setScale(state.scale)}
            doubleClick={{ mode: 'toggle', step: 1.5, animationTime: reducedMotion ? 0 : 180 }}
            keyboard={{ disabled: false, animationTime: reducedMotion ? 0 : 180 }}
            zoomAnimation={{ disabled: reducedMotion }}
            velocityAnimation={{ disabled: reducedMotion }}
          >
            <div className="h-[calc(100dvh-12rem)] min-h-0">
              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%', touchAction: 'none' }}
                contentStyle={{ width: '100%', height: '100%' }}
                wrapperClass="cursor-grab active:cursor-grabbing"
              >
                <div className="relative h-full w-full select-none">
                  <Image
                    src={src}
                    alt={`${name}, enlarged`}
                    fill
                    sizes="100vw"
                    draggable={false}
                    className="pointer-events-none object-contain p-4 sm:p-8"
                  />
                </div>
              </TransformComponent>
            </div>
            <footer className="flex h-28 flex-col justify-center gap-3 border-t border-white/10 px-4">
              <ZoomControls
                scale={scale}
                reducedMotion={reducedMotion}
              />
              <p
                id="product-image-help"
                className="text-center text-xs text-gray-300"
              >
                Scroll or pinch to zoom. Drag to explore. Double-tap to zoom or reset.
              </p>
            </footer>
          </TransformWrapper>
        )}
      </dialog>
    </>
  );
}
