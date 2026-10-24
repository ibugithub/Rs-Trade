import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Factory, PackageCheck, ShieldCheck } from 'lucide-react';
import { ProjectGallery } from '@/components/projects/projectGallery';
import { CompanyFooter } from '@/components/footer/companyFooter';

export const metadata: Metadata = {
  title: 'Projects | RS Trade International',
  description:
    'Factory visits, product inspections and project stories from RS Trade International’s sourcing and trading activities in China.',
};

const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
const categories = [
  {
    icon: Factory,
    title: 'Factory Visits',
    text: 'A closer look at supplier locations and the conversations behind product sourcing.',
  },
  {
    icon: ShieldCheck,
    title: 'Product Inspections',
    text: 'Photos and stories from checks on product quality, quantities and packaging.',
  },
  {
    icon: PackageCheck,
    title: 'Completed Projects',
    text: 'The requirements, work carried out and outcomes of sourcing and import projects.',
  },
];

export default function ProjectsPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className={`${container} py-8 sm:py-12`}>
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex items-center gap-2 text-sm text-gray-600"
          >
            <Link
              href="/"
              className="hover:text-blue-700"
            >
              Home
            </Link>
            <ChevronRight
              size={14}
              aria-hidden="true"
            />
            <span
              aria-current="page"
              className="text-blue-700"
            >
              Projects
            </span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            The work behind the service
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Projects</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Explore factory visits, product inspections and sourcing stories from RS Trade
            International. A place for real photos, practical details and the work behind each
            project.
          </p>
          <a
            href="#project-stories"
            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            Explore project stories
            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </a>
        </div>
      </section>
      <div className={container}>
        <section
          className="grid gap-5 border-b border-gray-200 py-10 md:grid-cols-3"
          aria-label="Types of work"
        >
          {categories.map(({ title, text, icon: Icon }) => (
            <div
              key={title}
              className="rounded-xl border border-gray-200 p-6"
            >
              <Icon
                size={28}
                className="text-blue-700"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
            </div>
          ))}
        </section>
        <ProjectGallery />
      </div>
      <section className="border-t border-gray-200 bg-blue-50">
        <div
          className={`${container} flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-center`}
        >
          <div>
            <h2 className="text-3xl font-bold">Have a project of your own?</h2>
            <p className="mt-3 max-w-xl leading-7 text-gray-600">
              Explore our services or prepare your requirements using the quotation form.
            </p>
          </div>
          <Link
            href="/request-a-quote"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-yellow-300 px-5 py-3 text-sm font-semibold hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            Request a Quote
            <ArrowRight
              size={18}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
      <CompanyFooter />
    </main>
  );
}
