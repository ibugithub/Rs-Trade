# Admin design audit — 24 October 2026

## Result

The rendering audit found no server errors in 79 authenticated routes across all 14 registered model admins. No referenced admin CSS/JavaScript assets were missing and no duplicate HTML IDs were found in those responses. All admin JavaScript passed syntax checks; all admin CSS parsed successfully; Django's system check passed.

These are template, source and server-response checks. A browser surface was unavailable, so mobile/tablet/desktop appearance and interactive controls are **not visually verified**. Successful rendering does not prove a page has no layout bugs.

## Fixes made during this audit

- Applied border-box sizing and intrinsic-width limits to all inline fieldsets, extending the subcategory clipping fix to other inline editors.
- Corrected the permissions search field's mobile flex rule specificity, allowing it to occupy its own row above the selection controls.
- Made order/service follow-up controls span the available width on small screens rather than squeezing the status field into half a card.
- Versioned changed assets so browsers fetch the fixes.

## Redesign priorities

| Priority | Section | Current limitation | Next design work |
| --- | --- | --- | --- |
| 1 | Deals → product inline editor | Native tabular inline with product autocomplete, prices, order and active controls; horizontal scrolling remains necessary on phones. | Responsive product cards with explicit field labels and clear add/remove controls, preserving Django formset hooks. |
| Visual review | Groups / user permissions | Replaced the narrow permission matrix with feature cards at picker widths up to 600px; desktop retains the table. | Verify card layout and search/selection interactions in a browser. |
| 2 | Order / cart product details | Product tables have a 740px minimum width inside scroll containers. | Stacked mobile product summaries with image, quantity and price; retain desktop tables. |
| 2 | User edit page | Additional profile details and saved addresses still use native stacked inline structure. | Consistent section headings, compact address summaries and clearer editable/readonly distinctions. |
| 3 | Follow-up forms | Status/notes use older dedicated control styles, alongside the newer shared record controls. | Bring status, public customer updates, private staff notes and save feedback into the shared form styling. |
| 3 | Password and error states | Shared navigation/assets are present, but content largely retains native form structure. | Review narrow-screen spacing, help text, validation and success/error messages. |

## Existing shared design to retain

Dashboard and app directories, record lists, detail mastheads, general add/edit controls, history and deletion confirmations now share the navy/blue/yellow identity. Category subcategory inlines use cards. Login/logout use the separate accepted operations gateway layout. These need responsive visual review rather than another wholesale redesign.

## Coverage

- Home, Catalog, Orders, Accounts and Service requests directories.
- Available list/add screens and seeded detail/edit/history/delete screens for registered models.
- Product, category, subcategory, deal, deal product, cart, order, service-request/proxy, user and group content.
- Admin password form, password success and user password form.
- Notification feed, login and logout screen.
- Staff with only view-category permission: allowed dashboard/list/detail; forbidden add/save/user-list/notification access; blocked save left the record unchanged.
- Signed-out admin requests redirect to login.

Fixtures and database checks ran only in isolated in-memory SQLite. No live data, stock, passwords or migrations were changed. Uploads, live notification polling, native inline add/remove, autocomplete, sorting and bulk-action browser interactions still require manual verification.

## Responsive review checklist

Review representative populated and empty states at 320, 375, 510, 650, 768, 1024 and 1440px. Confirm no page-level horizontal overflow, focus rings remain visible, account/notification panels fit, long names/addresses wrap, form errors stay beside their fields and destructive actions remain distinct. Include open filters, active sorting, selected records, inline creation/removal, failed images, protected deletion and view-only access.
