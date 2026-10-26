# Rs-Trade-Ser

## Account and admin updates

This remains the RS Trade e-commerce application. Catalog, cart, orders, delivery
addresses, services and notifications are preserved, as are the existing customer
JWT field names (`accessToken`/`refreshToken`) and account response formats.

- `is_admin` is removed. `is_staff` controls dashboard entry, groups/permissions
  control actions, and `is_superuser` grants all permissions. Migration
  `users.0016_remove_is_admin` preserves legacy privileged accounts as staff before
  dropping the redundant field. Historical migrations stay unchanged.
- The admin login page includes **Continue with Google** when backend Google
  credentials are configured. It reuses `FRONTEND_BASE_URL` and
  `GOOGLE_REDIRECT_URI`; the existing registered callback must reach Django.
  Only existing, verified staff accounts can enter. The OAuth state expires after
  five minutes, is browser-bound, and is single-use. Password admin login remains.
- Website Google login still returns JWTs. Admin Google login uses Django's
  existing admin session and never creates accounts or grants staff permissions.
- Authentication endpoints have shared database-backed request counters. Default
  budgets are 10/minute per IP for password/social signin, 5/hour per IP for signup,
  and 5/hour per IP plus 3/hour per recipient for reset/verification emails.
  Reset confirmation is 10/minute and email verification is 20/minute per IP.
  All attempts count; blocked requests return 429, `Retry-After`, and JSON
  `detail`, `code=throttled`, and `retry_after`. The UI displays the wait.

Optional overrides are listed in `.env.auth.example`; add them to the existing
`.env` rather than replacing its credentials. `AUTH_TRUSTED_PROXY_COUNT=0` ignores
untrusted forwarded headers locally. Set the actual trusted proxy count supplied
by the hosting platform before deployment. Standard DRF throttles can allow a few
extra concurrent requests; they are application-level limits.

The removal migration is intentionally NOT applied to the current Railway database
because a deployed site may still run the old model. Coordinate this release in a
maintenance window: stop old workers, apply the migration, then start the updated
code. Docker startup already runs migrations, so deploying this release will apply
it. Until then, use the isolated tests or a separate development database for new
account creation; the updated model and the legacy database schema must not be
mixed for registration writes.

For deployment/another database, inspect then apply only the intended schema work:

```powershell
python manage.py migrate users 0016_remove_is_admin --plan
python manage.py migrate users 0016_remove_is_admin
python manage.py createcachetable auth_rate_limit_cache --dry-run
python manage.py createcachetable auth_rate_limit_cache
python manage.py collectstatic --noinput
```

Docker startup creates the rate-cache table after the existing migration step.
No additional hosting service is required. Rebuild the UI and restart Django to
load the updates.

Tests use disposable SQLite and isolated email/cache backends:

```powershell
python manage.py test server.test_admin_google server.test_user_permissions server.test_throttles server.test_auth_port --settings=server.test_settings --noinput
```

## Admin address and navigation

Set `ADMIN_URL=staff-portal/` in `.env` and restart Django to change the admin address. Keep only one `ADMIN_URL` entry. The staff-only Admin link in desktop and mobile navigation follows the backend value; changing this setting needs no frontend rebuild. Google and password admin login use the configured path. The default `/admin/` is no longer mounted when a custom path is selected. Backend permissions remain enforced.
