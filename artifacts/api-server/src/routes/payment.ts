import { Router, Request, Response } from "express";

const router = Router();

router.post("/create-order", (req: Request, res: Response) => {
  res.json({ message: "Razorpay order creation stub", data: req.body });
});

router.post("/verify", (req: Request, res: Response) => {
  res.json({ message: "Payment verification stub", verified: false });
});

router.get("/status/:orderId", (req: Request, res: Response) => {
  res.json({ orderId: req.params.orderId, status: "pending" });
});

export default router;
