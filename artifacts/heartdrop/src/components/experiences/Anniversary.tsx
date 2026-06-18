import { useMemo } from "react";
import { motion } from "framer-motion";
import { CardExperienceLayout } from "@/components/cards/CardExperienceLayout";
import type { CardData } from "@/hooks/useCardData";

// ── Confetti particle ─────────────────────────────────────────────────────────
// All random values are pre-computed and passed as props so they are stable
// across re-renders (Math.random() in JSX re-randomises every repaint).

interface ConfettiProps {
  sizePx: number;
  leftVw: number;
  isCircle: boolean;
  isGold: boolean;
  xKeyframes: [number, number];
  duration: number;
  delay: number;
}

function Confetti({ sizePx, leftVw, isCircle, isGold, xKeyframes, duration, delay }: ConfettiProps) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{
        width: sizePx,
        height: sizePx,
        left: `${leftVw}vw`,
        top: "-10px",
        background: isGold ? "#c9a96e" : "#e8c99a",
        borderRadius: isCircle ? "50%" : "2px",
      }}
      animate={{
        y: "110vh",
        x: xKeyframes,
        rotate: [0, 360],
        opacity: [1, 0.8, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface AnniversaryCardProps {
  card: CardData;
  onReact: (emoji: string) => void;
}

export default function AnniversaryCard({ card, onReact }: AnniversaryCardProps) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        sizePx: Math.random() * 6 + 3,
        leftVw: Math.random() * 100,
        isCircle: Math.random() > 0.5,
        isGold: Math.random() > 0.5,
        xKeyframes: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60] as [number, number],
        duration: Math.random() * 4 + 4,
        delay: i * 0.4,
      })),
    [],
  );

  return (
    <>
      {confetti.map((c) => (
        <Confetti key={c.id} {...c} />
      ))}

      <CardExperienceLayout
        cardType="anniversary"
        senderName={card.senderName}
        recipientName={card.recipientName}
        message={card.message}
        isWatermarked={card.isWatermarked}
        onReact={onReact}
      >
        {/* ── Experience-specific content ── */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-6xl"
        >
          ✨
        </motion.div>

        <div className="flex items-center gap-3 w-full">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a96e]/40" />
          <p className="font-serif text-lg text-[#c9a96e] italic">Celebrating Us</p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a96e]/40" />
        </div>

        <p className="font-serif text-xl text-[#f5f0e8] text-center italic">
          Every moment with you is a gift.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-[#c9a96e] to-[#e8c99a] text-[#080810] font-semibold px-8 py-4 rounded-full hover:shadow-[0_0_24px_rgba(201,169,110,0.4)] transition-all duration-300"
        >
          💕 Love You Always
        </motion.button>
      </CardExperienceLayout>
    </>
  );
}
