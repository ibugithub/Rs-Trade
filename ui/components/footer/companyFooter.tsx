import Link from 'next/link';

export function CompanyFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="text-lg font-bold text-white">RS Trade International</Link>
          <p className="mt-3 max-w-md text-sm leading-6">China product sourcing, supplier verification, quality control and door-to-door import support.</p>
        </div>
        <nav aria-label="Company footer" className="flex flex-wrap items-start gap-x-6 gap-y-3 text-sm">
          <Link href="/#services" className="hover:text-white">Our Services</Link>
          <Link href="/ready-stock" className="hover:text-white">Ready Stock</Link>
          <Link href="/request-a-quote" className="hover:text-white">Request a Quote</Link>
        </nav>
      </div>
    </footer>
  );
}
