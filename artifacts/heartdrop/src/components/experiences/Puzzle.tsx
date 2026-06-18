import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardExperienceLayout } from "@/components/cards/CardExperienceLayout";
import type { CardData } from "@/hooks/useCardData";

// ── Constants ─────────────────────────────────────────────────────────────────

const GRID = 3;
const TOTAL = GRID * GRID;
const EMPTY = TOTAL - 1; // index of the blank tile value

// Module-level so it's never recreated and is safe in useEffect deps
const SOLVED_STR = Array.from({ length: TOTAL }, (_, i) => i).join(",");

const EMOJIS = ["💜", "🌟", "✨", "💫", "🔮", "💎", "🌙", "⭐"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function freshBoard() {
  return shuffle(Array.from({ length: TOTAL }, (_, i) => i));
}

// ── Geometric background ──────────────────────────────────────────────────────
// Shapes are memoised at mount — Math.random() in JSX re-randomises every
// repaint which causes visible layout jumps as the puzzle re-renders.

interface GeoShape {
  id: number;
  sizePx: number;
  topPct: number;
  leftPct: number;
  isCircle: boolean;
  duration: number;
}

function GeoBg({ shapes }: { shapes: GeoShape[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute border border-[#a96ec9]"
          style={{
            width: s.sizePx,
            height: s.sizePx,
            top: `${s.topPct}%`,
            left: `${s.leftPct}%`,
            borderRadius: s.isCircle ? "50%" : "4px",
          }}
          animate={{ rotate: [0, 360], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface PuzzleCardProps {
  card: CardData;
  onReact: (emoji: string) => void;
}

export default function PuzzleCard({ card, onReact }: PuzzleCardProps) {
  const [tiles, setTiles] = useState<number[]>(freshBoard);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  // Stable geo shapes — computed once on mount
  const geoShapes = useMemo<GeoShape[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        sizePx: Math.random() * 120 + 60,
        topPct: Math.random() * 100,
        leftPct: Math.random() * 100,
        isCircle: Math.random() > 0.5,
        duration: Math.random() * 10 + 8,
      })),
    [],
  );

  // SOLVED_STR is module-level (never changes) so this effect is safe
  useEffect(() => {
    if (tiles.join(",") === SOLVED_STR) setSolved(true);
  }, [tiles]);

  const emptyIdx = tiles.indexOf(EMPTY);

  function canMove(idx: number) {
    const row = Math.floor(idx / GRID);
    const col = idx % GRID;
    const eRow = Math.floor(emptyIdx / GRID);
    const eCol = emptyIdx % GRID;
    return Math.abs(row - eRow) + Math.abs(col - eCol) === 1;
  }

  function moveTile(idx: number) {
    if (!canMove(idx) || solved) return;
    setTiles((prev) => {
      const next = [...prev];
      [next[idx], next[emptyIdx]] = [next[emptyIdx], next[idx]];
      return next;
    });
    setMoves((m) => m + 1);
  }

  function reset() {
    setTiles(freshBoard());
    setSolved(false);
    setMoves(0);
  }

  return (
    <>
      <GeoBg shapes={geoShapes} />

      <CardExperienceLayout
        cardType="puzzle"
        senderName={card.senderName}
        recipientName={card.recipientName}
        message={card.message}
        isWatermarked={card.isWatermarked}
        onReact={onReact}
        reactionsDelay={solved ? 800 : 99999}
      >
        {/* ── Experience-specific content ── */}
        <div className="flex items-center justify-between w-full">
          <p className="text-[#8a8a9a] text-sm">
            Moves:{" "}
            <span className="text-[#a96ec9] font-medium">{moves}</span>
          </p>
          <button
            onClick={reset}
            className="text-xs border border-white/20 text-white/50 px-3 py-1.5 rounded-full hover:border-[#a96ec9]/40 hover:text-[#a96ec9] transition-all duration-300"
          >
            Shuffle
          </button>
        </div>

        {/* Tile grid */}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, width: "270px" }}
        >
          {tiles.map((tile, idx) => {
            const isBlank = tile === EMPTY;
            const movable = canMove(idx);
            return (
              <motion.button
                key={tile}
                onClick={() => moveTile(idx)}
                whileHover={movable ? { scale: 1.05 } : {}}
                whileTap={movable ? { scale: 0.95 } : {}}
                className={[
                  "w-[82px] h-[82px] rounded-xl flex items-center justify-center text-2xl",
                  "transition-all duration-200 font-serif",
                  isBlank
                    ? "bg-transparent border border-dashed border-white/10"
                    : movable
                    ? "bg-[#a96ec9]/20 border border-[#a96ec9]/40 hover:bg-[#a96ec9]/30 cursor-pointer"
                    : "bg-[#13132a] border border-white/[0.06] cursor-default",
                ].join(" ")}
              >
                {!isBlank && <span>{EMOJIS[tile % EMOJIS.length]}</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Solved state */}
        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <div className="bg-[#a96ec9]/10 border border-[#a96ec9]/30 rounded-2xl p-6 text-center w-full">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-serif text-xl text-[#f5f0e8]">Puzzle Solved!</p>
                <p className="text-[#8a8a9a] text-sm mt-1">
                  {moves} moves mein solve kiya
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-[#a96ec9] to-[#c9a96e] text-white font-semibold px-8 py-4 rounded-full hover:shadow-[0_0_24px_rgba(169,110,201,0.4)] transition-all duration-300"
              >
                💜 Claim Your Reward
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardExperienceLayout>
    </>
  );
}
