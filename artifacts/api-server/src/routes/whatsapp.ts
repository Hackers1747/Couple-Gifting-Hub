import { Router, Request, Response } from "express";

const router = Router();

router.post("/send", (req: Request, res: Response) => {
  res.json({ message: "WhatsApp send stub", data: req.body });
});

router.post("/webhook", (req: Request, res: Response) => {
  res.json({ message: "WhatsApp webhook received" });
});

export default router;
