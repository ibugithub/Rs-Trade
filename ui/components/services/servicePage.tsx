import Link from 'next/link';
import { ArrowRight, Check, ChevronRight, type LucideIcon } from 'lucide-react';
import { CompanyFooter } from '@/components/footer/companyFooter';

type Card = { title: string; text: string; icon: LucideIcon };
export type ServiceContent = {
  title: string;
  slug: string;
  eyebrow: string;
  introduction: string;
  action: string;
  icon: LucideIcon;
  asideTitle: string;
  asideText: string;
  supportTitle: string;
  supportText: string;
  support: Card[];
  processTitle: string;
  process: { title: string; text: string }[];
  prepareTitle: string;
  prepareText: string;
  requirements: string[];
  note: string;
  related: (Card & { href: string })[];
  faqs: { question: string; answer: string }[];
  closingTitle: string;
  closingText: string;
};
const container = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
const button =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600';

export function ServicePage({ content }: { content: ServiceContent }) {
  const Icon = content.icon;
  const quoteLink = `/request-a-quote?service=${content.slug}`;
  const inquiry = (
    <Link
      href={quoteLink}
      className={`${button} shrink-0 bg-yellow-300 text-gray-900 hover:bg-yellow-500`}
    >
      {content.action}
      <ArrowRight
        size={18}
        aria-hidden="true"
      />
    </Link>
  );
  return (
    <main className="bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gray-50">
        <div className={`${container} py-8 sm:py-12`}>
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-600"
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
            <Link
              href="/#services"
              className="hover:text-blue-700"
            >
              Services
            </Link>
            <ChevronRight
              size={14}
              aria-hidden="true"
            />
            <span
              aria-current="page"
              className="text-blue-700"
            >
              {content.title}
            </span>
          </nav>
          <div className="grid items-center gap-10 pb-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                {content.eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                {content.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                {content.introduction}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {inquiry}
                <a
                  href="#service-process"
                  className={`${button} border border-gray-300 bg-white text-blue-700 hover:bg-blue-50`}
                >
                  How it works
                </a>
              </div>
            </div>
            <aside
              className="rounded-2xl border border-gray-200 bg-white p-7 sm:p-8"
              aria-label="Getting started"
            >
              <Icon
                size={32}
                className="text-blue-700"
                aria-hidden="true"
              />
              <h2 className="mt-5 text-2xl font-bold">{content.asideTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">{content.asideText}</p>
              <div className="mt-6 border-t border-gray-200 pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  The wider journey
                </p>
                <p className="mt-2 text-sm font-semibold text-blue-700">
                  Source → Verify → QC → Ship → Deliver
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        className={`${container} py-14 sm:py-20`}
        aria-labelledby="support-title"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          What we help with
        </p>
        <h2
          id="support-title"
          className="mt-3 text-3xl font-bold tracking-tight"
        >
          {content.supportTitle}
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-gray-600">{content.supportText}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.support.map(({ title, text, icon: CardIcon }) => (
            <article
              key={title}
              className="rounded-2xl border border-gray-200 p-6"
            >
              <CardIcon
                size={28}
                className="text-blue-700"
                aria-hidden="true"
              />
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="service-process"
        className="scroll-mt-28 border-y border-gray-200 bg-gray-50 py-14 sm:py-20"
        aria-labelledby="process-title"
      >
        <div className={container}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">How it works</p>
          <h2
            id="process-title"
            className="mt-3 text-3xl font-bold tracking-tight"
          >
            {content.processTitle}
          </h2>
          <ol className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {content.process.map(({ title, text }, index) => (
              <li key={title}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className={`${container} grid gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16`}
        aria-labelledby="prepare-title"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Before you inquire
          </p>
          <h2
            id="prepare-title"
            className="mt-3 text-3xl font-bold tracking-tight"
          >
            {content.prepareTitle}
          </h2>
          <p className="mt-5 max-w-lg leading-7 text-gray-600">{content.prepareText}</p>
          <p className="mt-4 text-sm leading-7 text-gray-500">{content.note}</p>
        </div>
        <ul className="space-y-3">
          {content.requirements.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-gray-200 p-4"
            >
              <Check
                size={20}
                className="mt-0.5 shrink-0 text-blue-700"
                aria-hidden="true"
              />
              <span className="text-sm leading-6">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="border-y border-gray-200 bg-gray-50 py-14 sm:py-20"
        aria-labelledby="related-title"
      >
        <div className={container}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Related services
          </p>
          <h2
            id="related-title"
            className="mt-3 text-3xl font-bold tracking-tight"
          >
            Support for the rest of your order.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {content.related.map(({ title, text, href, icon: CardIcon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <CardIcon
                  size={26}
                  className="text-blue-700"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-lg font-bold group-hover:text-blue-700">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  Explore service{' '}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${container} grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-16`}
        aria-labelledby="faq-title"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            Common questions
          </p>
          <h2
            id="faq-title"
            className="mt-3 text-3xl font-bold tracking-tight"
          >
            Before you get started.
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {content.faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="py-5 first:pt-0"
            >
              <summary className="cursor-pointer text-lg font-semibold focus-visible:outline-blue-600">
                {question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-gray-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-blue-50">
        <div
          className={`${container} flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-center`}
        >
          <div>
            <h2 className="text-3xl font-bold">{content.closingTitle}</h2>
            <p className="mt-3 max-w-xl leading-7 text-gray-600">{content.closingText}</p>
          </div>
          {inquiry}
        </div>
      </section>
      <CompanyFooter />
    </main>
  );
}
