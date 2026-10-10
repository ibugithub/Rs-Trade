import type { Metadata } from 'next';
import {
  ClipboardCheck,
  Factory,
  FileText,
  Package,
  PackageSearch,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { ServicePage, type ServiceContent } from '@/components/services/servicePage';

export const metadata: Metadata = {
  title: 'China to Bangladesh Door-to-Door Import | RS Trade International',
  description:
    'Complete door-to-door import support from China to Bangladesh, including collection, shipping, documentation, customs formalities and final delivery.',
};

const content: ServiceContent = {
  title: 'Shipping & Door-to-Door Import',
  slug: 'door-to-door-import',
  eyebrow: 'From China to your address in Bangladesh',
  action: 'Request an Import Quote',
  icon: Truck,
  introduction:
    'One team to coordinate the full journey. RS Trade International handles collection in China, shipping, required documentation, customs formalities and final delivery to your address in Bangladesh.',
  asideTitle: 'Complete door-to-door support.',
  asideText:
    'Send your product details, supplier location and delivery address. We handle the necessary requirements and confirm the arrangements for your shipment.',
  supportTitle: 'Support from collection to delivery.',
  supportText:
    'We manage the full process. The quotation confirms the shipment arrangements, applicable costs and what is included.',
  support: [
    {
      icon: Package,
      title: 'Supplier collection',
      text: 'Coordinate collection from your supplier in China according to the agreed shipment arrangements.',
    },
    {
      icon: Truck,
      title: 'International shipping',
      text: 'Arrange shipping from China to Bangladesh for your confirmed product and shipment requirements.',
    },
    {
      icon: FileText,
      title: 'Required documentation',
      text: 'Handle the required shipping documentation and coordinate necessary information with the supplier and customer.',
    },
    {
      icon: ClipboardCheck,
      title: 'Customs clearance',
      text: 'Handle customs clearance and the necessary import formalities in Bangladesh.',
    },
    {
      icon: FileText,
      title: 'Duty & tax formalities',
      text: 'Handle applicable duty and tax formalities. The quotation clarifies how these costs are charged.',
    },
    {
      icon: Truck,
      title: 'Final delivery',
      text: 'Arrange delivery to the agreed customer address in Bangladesh.',
    },
  ],
  processTitle: 'From shipment details to your doorstep.',
  process: [
    {
      title: 'Share shipment details',
      text: 'Send the product, quantity, supplier location and delivery destination.',
    },
    {
      title: 'Confirm the quotation',
      text: 'Agree shipping arrangements, cost inclusions and expected timing before proceeding.',
    },
    {
      title: 'Collect the goods',
      text: 'Coordinate supplier readiness, collection and required documentation.',
    },
    {
      title: 'Ship to Bangladesh',
      text: 'Arrange the international shipment according to the confirmed plan.',
    },
    {
      title: 'Complete clearance',
      text: 'Handle customs clearance and applicable duty/tax formalities.',
    },
    {
      title: 'Deliver to your address',
      text: 'Coordinate final delivery to the agreed destination.',
    },
  ],
  prepareTitle: 'Help us understand your shipment.',
  prepareText:
    'Start with the information you have. Product details, shipment size and collection and delivery locations help us discuss an appropriate quotation.',
  requirements: [
    'Product description or reference link',
    'Quantity, weight and package dimensions, if available',
    'Supplier contact and collection location in China',
    'Delivery address or area in Bangladesh',
    'Goods readiness date and relevant documents, if available',
  ],
  note: 'Delivery coverage, product eligibility, costs and expected timelines are confirmed for each shipment. Full handling does not mean every cost is included in an advertised price.',
  related: [
    {
      icon: PackageSearch,
      title: 'China Product Sourcing',
      text: 'Find suitable products and suppliers before arranging import.',
      href: '/services/china-product-sourcing',
    },
    {
      icon: Factory,
      title: 'Supplier Verification',
      text: 'Review supplier information before committing to an order.',
      href: '/services/supplier-verification',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Control & Inspection',
      text: 'Check goods, quantities and packaging before shipping.',
      href: '/services/quality-control',
    },
  ],
  faqs: [
    {
      question: 'Do you handle the full door-to-door process?',
      answer:
        'Yes. We handle collection, shipping, required documentation, customs clearance, applicable duty/tax formalities and final delivery from China to the agreed address in Bangladesh.',
    },
    {
      question: 'Are duties and taxes included in the quoted price?',
      answer:
        'Cost inclusions must be confirmed in your quotation. We handle the formalities, but that does not mean every advertised price includes all duties, taxes and other shipment costs.',
    },
    {
      question: 'Can you ship from a supplier I already use?',
      answer:
        'Share the supplier location, product details and shipment information so we can confirm the collection and import arrangements.',
    },
    {
      question: 'How long does delivery take?',
      answer:
        'The expected timeline depends on the shipment arrangements, goods readiness, clearance and delivery destination. Confirm the expected timing with our team; no fixed timeline is stated for every shipment.',
    },
    {
      question: 'Can you import any type of product?',
      answer:
        'Product eligibility and any restrictions need to be checked before accepting the shipment. Share clear product details so our team can confirm whether the service is suitable.',
    },
    {
      question: 'Can I arrange inspection before shipping?',
      answer:
        'Yes. Quality Control & Inspection is a separate service that can be discussed before collection and shipment. Confirm the checks and timing with our team.',
    },
  ],
  closingTitle: 'Ready to discuss your import?',
  closingText:
    'Tell us what you are shipping and where it needs to go. Let’s confirm the arrangements from China to Bangladesh.',
};

export default function DoorToDoorImportPage() {
  return <ServicePage content={content} />;
}
