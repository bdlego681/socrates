# Personal Portal

A small, extensible private portal foundation: public landing and login pages plus session-protected dashboard and settings pages.

## Prerequisites

- Node.js 20+
- SQL Server (local instance, Docker, or hosted)

## Install and configure

1. Run `npm run install:all` from the repository root.
2. Copy `.env.example` to `backend/.env`, then replace `SESSION_TOKEN_PEPPER` with a long random value. The included `DB_DRIVER=msnodesqlv8` and connection string use your current Windows account through Integrated Security. Set `COOKIE_SECURE=true` when served over HTTPS.
3. Create an empty SQL Server database named `personal_portal` (or change the connection string).
4. Run [`database/migrations/001_auth.sql`](database/migrations/001_auth.sql) against that database.
5. Apply [`database/migrations/002_mfa_security.sql`](database/migrations/002_mfa_security.sql) to add MFA tables.
6. Apply [`database/migrations/003_activity_log.sql`](database/migrations/003_activity_log.sql) to add the V3 activity tracking table.
7. Create the first user (use a password of at least 12 characters): `npm run create-user --prefix backend -- yourname you@example.com "your-long-password"`.

## Run locally

In two terminals:

```powershell
npm run dev:backend
npm run dev:frontend
```

Open `http://localhost:4200`. The Angular dev-server proxies `/api` to Express so cookies work cleanly in development.

## Authentication model

Login validates credentials with bcrypt and returns only a generic failure message. On success, the server generates an opaque random token, stores only its HMAC hash in `sessions`, and places the original token in an HttpOnly, SameSite=Lax cookie. Each protected API request resolves the active non-expired session. Logout deletes that server record and clears the cookie. Angular checks `/api/auth/me` through the route guards but never stores a password or token in browser storage.

## V2 MFA setup

Apply `database/migrations/002_mfa_security.sql` after the V1 migration. Generate and add a separate 32-byte base64url key to `backend/.env`:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Set the output as `MFA_ENCRYPTION_KEY=...`. This key encrypts TOTP secrets using AES-256-GCM and must be securely backed up; losing it prevents MFA verification. On Settings, select **Enable MFA**, scan the QR code, and verify the six-digit code. Recovery codes are displayed once after enrollment (or regeneration); only bcrypt hashes are stored. During login, a password-verified MFA user receives a five-minute MFA-pending session which cannot access `/api/auth/me` or protected routes until a TOTP or unused recovery code is verified.

## Database

`users` stores unique username/email values, bcrypt password hashes, timestamps, and `mfa_enabled`. `sessions` stores a hash of each opaque session token, its owner, expiry, and creation time. The schema includes uniqueness and expiry indexes; `mfa_enabled` intentionally prepares a later separate MFA enrollment/secrets table without a users-table redesign.

## Included

- Landing page, login, session-aware protected shell, dashboard, settings, and server-backed logout.
- Reactive login validation, show/hide password, loading/error states, API rate limiting, input validation, Helmet headers, CORS credential policy, and environment-based secrets.

## Deliberately deferred

- MFA enrollment/verification/recovery codes, password change/reset, account editing, and every portal module beyond dashboard/settings.

## Next phase: TOTP MFA

Add an encrypted MFA-secret store and recovery-code hashes, then update login to a two-step challenge: password verification first, TOTP verification second, only then session creation. Also add MFA enrollment/disable endpoints guarded by a recent-password check.
