'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { ProfileModal } from '@/components/accounts/profileModal';
import { CartLink } from '@/components/cart/cartLink';

const services = [
  { label: 'China Product Sourcing', href: '/services/china-product-sourcing' },
  { label: 'Supplier Verification', href: '/services/supplier-verification' },
  { label: 'Quality Control & Inspection', href: '/services/quality-control' },
  { label: 'Shipping & Door-to-Door Import', href: '/services/door-to-door-import' },
];

const links = [
  { label: 'Home', href: '/' },
  { label: 'Ready Stock', href: '/ready-stock' },
  { label: 'Projects', href: '/our-work' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const NavBar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  const close = () => {
    setMobileOpen(false);
    setServicesOpen(false);
  };
  const linkStyle = (href: string) =>
    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${active(href) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`;

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mobileOpen) menuButtonRef.current?.focus();
        else if (servicesOpen) servicesButtonRef.current?.focus();
        close();
      }
    };
    const onResize = () => close();
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen, servicesOpen]);

  const renderLink = (item: { label: string; href: string }) => (
    <Link
      key={item.href}
      href={item.href}
      className={linkStyle(item.href)}
      aria-current={active(item.href) ? 'page' : undefined}
      onClick={close}
    >
      {item.label}
    </Link>
  );

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white shadow-sm"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[90px] lg:px-8">
        <Link
          href="/"
          onClick={close}
          aria-label="RS Trade International home"
          className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-300"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 text-lg font-bold text-blue-800">
            RS
          </span>
          <span className="hidden leading-tight text-gray-900 sm:block lg:hidden xl:block">
            <span className="block text-lg font-bold">Trade</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-gray-600">
              International
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {links.slice(0, 1).map(renderLink)}
          <div className="relative">
            <button
              ref={servicesButtonRef}
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="desktop-services"
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`${linkStyle('/services')} flex items-center gap-1`}
            >
              Services{' '}
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {servicesOpen && (
              <div
                id="desktop-services"
                className="absolute left-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white p-2 text-gray-800 shadow-xl"
              >
                {services.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={`block rounded-lg px-4 py-3 text-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 ${pathname === item.href ? 'bg-blue-50 font-semibold text-blue-700' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {links.slice(1).map(renderLink)}
        </nav>

        <div className="flex items-center gap-2">
          <CartLink onNavigate={close} />
          <div className="hidden lg:block">
            <ProfileModal onNavigate={close} />
          </div>
          <Link
            href="/request-a-quote"
            onClick={close}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-yellow-300 px-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-4"
          >
            Request a Quote{' '}
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="hidden sm:block"
            />
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setServicesOpen(false);
            }}
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-800 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 lg:hidden"
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gray-200 bg-white px-4 py-4 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.slice(0, 1).map(renderLink)}
            <button
              type="button"
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
              aria-controls="mobile-services"
              className={`${linkStyle('/services')} flex min-h-11 items-center justify-between text-left`}
            >
              Services{' '}
              <ChevronDown
                size={18}
                aria-hidden="true"
                className={servicesOpen ? 'rotate-180' : ''}
              />
            </button>
            {servicesOpen && (
              <div
                id="mobile-services"
                className="ml-3 flex flex-col gap-1 border-l border-gray-200 pl-3"
              >
                {services.map(renderLink)}
              </div>
            )}
            {links.slice(1).map(renderLink)}
            <div className="mt-2 flex flex-col border-t border-gray-200 pt-2">
              <ProfileModal
                mobile
                onNavigate={close}
              />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
