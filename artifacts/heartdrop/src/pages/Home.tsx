import { useRef } from "react";
import { useLocation } from "wouter";
import { motion, useInView, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function FadeSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: "easeOut", delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const experiences = [
  { emoji: "💔", name: "Sorry Card" },
  { emoji: "💍", name: "Proposal" },
  { emoji: "🎂", name: "Birthday" },
  { emoji: "💑", name: "Anniversary" },
  { emoji: "🧩", name: "Puzzle" },
  { emoji: "💌", name: "Love Letter" },
  { emoji: "✨", name: "HeartPage" },
];

const testimonials = [
  {
    name: "Ananya R.",
    location: "Bengaluru",
    text: "I sent a HeartPage to my boyfriend on our anniversary. He literally cried. 10/10 would do it again.",
    avatar: "A",
  },
  {
    name: "Rohan M.",
    location: "Mumbai",
    text: "Used the Proposal card — she said YES. This app literally changed my life 💍",
    avatar: "R",
  },
  {
    name: "Priya K.",
    location: "Delhi",
    text: "The puzzle card is so creative. My partner spent 20 mins solving it before seeing my message!",
    avatar: "P",
  },
];

const pricing = [
  {
    tier: "Free",
    price: "₹0",
    sub: "Try it out",
    features: ["Watermarked card", "1 theme", "Expires in 7 days"],
    cta: "Get started",
    highlight: false,
    badge: null,
  },
  {
    tier: "Premium",
    price: "₹179",
    sub: "per card",
    features: [
      "No watermark",
      "All themes",
      "Live tracking",
      "WhatsApp share",
      "PDF download",
      "Permanent link",
    ],
    cta: "Buy now",
    highlight: true,
    badge: null,
  },
  {
    tier: "Unlimited",
    price: "₹299",
    sub: "per month",
    features: [
      "Everything in Premium",
      "Unlimited cards",
      "Streak system",
      "Monthly Love Drop",
      "Anniversary reminders",
    ],
    cta: "Go unlimited",
    highlight: false,
    badge: "₹1,999/year — Save ₹1,600",
  },
];

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] pb-28">
      {/* ── Subtle background glow ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(183,110,121,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* ──────────────────────────────────────────
            1. HERO
        ────────────────────────────────────────── */}
        <section className="px-5 pt-16 pb-12 text-center">
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <span
              className="inline-block text-sm font-medium tracking-widest uppercase px-3 py-1 rounded-full border mb-6"
              style={{
                color: "#B76E79",
                borderColor: "rgba(183,110,121,0.35)",
                background: "rgba(183,110,121,0.08)",
                letterSpacing: "0.2em",
              }}
            >
              HeartDrop
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="font-serif text-[2.6rem] leading-[1.12] text-white mb-4"
            >
              Drop feelings,
              <br />
              <span style={{ color: "#B76E79" }}>not hints.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
              className="text-[#888] text-[0.95rem] leading-relaxed mb-8 max-w-[300px] mx-auto"
            >
              Send a moment they'll never forget —{" "}
              <span className="text-[#bbb]">right on their phone.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
              className="flex flex-col gap-3 items-center"
            >
              <button
                onClick={() => navigate("/create")}
                className="btn-pill w-full max-w-[280px] py-3.5 font-semibold text-[0.95rem] text-white transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #B76E79 0%, #8B4A56 100%)",
                  boxShadow: "0 0 24px rgba(183,110,121,0.35)",
                }}
              >
                Create a card ✨
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-pill w-full max-w-[280px] py-3.5 font-medium text-[0.9rem] border transition-all active:scale-95"
                style={{
                  color: "#B76E79",
                  borderColor: "rgba(183,110,121,0.4)",
                  background: "rgba(183,110,121,0.06)",
                }}
              >
                See how it works
              </button>
            </motion.div>
          </motion.div>

          {/* Decorative hearts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-1 text-lg"
          >
            {["💝", "💖", "💗"].map((h, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              >
                {h}
              </motion.span>
            ))}
          </motion.div>
        </section>

        {/* ──────────────────────────────────────────
            2. EXPERIENCE CARDS
        ────────────────────────────────────────── */}
        <FadeSection className="pb-12">
          <h2
            className="font-serif text-2xl text-white px-5 mb-4"
            id="how-it-works"
          >
            Choose your{" "}
            <span style={{ color: "#B76E79" }}>moment</span>
          </h2>
          <div
            className="flex gap-3 overflow-x-auto px-5 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {experiences.map((exp, i) => (
              <motion.button
                key={exp.name}
                onClick={() => navigate("/create")}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex-shrink-0 flex flex-col items-center gap-2 rounded-2xl border px-4 py-4 transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(183,110,121,0.2)",
                  minWidth: 88,
                }}
              >
                <span className="text-3xl">{exp.emoji}</span>
                <span
                  className="text-xs font-medium text-center leading-tight whitespace-nowrap"
                  style={{ color: "#ccc" }}
                >
                  {exp.name}
                </span>
              </motion.button>
            ))}
          </div>
        </FadeSection>

        {/* ──────────────────────────────────────────
            3. PRICING
        ────────────────────────────────────────── */}
        <FadeSection className="pb-12">
          <h2 className="font-serif text-2xl text-white px-5 mb-1">
            Simple{" "}
            <span style={{ color: "#B76E79" }}>pricing</span>
          </h2>
          <p className="text-[#666] text-sm px-5 mb-5">No subscriptions required to start.</p>

          <div
            className="flex gap-3 overflow-x-auto px-5 pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="flex-shrink-0 rounded-2xl border flex flex-col p-4 relative"
                style={{
                  width: 188,
                  background: plan.highlight
                    ? "linear-gradient(160deg, rgba(183,110,121,0.18) 0%, rgba(139,74,86,0.10) 100%)"
                    : "rgba(255,255,255,0.03)",
                  borderColor: plan.highlight
                    ? "rgba(183,110,121,0.6)"
                    : "rgba(255,255,255,0.08)",
                  boxShadow: plan.highlight
                    ? "0 0 24px rgba(183,110,121,0.15)"
                    : "none",
                }}
              >
                {plan.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #B76E79, #8B4A56)",
                      color: "white",
                    }}
                  >
                    Most popular
                  </div>
                )}

                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: plan.highlight ? "#B76E79" : "#888" }}
                >
                  {plan.tier}
                </p>

                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="font-serif text-2xl font-bold text-white">
                    {plan.price}
                  </span>
                </div>
                <p className="text-xs text-[#666] mb-3">{plan.sub}</p>

                {plan.badge && (
                  <div
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full mb-3 text-center"
                    style={{
                      background: "rgba(183,110,121,0.15)",
                      color: "#B76E79",
                      border: "1px solid rgba(183,110,121,0.3)",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-[#aaa]">
                      <span style={{ color: "#B76E79", marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/create")}
                  className="btn-pill w-full py-2.5 text-xs font-semibold transition-all active:scale-95"
                  style={
                    plan.highlight
                      ? {
                          background:
                            "linear-gradient(135deg, #B76E79 0%, #8B4A56 100%)",
                          color: "white",
                        }
                      : {
                          background: "rgba(183,110,121,0.1)",
                          color: "#B76E79",
                          border: "1px solid rgba(183,110,121,0.3)",
                        }
                  }
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </FadeSection>

        {/* ──────────────────────────────────────────
            4. SOCIAL PROOF
        ────────────────────────────────────────── */}
        <FadeSection className="px-5 pb-12">
          {/* Stat */}
          <div className="text-center mb-8">
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl text-white mb-1"
            >
              25,000+
            </motion.p>
            <p className="text-[#888] text-sm">surprises delivered 💝</p>
          </div>

          {/* Testimonials */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="rounded-2xl border p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-[#ccc] text-sm leading-relaxed mb-3">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #B76E79, #8B4A56)" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{t.name}</p>
                    <p className="text-[10px] text-[#666]">{t.location}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: "#B76E79", fontSize: 12 }}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </FadeSection>

        {/* ──────────────────────────────────────────
            FOOTER NOTE
        ────────────────────────────────────────── */}
        <FadeSection className="px-5 pb-6 text-center">
          <p className="text-[#444] text-xs">
            Made with 💝 for Indian couples · HeartDrop
          </p>
        </FadeSection>
      </div>

      {/* ──────────────────────────────────────────
          5. STICKY BOTTOM CTA
      ────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-5 pt-3 z-50"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.98) 60%, transparent)",
        }}
      >
        <button
          onClick={() => navigate("/create")}
          className="btn-pill w-full py-4 font-semibold text-[1rem] text-white transition-all active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #B76E79 0%, #8B4A56 100%)",
            boxShadow: "0 0 32px rgba(183,110,121,0.45)",
          }}
        >
          Create your surprise →
        </button>
      </motion.div>
    </div>
  );
}
