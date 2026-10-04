import type { Metadata } from 'next';
import { Camera, Factory, PackageCheck, PackageSearch, ShieldCheck, Truck } from 'lucide-react';
import { ServicePage, type ServiceContent } from '@/components/services/servicePage';

export const metadata: Metadata = {
  title: 'Quality Control & Inspection in China | RS Trade International',
  description: 'Product quality, quantity and packaging checks in China with photo and video reporting. Discuss pre-shipment inspection with RS Trade International.',
};

const content: ServiceContent = {
  title: 'Quality Control & Inspection', slug: 'quality-control',
  eyebrow: 'Quality before shipment', action: 'Request an Inspection', icon: ShieldCheck,
  introduction: 'Know what is being shipped before it leaves China. RS Trade International checks product quality, quantities and packaging, with photo and video reporting to support shipment decisions.',
  asideTitle: 'Check the goods before they ship.',
  asideText: 'Share your product requirements, supplier location and shipment plans. We can discuss the inspection checks your order needs.',
  supportTitle: 'A dedicated service for your products.',
  supportText: 'Agree the inspection scope with our team, including the specifications, quantity and packaging requirements to check.',
  support: [
    { icon: ShieldCheck, title: 'Product inspection', text: 'Check the products against the agreed requirements and record relevant findings.' },
    { icon: PackageCheck, title: 'Quantity & packaging', text: 'Check ordered quantities and review packaging against the agreed shipment requirements.' },
    { icon: Camera, title: 'Photo & video reporting', text: 'Review inspection findings with photo and video evidence before discussing shipment approval.' },
  ],
  processTitle: 'Our six-step QC process.',
  process: [
    { title: 'Factory / supplier verification', text: 'Confirm the supplier and inspection location. Discuss whether a separate supplier verification service is needed.' },
    { title: 'Product inspection', text: 'Check products against the specifications and inspection scope agreed for your order.' },
    { title: 'Quantity check', text: 'Check the quantity against the order details using the agreed inspection approach.' },
    { title: 'Packaging check', text: 'Review packaging and relevant labeling against your agreed requirements.' },
    { title: 'Photo / video report', text: 'Document findings and share photo and video evidence for review.' },
    { title: 'Shipment approval', text: 'Review the findings and confirm the shipment decision with the responsible parties before proceeding.' },
  ],
  prepareTitle: 'Give us a clear picture of your order.',
  prepareText: 'Your product specifications and order details help define what should be inspected. Share any concerns or checks that are especially important to you.',
  requirements: ['Product description, specifications and reference photos', 'Ordered quantity and supplier contact details', 'Factory or inspection location in China', 'Packaging and labeling requirements', 'Expected readiness date and shipment plans'],
  note: 'Inspection scope, reporting arrangements, timing and costs are confirmed for each request.',
  related: [
    { icon: PackageSearch, title: 'China Product Sourcing', text: 'Find suitable products and suppliers for your requirements.', href: '/services/china-product-sourcing' },
    { icon: Factory, title: 'Supplier Verification', text: 'Review the business behind your product order.', href: '/services/supplier-verification' },
    { icon: Truck, title: 'Door-to-Door Import', text: 'Handle collection, shipping, customs and delivery after the agreed checks.', href: '/services/door-to-door-import' },
  ],
  faqs: [
    { question: 'Can I request QC without using your sourcing service?', answer: 'Yes. Share your supplier and product details so we can discuss inspection as a separate service.' },
    { question: 'Will I receive photos and videos?', answer: 'Photo and video reporting is part of our QC process. Confirm the specific reporting requirements with our team when agreeing the inspection scope.' },
    { question: 'Does inspection cover every product in the order?', answer: 'The inspection approach and coverage need to be agreed for your order. Do not assume every individual unit will be checked unless that is included in the confirmed scope.' },
    { question: 'What happens if an issue is found?', answer: 'The findings are reported for review. Discuss any required supplier follow-up and the shipment decision before proceeding.' },
    { question: 'Who approves shipment?', answer: 'The approval responsibilities and decision process are agreed for your order. Inspection findings support that decision; completing an inspection does not automatically approve shipment.' },
    { question: 'When should I arrange inspection?', answer: 'Contact us before the planned shipment and share when the goods will be ready. Timing and access arrangements are confirmed with the supplier and our team.' },
  ],
  closingTitle: 'Preparing a shipment from China?',
  closingText: 'Share your order details and inspection requirements. Let’s discuss the checks before your goods are shipped.',
};

export default function QualityControlPage() {
  return <ServicePage content={content} />;
}
