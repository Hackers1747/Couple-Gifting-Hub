import { useMemo } from "react";
import { motion } from "framer-motion";
import { CardExperienceLayout } from "@/components/cards/CardExperienceLayout";
import type { CardData } from "@/hooks/useCardData";

// ── Shimmer particle ─────────────────────────────────────────────────────────
// All random values are pre-computed and passed as props so they are stable
// across re-renders (Math.random() in JSX re-randomises every repaint).

interface ShimmerProps {
  sizePx: number;
  leftVw: number;
  topVh: number;
  duration: number;
  delay: number;
}

function Shimmer({ sizePx, leftVw, topVh, duration, delay }: ShimmerProps) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0 rounded-full"
      style={{
        width: sizePx,
        height: sizePx,
        left: `${leftVw}vw`,
        top: `${topVh}vh`,
        background: "#d4d4d4",
      }}
      animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
      transition={{ duration, delay, repeat: Infinity }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface ProposalCardProps {
  card: CardData;
  onReact: (emoji: string) => void;
}

export default function ProposalCard({ card, onReact }: ProposalCardProps) {
  const shimmers = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        sizePx: Math.random() * 4 + 2,
        leftVw: Math.random() * 100,
        topVh: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: i * 0.3,
      })),
    [],
  );

  return (
    <>
      {shimmers.map((s) => (
        <Shimmer
          key={s.id}
          sizePx={s.sizePx}
          leftVw={s.leftVw}
          topVh={s.topVh}
          duration={s.duration}
          delay={s.delay}
        />
      ))}

      <CardExperienceLayout
        cardType="proposal"
        senderName={card.senderName}
        recipientName={card.recipientName}
        message={card.message}
        isWatermarked={card.isWatermarked}
        onReact={onReact}
      >
        {/* ── Experience-specific content ── */}
        <motion.div
          animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl"
        >
          💍
        </motion.div>

        <p className="font-serif text-2xl text-[#f5f0e8] text-center italic">
          Will you be mine forever?
        </p>

        <div className="flex gap-3 mt-4 w-full">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-[#c9a96e] to-[#e8c99a] text-[#080810] font-semibold px-6 py-4 rounded-full hover:shadow-[0_0_24px_rgba(201,169,110,0.4)] transition-all duration-300"
          >
            💍 Yes, Always
          </motion.button>
          <motion.button
            whileHover={{ x: [0, 10, -10, 10, 0] }}
            className="flex-1 border border-white/20 text-white/40 px-6 py-4 rounded-full text-sm transition-all duration-300"
          >
            No
          </motion.button>
        </div>
      </CardExperienceLayout>
    </>
  );
}
