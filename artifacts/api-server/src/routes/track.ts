import { Router, Request, Response } from "express";

const router = Router();

router.post("/open/:cardId", (req: Request, res: Response) => {
  res.json({ message: "Card open tracked", cardId: req.params.cardId });
});

router.get("/analytics/:cardId", (req: Request, res: Response) => {
  res.json({
    cardId: req.params.cardId,
    opens: 0,
    uniqueOpens: 0,
    lastOpenedAt: null,
  });
});

export default router;
