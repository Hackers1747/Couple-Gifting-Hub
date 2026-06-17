import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["❤️", "😭", "😍", "🥰", "😊"];

interface EmojiReactionsProps {
  onReact: (emoji: string) => void;
}

export default function EmojiReactions({ onReact }: EmojiReactionsProps) {
  const [reacted, setReacted] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleReact = (emoji: string) => {
    if (sent) return;
    setReacted(emoji);
    setSent(true);
    onReact(emoji);
  };

  return (
    <div className="py-6 px-4 text-center">
      <p className="text-sm text-[#666] mb-4">How did this make you feel?</p>
      <div className="flex justify-center gap-3 mb-3">
        {EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            whileTap={{ scale: 1.4 }}
            animate={reacted === emoji ? { scale: [1, 1.5, 1] } : {}}
            onClick={() => handleReact(emoji)}
            className="text-2xl p-2 rounded-full transition-all"
            style={{
              background:
                reacted === emoji
                  ? "rgba(183,110,121,0.2)"
                  : "rgba(255,255,255,0.05)",
              border:
                reacted === emoji
                  ? "1px solid rgba(183,110,121,0.5)"
                  : "1px solid transparent",
              opacity: sent && reacted !== emoji ? 0.4 : 1,
            }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {sent && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
            style={{ color: "#B76E79" }}
          >
            Sent! They'll be notified 💌
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
