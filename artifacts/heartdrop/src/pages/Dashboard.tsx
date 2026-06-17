import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardRecord {
  id: string;
  type: string;
  recipientName: string;
  status: "created" | "sent" | "opened" | "reacted";
  reactionEmoji?: string;
  openedAt?: string;
  watermarkClicks: number;
  shareToken: string;
  createdAt: string;
}

const MOCK_CARDS: CardRecord[] = [
  {
    id: "1",
    type: "anniversary",
    recipientName: "Priya",
    status: "reacted",
    reactionEmoji: "😍",
    openedAt: "2 hours ago",
    watermarkClicks: 3,
    shareToken: "anniversary-demo",
    createdAt: "Today",
  },
  {
    id: "2",
    type: "birthday",
    recipientName: "Ananya",
    status: "opened",
    openedAt: "Yesterday",
    watermarkClicks: 1,
    shareToken: "birthday-demo",
    createdAt: "2 days ago",
  },
  {
    id: "3",
    type: "sorry",
    recipientName: "Riya",
    status: "sent",
    watermarkClicks: 0,
    shareToken: "sorry-demo",
    createdAt: "3 days ago",
  },
  {
    id: "4",
    type: "love-letter",
    recipientName: "Meera",
    status: "created",
    watermarkClicks: 0,
    shareToken: "love-letter-demo",
    createdAt: "5 days ago",
  },
];

const TYPE_EMOJI: Record<string, string> = {
  anniversary: "💑",
  birthday: "🎂",
  sorry: "💔",
  proposal: "💍",
  puzzle: "🧩",
  "love-letter": "💌",
  heartpage: "✨",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  created: { label: "Created", color: "#9ca3af", bg: "rgba(156,163,175,0.1)" },
  sent: { label: "Sent", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  opened: { label: "Opened", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  reacted: { label: "Reacted ❤", color: "#B76E79", bg: "rgba(183,110,121,0.12)" },
};

function timeAgo(dateStr: string) {
  return dateStr;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [cards] = useState<CardRecord[]>(MOCK_CARDS);
  const [reminderDate, setReminderDate] = useState("2026-09-15");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [loveDrop, setLoveDrop] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const totalOpens = cards.filter((c) => c.status === "opened" || c.status === "reacted").length;
  const totalReacted = cards.filter((c) => c.status === "reacted").length;
  const streak = 3;
  const isPremium = true;

  async function copyLink(token: string) {
    try {
      await navigator.clipboard.writeText(`https://heartdrop.in/card/${token}`);
    } catch {}
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  const nextAnniversary = () => {
    if (!reminderDate) return "Not set";
    const d = new Date(reminderDate);
    const now = new Date();
    d.setFullYear(now.getFullYear());
    if (d < now) d.setFullYear(now.getFullYear() + 1);
    const days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days away`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24" style={{ maxWidth: 430, margin: "0 auto" }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-serif text-2xl text-white">Your HeartDrops</h1>
          <span className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ background: "rgba(183,110,121,0.15)", color: "#B76E79" }}>
            {isPremium ? "✨ Unlimited" : "Free"}
          </span>
        </div>
        <p className="text-gray-500 text-xs">Track every surprise you've sent</p>
      </div>

      {/* Stats row */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📨", label: "Sent", value: cards.length },
            { icon: "👁", label: "Opened", value: totalOpens },
            { icon: "🔥", label: "Streak", value: `${streak}mo` },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-white font-semibold text-lg">{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cards list */}
      <div className="px-4 mb-6">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Your Cards</p>
        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">💝</div>
            <p className="text-gray-400 text-base mb-1">No surprises yet</p>
            <p className="text-gray-600 text-sm mb-6">Create your first card to see it here</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/create")}
              className="px-6 py-3 rounded-2xl font-medium text-white text-sm"
              style={{ background: "linear-gradient(135deg, #B76E79 0%, #8B4E5A 100%)" }}
            >
              Create your first card →
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {cards.map((card, i) => {
              const sc = STATUS_CONFIG[card.status];
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{TYPE_EMOJI[card.type] || "💝"}</span>
                      <div>
                        <p className="text-white font-medium text-sm">For {card.recipientName}</p>
                        <p className="text-gray-500 text-xs capitalize">{card.type.replace("-", " ")} · {card.createdAt}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium shrink-0"
                      style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>

                  {card.reactionEmoji && (
                    <p className="text-sm mb-2">
                      Reacted with <span className="text-lg">{card.reactionEmoji}</span>
                    </p>
                  )}
                  {card.openedAt && (
                    <p className="text-gray-500 text-xs mb-2">Opened {timeAgo(card.openedAt)}</p>
                  )}
                  {card.watermarkClicks > 0 && (
                    <p className="text-gray-600 text-xs mb-2">
                      👆 {card.watermarkClicks} {card.watermarkClicks === 1 ? "person" : "people"} tapped watermark
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyLink(card.shareToken)}
                      className="flex-1 py-2 rounded-xl text-xs font-medium"
                      style={{
                        background: copied === card.shareToken ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
                        color: copied === card.shareToken ? "#4ade80" : "#9ca3af",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {copied === card.shareToken ? "Copied ✓" : "📋 Copy link"}
                    </motion.button>
                    <motion.a
                      whileTap={{ scale: 0.95 }}
                      href={`https://wa.me/?text=${encodeURIComponent(`A surprise for you 💝\nhttps://heartdrop.in/card/${card.shareToken}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl text-xs font-medium text-center"
                      style={{ background: "rgba(37,211,102,0.08)", color: "#25D366", border: "1px solid rgba(37,211,102,0.15)" }}
                    >
                      💚 WhatsApp
                    </motion.a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Relationship OS — premium only */}
      {isPremium && (
        <div className="px-4 mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Relationship OS</p>
          <div className="space-y-3">
            {/* Love Drop */}
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(183,110,121,0.06)", border: "1px solid rgba(183,110,121,0.15)" }}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-white text-sm font-medium">💝 Monthly Love Drop</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {loveDrop ? "Next drop in 12 days" : "Paused"}
                  </p>
                </div>
                <button
                  onClick={() => setLoveDrop(!loveDrop)}
                  className="relative w-11 h-6 rounded-full transition-all"
                  style={{ background: loveDrop ? "#B76E79" : "rgba(255,255,255,0.1)" }}
                >
                  <motion.div
                    animate={{ x: loveDrop ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>
            </div>

            {/* Anniversary reminder */}
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">🗓 Anniversary Reminder</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {reminderDate
                      ? `${new Date(reminderDate).toLocaleDateString("en-IN", { day: "numeric", month: "long" })} · ${nextAnniversary()}`
                      : "Not set"}
                  </p>
                </div>
                <button
                  onClick={() => setShowReminderModal(true)}
                  className="text-xs px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(183,110,121,0.12)", color: "#B76E79" }}
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Streak */}
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-white text-sm font-medium mb-1">🔥 Streak</p>
              <p className="text-gray-400 text-xs mb-3">
                You've surprised Priya for {streak} months in a row!
              </p>
              <div className="relative h-2 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(streak / 6) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #B76E79, #f9a8d4)" }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>0</span>
                <span className="text-[#B76E79]">🏅 Loyal Heart at 6 months</span>
                <span>6</span>
              </div>
              {streak >= 12 && (
                <p className="text-center text-[#B76E79] text-xs mt-2 font-medium">👑 Legendary Lover badge unlocked!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Anniversary date modal */}
      <AnimatePresence>
        {showReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-end justify-center z-50"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowReminderModal(false)}
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-3xl p-6 pb-10"
              style={{ background: "#111", maxWidth: 430 }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.15)" }} />
              <h3 className="text-white font-serif text-xl mb-4">Set Anniversary Date</h3>
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-white mb-4"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              />
              <button
                onClick={() => setShowReminderModal(false)}
                className="w-full py-3 rounded-xl font-medium text-white"
                style={{ background: "linear-gradient(135deg, #B76E79 0%, #8B4E5A 100%)" }}
              >
                Save
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate("/create")}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white text-2xl flex items-center justify-center shadow-lg z-40"
        style={{
          background: "linear-gradient(135deg, #B76E79 0%, #8B4E5A 100%)",
          boxShadow: "0 4px 24px rgba(183,110,121,0.5)",
        }}
      >
        +
      </motion.button>
    </div>
  );
}
