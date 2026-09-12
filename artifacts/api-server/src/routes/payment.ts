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
  shareToken?: string;
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

router.post("/webhook", (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.get("x-razorpay-signature");

  if (!webhookSecret) {
    res.status(503).json({ error: "Webhook secret is not configured" });
    return;
  }

  if (!signature || !Buffer.isBuffer(req.body)) {
    res.status(400).json({ error: "Invalid webhook request" });
    return;
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body)
    .digest("hex");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    res.status(403).json({ error: "Invalid webhook signature" });
    return;
  }

  let payload: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          order_id?: string;
        };
      };
    };
  };

  try {
    payload = JSON.parse(req.body.toString("utf8"));
  } catch {
    res.status(400).json({ error: "Invalid webhook payload" });
    return;
  }

  if (payload.event !== "payment.captured") {
    res.json({ received: true });
    return;
  }

  const orderId = payload.payload?.payment?.entity?.order_id;
  const payment = orderId ? payments[orderId] : undefined;
  if (payment) {
    payment.status = "paid";
  }

  res.json({ received: true, matched: Boolean(payment) });
});

router.post("/verify", (req: Request, res: Response) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    cardId,
    senderName,
    recipientName,
  } = req.body as {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    cardId: string;
    senderName?: string;
    recipientName?: string;
  };

  const payment = payments[razorpayOrderId];
  if (!payment) {
    res.status(404).json({ error: "Payment order not found" });
    return;
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== razorpaySignature) {
    res.status(403).json({ error: "Invalid signature" });
    return;
  }

  if (payment.status === "paid" && payment.shareToken) {
    res.json({
      success: true,
      shareUrl: `heartdrop.in/card/${payment.shareToken}`,
      shareToken: payment.shareToken,
      senderName,
      recipientName,
      planType: payment.planType,
    });
    return;
  }

  payment.status = "paid";

  const shareToken = nanoid(10);
  payment.shareToken = shareToken;

  res.json({
    success: true,
    shareUrl: `heartdrop.in/card/${shareToken}`,
    shareToken,
    senderName,
    recipientName,
    planType: payment.planType,
  });
});

router.get("/status/:orderId", (req: Request, res: Response) => {
  const orderId = Array.isArray(req.params.orderId)
    ? (req.params.orderId[0] ?? "")
    : req.params.orderId;
  const payment = payments[orderId];
  if (!payment) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({ orderId, status: payment.status });
});

export default router;
