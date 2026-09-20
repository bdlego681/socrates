# Socrates

**Enterprise Data Dashboard**

Socrates is a secure, robust, and extensible enterprise data dashboard and portal application.

## Prerequisites

- Node.js 20+
- SQL Server (local instance, Docker, or hosted)

## Install and configure

1. Run `npm run install:all` from the repository root.
2. Copy `.env.example` to `backend/.env`, then replace `SESSION_TOKEN_PEPPER` with a long random value. The included `DB_DRIVER=msnodesqlv8` and connection string use your current Windows account through Integrated Security. Set `COOKIE_SECURE=true` when served over HTTPS.
3. Add `MFA_ENCRYPTION_KEY` to `.env` using a 32-byte base64url key (e.g. run `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`).
4. Create an empty SQL Server database named `socrates` (or change the connection string).
5. Run [`database/migrations/001_auth.sql`](database/migrations/001_auth.sql) against that database.
6. Apply [`database/migrations/002_mfa_security.sql`](database/migrations/002_mfa_security.sql) to add MFA tables.
7. Apply [`database/migrations/003_activity_log.sql`](database/migrations/003_activity_log.sql) to add the activity tracking table.
8. Create the first user (use a password of at least 12 characters): `npm run create-user --prefix backend -- yourname you@example.com "your-long-password"`.

## Run locally

In two terminals:

```powershell
npm run dev:backend
npm run dev:frontend
```

Open `http://localhost:4200`. The Angular dev-server proxies `/api` to Express so cookies work cleanly in development.

## Design System

Socrates uses a custom token-based design system:
- **Brand Colors**: Primary Indigo (`#233261`), Secondary Teal (`#3AB9B0`), Highlight Lime (`#C8E53C`), Accent Sunset (`#FF8C4F`).
- **Typography**: Clean geometric sans-serif (Inter/system-ui).
- **Layout**: Sidebar-driven enterprise shell with responsive components.

## Security & Authentication

- **Authentication**: Bcrypt password hashes, opaque random tokens, HttpOnly SameSite=Lax cookies. No tokens or passwords stored in browser state.
- **MFA (TOTP)**: AES-256-GCM encrypted secrets, bcrypt-hashed recovery codes, secure two-step challenge with short-lived pending sessions.
- **Activity Logging**: Full audit trail of security events without exposing sensitive metadata.
