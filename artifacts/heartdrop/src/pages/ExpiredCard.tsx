import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";

export default function ExpiredCard() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const experience = params.get("type") ?? "";

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "expired_card_visit" }),
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center pb-12">
      {/* Broken heart SVG */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="mb-6"
      >
        <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
          {/* Left half */}
          <motion.path
            initial={{ x: 0, rotate: 0 }}
            animate={{ x: -6, rotate: -8 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
            d="M50 80 C50 80 10 55 10 30 C10 16 22 8 35 14 C40 16 45 20 50 25"
            fill="#B76E79"
            opacity="0.85"
          />
          {/* Right half */}
          <motion.path
            initial={{ x: 0, rotate: 0 }}
            animate={{ x: 6, rotate: 8 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
            d="M50 80 C50 80 90 55 90 30 C90 16 78 8 65 14 C60 16 55 20 50 25"
            fill="#8B4A56"
            opacity="0.85"
          />
          {/* Crack line */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            d="M50 25 L46 42 L54 52 L48 70 L52 80"
            stroke="#0A0A0A"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-serif text-3xl text-white mb-3"
      >
        This surprise has expired 💔
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-[#666] text-sm leading-relaxed mb-8 max-w-[280px]"
      >
        Cards are kept alive for 7 days on the free plan.
        <br />
        <span style={{ color: "#B76E79" }}>Upgrade to Premium</span> for a permanent link.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(`/create${experience ? `?type=${experience}` : ""}`)}
        className="btn-pill w-full max-w-[280px] py-4 font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, #B76E79 0%, #8B4A56 100%)",
          boxShadow: "0 0 24px rgba(183,110,121,0.35)",
        }}
      >
        Create your own — it's free
      </motion.button>
    </div>
  );
}
