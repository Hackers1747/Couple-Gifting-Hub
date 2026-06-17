import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiReactions from "@/components/card/EmojiReactions";
import ViralCTA from "@/components/card/ViralCTA";
import type { CardData } from "@/hooks/useCardData";

function useTypewriter(text: string, speed = 40) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

interface HeartParticle { id: number; x: number; y: number; angle: number; emoji: string }

export default function SorryCard({ card, onReact }: { card: CardData; onReact: (e: string) => void }) {
  const [answered, setAnswered] = useState(false);
  const [saidYes, setSaidYes] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const [showReactions, setShowReactions] = useState(false);
  const displayedMsg = useTypewriter(card.message, 35);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNo = () => {
    const w = (containerRef.current?.offsetWidth ?? 320) - 120;
    setNoPos({ x: (Math.random() - 0.5) * w, y: (Math.random() * 60) - 30 });
  };

  const handleYes = () => {
    setSaidYes(true);
    setAnswered(true);
    const hearts = Array.from({ length: 20 }, (_, i) => ({
      id: i, x: Math.random() * 280 - 140, y: -(Math.random() * 200 + 80),
      angle: Math.random() * 360, emoji: ["❤️","💕","💗","💝"][Math.floor(Math.random()*4)],
    }));
    setParticles(hearts);
    setTimeout(() => setShowReactions(true), 1200);
  };

  const bubbles = Array.from({ length: 9 }, (_, i) => ({
    id: i, left: `${8 + i * 10}%`, delay: `${i * 0.7}s`,
    duration: `${4 + (i % 3)}s`, size: 14 + (i % 3) * 4,
  }));

  return (
    <>
      <style>{`
        @keyframes riseBubble {
          0%   { transform: translateY(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(-100vh) scale(0.6); opacity: 0; }
        }
      `}</style>

      <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden pb-10">
        {/* Floating Sorry bubbles */}
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="fixed pointer-events-none font-serif italic text-[#B76E79] select-none"
            style={{
              left: b.left, bottom: "-2rem", fontSize: b.size,
              animation: `riseBubble ${b.duration} ${b.delay} infinite linear`,
              opacity: 0.25,
            }}
          >
            Sorry
          </div>
        ))}

        <div className="relative z-10 flex flex-col items-center px-5 pt-12">
          {/* Photo */}
          {card.photos[0] ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-48 h-48 rounded-full overflow-hidden mb-8"
              style={{ boxShadow: "0 0 40px rgba(183,110,121,0.5)" }}
            >
              <img src={card.photos[0]} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-40 h-40 rounded-full flex items-center justify-center mb-8"
              style={{ background: "rgba(183,110,121,0.12)", boxShadow: "0 0 40px rgba(183,110,121,0.35)" }}
            >
              <span className="text-6xl">💔</span>
            </motion.div>
          )}

          {/* From */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#666] text-xs uppercase tracking-widest mb-2"
          >
            From {card.senderName}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-serif text-3xl text-white mb-6 text-center"
          >
            I'm so sorry, {card.recipientName}
          </motion.h1>

          {/* Typewriter message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl border p-5 mb-8 w-full"
            style={{ borderColor: "rgba(183,110,121,0.25)", background: "rgba(183,110,121,0.05)" }}
          >
            <p className="text-[#ddd] text-sm leading-relaxed font-serif italic">
              "{displayedMsg}
              <span className="animate-pulse">|</span>"
            </p>
          </motion.div>

          {/* YES / NO buttons */}
          <AnimatePresence>
            {!answered && (
              <motion.div
                ref={containerRef}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.9 }}
                className="relative flex flex-col items-center gap-4 w-full"
              >
                <p className="font-serif text-xl text-white">Forgive me? 🙏</p>
                <button
                  onClick={handleYes}
                  className="btn-pill w-48 py-3.5 font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #B76E79, #8B4A56)", boxShadow: "0 0 20px rgba(183,110,121,0.4)" }}
                >
                  Yes 💕
                </button>
                <motion.button
                  animate={{ x: noPos.x, y: noPos.y }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onMouseEnter={moveNo}
                  onTouchStart={moveNo}
                  onClick={moveNo}
                  className="btn-pill px-6 py-2 text-sm font-medium"
                  style={{ background: "rgba(255,255,255,0.07)", color: "#888", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  No
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heart particle explosion */}
          <AnimatePresence>
            {saidYes && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex flex-col items-center"
              >
                <div className="relative h-20">
                  {particles.map((p) => (
                    <motion.span
                      key={p.id}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                      animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.5, rotate: p.angle }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute text-xl pointer-events-none"
                      style={{ left: "50%", top: "50%" }}
                    >
                      {p.emoji}
                    </motion.span>
                  ))}
                </div>
                <motion.p
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="font-serif text-2xl text-white text-center"
                >
                  Thank you 💕
                </motion.p>
                <p className="text-[#B76E79] text-sm mt-1">You've made me the happiest person.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reactions + CTA after answer */}
          {showReactions && (
            <>
              <div className="w-full">
                <EmojiReactions onReact={onReact} />
              </div>
              <ViralCTA experience={card.experience} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
