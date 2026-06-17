import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiReactions from "@/components/card/EmojiReactions";
import ViralCTA from "@/components/card/ViralCTA";
import type { CardData } from "@/hooks/useCardData";

function useTypewriter(text: string, delay = 1200, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, speed);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay, speed]);
  return displayed;
}

const PETAL_COLORS = ["#B76E79","#c9818c","#d4899a","#8B4A56","#e8a0ac"];

export default function LoveLetter({ card, onReact }: { card: CardData; onReact: (e: string) => void }) {
  const [opened, setOpened] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const displayedMsg = useTypewriter(card.message, 1400);

  const petals = Array.from({ length: 14 }, (_, i) => ({
    id: i, left: `${Math.random() * 95}%`,
    delay: `${i * 0.5}s`, dur: `${5 + (i % 4)}s`,
    rotate: `${Math.random() * 360}deg`,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    size: 8 + (i % 3) * 4,
  }));

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => {
      setLetterVisible(true);
      setTimeout(() => setShowReactions(true), 3200);
    }, 600);
  };

  return (
    <>
      <style>{`
        @keyframes petalFall {
          0%   { transform:translateY(-20px) rotate(0deg); opacity:0.8; }
          100% { transform:translateY(100vh) rotate(360deg); opacity:0; }
        }
      `}</style>

      <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden pb-10">
        {/* Rose petals */}
        {petals.map((p) => (
          <div
            key={p.id}
            className="fixed pointer-events-none rounded-full"
            style={{
              left: p.left, top: "-20px", width: p.size, height: p.size * 0.6,
              background: p.color, borderRadius: "50% 0 50% 0",
              opacity: 0.5,
              animation: `petalFall ${p.dur} ${p.delay} infinite linear`,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center px-5 pt-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#B76E79] text-xs uppercase tracking-widest mb-2"
          >
            A letter for you
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl text-white text-center mb-10"
          >
            My dearest {card.recipientName} 💌
          </motion.h1>

          {/* Envelope */}
          <div className="relative w-full max-w-[320px] mb-4">
            {/* Envelope body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-full rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(183,110,121,0.2) 0%, rgba(139,74,86,0.1) 100%)",
                border: "1px solid rgba(183,110,121,0.35)",
                minHeight: 200,
              }}
            >
              {/* Envelope flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 overflow-hidden"
                style={{ height: 100, transformOrigin: "top", zIndex: 2 }}
                animate={opened ? { rotateX: -180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 320 100" className="w-full" style={{ display: "block" }}>
                  <polygon points="0,0 160,85 320,0" fill="rgba(183,110,121,0.35)" />
                  <polygon points="0,0 160,85 320,0" fill="none" stroke="rgba(183,110,121,0.4)" strokeWidth="1" />
                  {/* Wax seal */}
                  {!opened && (
                    <circle cx="160" cy="60" r="18" fill="#B76E79" opacity="0.9" />
                  )}
                  {!opened && (
                    <text x="160" y="65" textAnchor="middle" fill="white" fontSize="16">❤</text>
                  )}
                </svg>
              </motion.div>

              {/* Envelope content area */}
              <div className="pt-[90px] pb-8 px-6 flex flex-col items-center">
                <AnimatePresence>
                  {!opened && (
                    <motion.button
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleOpen}
                      className="flex flex-col items-center gap-2 mt-4"
                    >
                      <span className="text-4xl">💌</span>
                      <span className="text-sm text-[#B76E79] font-medium">Tap to open</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Letter slides up */}
                <AnimatePresence>
                  {letterVisible && (
                    <motion.div
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-full"
                    >
                      <div
                        className="rounded-xl p-5 w-full"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(183,110,121,0.15)",
                        }}
                      >
                        <p
                          className="text-[#f0e6e8] leading-[1.9] text-sm"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
                        >
                          {displayedMsg}
                          {displayedMsg.length < card.message.length && (
                            <span className="animate-pulse">|</span>
                          )}
                        </p>
                        <p
                          className="text-right mt-5 text-[#B76E79] text-sm"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
                        >
                          — {card.senderName}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {showReactions && (
            <>
              <div className="w-full mt-4"><EmojiReactions onReact={onReact} /></div>
              <ViralCTA experience={card.experience} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
