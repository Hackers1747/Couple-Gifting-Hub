import { Router, Request, Response } from "express";

const router = Router();

// ─── WhatsApp send helper ────────────────────────────────────────────────────
// Exported so track.ts can use it directly.
// Currently logs to stdout; wire up Twilio / Meta Cloud API here when ready.
export async function sendWhatsApp(toPhone: string, message: string): Promise<void> {
  if (!toPhone) return;

  // Production: replace body with real API call, e.g.:
  //
  // await twilio.messages.create({
  //   from: "whatsapp:+14155238886",
  //   to:   `whatsapp:${toPhone}`,
  //   body: message,
  // });
  //
  // or Meta Cloud API:
  // await fetch(`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`, {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${WA_TOKEN}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ messaging_product: "whatsapp", to: toPhone, type: "text", text: { body: message } }),
  // });

  // Stub — log so it's visible in workflow console
  console.log(`[WhatsApp stub] → ${toPhone}\n${message}\n`);
}

// ─── Routes ──────────────────────────────────────────────────────────────────

router.post("/send", async (req: Request, res: Response) => {
  const { phone, message } = req.body as { phone: string; message: string };
  if (!phone || !message) {
    res.status(400).json({ error: "phone and message are required" });
    return;
  }
  await sendWhatsApp(phone, message);
  res.json({ ok: true, stub: true });
});

router.post("/webhook", (req: Request, res: Response) => {
  req.log.info({ body: req.body }, "WhatsApp webhook received");
  res.json({ ok: true });
});

export default router;
