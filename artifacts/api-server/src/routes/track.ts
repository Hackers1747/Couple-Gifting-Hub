import { Router, Request, Response } from "express";
import { sendWhatsApp } from "./whatsapp";

const router = Router();

// ─── In-memory store (replace with DB inserts when Supabase is wired up) ─────
interface CardEvent {
  id: string;
  cardId: string;
  eventType: string;
  emojiReaction?: string;
  viewerIp?: string;
  createdAt: string;
}

interface CardMeta {
  recipientName: string;
  experience: string;
  senderWhatsapp?: string;
}

const events: CardEvent[] = [];
// Card metadata registry — populated when a card is created/paid
const cardRegistry: Record<string, CardMeta> = {
  // Seed with demo slugs so tracking works on demo cards
  "sorry-demo":       { recipientName: "Priya",  experience: "sorry",       senderWhatsapp: "" },
  "proposal-demo":    { recipientName: "Priya",  experience: "proposal",    senderWhatsapp: "" },
  "birthday-demo":    { recipientName: "Priya",  experience: "birthday",    senderWhatsapp: "" },
  "anniversary-demo": { recipientName: "Priya",  experience: "anniversary", senderWhatsapp: "" },
  "puzzle-demo":      { recipientName: "Priya",  experience: "puzzle",      senderWhatsapp: "" },
  "love-letter-demo": { recipientName: "Priya",  experience: "love_letter", senderWhatsapp: "" },
  "heartpage-demo":   { recipientName: "Priya",  experience: "heartpage",   senderWhatsapp: "" },
};

// ─── POST /api/track ──────────────────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  const { cardId, eventType, emojiReaction, senderWhatsapp, recipientName, experience } = req.body as {
    cardId?: string;
    eventType: string;
    emojiReaction?: string;
    senderWhatsapp?: string;
    recipientName?: string;
    experience?: string;
  };

  if (!eventType) {
    res.status(400).json({ error: "eventType is required" });
    return;
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const event: CardEvent = {
    id,
    cardId: cardId ?? "unknown",
    eventType,
    emojiReaction,
    viewerIp: req.ip,
    createdAt: new Date().toISOString(),
  };
  events.push(event);

  req.log.info({ cardId, eventType, emojiReaction }, "track event");

  // Upsert card metadata if provided by caller
  if (cardId && (recipientName || experience || senderWhatsapp)) {
    cardRegistry[cardId] = {
      recipientName: recipientName ?? cardRegistry[cardId]?.recipientName ?? "Someone",
      experience:    experience    ?? cardRegistry[cardId]?.experience    ?? "card",
      senderWhatsapp: senderWhatsapp ?? cardRegistry[cardId]?.senderWhatsapp ?? "",
    };
  }

  // Lookup card for WhatsApp notifications
  const card = cardId ? cardRegistry[cardId] : undefined;
  const senderPhone = card?.senderWhatsapp ?? "";

  if (eventType === "opened" && senderPhone) {
    const msg =
      `💌 ${card!.recipientName} opened your ` +
      `${card!.experience} card!\n` +
      `heartdrop.in/dashboard`;
    sendWhatsApp(senderPhone, msg).catch(() => {});
  }

  if (eventType === "reacted" && senderPhone) {
    const msg =
      `${card!.recipientName} reacted with ` +
      `${emojiReaction ?? "❤"} 🎉\nheartdrop.in/dashboard`;
    sendWhatsApp(senderPhone, msg).catch(() => {});
  }

  res.json({ ok: true, eventId: id });
});

// ─── POST /api/track/open/:cardId  (legacy) ───────────────────────────────────
router.post("/open/:cardId", (req: Request, res: Response) => {
  req.log.info({ cardId: req.params.cardId, ...req.body }, "track open (legacy)");
  events.push({
    id: `${Date.now()}`,
    cardId: req.params.cardId,
    eventType: "opened",
    viewerIp: req.ip,
    createdAt: new Date().toISOString(),
  });
  res.json({ ok: true });
});

// ─── GET /api/track/analytics/:cardId ────────────────────────────────────────
router.get("/analytics/:cardId", (req: Request, res: Response) => {
  const { cardId } = req.params;
  const cardEvents = events.filter((e) => e.cardId === cardId);

  const opens   = cardEvents.filter((e) => e.eventType === "opened").length;
  const reacted = cardEvents.filter((e) => e.eventType === "reacted");
  const reactions: Record<string, number> = {};
  for (const e of reacted) {
    if (e.emojiReaction) reactions[e.emojiReaction] = (reactions[e.emojiReaction] ?? 0) + 1;
  }

  const lastOpen = cardEvents
    .filter((e) => e.eventType === "opened")
    .at(-1);

  res.json({
    cardId,
    opens,
    uniqueOpens: opens,
    reactions,
    watermarkClicks: cardEvents.filter((e) => e.eventType === "watermark_click").length,
    lastOpenedAt: lastOpen?.createdAt ?? null,
    totalEvents: cardEvents.length,
  });
});

// ─── POST /api/track/register  (called after payment verify) ─────────────────
router.post("/register", (req: Request, res: Response) => {
  const { cardId, recipientName, experience, senderWhatsapp } = req.body as {
    cardId: string;
    recipientName: string;
    experience: string;
    senderWhatsapp?: string;
  };

  if (!cardId || !recipientName) {
    res.status(400).json({ error: "cardId and recipientName required" });
    return;
  }

  cardRegistry[cardId] = { recipientName, experience: experience ?? "card", senderWhatsapp };
  req.log.info({ cardId }, "card registered for tracking");
  res.json({ ok: true });
});

export default router;
