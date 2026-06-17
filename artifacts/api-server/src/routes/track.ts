import { Router, Request, Response } from "express";

const router = Router();

interface TrackEvent {
  cardId?: string;
  eventType: "opened" | "reacted" | "watermark_click" | "expired_card_visit" | string;
  emojiReaction?: string;
}

router.post("/", (req: Request, res: Response) => {
  const { cardId, eventType, emojiReaction } = req.body as TrackEvent;

  req.log.info({ cardId, eventType, emojiReaction }, "track event");

  // In production: write to DB / analytics service
  res.json({ ok: true, cardId, eventType });
});

// Legacy path kept for compatibility
router.post("/open/:cardId", (req: Request, res: Response) => {
  req.log.info({ cardId: req.params.cardId, ...req.body }, "track open");
  res.json({ ok: true });
});

router.get("/analytics/:cardId", (req: Request, res: Response) => {
  res.json({
    cardId: req.params.cardId,
    opens: 0,
    uniqueOpens: 0,
    reactions: {},
    watermarkClicks: 0,
    lastOpenedAt: null,
  });
});

export default router;
