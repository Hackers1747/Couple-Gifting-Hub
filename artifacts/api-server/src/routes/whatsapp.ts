import { Router, Request, Response } from "express";

const router = Router();

// ─── sendWhatsApp ─────────────────────────────────────────────────────────────
// Uses Meta Cloud API when WHATSAPP_PHONE_ID + WHATSAPP_ACCESS_TOKEN are set.
// Falls back to a console stub so the rest of the app works without credentials.
export async function sendWhatsApp(to: string, message: string): Promise<Record<string, unknown>> {
  if (!to) return { skipped: true };

  // Normalise to E.164 for India (add 91 if not already there)
  let phone = to.replace(/\s+/g, "").replace(/^\+/, "");
  if (!phone.startsWith("91")) phone = "91" + phone;

  const phoneId   = process.env.WHATSAPP_PHONE_ID;
  const token     = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !token) {
    console.log(`[WhatsApp stub] → ${phone}\n${message}\n`);
    return { stub: true, to: phone };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: message },
        }),
      }
    );
    const data = await res.json() as Record<string, unknown>;
    if (!res.ok) console.error("[WhatsApp] API error:", JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("[WhatsApp] fetch failed:", err);
    return { error: String(err) };
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

router.post("/send", async (req: Request, res: Response) => {
  const { to, message } = req.body as { to: string; message: string };
  if (!to || !message) {
    res.status(400).json({ error: "to and message are required" });
    return;
  }
  const result = await sendWhatsApp(to, message);
  res.json(result);
});

router.post("/webhook", (req: Request, res: Response) => {
  req.log.info({ body: req.body }, "WhatsApp webhook");
  res.json({ ok: true });
});

export default router;
