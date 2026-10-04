# RS Trade International website restructuring

## Confirmed business direction

- Audience: wholesalers, importers, small businesses and individual buyers.
- Main website language: English.
- Website: sourcing and trading company corporate website with a small Ready Stock store.
- Services: China Product Sourcing, Supplier Verification, Quality Control & Inspection, and Shipping & Door-to-Door Import.
- Ready Stock: initially 5–10 selected products; orders confirmed through WhatsApp or phone. No online payment integration in the current scope.
- Core journey: Source → Verify → QC → Ship → Deliver.
- Trust content must use genuine company information, factory visits, inspections, projects and customer feedback.

## Shipping & Door-to-Door Import

Confirmed by the owner on 2026-10-04: RS Trade International will provide the full door-to-door service and handle all necessary requirements throughout the process.

For the planned China-to-Bangladesh service, this includes coordinating supplier collection in China, required shipping documentation, international shipping, customs clearance and applicable duty/tax formalities, and final delivery to the customer's address in Bangladesh.

Suggested website wording:

> Complete door-to-door import support from China to Bangladesh. We handle collection, shipping, required documentation, customs clearance and final delivery to your address.

Handling the full process does not establish that all costs are included in a single advertised price. Quotation inclusions, payment terms, delivery timelines, geographic coverage and product restrictions still need to be confirmed before publishing detailed terms.

## Planned sitemap

Items marked `section` belong inside their parent page; they are not separate pages.

```text
RS Trade International
|
+-- Home
|   +-- Hero & Inquiry Buttons                      [section]
|   +-- Our Services                                [section]
|   +-- How We Work                                 [section]
|   +-- Our QC Process                              [section]
|   +-- Our Presence in China                       [section]
|   +-- Door-to-Door Import                         [section]
|   +-- Featured Ready Stock                       [section]
|   +-- Completed Projects / Testimonials          [section]
|   +-- Frequently Asked Questions                 [section]
|   +-- Request a Quote                            [section]
+-- About Us
|   +-- Company Introduction                       [section]
|   +-- Our Presence in China                      [section]
|   +-- Team & Office Information                  [section]
|   +-- Business Credentials                       [section]
+-- Services (Services Overview)
|   +-- China Product Sourcing
|   +-- Supplier Verification
|   +-- Quality Control & Inspection
|   +-- Shipping & Door-to-Door Import
+-- Ready Stock (Product Listing)
|   +-- Individual Product Pages
|       +-- Photos & Description                   [section]
|       +-- Specifications                         [section]
|       +-- MOQ, Price & Available Quantity        [section]
|       +-- Delivery Information                   [section]
|       +-- WhatsApp / Phone Inquiry               [action]
+-- Our Work
|   +-- Factory Visits                             [section/filter]
|   +-- Product Inspections                        [section/filter]
|   +-- Completed Projects                         [section/filter]
|   +-- Individual Project Pages
+-- FAQ
|   +-- Sourcing & Supplier Verification           [section]
|   +-- Quality Control                            [section]
|   +-- Shipping & Door-to-Door Import             [section]
|   +-- Ready Stock & Ordering                     [section]
+-- Contact
|   +-- Office Information                        [section]
|   +-- Phone, WhatsApp & Email                    [section]
|   +-- Inquiry / Request a Quote Link             [action]
+-- Request a Quote
|   +-- Service / Product Inquiry Form             [section]
+-- Policies                                      [footer grouping]
    +-- Privacy Policy
    +-- Terms
        +-- Service Terms                          [section]
        +-- Ready Stock Order Terms                [section]
        +-- Applicable Cancellation, Return
            & Refund Terms                         [section]
```

Main navigation: **Home / About Us / Services / Ready Stock / Our Work / Contact / Request a Quote**.

Footer links include FAQ, Privacy Policy, Terms and contact details. The sitemap contains 14 fixed public pages, plus individual product and project pages. Policies is a grouping, not an additional page. Evidence sections will appear when genuine content is available. Orders are confirmed through WhatsApp or phone without online payment or mandatory registration.

### Page summary

- Home
- About Us
- Services
  - China Product Sourcing
  - Supplier Verification
  - Quality Control & Inspection
  - Shipping & Door-to-Door Import
- Ready Stock and individual product pages
- Our Work and project details
- FAQ
- Contact
- Request a Quote
- Privacy Policy and applicable service / ready-stock terms

## Implementation sequence

1. Audit existing features and finalize page content requirements.
2. Design mobile and desktop layouts.
3. Add product fields, inquiry storage and content administration to Django.
4. Restructure the Next.js frontend around services and inquiries.
5. Verify customer journeys, mobile layouts, forms and production builds.
6. Prepare SEO, analytics, hosting security, backups and redirects.
7. Publish after approval and hand over content-management instructions.

## Full restructuring roadmap

Updated: 2026-10-04 (Asia/Dhaka). This document records confirmed decisions and proposed implementation work; it does not indicate that implementation is complete.

### Website goals and customer journeys

The website's primary purpose is to explain RS Trade's services, establish trust and generate inquiries. Visitors include wholesalers, importers, small businesses, Facebook sellers and individual buyers.

| Need | Journey |
| --- | --- |
| Source products | Home / sourcing page -> Request a Quote -> team follow-up -> quotation |
| Verify suppliers | Verification page -> inquiry with supplier details -> team follow-up |
| Inspect products | QC page -> inquiry with inspection requirements -> team follow-up |
| Import door-to-door | Shipping page -> inquiry -> scope and quotation confirmation |
| Buy Ready Stock | Product listing -> product details -> WhatsApp / phone -> team confirms order |
| Evaluate the company | About / Our Work -> genuine evidence -> service or product inquiry |

All journeys should work on mobile without requiring registration.

### Detailed sitemap and proposed routes

| Page | Proposed route | Content |
| --- | --- | --- |
| Home | `/` | Services, workflow, evidence, products and inquiry |
| About Us | `/about` | Company introduction, China presence, offices and credentials |
| Services overview | `/services` | Overview of all four services |
| China Product Sourcing | `/services/china-product-sourcing` | Product/supplier sourcing and purchasing support |
| Supplier Verification | `/services/supplier-verification` | Supplier identity, capability and credibility checks |
| Quality Control & Inspection | `/services/quality-control` | Inspections, checks, reports and approval process |
| Shipping & Door-to-Door Import | `/services/door-to-door-import` | Full China-to-Bangladesh process |
| Ready Stock | `/ready-stock` | Initially 5-10 selected products |
| Product details | `/ready-stock/[slug]` | Product information and inquiry actions |
| Our Work | `/our-work` | Factory visits, inspections and completed projects |
| Project details | `/our-work/[slug]` | Approved individual project stories |
| FAQ | `/faq` | Service and ordering questions |
| Contact | `/contact` | Phone, WhatsApp, email and offices |
| Request a Quote | `/request-a-quote` | Structured inquiry form |
| Privacy Policy | `/privacy-policy` | Actual data handling practices |
| Terms | `/terms` | Applicable service and ready-stock terms |

About Us topics can be sections on one page. Factory visits and inspections can initially be sections or filters within Our Work. Final routes must account for existing URLs and redirects.

Desktop navigation: **Home / About / Services / Ready Stock / Our Work / Contact / Request a Quote**.

Footer: FAQ, policies, company/contact details and relevant page links. Mobile navigation should make quotation requests and WhatsApp easy to reach.

### Homepage layout

| Order | Section | Purpose |
| --- | --- | --- |
| 1 | Hero | Explain the business immediately; Request a Quote and Browse Ready Stock |
| 2 | Main services | Introduce all four services with detail-page links |
| 3 | How We Work | Source -> Verify -> QC -> Ship -> Deliver |
| 4 | QC Process | Explain checks, reports and shipment approval |
| 5 | China Presence / Our Work | Show genuine visits and inspection evidence |
| 6 | Door-to-Door Support | Explain complete import support |
| 7 | Selected Ready Stock | Display a small featured selection |
| 8 | Completed Projects / Testimonials | Publish genuine, approved evidence when available |
| 9 | FAQ | Address common questions |
| 10 | Final inquiry | Invite customers to describe requirements |
| 11 | Footer | Company information, contacts and policies |

Suggested hero:

> **Source Products from China with Confidence**
>
> Product sourcing, supplier verification, quality inspection and door-to-door import support for customers in Bangladesh.

Primary button: **Request a Quote**. Secondary button: **Browse Ready Stock**. WhatsApp remains accessible throughout the website.

### Service page template and QC details

Each service page explains what it does, who it helps, what customers must provide, what RS Trade handles, the process, actual deliverables, relevant evidence, FAQs and a service-specific inquiry action.

QC must have its own page and homepage section. Planned process:

1. Factory / supplier verification.
2. Product inspection.
3. Quantity check.
4. Packaging check.
5. Photo / video report.
6. Shipment approval.

Use actual inspection media and appropriate report examples. Final service terms should clarify inspection scope and approval responsibilities.

Full door-to-door responsibilities are confirmed in the earlier section. Pricing inclusions, timelines, delivery coverage and product restrictions remain pending; do not publish unsupported guarantees.

### Other page content

- **About Us:** approved company introduction, China presence, offices, team information where available and relevant trade license details.
- **Our Work:** real factory visits, inspection media and completed projects. Project pages describe work performed and approved outcomes. Obtain permission before naming customers or publishing their feedback.
- **Contact:** confirmed phone, WhatsApp, email, office addresses and business hours if supplied.
- **FAQ:** sourcing, MOQ, verification, QC, shipping and ordering answers based on actual operations.
- **Policies:** match actual data handling and service/order responsibilities. Confirm applicable cancellation, return and refund arrangements before publication.

Do not invent testimonials, customer counts, project statistics, credentials, partners or operational images. Withhold evidence sections until genuine content is available.

### Ready Stock experience

Product listing cards show image, name, price or Request Price, MOQ and availability. Add category filtering only if useful for the initial products.

Each product detail page includes:

- Real photos, short description and relevant specifications.
- MOQ and available quantity.
- Price or Request Price.
- Delivery information.
- Inquire on WhatsApp and Call to Order actions.
- Optional website inquiry through the shared form.

WhatsApp messages include product name and URL. Website inquiries preselect the product. Your team confirms availability, final price and delivery before confirming an order.

No online payment is included. Registration and checkout are outside the new main customer journey. Audit existing cart, checkout and account dependencies before changing routes or navigation.

### Inquiry form and administration

| Field | Requirement |
| --- | --- |
| Name | Required |
| Phone / WhatsApp | Required |
| Service needed | Required for service inquiries |
| Product / requirement description | Required |
| Quantity | Optional |
| Product / supplier link | Optional |
| Email | Optional |
| Company name | Optional |

Service/product actions preselect the relevant context. Keep forms short with clear success and failure feedback.

Store submissions in the database and notify the configured business mailbox. Preserve the source page and related service/product. Notification failure must not lose a saved inquiry.

Django admin should manage:

- Inquiries, internal notes and statuses: New -> Contacted -> Quoted -> Closed.
- Products, images, descriptions, MOQ, stock, pricing mode and delivery information.
- Approved company information.
- Real project descriptions and media.

Decide during the audit whether service copy and FAQs also need editable admin records. Define staff permissions.

Proposed professional email addresses: `info@rstradeinternational.com`, `sales@rstradeinternational.com`, `sourcing@rstradeinternational.com`. These are examples, not confirmed active mailboxes. Confirm the domain and configure mailbox delivery before publication.

### Design and mobile requirements

- Review the existing logo and brand colors before choosing the final visual direction.
- Use consistent typography, buttons, spacing and colors.
- Prioritize service explanations and contact actions over shopping promotions.
- Design mobile and desktop together; make the purpose and inquiry path clear on the first screen.
- Provide readable contrast, accessible labels, keyboard navigation and useful image alternative text.
- Keep WhatsApp/phone actions easy to reach without covering content.
- Optimize images and video loading; use actual business media for evidence.

### Technical restructuring

Initial review identified a Next.js frontend in `ui`, Django backend, product catalog models and existing cart/checkout/account pages. The current homepage is centered on product categories, promotional banners and deals. A full integration/deployment audit remains necessary.

| Area | Planned change |
| --- | --- |
| Homepage | Replace shop-focused presentation with corporate/service layout |
| Navigation/footer | Rebuild around the new sitemap |
| Catalog | Adapt to selected Ready Stock |
| Product model | Add MOQ, request-price mode, delivery information and suitable image support |
| Pricing validation | Allow Request Price without fake prices; review affected deal logic |
| Inquiry backend | Add storage, validation, admin management and notifications |
| Content | Manage company information and genuine project content |
| Frontend layout | Shared corporate layout and reusable page sections |
| Accounts | Inquiries must work without login |
| Cart/checkout | Review dependencies; exclude from primary navigation |
| Existing URLs | Preserve useful routes or redirect replaced pages |

Audit APIs and existing records before migrations. Preserve existing product data. Review frontend server/client boundaries and metadata support during restructuring.

### SEO and measurement

- Unique titles, descriptions and readable URLs for each page.
- Useful English content targeting relevant topics naturally: China Product Sourcing Bangladesh, China Sourcing Agent Bangladesh, China to Bangladesh Import Service and China Product Supplier Verification.
- Sitemap, robots configuration, canonical URLs and appropriate structured data using verified business/product information.
- Internal links between services, projects, products and inquiries.
- Image optimization and redirects for replaced public URLs.
- Avoid keyword stuffing.

Configure Analytics and Search Console once account/domain access and identifiers are supplied. Verify ownership and submit the sitemap.

Track successful quotation submissions, WhatsApp clicks, phone clicks and product inquiry actions. A click is an interest signal, not a completed sale. Failed form submissions must not count as successful leads. Do not send customer form details to analytics events.

### Security, performance and operations

- Verify production HTTPS/SSL and environment configuration.
- Keep credentials out of public code and browser bundles.
- Validate forms server-side and add spam protection/submission limits.
- Review staff permissions and dependency maintenance.
- Optimize media loading and page performance.
- Confirm database/media backup schedules, retention and restoration procedures.
- Verify email delivery and notification-failure handling.
- Review privacy requirements for the actual data collection and tracking used.

Domain, hosting, email and analytics setup depend on access to those systems. They are planned launch tasks, not assumed completed features.

### Detailed implementation phases

| Phase | Deliverables | Review/completion point |
| --- | --- | --- |
| 1. Audit and content planning | Feature audit, final sitemap, page checklist, pending details, migration needs | Structure and scope agreed |
| 2. Design | Mobile/desktop homepage, navigation, service page, product page and form | Visual direction agreed |
| 3. Backend | Product fields, inquiry storage, admin, validation and notifications | Data/inquiry flows verified |
| 4. Frontend | Planned pages, responsive navigation, contextual inquiries and real content | Customer journeys work |
| 5. Verification | Relevant builds/checks, mobile, forms, accessibility and links | Material issues resolved |
| 6. Launch preparation | SEO, analytics, redirects, hosting/security and backups | Ready for publication |
| 7. Launch and handover | Approved deployment and management instructions | Team can operate the site |

Phases can overlap where dependencies permit. Shipping scope no longer blocks planning; detailed terms still require business input.

### Acceptance and launch checklist

- Planned public pages and navigation work on mobile and desktop.
- Visitors understand the services and can reach an inquiry action quickly.
- Products show correct MOQ, stock and pricing mode.
- WhatsApp/phone links use confirmed numbers and correct product context.
- Forms validate, save inquiries and report their status accurately.
- Staff can manage products, inquiries and approved content.
- Notifications work with the configured mailbox.
- No registration/payment barrier exists in the planned inquiry journey.
- Business claims are approved; missing content is withheld or finalized.
- Metadata, sitemap, canonical URLs and required redirects are checked.
- Analytics events are verified when configured.
- Appropriate production builds and backend checks pass.
- HTTPS, secrets, backups and deployment configuration are reviewed.

### Owner information checklist

| Information | Status |
| --- | --- |
| Audience, language and order flow | Confirmed |
| Full door-to-door responsibilities | Confirmed |
| Logo and brand colors | Review/confirmation needed |
| Company introduction and China-presence details | Approved content needed |
| Phone, WhatsApp, offices and hours | Confirmed details needed |
| Domain and professional mailboxes | Setup/confirmation needed |
| Trade license information for publication | Approved details needed |
| Initial products, actual photos and specifications | Needed |
| MOQ, prices, stock and delivery details | Needed |
| Factory/inspection photos and videos | Needed |
| Projects/testimonials and publication permissions | Needed where available |
| Quotation inclusions and payment terms | Needed |
| Shipping timelines, coverage and restrictions | Needed |
| Applicable ready-stock/service terms | Needed |
| Hosting/Analytics/Search Console access | Needed near launch |

Information can be provided gradually. Missing content need not stop structural design; resolve it before publishing affected sections.

### Future expansion and current boundaries

Keep services, products, inquiries and project content separate, with reusable layouts and clear data relationships. Future additions may include RS Sourcing, RS Logistics, RS Warehouse, RS Store and a B2B platform. These will require their own requirements and implementation.

The present scope does not include online payments, a large marketplace, warehouse management, a shipment-tracking portal or a B2B platform.

### Immediate next step

Complete Phase 1: audit the existing project, finalize the sitemap and prepare the page-by-page content checklist. Then design the homepage and apply the agreed visual direction across the other pages.
