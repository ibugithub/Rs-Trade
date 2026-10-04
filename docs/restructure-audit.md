# What we found in the current website

Updated: 2026-10-04.

This file answers: **What do we already have, and what needs changing?**

I checked the website's code. I have not tested the live website, email delivery or hosting yet. No website features were changed during this review.

## What we can keep

- The existing project. We do not need to start from zero.
- The admin area where staff can manage products and categories.
- The existing way of saving product names, descriptions, prices and stock quantities.
- The staff login system.
- Parts of the email-sending code, after checking that it works with your business email.

## What needs changing

| Part of the website | What it does now | What we will do |
| --- | --- | --- |
| Home page | Mainly shows products, discounts and shopping banners | Show your company, four services, work process and inquiry buttons |
| Top menu | Some links point to pages that have not been built | Build the planned pages and connect the correct links |
| Bottom of the website | Several links do not lead anywhere | Add working page links and real contact details |
| Product pages | Show example products written directly into the code | Connect them to the products managed in your admin area |
| Product reviews | Show example ratings and review counts | Remove them unless you have genuine reviews |
| Product details | Do not have all the information we need | Add MOQ, delivery details, more photos and Request Price |
| Cart and checkout | Use example products and payment details; checkout only shows a demo message | Make WhatsApp, phone and inquiry the main ordering options |
| Buy Now / Add to Cart | Show purchase messages without confirming a real order | Replace them with clear inquiry buttons |
| Contact section | Shows example phone numbers | Use your confirmed phone, WhatsApp, email and addresses |
| Newsletter | Does not actually save subscriptions or send emails | Leave it out for now unless you want it later |
| Inquiry form | No complete inquiry-saving system was found | Build a form that saves requests for your team to follow up |
| Company and project information | No dedicated way to manage this information was found | Add a suitable way to manage approved information and real work photos |

**Example:** A customer currently sees products written into the website code. Changing a product in the admin area does not update those example product details. We need to connect the two.

If a customer opens a wrong product link, the current product code can show the first example product. We should show a clear Product Not Found message instead.

## Pages we need to build

- About Us.
- Services overview and the four service pages.
- Ready Stock listing and updated product pages.
- Our Work and project pages.
- FAQ.
- Contact.
- Request a Quote.
- Privacy Policy and Terms.

The full page list is in the [main plan](restructuring-plan.md).

## An important issue when adding new products

The current website creates its pages before they are published. It currently creates pages for 36 example product links.

That means adding a new product in the admin area will not automatically create a new website page with the current setup.

We need to choose how this will work:

1. Keep the current setup and rebuild the website when new product or project pages are added.
2. Change the setup so the website can show new pages without that rebuild.

We will decide this before building the real product pages. Prices and stock also need to stay up to date.

## Other things we need to check

- Show useful page titles and descriptions in Google.
- Make wrong links return a proper Page Not Found result.
- Keep old useful links working, or send visitors to the correct replacement page.
- Make images load quickly. Automatic image optimization is currently turned off.
- Run code checks separately; the current build skips one set of code checks.
- Check the real hosting settings, HTTPS and backups before launch.
- Check that emails reach the correct business mailbox.
- Protect inquiry forms from spam and too many repeated submissions.

These are future checks. This review does not mean the live website has passed them.

## How we will protect existing work

- Keep existing product records rather than deleting them.
- Add new product fields carefully.
- Make sure Request Price works without entering a made-up price.
- Keep staff access working.
- Review old cart, checkout and account links before changing them.
- Only show products that you have marked ready for the public.
- Keep a customer's inquiry saved even if its email notification fails.

## Where the findings came from

For later development work, the main files reviewed were:

- `ui/app` and `ui/components`: website pages, menu, products and demo checkout.
- `catalog/models.py` and `catalog/admin.py`: saved product information and admin controls.
- `server/urls.py`: existing user/profile connections; no product connection is currently listed.
- `ui/next.config.ts`, `server/frontend.py` and `Dockerfile`: how pages are built and served.
- `server/settings.py` and `users/utils/sendEmail.py`: database, images and email setup.

Live settings, actual saved products, email accounts, social login, backups and hosting were not tested. Existing changes you made were preserved.

## What comes next

1. Review the logo and colors.
2. Design the home page and menu.
3. Collect the information listed in [Information we need from you](restructure-content-inventory.md).
4. Decide how new product pages will be published before implementing them.

Track completed work in [Progress](restructure-progress.md).
