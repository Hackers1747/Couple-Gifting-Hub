import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  {
    id: "per_card",
    label: "This Card",
    price: "₹179",
    paise: 17900,
    desc: "One-time for this card",
    tag: null,
  },
  {
    id: "monthly",
    label: "Monthly",
    price: "₹299",
    paise: 29900,
    desc: "Unlimited cards for 30 days",
    tag: "Popular",
  },
  {
    id: "annual",
    label: "Annual",
    price: "₹1,999",
    paise: 199900,
    desc: "Unlimited cards for a year",
    tag: "Best Value",
  },
];

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("per_card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const senderName = new URLSearchParams(window.location.search).get("sender") || "You";
  const recipientName = new URLSearchParams(window.location.search).get("recipient") || "Someone special";

  async function openRazorpay() {
    setLoading(true);
    setError("");
    const plan = PLANS.find((p) => p.id === selectedPlan)!;

    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: id, planType: selectedPlan }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "HeartDrop",
        description: plan.label + " — Premium Card",
        image: "/favicon.svg",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                cardId: id,
                planType: selectedPlan,
                senderName,
                recipientName,
              }),
            });
            const data = await verifyRes.json();
            if (data.success) {
              navigate(`/success?url=${encodeURIComponent(data.shareUrl)}&token=${data.shareToken}&plan=${selectedPlan}&recipient=${encodeURIComponent(recipientName)}`);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch {
            setError("Verification error. Please contact support.");
          }
        },
        prefill: { name: senderName },
        theme: { color: "#B76E79" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setError("Payment failed: " + resp.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center px-4 py-12" style={{ maxWidth: 430, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="text-center mb-8">
          <span className="text-3xl mb-3 block">💝</span>
          <h1 className="font-serif text-3xl text-white mb-2">Unlock Your Card</h1>
          <p className="text-gray-400 text-sm">Remove the watermark and make it truly yours</p>
        </div>

        <div className="space-y-3 mb-8">
          {PLANS.map((plan) => (
            <motion.button
              key={plan.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.id)}
              className="w-full text-left rounded-2xl border p-4 transition-all relative"
              style={{
                background: selectedPlan === plan.id ? "rgba(183,110,121,0.12)" : "rgba(255,255,255,0.03)",
                borderColor: selectedPlan === plan.id ? "#B76E79" : "rgba(255,255,255,0.08)",
              }}
            >
              {plan.tag && (
                <span className="absolute -top-2.5 right-4 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "#B76E79", color: "#fff" }}>
                  {plan.tag}
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{plan.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{plan.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold text-lg">{plan.price}</span>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: selectedPlan === plan.id ? "#B76E79" : "rgba(255,255,255,0.2)" }}>
                    {selectedPlan === plan.id && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#B76E79" }} />
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-gray-400 text-xs text-center mb-3">What you get</p>
          <div className="space-y-2">
            {[
              "✅ No watermark",
              "✅ Forever shareable link",
              "✅ Delivery to recipient via WhatsApp",
              "✅ Download as PDF",
              selectedPlan !== "per_card" ? "✅ Unlimited cards" : "✅ This card only",
              selectedPlan === "annual" ? "✅ Priority support + new experiences" : null,
            ]
              .filter(Boolean)
              .map((item, i) => (
                <p key={i} className="text-gray-300 text-sm">{item}</p>
              ))}
          </div>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-400 text-sm text-center mb-4">{error}</motion.p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openRazorpay}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-semibold text-white text-base transition-all"
          style={{
            background: loading ? "rgba(183,110,121,0.4)" : "linear-gradient(135deg, #B76E79 0%, #8B4E5A 100%)",
            boxShadow: loading ? "none" : "0 4px 24px rgba(183,110,121,0.4)",
          }}
        >
          {loading ? "Opening payment…" : `Pay ${PLANS.find((p) => p.id === selectedPlan)?.price}`}
        </motion.button>

        <p className="text-center text-gray-600 text-xs mt-4">
          🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted
        </p>
      </motion.div>
    </div>
  );
}
