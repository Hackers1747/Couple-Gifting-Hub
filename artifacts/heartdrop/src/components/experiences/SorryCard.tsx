import { useMemo } from "react";
import { motion } from "framer-motion";
import { CardExperienceLayout } from "@/components/cards/CardExperienceLayout";
import type { CardData } from "@/hooks/useCardData";

// ── Teardrop particle ────────────────────────────────────────────────────────
// Random values are memoised at the SorryCard level and passed as props so
// they are stable across re-renders (Math.random() in the render body would
// produce a new value — and therefore a layout jump — every time).

interface TeardropProps {
  leftVw: number;   // 0–100
  duration: number; // seconds
  delay: number;    // seconds
}

function Teardrop({ leftVw, duration, delay }: TeardropProps) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{ left: `${leftVw}vw`, top: "-20px" }}
      animate={{ y: "110vh", opacity: [0, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeIn" }}
    >
      <div className="w-2 h-3 bg-[#c0394b]/60 rounded-full" />
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface SorryCardProps {
  card: CardData;
  onReact: (emoji: string) => void;
}

export default function SorryCard({ card, onReact }: SorryCardProps) {
  // Compute stable random positions once on mount
  const teardrops = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        leftVw: Math.random() * 100,
        duration: Math.random() * 3 + 4,
        delay: i * 0.8,
      })),
    [],
  );

  return (
    <>
      {/* Ambient teardrops sit behind everything */}
      {teardrops.map((t) => (
        <Teardrop key={t.id} leftVw={t.leftVw} duration={t.duration} delay={t.delay} />
      ))}

      <CardExperienceLayout
        cardType="sorry"
        senderName={card.senderName}
        recipientName={card.recipientName}
        message={card.message}
        isWatermarked={card.isWatermarked}
        onReact={onReact}
      >
        {/* ── Experience-specific content ── */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl"
        >
          🕊️
        </motion.div>

        <p className="font-serif text-xl text-[#f5f0e8] text-center italic">
          I'm truly sorry. You mean everything to me.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-[#c0394b] to-[#e05464] text-white font-semibold px-8 py-4 rounded-full hover:shadow-[0_0_24px_rgba(192,57,75,0.4)] transition-all duration-300 mt-4"
        >
          💝 I Forgive You
        </motion.button>
      </CardExperienceLayout>
    </>
  );
}
