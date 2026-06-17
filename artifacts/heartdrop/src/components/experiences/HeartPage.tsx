import { motion } from "framer-motion";
import EmojiReactions from "@/components/card/EmojiReactions";
import ViralCTA from "@/components/card/ViralCTA";
import type { CardData } from "@/hooks/useCardData";

export default function HeartPageCard({ card, onReact }: { card: CardData; onReact: (e: string) => void }) {
  const hearts = Array.from({ length: 10 }, (_, i) => ({
    id: i, left: `${5 + i * 9}%`, delay: `${i * 0.4}s`, dur: `${4 + (i % 3)}s`, size: 10 + (i % 4) * 4,
  }));

  return (
    <>
      <style>{`
        @keyframes floatUp { 0%{transform:translateY(0);opacity:.5}100%{transform:translateY(-100vh);opacity:0} }
      `}</style>
      <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden pb-10">
        {hearts.map((h) => (
          <div key={h.id} className="fixed pointer-events-none text-[#B76E79]"
            style={{ left: h.left, bottom: 0, fontSize: h.size, animation: `floatUp ${h.dur} ${h.delay} infinite linear` }}>
            ✨
          </div>
        ))}
        <div className="relative z-10 flex flex-col items-center px-5 pt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <p className="text-[#B76E79] text-xs uppercase tracking-widest mb-2">From {card.senderName}</p>
            <h1 className="font-serif text-3xl text-white mb-2">A HeartDrop for you, {card.recipientName} ✨</h1>
          </motion.div>
          {(card.photos ?? [])[0] && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="w-full rounded-2xl overflow-hidden mb-6" style={{ boxShadow: "0 0 30px rgba(183,110,121,0.3)" }}>
              <img src={card.photos[0]} alt="" className="w-full object-cover" style={{ maxHeight: 280 }} />
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border p-5 w-full mb-6"
            style={{ borderColor: "rgba(183,110,121,0.25)", background: "rgba(183,110,121,0.05)" }}>
            <p className="font-serif italic text-[#ddd] text-sm leading-relaxed text-center">"{card.message}"</p>
            <p className="text-right text-[#B76E79] text-xs mt-3">— {card.senderName}</p>
          </motion.div>
          <div className="w-full"><EmojiReactions onReact={onReact} /></div>
          <ViralCTA experience={card.experience} />
        </div>
      </div>
    </>
  );
}
