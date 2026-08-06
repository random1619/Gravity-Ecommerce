# ⚠️ Production Warning — GRAVITY

> **GRAVITY is a demo / educational project.** It is built for portfolios, UI/UX
> showcases, and learning. It is **not** production software and must not be used
> for real transactions, real user data, or any live business.

This document consolidates the security, deployment, and production-readiness
notes that were previously spread across `SECURITY.md`, `DEPLOYMENT.md`, and
`PRODUCTION_WARNING.md`.

---

## What "demo mode" means

| Concern | Current state | Production requirement |
| --- | --- | --- |
| **Authentication** | Simulated in the browser; credentials stored in `localStorage` (`gravity_user`). No password hashing, no sessions, no server verification. | Real identity provider / hashed credentials / server-side sessions (e.g. Supabase Auth, Auth.js, Clerk). |
| **Data persistence** | Static mock catalog from `src/lib/data.ts`; cart, wishlist, recently-viewed in `localStorage`. No database. | A real database (PostgreSQL via Prisma/Supabase, etc.) with server-side validation. |
| **Checkout / payments** | Fully simulated. No payment processor is contacted. `DemoWarning` banner is shown. | PCI-compliant provider (Stripe, Razorpay, …) with server-side order creation. |
| **Student verification** | Placeholder — `/api/verify` returns a hardcoded `STUDENT20` promo code after basic input checks. No real verification. | A verification service (SheerID, UNiDAYS) or manual review flow. |

---

## Security posture

GRAVITY ships with **reasonable front-end hygiene**, but these measures are
*defense-in-depth for a demo*, not a production security model:

- **Security headers** set in `next.config.ts` — HSTS, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and a
  Content-Security-Policy.
- **Rate limiting** — best-effort, in-memory (per-instance) limiter in
  `src/middleware.ts` and `src/lib/security.ts` (~100 req/min/IP). **Not
  suitable for production** — it resets on deploy and does not share state
  across instances. Use Redis/Upstash or a CDN-level limiter in production.
- **Input validation & sanitization** — helpers in `src/lib/security.ts`
  (`isValidEmail`, `sanitizeString`, `sanitizeNumber`, etc.) used by API routes.

### Known limitations (do not ship as-is)
- Client-side auth state is trivially forgeable (it's just `localStorage`).
- The in-memory rate limiter is per-process and easily bypassed / lost.
- The CSP allows `'unsafe-inline'` and `'unsafe-eval'` for scripts/styles to
  accommodate the current component/WebGL setup — tighten before production.
- No CSRF protection, no real session management, no audit logging.

---

## Deployment notes

- Standard Next.js 16 (App Router) build: `npm run build` → `npm run start`.
- No environment variables are required for demo mode.
- If you fork this toward production, **first** replace auth, persistence,
  checkout, and verification per the table above, then re-audit the CSP and
  rate limiting.

---

## TL;DR

✅ **Great for:** portfolios · design showcases · learning · UI/UX demos
❌ **Not for:** real payments · real customer data · any production workload

If you're evaluating the code, treat every "logged in" / "verified" / "ordered"
state as **simulated**.
