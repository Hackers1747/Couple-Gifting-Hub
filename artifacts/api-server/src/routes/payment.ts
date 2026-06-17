import { Router, Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { nanoid } from "nanoid";

const router = Router();

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

const PLAN_AMOUNTS: Record<string, number> = {
  per_card: 17900,
  monthly: 29900,
  annual: 199900,
};

const payments: Record<string, {
  userId: string;
  cardId: string;
  razorpayOrderId: string;
  amount: number;
  planType: string;
  status: "pending" | "paid" | "failed";
}> = {};

router.post("/create-order", async (req: Request, res: Response) => {
  const { cardId, planType } = req.body as { cardId: string; planType: string };

  if (!planType || !PLAN_AMOUNTS[planType]) {
    res.status(400).json({ error: "Invalid planType" });
    return;
  }

  const amount = PLAN_AMOUNTS[planType];

  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: cardId || `hd-${Date.now()}`,
    });

    const paymentId = nanoid();
    payments[order.id] = {
      userId: "guest",
      cardId: cardId || "",
      razorpayOrderId: order.id,
      amount,
      planType,
      status: "pending",
    };

    res.json({ orderId: order.id, amount, paymentId });
  } catch (err: any) {
    req.log?.error(err, "Razorpay order creation failed");
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
});

router.post("/verify", (req: Request, res: Response) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    cardId,
    planType,
    senderName,
    recipientName,
  } = req.body as {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    cardId: string;
    planType: string;
    senderName?: string;
    recipientName?: string;
  };

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== razorpaySignature) {
    res.status(403).json({ error: "Invalid signature" });
    return;
  }

  if (payments[razorpayOrderId]) {
    payments[razorpayOrderId].status = "paid";
  }

  const shareToken = nanoid(10);

  res.json({
    success: true,
    shareUrl: `heartdrop.in/card/${shareToken}`,
    shareToken,
    senderName,
    recipientName,
    planType,
  });
});

router.get("/status/:orderId", (req: Request, res: Response) => {
  const payment = payments[req.params.orderId];
  if (!payment) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({ orderId: req.params.orderId, status: payment.status });
});

export default router;
