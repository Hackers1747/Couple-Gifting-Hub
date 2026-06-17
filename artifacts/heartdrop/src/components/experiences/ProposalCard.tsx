import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import EmojiReactions from "@/components/card/EmojiReactions";
import ViralCTA from "@/components/card/ViralCTA";
import type { CardData } from "@/hooks/useCardData";

function useTypewriter(text: string, delay = 800, speed = 38) {
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

export default function ProposalCard({ card, onReact }: { card: CardData; onReact: (e: string) => void }) {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [saidYes, setSaidYes] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [showReactions, setShowReactions] = useState(false);
  const displayedMsg = useTypewriter(card.message, 1600);

  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i, top: `${Math.random() * 90}%`, left: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.5, delay: `${Math.random() * 4}s`,
    dur: `${2 + Math.random() * 3}s`,
  }));

  const moveNo = () => {
    setNoPos({ x: (Math.random() - 0.5) * 240, y: (Math.random() - 0.5) * 120 });
  };

  const handleYes = () => {
    setSaidYes(true);
    setAnswered(true);
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#B76E79", "#ff6b9d", "#fff", "#ffd700"] });
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5 } }), 400);
    setTimeout(() => setShowReactions(true), 1500);
  };

  return (
    <>
      <style>{`
        @keyframes twinkle { 0%,100% { opacity:0.2; transform:scale(1) } 50% { opacity:1; transform:scale(1.4) } }
      `}</style>

      <div className="relative min-h-screen overflow-hidden pb-10" style={{ background: "#0A0F2C" }}>
        {/* Stars */}
        {stars.map((s) => (
          <div
            key={s.id}
            className="fixed rounded-full bg-white pointer-events-none"
            style={{
              top: s.top, left: s.left, width: s.size, height: s.size,
              animation: `twinkle ${s.dur} ${s.delay} infinite ease-in-out`,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center px-5 pt-12">
          {/* Photo with curtain */}
          <div className="relative w-64 h-64 mb-8 rounded-2xl overflow-hidden">
            {card.photos[0] ? (
              <img src={card.photos[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(183,110,121,0.1)" }}>
                <span className="text-7xl">💍</span>
              </div>
            )}
            {/* Curtain halves */}
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2"
              style={{ background: "linear-gradient(90deg,#0A0F2C,#1a1f4c)", transformOrigin: "left" }}
              animate={curtainOpen ? { scaleX: 0 } : { scaleX: 1 }}
              transition={{ duration: 0.8, ease: [0.32, 0, 0.67, 0] }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-1/2"
              style={{ background: "linear-gradient(270deg,#0A0F2C,#1a1f4c)", transformOrigin: "right" }}
              animate={curtainOpen ? { scaleX: 0 } : { scaleX: 1 }}
              transition={{ duration: 0.8, ease: [0.32, 0, 0.67, 0] }}
            />
            {!curtainOpen && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => setCurtainOpen(true)}
                className="absolute inset-0 flex items-center justify-center text-sm text-white font-medium"
                style={{ background: "rgba(10,15,44,0.3)" }}
              >
                Tap to reveal ✨
              </motion.button>
            )}
          </div>

          <motion.p className="text-[#7B9FFF] text-xs uppercase tracking-widest mb-2">
            From {card.senderName}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: curtainOpen ? 1 : 0, y: curtainOpen ? 0 : 12 }}
            transition={{ delay: 0.5 }}
            className="font-serif text-3xl text-white mb-6 text-center"
          >
            {card.recipientName}, my love…
          </motion.h1>

          {/* Message */}
          <AnimatePresence>
            {curtainOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl border p-5 mb-8 w-full"
                style={{ borderColor: "rgba(123,159,255,0.25)", background: "rgba(123,159,255,0.05)" }}
              >
                <p className="text-[#ddd] text-sm leading-relaxed font-serif italic">
                  "{displayedMsg}
                  <span className="animate-pulse">|</span>"
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Will you be mine + YES/NO */}
          <AnimatePresence>
            {curtainOpen && !answered && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative flex flex-col items-center gap-4 w-full"
              >
                <p className="font-serif text-2xl text-white text-center">Will you be mine? 💍</p>
                <button
                  onClick={handleYes}
                  className="btn-pill w-52 py-3.5 font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #B76E79, #8B4A56)", boxShadow: "0 0 24px rgba(183,110,121,0.5)" }}
                >
                  Yes, always 💍
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

          {/* YES response */}
          <AnimatePresence>
            {saidYes && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <span className="text-6xl mb-3">💍</span>
                <p className="font-serif text-3xl text-white">You said yes!</p>
                <p className="text-[#B76E79] text-sm mt-1">This is the best day ever 🥂</p>
              </motion.div>
            )}
          </AnimatePresence>

          {showReactions && (
            <>
              <div className="w-full mt-6"><EmojiReactions onReact={onReact} /></div>
              <ViralCTA experience={card.experience} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
