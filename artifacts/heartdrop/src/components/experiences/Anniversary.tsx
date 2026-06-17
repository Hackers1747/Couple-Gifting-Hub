import { useMemo } from "react";
import { motion } from "framer-motion";
import EmojiReactions from "@/components/card/EmojiReactions";
import ViralCTA from "@/components/card/ViralCTA";
import type { CardData } from "@/hooks/useCardData";

function daysUntilAnniversary(dateStr?: string): number | null {
  if (!dateStr) return null;
  const today = new Date();
  const ann = new Date(dateStr);
  const next = new Date(today.getFullYear(), ann.getMonth(), ann.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / 86400000);
}

function yearsSince(dateStr?: string): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  return new Date().getFullYear() - d.getFullYear();
}

export default function Anniversary({ card, onReact }: { card: CardData; onReact: (e: string) => void }) {
  const days = useMemo(() => daysUntilAnniversary(card.anniversaryDate), [card.anniversaryDate]);
  const years = useMemo(() => yearsSince(card.anniversaryDate), [card.anniversaryDate]);

  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i, left: `${5 + i * 8}%`, delay: `${i * 0.6}s`, dur: `${5 + (i % 3)}s`, size: 12 + (i % 3) * 6,
  }));

  const photoRotations = [-4, 3, -2, 5, -3];

  return (
    <>
      <style>{`
        @keyframes floatHeart {
          0%   { transform:translateY(0) scale(1); opacity:0.6; }
          100% { transform:translateY(-100vh) scale(0.5); opacity:0; }
        }
      `}</style>

      <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden pb-10">
        {/* Floating hearts */}
        {hearts.map((h) => (
          <div
            key={h.id}
            className="fixed pointer-events-none text-[#B76E79]"
            style={{
              left: h.left, bottom: "-1rem", fontSize: h.size,
              animation: `floatHeart ${h.dur} ${h.delay} infinite linear`,
            }}
          >
            ❤️
          </div>
        ))}

        <div className="relative z-10 flex flex-col items-center px-5 pt-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#B76E79] text-xs uppercase tracking-widest mb-2"
          >
            From {card.senderName}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl text-white text-center mb-2"
          >
            {years > 0 ? `${years} Beautiful Years` : "Happy Anniversary"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#888] text-sm text-center mb-8"
          >
            {card.recipientName}, you're my everything ❤️
          </motion.p>

          {/* Polaroid photos */}
          {card.photos.length > 0 && (
            <div className="relative w-full h-44 mb-10 flex justify-center">
              {card.photos.slice(0, 5).map((url, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: photoRotations[i] }}
                  transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                  className="absolute rounded-sm overflow-hidden shadow-xl"
                  style={{
                    width: 120, height: 140,
                    background: "white",
                    left: `${10 + i * 16}%`,
                    top: i % 2 === 0 ? 0 : 16,
                    padding: "6px 6px 24px 6px",
                    zIndex: i,
                  }}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" style={{ borderRadius: 2 }} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border p-5 w-full mb-8"
            style={{ borderColor: "rgba(183,110,121,0.25)", background: "rgba(183,110,121,0.05)" }}
          >
            <p className="font-serif italic text-[#ddd] text-sm leading-relaxed text-center">
              "{card.message}"
            </p>
            <p className="text-right text-[#B76E79] text-xs mt-3">— {card.senderName}</p>
          </motion.div>

          {/* Story Timeline */}
          {card.storyMemories && card.storyMemories.length > 0 && (
            <div className="w-full mb-8">
              <h2 className="font-serif text-xl text-white mb-5 text-center">Our Story 📖</h2>
              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-0.5 top-0 bottom-0"
                  style={{ background: "linear-gradient(to bottom, #B76E79, transparent)" }}
                />
                {card.storyMemories.map((mem, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className={`relative flex mb-6 ${isLeft ? "pr-[52%]" : "pl-[52%]"}`}
                    >
                      {/* Dot */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full top-3"
                        style={{ background: "#B76E79" }}
                      />
                      <div
                        className="w-full rounded-xl border p-3"
                        style={{ borderColor: "rgba(183,110,121,0.2)", background: "rgba(183,110,121,0.05)" }}
                      >
                        {mem.date && (
                          <p className="text-[10px] text-[#B76E79] mb-1 font-medium">
                            {new Date(mem.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        )}
                        <p className="text-xs text-[#ccc]">{mem.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Countdown */}
          {days !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="rounded-2xl border p-5 w-full text-center mb-8"
              style={{ borderColor: "rgba(183,110,121,0.3)", background: "rgba(183,110,121,0.07)" }}
            >
              <p className="text-[#888] text-xs mb-1">Next anniversary in</p>
              <p className="font-serif text-4xl text-white font-bold">{days}</p>
              <p className="text-[#B76E79] text-sm">days 🗓</p>
            </motion.div>
          )}

          <div className="w-full"><EmojiReactions onReact={onReact} /></div>
          <ViralCTA experience={card.experience} />
        </div>
      </div>
    </>
  );
}
