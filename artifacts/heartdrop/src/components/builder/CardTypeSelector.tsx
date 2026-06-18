import { motion } from "framer-motion";

export type CardTypeId =
  | "birthday"
  | "proposal"
  | "sorry"
  | "anniversary"
  | "loveletter"
  | "puzzle"
  | "heartpage";

interface CardType {
  id: CardTypeId;
  label: string;
  emoji: string;
  desc: string;
}

const CARD_TYPES: CardType[] = [
  { id: "birthday",    label: "Birthday Bash", emoji: "🎂", desc: "Celebrate their day" },
  { id: "proposal",    label: "Proposal",       emoji: "💍", desc: "Pop the question" },
  { id: "sorry",       label: "Sorry Card",     emoji: "🕊️", desc: "Make it right" },
  { id: "anniversary", label: "Anniversary",    emoji: "✨", desc: "Celebrate your love" },
  { id: "loveletter",  label: "Love Letter",    emoji: "💌", desc: "Words from the heart" },
  { id: "puzzle",      label: "Puzzle",         emoji: "🧩", desc: "Make them think" },
  { id: "heartpage",   label: "HeartPage",      emoji: "❤️", desc: "Your love story" },
];

interface CardTypeSelectorProps {
  selected: CardTypeId | null;
  onSelect: (id: CardTypeId) => void;
}

export function CardTypeSelector({ selected, onSelect }: CardTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CARD_TYPES.map(({ id, label, emoji, desc }, i) => {
        const isSelected = selected === id;
        return (
          <motion.button
            key={id}
            onClick={() => onSelect(id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={[
              "p-4 rounded-2xl border text-left transition-all duration-300",
              isSelected
                ? "border-[#c9a96e] bg-[#c9a96e]/10 shadow-[0_0_20px_rgba(201,169,110,0.15)]"
                : "border-white/[0.06] bg-[#13132a] hover:border-white/20 hover:bg-white/[0.03]",
            ].join(" ")}
          >
            <span className="text-2xl mb-2 block">{emoji}</span>
            <span
              className={[
                "text-sm font-medium block mb-0.5",
                isSelected ? "text-[#c9a96e]" : "text-[#f5f0e8]",
              ].join(" ")}
            >
              {label}
            </span>
            <span className="text-xs text-[#8a8a9a]">{desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
