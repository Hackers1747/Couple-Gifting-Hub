# Production Page Audit — HeartDrop (Couple Gifting Hub)

Scanned: `artifacts/api-server`, `artifacts/heartdrop`, `lib/*`, root config. No
`AGENTS.md`, no `.github/`, no test files, no docs/ existed before this audit.

**Verified facts driving every decision below:**
- No auth system anywhere (no login/register/session/token/password code in
  `artifacts/api-server/src` or `artifacts/heartdrop/src`).
- `Dashboard.tsx` uses hardcoded `MOCK_CARDS` and `isPremium = true` — not
  gated by login, not reading real data.
- No user table/model exists (`lib/db/src/schema/index.ts` is empty).
- Payments are real (Razorpay), but not tied to any account — anonymous, per-card.
- No CI, no lint script wired, no test files anywhere in the repo.

## Legal

| Page | Status | Evidence | Applicability reason | Required action |
|---|---|---|---|---|
| Privacy Policy | BLOCKED_BY_MISSING_INFORMATION | App collects name, WhatsApp number, phone (payment), photos (client-side), Razorpay/Gemini/Meta as processors — `routes/payment.ts`, `routes/whatsapp.ts`, `routes/ai.ts` | Required — real personal data is collected | Need business/contact facts (see §Missing Owner Information) before publishing |
| Terms of Service | BLOCKED_BY_MISSING_INFORMATION | Public paid product, `routes/payment.ts` | Applicable — takes payment from public users | Same as above |
| Cookie Policy / Preferences | NOT_APPLICABLE | No cookie-setting code, no analytics/ads SDK found anywhere in `artifacts/heartdrop/src` | No tracking cookies exist to disclose | None now; re-check if analytics added |
| Refund Policy | BLOCKED_BY_MISSING_INFORMATION | Real purchases exist (`PLAN_AMOUNTS` in `routes/payment.ts`) but no stated refund rule anywhere in code | Applicable — paid product | Need your actual refund rule |
| Cancellation Policy | BLOCKED_BY_MISSING_INFORMATION | `monthly`/`annual` plans referenced (`payment.ts`, `cron.ts`) but no cancel flow exists in code at all | Applicable in principle, but there's no cancel mechanism to describe yet | Need to know if cancellation is even supported, and how |
| Shipping Policy | NOT_APPLICABLE | No physical product/shipping code anywhere | Digital-only product | — |
| Return/Exchange Policy | NOT_APPLICABLE | Same as above | No physical goods | — |
| Disclaimer | APPLICABLE_MISSING | AI-generated message content (`routes/ai.ts`) is shown to real recipients | Users should know messages may be AI-assisted | Can be written from what's already verified — no blocked info |
| Accessibility Statement | APPLICABLE_MISSING | Public-facing SPA, `artifacts/heartdrop` | Applicable to public product | Must not claim compliance — no audit has been run |
| Data Processing Agreement | NOT_APPLICABLE (for now) | No evidence of B2B customers processing data via this app | Consumer product only | Revisit if B2B use appears |
| Acceptable Use Policy | APPLICABLE_MISSING | User-submitted message text + photos go into shareable cards (`routes/cards.ts`) | Applicable — user-generated content, no moderation exists | Can be drafted from verified features |
| Security Policy | APPLICABLE_MISSING | Public API surface, payment webhook-ish verify endpoint | Applicable, must not expose infra details | Draft high-level only |
| Responsible Disclosure | BLOCKED_BY_MISSING_INFORMATION | No security contact exists anywhere | Applicable to any public API | Need a real reporting email/address |
| Community Guidelines | NOT_APPLICABLE | No comments/reviews/messaging/public social features exist | Cards are 1:1 private links only | — |

## Customer lifecycle

| Page | Status | Evidence | Applicability reason | Required action |
|---|---|---|---|---|
| Login / Register | NOT_APPLICABLE | No auth code anywhere in `api-server` or `heartdrop` | Product has no accounts today | Do not fabricate — flag if this is actually planned |
| Email Verification | NOT_APPLICABLE | Depends on accounts, which don't exist | — | — |
| Forgot/Reset Password | NOT_APPLICABLE | No accounts, no password storage | — | — |
| Onboarding | NOT_APPLICABLE | `Home.tsx`→`Create.tsx` flow already serves as the only "setup" needed; no profile/permissions to configure | Multi-step create flow already exists and is adequate | — |
| Account Settings | NOT_APPLICABLE | No account object exists to hold settings | — | — |
| Billing / Upgrade / Downgrade / Cancel Subscription | NOT_APPLICABLE (currently) | `plan` field referenced in `cron.ts`'s in-memory `UserRecord` only — never persisted, never exposed in any UI | "Unlimited" plan is aspirational in code, not a real subscription product yet | Real subscription management needs an account system first — out of scope until that exists |
| Payment Success | EXISTS_NEEDS_IMPROVEMENT | `pages/Success.tsx` | Applicable — real payments | Reads `plan`/`token`/`url` from URL params only; doesn't re-check `/api/payment/status/:orderId`. Low risk today (doesn't unlock anything sensitive) but worth tightening |
| Payment Failed | APPLICABLE_MISSING | `Payment.tsx` shows an inline error string on failure, no dedicated failed state/route | Payments exist, Razorpay does report `payment.failed` | Add a real failed state, wired to the existing `rzp.on("payment.failed", ...)` handler already in `Payment.tsx` |
| Payment Pending | APPLICABLE_MISSING | No pending/processing UI between order creation and `handler` callback | Razorpay can leave a payment pending (e.g. UPI collect) | Add a pending state |
| Support / Help Center | BLOCKED_BY_MISSING_INFORMATION | No support email/contact anywhere in code | Applicable to any paid product | Need a real support contact before publishing anything with support claims |

## UX states

| State | Status | Evidence | Required action |
|---|---|---|---|
| 404 | EXISTS_NEEDS_IMPROVEMENT | `pages/not-found.tsx` — generic shadcn boilerplate, light theme (mismatches app's dark theme), developer-facing copy ("Did you forget to add the page to the router?"), no way back into the app | Rewrite to match dark theme + on-brand copy + a real "go home" action |
| 403 | APPLICABLE_MISSING | No route guards exist at all (no auth) so nothing currently triggers a 403 — but reusable component still worth having for e.g. an already-paid/expired card link | Build as reusable component; not urgent since nothing gates access yet |
| 500 | APPLICABLE_MISSING | No error boundary found in `App.tsx`; unhandled render errors currently show a blank screen | Add a top-level React error boundary |
| Maintenance | NOT_APPLICABLE | No feature-flag/maintenance-mode config exists anywhere (`.replit`, env, or code) | Would require fabricating a config that doesn't exist — skip until a real flag exists |
| Offline | APPLICABLE_MISSING | No `navigator.onLine`/offline handling anywhere in `heartdrop/src` | Card-viewing and create flow both assume network is always up | Add a lightweight offline banner/state |
| Empty State | EXISTS_AND_ADEQUATE | `Dashboard.tsx` already has a real empty state ("No surprises yet" + CTA) | — |
| No Search Results | NOT_APPLICABLE | No search feature exists anywhere in the product | — |
| Loading State | EXISTS_NEEDS_IMPROVEMENT | `useCardData.ts` exposes `loading`, but `pages/Card.tsx` wasn't confirmed to render a real skeleton (not yet inspected in this pass) | Verify and standardize on one loading component |
| Error State | EXISTS_NEEDS_IMPROVEMENT | Ad-hoc inline error strings in `Create.tsx`/`Payment.tsx`; `useCardData.ts` has a generic `"Failed to load card"` with no retry action | Add a shared retry-capable error component |
| Success State | EXISTS_AND_ADEQUATE | `pages/Success.tsx` is thorough and on-brand | — |
| Session Expired | NOT_APPLICABLE | No sessions exist (no auth) | — |

## Missing owner information (do not guess these)

Needed before the BLOCKED legal pages above can be written truthfully:
1. Legal business/operator name and registered address
2. Support contact (email/phone) and a security-disclosure contact
3. Applicable jurisdiction (which country/state's law governs ToS)
4. Minimum user age for the product
5. Actual refund rule for the `per_card` (₹179), `monthly` (₹299), and `annual`
   (₹1,999) purchases — none is implemented or stated in code today
6. Whether cancellation of the `monthly`/`annual` plan is meant to be supported
   at all (currently no code path for it exists)
7. Data retention period for uploaded photos/messages (currently: photos aren't
   even persisted server-side, so there may be nothing to retain — confirm this
   is intentional)
8. Effective date to print on legal pages

## Legal-review note

Even once the above facts are supplied, the Privacy Policy/ToS/Disclaimer/AUP/
Security Policy drafted from them should get a real legal review before
publishing — this audit and any resulting draft is not a substitute for one.
