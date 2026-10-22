'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { validatePhoneNumber } from '@/lib/phoneNumber';
import {
  inquiryError,
  sendServiceInquiry,
  type ServiceInquiry,
  type InquiryReceipt,
} from '@/lib/serviceRequestsApi';

const services = [
  { value: 'china-product-sourcing', label: 'China Product Sourcing' },
  { value: 'supplier-verification', label: 'Supplier Verification' },
  { value: 'quality-control', label: 'Quality Control & Inspection' },
  { value: 'door-to-door-import', label: 'Shipping & Door-to-Door Import' },
];
const empty = {
  name: '',
  phone: '',
  email: '',
  company: '',
  description: '',
  quantity: '',
  reference_url: '',
  destination: '',
};
type Fields = typeof empty;
const inputStyle =
  'mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50';

export function QuoteForm() {
  const params = useSearchParams();
  const preselected = params.get('service');
  const [selected, setSelected] = useState<string[]>([]);
  const [fields, setFields] = useState<Fields>(empty);
  const [sending, setSending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<InquiryReceipt | null>(null);
  const pending = useRef<ServiceInquiry | null>(null);
  const busy = useRef(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    setError('');
    if (!pending.current) {
      const phone = validatePhoneNumber(fields.phone);
      if (phone.error) {
        setError(phone.error);
        document.getElementById('quote-phone')?.focus();
        return;
      }
      pending.current = {
        ...fields,
        phone: phone.number,
        services: selected,
        requestId: crypto.randomUUID(),
        source_page: services.some((service) => service.value === preselected)
          ? `/services/${preselected}/`
          : '/request-a-quote/',
      };
    }
    const controller = new AbortController();
    request.current = controller;
    busy.current = true;
    setSending(true);
    try {
      const result = await sendServiceInquiry(pending.current, controller.signal);
      if (controller.signal.aborted) return;
      setReceipt(result);
      pending.current = null;
      setUncertain(false);
    } catch (failure) {
      if (controller.signal.aborted) return;
      const rejected =
        axios.isAxiosError(failure) && !!failure.response && failure.response.status < 500;
      if (rejected) pending.current = null;
      setUncertain(!rejected);
      setError(inquiryError(failure));
    } finally {
      busy.current = false;
      if (!controller.signal.aborted) setSending(false);
    }
  }

  useEffect(() => {
    setSelected(services.some((service) => service.value === preselected) ? [preselected!] : []);
  }, [preselected]);

  const change = (key: keyof Fields, value: string) =>
    setFields((current) => ({ ...current, [key]: value }));
  const toggle = (value: string) =>
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );

  const field = (
    key: keyof Fields,
    label: string,
    options: {
      required?: boolean;
      type?: string;
      maxLength: number;
      autoComplete?: string;
      placeholder?: string;
    },
  ) => (
    <div>
      <label
        htmlFor={`quote-${key}`}
        className="text-sm font-semibold"
      >
        {label}
        {options.required ? ' *' : ' (optional)'}
      </label>
      <input
        id={`quote-${key}`}
        name={key}
        type={options.type || 'text'}
        required={options.required}
        maxLength={options.maxLength}
        autoComplete={options.autoComplete}
        placeholder={options.placeholder}
        value={fields[key]}
        onChange={(event) => change(key, event.target.value)}
        className={inputStyle}
      />
    </div>
  );

  if (receipt)
    return (
      <section
        aria-labelledby="inquiry-received-title"
        className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
      >
        <CheckCircle2
          size={40}
          className="text-green-600"
          aria-hidden="true"
        />
        <p className="mt-5 text-sm font-semibold text-blue-700">Request {receipt.number}</p>
        <h2
          id="inquiry-received-title"
          className="mt-2 text-2xl font-bold"
        >
          Your inquiry has been received
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          Our team will contact you using the details you provided to discuss your requirements and
          quotation.
        </p>
        <p className="mt-4 text-sm font-semibold">
          {receipt.services.join(' ? ') || 'General inquiry'}
        </p>
        <p className="mt-4 text-sm leading-6 text-gray-500">
          Keep your reference number for follow-up. This is an inquiry; no order or payment has been
          created.
        </p>
        <button
          type="button"
          onClick={() => {
            setReceipt(null);
            setFields(empty);
            setError('');
          }}
          className="mt-6 min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          Send another inquiry
        </button>
      </section>
    );

  return (
    <form
      onSubmit={submit}
      aria-busy={sending}
      className="min-w-0"
    >
      <fieldset disabled={sending || uncertain}>
        <legend className="text-xl font-bold">Which services do you need?</legend>
        <p className="mt-2 text-sm leading-7 text-gray-600">
          Select one or more. If you are unsure, leave these unchecked and describe your needs
          below.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <label
              key={service.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${selected.includes(service.value) ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
            >
              <input
                type="checkbox"
                name="services"
                value={service.value}
                checked={selected.includes(service.value)}
                onChange={() => toggle(service.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-blue-700"
              />
              <span className="font-medium">{service.label}</span>
            </label>
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {field('name', 'Your name', { required: true, maxLength: 120, autoComplete: 'name' })}
          {field('phone', 'Phone / WhatsApp', {
            required: true,
            type: 'tel',
            maxLength: 30,
            autoComplete: 'tel',
            placeholder: 'Include your country code',
          })}
          {field('email', 'Email', { type: 'email', maxLength: 254, autoComplete: 'email' })}
          {field('company', 'Company name', { maxLength: 180, autoComplete: 'organization' })}
          {field('quantity', 'Estimated quantity', {
            maxLength: 100,
            placeholder: 'For example: 100 pieces',
          })}
          {field('destination', 'Delivery destination', {
            maxLength: 255,
            placeholder: 'City or area in Bangladesh',
          })}
        </div>
        <div className="mt-6">
          {field('reference_url', 'Product / supplier link', {
            type: 'url',
            maxLength: 1000,
            placeholder: 'https://',
          })}
        </div>
        <div className="mt-6">
          <label
            htmlFor="quote-description"
            className="text-sm font-semibold"
          >
            Describe your requirements *
          </label>
          <textarea
            id="quote-description"
            name="description"
            required
            maxLength={5000}
            rows={6}
            value={fields.description}
            onChange={(event) => change('description', event.target.value)}
            placeholder="Tell us about your product, supplier, inspection or shipment. Include any important specifications."
            className={inputStyle}
          />
        </div>
        <p
          id="quote-submit-notice"
          className="mt-5 text-sm leading-7 text-gray-600"
        >
          Our team uses these details to contact you about your inquiry. Required fields are marked
          with *.
        </p>
      </fieldset>
      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
        >
          {error}
        </p>
      )}
      {uncertain && (
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Your details are kept unchanged for this retry to prevent duplicate inquiries.
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        aria-describedby="quote-submit-notice"
        className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-yellow-300 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? 'Sending...' : uncertain ? 'Retry inquiry' : 'Send Inquiry'}
        {sending ? (
          <LoaderCircle
            size={18}
            className="motion-safe:animate-spin"
            aria-hidden="true"
          />
        ) : (
          <ArrowRight
            size={18}
            aria-hidden="true"
          />
        )}
      </button>
    </form>
  );
}
