# Integrations & Background Jobs

## Third-party integrations

| Service | Where | Behavior without credentials |
|---|---|---|
| **Google Gemini** (`@google/genai`, model `gemini-2.5-flash`) | `artifacts/api-server/src/routes/ai.ts` | Falls back to hardcoded template messages (`FALLBACK_MESSAGES`) — app stays functional without `GEMINI_API_KEY`. |
| **Razorpay** (`razorpay` npm package) | `artifacts/api-server/src/routes/payment.ts`, `artifacts/heartdrop/src/pages/Payment.tsx` | Hard dependency for the paid flow — `create-order` will throw if `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are unset (non-null assertions, no guard). |
| **WhatsApp (Meta Cloud API)** | `artifacts/api-server/src/routes/whatsapp.ts` | Falls back to a `console.log` stub — safe to run without `WHATSAPP_PHONE_ID`/`WHATSAPP_ACCESS_TOKEN`. |
| **Supabase** | `artifacts/api-server/src/lib/supabase.ts` | Module throws on import if env vars are unset, but nothing currently imports it — effectively dead code today. |
| **Postgres via Drizzle** (`@workspace/db`) | `lib/db` | Same situation — declared, not wired to any route. Schema (`lib/db/src/schema/index.ts`) is an empty stub. |

## Cron jobs — `artifacts/api-server/src/cron.ts`

Started from `index.ts` right after the HTTP server begins listening (dynamic
`import("./cron")`). Uses `node-cron`. All four jobs currently operate on the
**same in-memory arrays** (`scheduledCards`, `users`, `loveDrops`) that are
initialized empty at module load and never populated by any route in this
codebase — so as written, none of these jobs will find any data to act on until
something (a route, a seed script) starts pushing into those arrays or the
inline `// TODO (Supabase)` queries are implemented.

1. **Scheduled Delivery** — `* * * * *` (every minute). Finds due, unpaid-notified,
   paid cards with a `receiver_whatsapp` and sends the share link via
   `sendWhatsApp`.
2. **Anniversary Reminders** — `0 9 * * *` (daily 9 AM). Warns senders 7 and 1
   day before a stored `anniversary_date`.
3. **Monthly Love Drop** — `0 10 * * *` (daily 10 AM). For active drops matching
   today's `send_day`, calls the AI message endpoint
   (`callAiMessage` → `POST http://localhost:8080/api/ai/message`, hardcoded to
   port 8080 rather than reading `PORT`), generates a new card, and sends it via
   WhatsApp.
4. **Streak Calculator** — `0 8 1 * *` (1st of month, 8 AM). For `plan ===
   "unlimited"` users, increments/resets a monthly streak and unlocks
   `loyal_heart` (6 months) / `legendary_lover` (12 months) badges, notifying
   via WhatsApp on unlock.

**Note:** `callAiMessage` in `cron.ts` calls `http://localhost:8080/api/ai/message`
with a hardcoded port (8080) rather than reading the `PORT` env var the rest of
the app uses — if the server is configured to listen on a different port, this
internal call will fail silently (it's wrapped in try/catch with a fallback
message).
