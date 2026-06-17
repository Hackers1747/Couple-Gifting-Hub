import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ cards: [] });
});

router.post("/", (req: Request, res: Response) => {
  res.status(201).json({ message: "Card created", data: req.body });
});

router.get("/:id", (req: Request, res: Response) => {
  res.json({ id: req.params.id });
});

router.patch("/:id", (req: Request, res: Response) => {
  res.json({ message: "Card updated", id: req.params.id });
});

router.delete("/:id", (req: Request, res: Response) => {
  res.json({ message: "Card deleted", id: req.params.id });
});

router.get("/slug/:slug", (req: Request, res: Response) => {
  res.json({ slug: req.params.slug });
});

export default router;
