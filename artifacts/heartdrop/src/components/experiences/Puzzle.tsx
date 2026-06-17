import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiReactions from "@/components/card/EmojiReactions";
import ViralCTA from "@/components/card/ViralCTA";
import type { CardData } from "@/hooks/useCardData";

function scramble(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isSolved(tiles: number[]) {
  return tiles.every((t, i) => t === i);
}

export default function PuzzleCard({ card, onReact }: { card: CardData; onReact: (e: string) => void }) {
  const SIZE = 3;
  const TOTAL = SIZE * SIZE;
  const [tiles, setTiles] = useState<number[]>(() => scramble(TOTAL));
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const photoUrl = card.photos[0];

  useEffect(() => {
    timerRef.current = setTimeout(() => setShowReveal(true), 60000);
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleTap = (idx: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(idx);
    } else {
      if (selected === idx) { setSelected(null); return; }
      const next = [...tiles];
      [next[selected], next[idx]] = [next[idx], next[selected]];
      setTiles(next);
      setSelected(null);
      if (isSolved(next)) {
        setSolved(true);
        setSparkle(true);
        clearTimeout(timerRef.current);
        setTimeout(() => setShowReactions(true), 1400);
      }
    }
  };

  const doReveal = () => {
    setRevealed(true);
    setTiles(Array.from({ length: TOTAL }, (_, i) => i));
    setSolved(true);
    setTimeout(() => setShowReactions(true), 800);
  };

  const tileSize = Math.min(340, window.innerWidth - 40);
  const cellSize = tileSize / SIZE;

  return (
    <div className="min-h-screen pb-10" style={{ background: "#141414" }}>
      <div className="flex flex-col items-center px-5 pt-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-[#B76E79] text-xs uppercase tracking-widest text-center mb-1">
            From {card.senderName}
          </p>
          <h1 className="font-serif text-2xl text-white text-center mb-2">
            Solve the puzzle, {card.recipientName} 🧩
          </h1>
          {!solved && (
            <p className="text-[#666] text-sm text-center mb-5">
              Tap a tile, then tap where to move it
            </p>
          )}
        </motion.div>

        {/* Puzzle grid */}
        <div
          className="relative mb-6 rounded-2xl overflow-hidden"
          style={{ width: tileSize, height: tileSize }}
        >
          {tiles.map((tileIdx, position) => {
            const row = Math.floor(tileIdx / SIZE);
            const col = tileIdx % SIZE;
            const bgX = -(col * cellSize);
            const bgY = -(row * cellSize);
            const isSelected = selected === position;

            return (
              <motion.button
                key={tileIdx}
                layout
                animate={{
                  outline: isSelected ? "3px solid #B76E79" : "1px solid rgba(255,255,255,0.08)",
                  scale: isSelected ? 0.95 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onClick={() => handleTap(position)}
                className="absolute"
                style={{
                  width: cellSize - 2,
                  height: cellSize - 2,
                  left: (position % SIZE) * cellSize + 1,
                  top: Math.floor(position / SIZE) * cellSize + 1,
                  backgroundImage: photoUrl ? `url(${photoUrl})` : undefined,
                  backgroundSize: `${tileSize}px ${tileSize}px`,
                  backgroundPosition: `${bgX}px ${bgY}px`,
                  backgroundColor: !photoUrl ? `hsl(${tileIdx * 40}, 50%, 30%)` : undefined,
                  cursor: "pointer",
                }}
              >
                {!photoUrl && (
                  <span className="text-white font-bold text-lg opacity-50">{tileIdx + 1}</span>
                )}
              </motion.button>
            );
          })}

          {/* Sparkle overlay */}
          <AnimatePresence>
            {sparkle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ background: "rgba(183,110,121,0.35)" }}
              >
                <span className="text-5xl">✨</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reveal button after 60s */}
        <AnimatePresence>
          {showReveal && !solved && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={doReveal}
              className="btn-pill px-6 py-2.5 text-sm font-medium mb-5"
              style={{ background: "rgba(183,110,121,0.12)", color: "#B76E79", border: "1px solid rgba(183,110,121,0.3)" }}
            >
              Reveal? 👀
            </motion.button>
          )}
        </AnimatePresence>

        {/* Message after solve */}
        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              {!revealed && (
                <p className="font-serif text-xl text-white text-center mb-4">
                  You solved it! 🎉
                </p>
              )}
              <div
                className="rounded-2xl border p-5 mb-6"
                style={{ borderColor: "rgba(183,110,121,0.25)", background: "rgba(183,110,121,0.05)" }}
              >
                <p className="font-serif italic text-[#ddd] text-sm leading-relaxed text-center">
                  "{card.message}"
                </p>
                <p className="text-right text-[#B76E79] text-xs mt-3">— {card.senderName}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showReactions && (
          <>
            <div className="w-full"><EmojiReactions onReact={onReact} /></div>
            <ViralCTA experience={card.experience} />
          </>
        )}
      </div>
    </div>
  );
}
