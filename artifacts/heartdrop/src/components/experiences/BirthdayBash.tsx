import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import EmojiReactions from "@/components/card/EmojiReactions";
import ViralCTA from "@/components/card/ViralCTA";
import type { CardData } from "@/hooks/useCardData";

const BALLOON_COLORS = ["#FF6B9D","#B76E79","#FF9A3C","#FFDE59","#A8E6CF","#7B9FFF"];
const BALLOON_EMOJIS = ["🎈","🎈","🎈","🎈","🎈","🎈"];

export default function BirthdayBash({ card, onReact }: { card: CardData; onReact: (e: string) => void }) {
  const [poppedBalloons, setPoppedBalloons] = useState<Set<number>>(new Set());
  const [candlesBlow, setCandlesBlow] = useState<Set<number>>(new Set());
  const [allBlown, setAllBlown] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const totalCandles = 5;

  const popBalloon = (i: number) => {
    if (poppedBalloons.has(i)) return;
    setPoppedBalloons((prev) => new Set([...prev, i]));
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.4 }, colors: [BALLOON_COLORS[i]] });
  };

  const blowCandle = (i: number) => {
    if (candlesBlow.has(i)) return;
    const next = new Set([...candlesBlow, i]);
    setCandlesBlow(next);
    if (next.size === totalCandles) {
      setAllBlown(true);
      setTimeout(() => {
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 }, colors: ["#FF6B9D","#FFDE59","#B76E79","#fff"] });
        setTimeout(() => setShowReactions(true), 1200);
      }, 400);
    }
  };

  const openEnvelope = () => {
    setEnvelopeOpen(true);
    setTimeout(() => setLetterVisible(true), 500);
  };

  const balloons = Array.from({ length: 6 }, (_, i) => ({
    id: i, color: BALLOON_COLORS[i],
    left: `${8 + i * 14}%`, delay: `${i * 0.5}s`, dur: `${3 + (i % 2)}s`,
  }));

  return (
    <>
      <style>{`
        @keyframes floatBalloon {
          0%   { transform:translateY(0) rotate(-3deg); }
          50%  { transform:translateY(-18px) rotate(3deg); }
          100% { transform:translateY(0) rotate(-3deg); }
        }
        @keyframes flameDance {
          0%,100% { transform:scaleY(1) skewX(0deg); opacity:1; }
          33%     { transform:scaleY(1.15) skewX(-4deg); opacity:0.9; }
          66%     { transform:scaleY(0.9) skewX(3deg); opacity:1; }
        }
      `}</style>

      <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden pb-10">
        {/* Floating balloons */}
        {balloons.map((b) => (
          <AnimatePresence key={b.id}>
            {!poppedBalloons.has(b.id) && (
              <motion.button
                exit={{ scale: 2, opacity: 0 }}
                onClick={() => popBalloon(b.id)}
                className="fixed text-3xl pointer-events-auto z-20"
                style={{
                  left: b.left, top: "8%",
                  animation: `floatBalloon ${b.dur} ${b.delay} infinite ease-in-out`,
                  filter: `drop-shadow(0 0 8px ${b.color}80)`,
                }}
              >
                🎈
              </motion.button>
            )}
          </AnimatePresence>
        ))}

        <div className="relative z-10 flex flex-col items-center px-5 pt-32">
          {/* Birthday heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-[#B76E79] text-xs uppercase tracking-widest mb-1">From {card.senderName}</p>
            <h1 className="font-serif text-3xl text-white">
              Happy Birthday,<br />
              <span style={{ color: "#B76E79" }}>{card.recipientName}! 🎂</span>
            </h1>
          </motion.div>

          {/* Cake SVG with candles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2"
          >
            <svg width="160" height="130" viewBox="0 0 160 130">
              {/* Cake base */}
              <ellipse cx="80" cy="105" rx="60" ry="12" fill="#8B4A56" opacity="0.5" />
              <rect x="20" y="70" width="120" height="40" rx="8" fill="#B76E79" />
              <rect x="20" y="55" width="120" height="22" rx="6" fill="#d4899a" />
              {/* Frosting drips */}
              {[30,55,80,105,130].map((x) => (
                <ellipse key={x} cx={x} cy="55" rx="7" ry="9" fill="white" opacity="0.85" />
              ))}
              {/* Candles */}
              {Array.from({ length: totalCandles }, (_, i) => {
                const cx = 28 + i * 26;
                const blown = candlesBlow.has(i);
                return (
                  <g key={i} onClick={() => blowCandle(i)} style={{ cursor: "pointer" }}>
                    <rect x={cx - 4} y="28" width="8" height="28" rx="3"
                      fill={["#FF6B9D","#FFDE59","#A8E6CF","#7B9FFF","#B76E79"][i]} />
                    {!blown && (
                      <ellipse
                        cx={cx}
                        cy="24"
                        rx="4"
                        ry="6"
                        fill="#FFDE59"
                        opacity="0.95"
                        style={{ animation: "flameDance 0.6s ease-in-out infinite", transformOrigin: `${cx}px 28px` }}
                      />
                    )}
                    {blown && <text x={cx - 5} y="22" fontSize="10">💨</text>}
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {!allBlown && (
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-sm text-[#888] mb-8 text-center"
            >
              Tap the candles to blow them out! 🎂
            </motion.p>
          )}

          {allBlown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-6"
            >
              <p className="text-xl text-white font-serif">🎉 Make a wish! 🎉</p>
            </motion.div>
          )}

          {/* Envelope */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full mb-6"
          >
            {!envelopeOpen ? (
              <button
                onClick={openEnvelope}
                className="w-full flex flex-col items-center gap-2 rounded-2xl border py-6 transition-all"
                style={{ borderColor: "rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.06)" }}
              >
                <span className="text-4xl">💌</span>
                <span className="text-sm text-[#888]">Tap to open your message</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Envelope flap opens */}
                <div
                  className="relative rounded-2xl border overflow-hidden"
                  style={{ borderColor: "rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.06)" }}
                >
                  <div className="p-5 pb-2 text-center">
                    <span className="text-3xl">💌</span>
                  </div>
                  <AnimatePresence>
                    {letterVisible && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 pt-0"
                      >
                        <p className="font-serif italic text-[#ddd] text-sm leading-relaxed text-center">
                          "{card.message}"
                        </p>
                        <p className="text-right text-[#B76E79] text-xs mt-3 font-serif">— {card.senderName}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </motion.div>

          {showReactions && (
            <>
              <div className="w-full"><EmojiReactions onReact={onReact} /></div>
              <ViralCTA experience={card.experience} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
