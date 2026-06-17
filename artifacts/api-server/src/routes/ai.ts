import { Router, Request, Response } from "express";

const router = Router();

router.post("/generate-message", (req: Request, res: Response) => {
  res.json({ message: "AI message generation stub", data: req.body });
});

router.post("/suggest-experience", (req: Request, res: Response) => {
  res.json({ message: "AI experience suggestion stub", data: req.body });
});

export default router;
