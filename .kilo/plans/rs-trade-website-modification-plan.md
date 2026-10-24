# RS Trade Website Modification Plan

## Business Context
RS Trade International is a China-Bangladesh sourcing & trading company with:
- China Product Sourcing with QC verification
- Door-to-Door shipping import service  
- Selected ready stock products (5-10 items initially)

The website serves as both a corporate site + small product store (not just an online shop).

## Current State
- Django project with React frontend
- Catch-all route `re_path(r'^(?P<path>.*)$', serve_next_frontend, name='next-frontend')` routes all URLs to frontend
- Frontend serves static files from `ui/out` directory
- Models: Category, SubCategory, Product, Deal, DealProduct
- User auth system with email-based users
- Profile model for user info

## Key Decisions & Planning

### 1. Homepage Structure (Priority 1)
- **Hero section**: "ChinaからBangladesh 위한 Sourcing, QC & Door-to-Door Import Solution"
- **Primary CTA Buttons**:
  - "Get a Sourcing Quote" → leads to quote request form
  - "View Our Products" → leads to ready stock products

### 2. Sourcing Quote Form (Critical Feature)
- Form fields: Product Name, Product Image, Quantity, Target Price, Specification, Bangladesh Delivery Location, WhatsApp/Phone, Other Requirements
- **Must have**: Image upload option
- This replaces simple "Contact WhatsApp" approach from Facebook ads

### 3. QC Process Section
- Display: Factory/Supplier Verification → Product Inspection → Quantity Check → Packaging Check → Photo/Video Report → Shipment Approval
- Emphasize China-based direct presence as competitive advantage

### 4. Door-to-Door Service Communication
- Message: "We don't just buy products; we support you through the entire process from China to Bangladesh"
- This is a major selling point

### 5. Ready Stock Products (Initial: 5-10 items)
Each product page should have:
- Product image
- Short description
- MOQ
- Price/"Request Price"
- Available quantity
- Delivery information
- Order/Inquiry button

### 6. Social Media Integration
- Website links: Facebook, YouTube, TikTok, WhatsApp
- Videos should link back to website
- Funnel: Video → Website → Inquiry → Customer → Business

### 7. China Presence Section
- Section: "Why RS Trade International?"
- Items (only if within capabilities):
  - China-based sourcing support
  - Direct supplier communication
  - Factory sourcing
  - QC support
  - Bangladesh delivery support
  - Transparent communication
- **DO NOT** claim capabilities not yet achieved

### 8. Trust Elements
- Company information
- Trade License information (where appropriate)
- Office information
- Real factory visit photos
- Real product inspection photos
- Customer testimonials
- Completed projects
- **Prohibited**: Fake reviews, stock photos
- **Strongest proof**: Owner's own videos

### 9. Professional Email
- Domain-aligned emails: info@rstradeinternational.com, sales@rstradeinternational.com, sourcing@rstradeinternational.com
- Quotations and business communication become more professional

### 10. Mobile-First Design
- **Priority**: Mobile version over desktop
- Facebook/WhatsApp customers arrive via mobile
- Must understand business within 5-10 seconds on mobile

### 11. Speed + Security
- Fast loading website
- SSL/HTTPS
- Regular backups
- Security protection
- Spam protection
- Contact form security
- Image optimization

### 12. SEO Foundation (Long-term)
Initial keywords:
- China Product Sourcing Bangladesh
- China Sourcing Agent Bangladesh
- China to Bangladesh Import Service
- China Product Supplier Verification
- Create respectable content, avoid keyword stuffing

### 13. Analytics Setup
- Google Analytics + Search Console
- Track: visitor sources, page views, keywords, inquiry conversions
- Critical for future marketing decisions

### 14. Scalable Structure
- Build so rebranding/rebuilding isn't needed in 2-3 years
- Future modules (not now): RS Sourcing → RS Logistics → RS Warehouse → RS Store → B2B Platform
- Keep scalable structure now

## Technical Implementation Notes

### URL Configuration
The existing `re_path(r'^(?P<path>.*)$', serve_next_frontend, name='next-frontend')` is correct for catch-all routing to React frontend. No changes needed.

### Frontend.py
Current implementation at `server/frontend.py` serves files from `FRONTEND_BUILD_DIR / path`. Need to ensure:
- Proper handling of SPA routes
- 404 for non-existent assets
- Index.html fallback for deep links

### Database & Models
May need to add models for:
- Sourcing quotes (new entity)
- QC logs/reports
- Contact inquiries
- Testimonials

### Form Handling
Need to create Django forms/views for:
- Sourcing quote request form
- General contact/inquiry

### File Uploads
- Product images via Cloudinary (already configured)
- Quote form image uploads

## Risks & Considerations
1. **Over-promising**: Only claim China presence capabilities that are actually available
2. **Form submissions**: Need backend handling for quote requests
3. **Mobile optimization**: Critical for conversion from Facebook/WhatsApp traffic
4. **SEO timing**: Long-term benefit, don't compromise UX for keywords
5. **Scalability**: Build structure that allows growth without major rebuild

## Open Questions for User
1. Do you want me to create the Sourcing Quote form model and view?
2. Should I add QC process section content to the frontend?
3. What specific product data should be in the initial 5-10 ready stock items?
4. Do you have the video content ready for social media integration?
5. What's the preferred tech stack for form submissions (Django forms, DRF, or third-party)?