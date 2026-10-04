# RS Trade International: restructuring progress

Last updated: 2026-10-04 (Asia/Dhaka).

Source plan: [Website restructuring plan](restructuring-plan.md).

This file is the single place for progress and pending information. Separate review and content-checklist files are no longer used.

This is the ongoing tracker for the full website restructuring. Planning decisions are recorded separately from implementation: documenting a feature does not mean it has been built or verified.

## Current position

**Current phase:** Navigation implementation (Phase 4), with planning/design items still open.

**Completed:** Business direction, service list, order approach, full door-to-door responsibility, restructuring roadmap and planned sitemap have been documented.

**Next:** Review the new homepage on mobile and desktop, refine its design, then build the service and quotation pages. Replace Ready Stock example data with approved products later.

**Implementation status:** Navigation and the first corporate homepage design are implemented. The old shopping homepage is now at `/ready-stock`. Service/quotation pages, real product data and inquiry handling remain pending. Runtime integrations and deployment remain unverified.

## Visual roadmap

```mermaid
flowchart TD
    A[Business direction and sitemap documented] --> B[Phase 1: Audit and content planning - IN PROGRESS]
    B --> C[Phase 2: Design - NOT STARTED]
    C --> D[Phase 3: Backend - NOT STARTED]
    D --> E[Phase 4: Frontend - IN PROGRESS]
    E --> F[Phase 5: Verification - NOT STARTED]
    F --> G[Phase 6: Launch preparation - NOT STARTED]
    G --> H[Phase 7: Launch and handover - NOT STARTED]
    style A fill:#dcfce7,stroke:#15803d,color:#14532d
    style B fill:#fef3c7,stroke:#d97706,color:#78350f
```

If the Markdown viewer does not render Mermaid, use the phase table and checklists below. Phases can overlap when dependencies permit; the diagram shows the main sequence.

## Phase status

| Phase | Status | Completion requirement |
| --- | --- | --- |
| 1. Audit and content planning | In progress | Audit, sitemap/content inventory and scope review complete |
| 2. Design | Not started | Mobile/desktop layouts and visual direction agreed |
| 3. Backend | Not started | Product, content and inquiry flows implemented and verified |
| 4. Frontend | In progress | Planned pages and customer journeys implemented |
| 5. Verification | Not started | Relevant checks pass and material issues are resolved |
| 6. Launch preparation | Not started | Content, SEO, hosting, tracking and operations ready |
| 7. Launch and handover | Not started | Approved site published and management instructions delivered |

Status vocabulary: **Not started / In progress / Waiting for input / Complete**. Mark a task complete only when its stated outcome exists and any required verification has passed. Do not use speculative percentages.

## Phase 1 - Audit and content planning

- [x] Confirm corporate website plus small Ready Stock business model.
- [x] Confirm audience: wholesalers, importers, businesses and individual buyers.
- [x] Confirm English as the main website language.
- [x] Confirm four services and the Source -> Verify -> QC -> Ship -> Deliver journey.
- [x] Confirm initial 5-10 Ready Stock products and WhatsApp/phone order confirmation.
- [x] Confirm no online payment integration in the current scope.
- [x] Confirm complete door-to-door handling responsibilities.
- [x] Record the full restructuring roadmap in the source plan.
- [x] Document the full planned sitemap, page sections and proposed routes.
- [x] Create this progress tracker.
- [x] Audit existing pages, APIs, models, integrations and deployment configuration (source review; runtime checks pending).
- [x] Identify reusable features, demonstration content and migration requirements.
- [x] Review cart, checkout and account dependencies before changing navigation/routes.
- [x] Create a page-by-page content inventory with available/missing information.
- The useful findings and missing information are kept below; separate review documents were removed at the owner's request.
- [ ] Finalize static-export publishing/rebuild workflow or alternative Next runtime architecture.
- [ ] Review logo, brand colors and design preferences.
- [ ] Review the planned sitemap and finalize implementation scope/routes.

## Phase 2 - Design

- [ ] Define shared typography, colors, spacing and buttons.
- [ ] Design desktop/mobile navigation and footer.
- [ ] Design desktop/mobile homepage and its planned sections.
- [ ] Design service overview and service detail template, including prominent QC.
- [ ] Design Ready Stock listing and product details.
- [ ] Design About Us, Our Work and project details.
- [ ] Design FAQ, Contact, quotation form and policy layouts.
- [ ] Review mobile contact actions, readability and accessibility.
- [ ] Review and agree the visual direction before full implementation.

## Phase 3 - Backend

- [ ] Plan safe schema migrations for existing product records.
- [ ] Add MOQ, request-price mode and delivery information.
- [ ] Review pricing/deal validation and product image support.
- [ ] Implement inquiry storage with service/product context and source page.
- [ ] Implement server-side validation, spam protection and submission limits.
- [ ] Add inquiry statuses and internal notes in admin.
- [ ] Configure inquiry email notifications and failure handling.
- [ ] Implement required company/project content administration.
- [ ] Decide whether service copy and FAQs require editable admin records.
- [ ] Configure staff permissions and verify backend/API behavior.

## Phase 4 - Frontend

- [ ] Implement shared corporate layout, navigation and footer.
- [x] Implement responsive navigation, Services dropdown and Request a Quote link.
- [ ] Review navigation in a browser on mobile and desktop.
- [ ] Replace the shop-focused homepage with the planned corporate sections.
- [x] Build the first homepage design with hero, process overview, four services, QC, door-to-door, Ready Stock link, FAQs and quotation links.
- [x] Move existing shopping homepage content to `/ready-stock` without deleting its components.
- [ ] Review homepage design on mobile and desktop; add genuine evidence and approved content when available.
- [ ] Implement About Us and services overview.
- [ ] Implement China Product Sourcing page.
- [ ] Implement Supplier Verification page.
- [ ] Implement Quality Control & Inspection page.
- [ ] Implement Shipping & Door-to-Door Import page.
- [ ] Implement Ready Stock listing and individual product pages.
- [ ] Implement product-aware WhatsApp links and phone actions.
- [ ] Implement Our Work and individual project pages.
- [ ] Implement FAQ and Contact pages.
- [ ] Implement contextual quotation form, validation and submission feedback.
- [ ] Implement approved Privacy Policy and Terms pages.
- [ ] Integrate genuine approved content; withhold unavailable evidence sections.
- [ ] Remove cart/checkout from the primary journey after dependency review.
- [ ] Preserve useful URLs or implement redirects for replaced routes.

## Phase 5 - Verification

- [ ] Verify all planned pages, links and navigation.
- [ ] Verify mobile and desktop customer journeys without mandatory login.
- [ ] Verify product MOQ, stock, pricing mode and delivery information.
- [ ] Verify WhatsApp product context and confirmed phone numbers.
- [ ] Verify inquiry validation, persistence, feedback and notification delivery.
- [ ] Verify admin content management and permissions.
- [ ] Check accessibility and optimize media/page loading.
- [ ] Run appropriate frontend production build and backend checks.
- [ ] Resolve material defects and review final business claims/content.

## Phase 6 - Launch preparation

- [ ] Confirm production domain, hosting and business mailboxes.
- [ ] Finalize quotation inclusions, shipping details and applicable order terms.
- [ ] Add unique titles/descriptions, canonical URLs and internal links.
- [ ] Add sitemap, robots configuration and verified structured data.
- [ ] Verify replaced-URL redirects.
- [ ] Configure Analytics and verify successful inquiry/contact events.
- [ ] Verify Search Console ownership and submit sitemap.
- [ ] Review HTTPS, secrets, production settings and dependency maintenance.
- [ ] Configure database/media backups and verify restoration procedures.
- [ ] Complete launch checklist and prepare the concrete site for publication review.

## Phase 7 - Launch and handover

- [ ] Obtain publication approval for the completed site.
- [ ] Deploy and verify live pages, forms, contact links and admin access.
- [ ] Verify live email delivery and tracking configuration.
- [ ] Provide product, content and inquiry management instructions.
- [ ] Record maintenance, backup and support responsibilities.
- [ ] Record deployment details and outstanding follow-up work.

## Pending information and dependencies

### What we learned from the existing website

- We can reuse the product admin area and existing product storage.
- Current public product pages and checkout use example data. They need real products and inquiry actions.
- Some menu/footer links do not lead to built pages yet.
- We need a form that saves customer inquiries and notifies the team.
- We need to decide how adding a product in admin creates its public page. The current setup builds pages before publication.
- Existing product records and staff access should be preserved.
- Live email, hosting, backups and customer journeys still need checking.

These items await business content or account access; they do not prevent independent audit/design work.

| Item | Needed for | Status |
| --- | --- | --- |
| Logo/colors and visual preferences | Design | Awaiting review/input |
| Approved company/China-presence details | About, homepage | Awaiting content |
| Phone, WhatsApp, offices and hours | Contact actions | Awaiting confirmed details |
| Domain and active professional email | Email/launch | Awaiting confirmation/setup |
| Trade license details for publication | Credentials | Awaiting approved details |
| Initial products, photos, MOQ, prices and quantities | Ready Stock | Awaiting content |
| Real visits, inspections, projects and permitted feedback | Our Work/trust sections | Awaiting content |
| Shipping pricing inclusions, timelines, coverage and restrictions | Shipping details/terms | Awaiting details; full handling confirmed |
| Service and ready-stock terms | Policies/order information | Awaiting details |
| Hosting, Analytics and Search Console access | Launch preparation | Awaiting access when needed |

## Next work queue

1. Review the new homepage and navigation on mobile and desktop; refine the design.
2. Collect company details, real contact information, products and photos using the pending-information table above.
3. Decide how new product pages will be published and how old links will work.

## Update rules

Update this file when a meaningful part of the restructuring is completed, such as navigation, homepage, a service page or inquiry handling. Small adjustments belong in that part's existing entry; do not add a new log entry for every height, color or spacing change.

1. Check its task box after verifying the outcome.
2. Update phase status, current position and the visual roadmap if a phase changes.
3. Update pending dependencies and the next work queue.
4. Add a dated activity entry with what changed and verification evidence or a file reference.
5. Update the last-updated date. If scope changes, update the source plan as well.

For incomplete work, leave the box unchecked and record the current state or dependency. Keep completed planning separate from completed code. Add newly discovered tasks to the relevant phase rather than silently omitting them.

## Completed milestones

| Date (Asia/Dhaka) | Meaningful part | Result and checks |
| --- | --- | --- |
| 2026-10-04 | Website plan and progress tracking | Business model, services, full door-to-door handling, sitemap and task list recorded. Progress is maintained here. |
| 2026-10-04 | Existing website review | Identified reusable admin/product storage, example shopping features and missing pages/inquiry handling. Useful findings and pending information are kept in this file. Live checks remain pending. |
| 2026-10-04 | Navigation implementation | Main order: Home, Services, Ready Stock, Our Work, About Us, Contact; Request a Quote stays on the right. Dropdown contains only the four services; the overview link was removed at the owner's request. Desktop/mobile share this order. Added mobile menu and active-page styles; removed shopping controls. Desktop height is 90px; mobile is 64px, with matching page spacing. Initial production build passed; TypeScript and component lint passed for the arrangement update. Full browser review and destination pages remain pending. |
| 2026-10-04 | Shopping content moved and first corporate homepage built | Previous home content preserved at `ui/app/ready-stock/page.tsx`. New `ui/app/page.tsx` presents services, process, QC, import support, FAQ and inquiry links. TypeScript, changed-page ESLint and production export passed, including `/ready-stock`. Browser review, real product data, evidence, service pages and quotation handling remain pending. |

