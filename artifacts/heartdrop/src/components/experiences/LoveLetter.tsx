import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardExperienceLayout } from "@/components/cards/CardExperienceLayout";
import type { CardData } from "@/hooks/useCardData";

// ── Floating heart particle ───────────────────────────────────────────────────

interface FloatingHeartProps {
  leftVw: number;
  xKeyframes: [number, number];
  duration: number;
  delay: number;
  isChar: boolean; // ♥ vs ❤️
}

function FloatingHeart({ leftVw, xKeyframes, duration, delay, isChar }: FloatingHeartProps) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0 text-lg"
      style={{ left: `${leftVw}vw`, top: "110vh" }}
      animate={{
        y: "-120vh",
        x: xKeyframes,
        opacity: [0, 0.6, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    >
      {isChar ? "♥" : "❤️"}
    </motion.div>
  );
}

// ── Envelope open toggle ──────────────────────────────────────────────────────

interface EnvelopeOpenProps {
  opened: boolean;
  onOpen: () => void;
}

function EnvelopeOpen({ opened, onOpen }: EnvelopeOpenProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 cursor-pointer"
      onClick={onOpen}
    >
      <motion.div
        animate={opened ? { scale: 0, opacity: 0 } : { scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: opened ? 0 : Infinity }}
        className="text-7xl"
      >
        💌
      </motion.div>
      {!opened && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#8a8a9a] text-sm"
        >
          Tap to open your letter
        </motion.p>
      )}
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface LoveLetterCardProps {
  card: CardData;
  onReact: (emoji: string) => void;
}

export default function LoveLetterCard({ card, onReact }: LoveLetterCardProps) {
  const [opened, setOpened] = useState(false);

  const hearts = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        leftVw: Math.random() * 100,
        xKeyframes: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80] as [number, number],
        duration: Math.random() * 5 + 5,
        delay: i * 0.7,
        isChar: Math.random() > 0.5,
      })),
    [],
  );

  return (
    <>
      {hearts.map((h) => (
        <FloatingHeart key={h.id} {...h} />
      ))}

      <CardExperienceLayout
        cardType="loveletter"
        senderName={card.senderName}
        recipientName={card.recipientName}
        message={card.message}
        isWatermarked={card.isWatermarked}
        onReact={onReact}
        reactionsDelay={opened ? 800 : 99999}
      >
        {/* ── Experience-specific content ── */}
        <EnvelopeOpen opened={opened} onOpen={() => setOpened(true)} />

        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              {/* Lined-paper letter */}
              <div className="bg-white/[0.04] border border-[#c9a96e]/20 rounded-2xl p-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 28px, #c9a96e 28px, #c9a96e 29px)",
                  }}
                />
                <p className="font-serif italic text-[#f5f0e8] text-base leading-relaxed relative z-10">
                  My dearest {card.recipientName},
                </p>
                <p className="font-serif italic text-[#f5f0e8]/80 text-sm leading-relaxed mt-3 relative z-10">
                  {card.message}
                </p>
                <p className="font-serif italic text-[#c9a96e] text-sm mt-4 text-right relative z-10">
                  — {card.senderName} ♥
                </p>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-gradient-to-r from-[#c9a96e] to-[#e8c99a] text-[#080810] font-semibold px-8 py-4 rounded-full hover:shadow-[0_0_24px_rgba(201,169,110,0.4)] transition-all duration-300"
              >
                💌 Send Love Back
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardExperienceLayout>
    </>
  );
}
