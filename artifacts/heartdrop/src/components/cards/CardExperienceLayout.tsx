import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import EmojiReactions from "@/components/card/EmojiReactions";
import ViralCTA from "@/components/card/ViralCTA";
import Watermark from "@/components/card/Watermark";

interface CardExperienceLayoutProps {
  cardType: string;
  senderName?: string;
  recipientName?: string;
  message?: string;
  /** True when the card is watermarked (free tier) — shows the HeartDrop branding footer. */
  isWatermarked?: boolean;
  children?: ReactNode;
  /** Called with the chosen emoji. If omitted, reactions are still shown but
   *  the callback is a no-op (useful while the parent is still wiring up the
   *  API call). */
  onReact?: (emoji: string) => void;
  /** Delay (ms) before the reactions row fades in. Default 1 200. */
  reactionsDelay?: number;
}

export function CardExperienceLayout({
  cardType,
  senderName,
  recipientName,
  message,
  isWatermarked = false,
  children,
  onReact,
  reactionsDelay = 1200,
}: CardExperienceLayoutProps) {
  const [reacted, setReacted] = useState(false);

  const handleReact = (emoji: string) => {
    setReacted(true);
    onReact?.(emoji);
  };

  return (
    <div className="relative min-h-screen bg-[#080810] overflow-hidden pb-16">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-5 pt-10">
        {senderName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#8a8a9a] text-xs uppercase tracking-widest mb-1"
          >
            From {senderName}
          </motion.p>
        )}

        {recipientName && (
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-serif text-2xl text-[#f5f0e8] mb-6 text-center"
          >
            For {recipientName}
          </motion.h1>
        )}

        {/* ── Experience-specific content ──────────────────────────── */}
        <div className="w-full flex flex-col items-center gap-6">
          {children}
        </div>

        {/* ── Personal message ─────────────────────────────────────── */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full mt-6 rounded-2xl border border-[#c9a96e]/20 bg-[#c9a96e]/5 p-5"
          >
            <p className="text-[#f5f0e8] text-sm leading-relaxed font-serif italic text-center">
              "{message}"
            </p>
            {senderName && (
              <p className="text-[#c9a96e] text-xs text-right mt-3">— {senderName}</p>
            )}
          </motion.div>
        )}

        {/* ── Reactions ────────────────────────────────────────────── */}
        <motion.div
          className="w-full mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reactionsDelay / 1000 }}
        >
          <EmojiReactions onReact={handleReact} />
        </motion.div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        {reacted && <ViralCTA experience={cardType} />}
        {isWatermarked && <Watermark experience={cardType} />}
      </div>
    </div>
  );
}
