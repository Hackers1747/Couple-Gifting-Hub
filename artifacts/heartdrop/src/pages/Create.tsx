import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

type Experience =
  | "sorry"
  | "proposal"
  | "birthday"
  | "anniversary"
  | "puzzle"
  | "love_letter"
  | "heartpage";

type Tone = "Romantic" | "Funny" | "Emotional" | "Poetic" | "Casual";

interface StoryMemory {
  date: string;
  text: string;
  photoUrl?: string;
}

interface CardState {
  experience: Experience | null;
  recipientName: string;
  senderName: string;
  photos: string[];
  message: string;
  tone: Tone | null;
  theme: string;
  scheduledAt: string;
  receiverWhatsapp: string;
  aiMessages: string[];
  storyMemories: StoryMemory[];
  voiceNote: boolean;
  pdfDownload: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXPERIENCES: { id: Experience; emoji: string; label: string }[] = [
  { id: "sorry", emoji: "💔", label: "Sorry Card" },
  { id: "proposal", emoji: "💍", label: "Proposal" },
  { id: "birthday", emoji: "🎂", label: "Birthday" },
  { id: "anniversary", emoji: "💑", label: "Anniversary" },
  { id: "puzzle", emoji: "🧩", label: "Puzzle" },
  { id: "love_letter", emoji: "💌", label: "Love Letter" },
  { id: "heartpage", emoji: "✨", label: "HeartPage" },
];

const TONES: Tone[] = ["Romantic", "Funny", "Emotional", "Poetic", "Casual"];

const THEMES = [
  { id: "dark_rose", label: "Dark Rose", bg: "#0A0A0A", accent: "#B76E79", free: true },
  { id: "minimal_white", label: "Minimal White", bg: "#FAFAFA", accent: "#B76E79", free: false },
  { id: "neon_glow", label: "Neon Glow", bg: "#0A0A0A", accent: "#00FF94", free: false },
  { id: "midnight_blue", label: "Midnight Blue", bg: "#0A0F2C", accent: "#7B9FFF", free: false },
];

// ─── Slide animation ──────────────────────────────────────────────────────────

const slideVariants = {
  enterRight: { x: "100%", opacity: 0 },
  enterLeft: { x: "-100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitLeft: { x: "-100%", opacity: 0 },
  exitRight: { x: "100%", opacity: 0 },
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = ((step - 1) / (total - 1)) * 100;
  return (
    <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg, #B76E79, #8B4A56)" }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── Shared button styles ─────────────────────────────────────────────────────

const primaryBtn =
  "btn-pill w-full py-4 font-semibold text-[0.95rem] text-white transition-all active:scale-95 disabled:opacity-40";
const primaryBtnStyle = {
  background: "linear-gradient(135deg, #B76E79 0%, #8B4A56 100%)",
  boxShadow: "0 0 20px rgba(183,110,121,0.3)",
};

// ─── STEP 1 — Choose Experience ───────────────────────────────────────────────

function Step1({
  value,
  onChange,
}: {
  value: Experience | null;
  onChange: (v: Experience) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Choose your moment</h2>
      <p className="text-[#888] text-sm mb-6">What do you want to say?</p>
      <div className="grid grid-cols-2 gap-3">
        {EXPERIENCES.map((exp) => {
          const selected = value === exp.id;
          return (
            <motion.button
              key={exp.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(exp.id)}
              className="flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all"
              style={{
                background: selected
                  ? "rgba(183,110,121,0.15)"
                  : "rgba(255,255,255,0.03)",
                borderColor: selected ? "#B76E79" : "rgba(255,255,255,0.08)",
                boxShadow: selected ? "0 0 16px rgba(183,110,121,0.25)" : "none",
              }}
            >
              <span className="text-3xl">{exp.emoji}</span>
              <span
                className="text-xs font-medium text-center"
                style={{ color: selected ? "#B76E79" : "#aaa" }}
              >
                {exp.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 2 — Names ───────────────────────────────────────────────────────────

function Step2({
  recipientName,
  senderName,
  onRecipient,
  onSender,
}: {
  recipientName: string;
  senderName: string;
  onRecipient: (v: string) => void;
  onSender: (v: string) => void;
}) {
  const inputCls =
    "w-full rounded-2xl border px-4 py-3.5 text-sm text-white bg-transparent outline-none transition-all placeholder-[#555] focus:border-[#B76E79]";
  const inputStyle = { borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" };

  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Who's this for?</h2>
      <p className="text-[#888] text-sm mb-7">We'll personalise the card for them.</p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-[#888] mb-1.5 block">Who is this for?</label>
          <input
            className={inputCls}
            style={inputStyle}
            placeholder="e.g. Priya, Riya, my love…"
            value={recipientName}
            onChange={(e) => onRecipient(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-[#888] mb-1.5 block">Your name</label>
          <input
            className={inputCls}
            style={inputStyle}
            placeholder="e.g. Rohan"
            value={senderName}
            onChange={(e) => onSender(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3 — Upload Photos ───────────────────────────────────────────────────

function Step3({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[];
  onAdd: (urls: string[]) => void;
  onRemove: (i: number) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || photos.length >= 5) return;
      setUploading(true);
      const remaining = 5 - photos.length;
      const toUpload = Array.from(files).slice(0, remaining);
      // Preview via object URLs (Supabase upload wired in Phase 4)
      const urls = toUpload.map((f) => URL.createObjectURL(f));
      onAdd(urls);
      setUploading(false);
    },
    [photos.length, onAdd]
  );

  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Add photos</h2>
      <p className="text-[#888] text-sm mb-6">Up to 5 photos to make it personal.</p>

      {photos.length < 5 && (
        <label
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-8 mb-4 cursor-pointer transition-all"
          style={{ borderColor: "rgba(183,110,121,0.35)", background: "rgba(183,110,121,0.04)" }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="text-3xl">{uploading ? "⏳" : "📸"}</span>
          <span className="text-sm text-[#888]">
            {uploading ? "Uploading…" : "Tap to upload photos"}
          </span>
          <span className="text-xs text-[#555]">{photos.length}/5 added</span>
        </label>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((url, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── STEP 3B — Anniversary Timeline ──────────────────────────────────────────

function Step3B({
  memories,
  onChange,
}: {
  memories: StoryMemory[];
  onChange: (m: StoryMemory[]) => void;
}) {
  const inputCls =
    "w-full rounded-xl border px-3 py-2.5 text-sm text-white bg-transparent outline-none placeholder-[#555] focus:border-[#B76E79] transition-all";
  const inputStyle = { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" };

  const update = (i: number, field: keyof StoryMemory, val: string) => {
    const next = memories.map((m, idx) => (idx === i ? { ...m, [field]: val } : m));
    onChange(next);
  };

  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Your love story</h2>
      <p className="text-[#888] text-sm mb-6">Add up to 3 special memories.</p>
      <div className="flex flex-col gap-5">
        {memories.map((mem, i) => (
          <div
            key={i}
            className="rounded-2xl border p-4"
            style={{ borderColor: "rgba(183,110,121,0.2)", background: "rgba(183,110,121,0.04)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#B76E79" }}
            >
              Memory {i + 1}
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="date"
                className={inputCls}
                style={{ ...inputStyle, colorScheme: "dark" }}
                value={mem.date}
                onChange={(e) => update(i, "date", e.target.value)}
              />
              <input
                className={inputCls}
                style={inputStyle}
                placeholder="What happened? (60 chars)"
                maxLength={60}
                value={mem.text}
                onChange={(e) => update(i, "text", e.target.value)}
              />
              <label className="flex items-center gap-2 text-xs text-[#888] cursor-pointer">
                <span>📷</span>
                <span>Add a photo (optional)</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 4 — AI Message Generator ───────────────────────────────────────────

function Step4({
  tone,
  onTone,
  message,
  onMessage,
  aiMessages,
  onAiMessages,
  experience,
  recipientName,
  senderName,
}: {
  tone: Tone | null;
  onTone: (t: Tone) => void;
  message: string;
  onMessage: (m: string) => void;
  aiMessages: string[];
  onAiMessages: (msgs: string[]) => void;
  experience: Experience | null;
  recipientName: string;
  senderName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!tone) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience, recipientName, senderName, tone }),
      });
      const data = await res.json();
      if (data.messages) {
        onAiMessages(data.messages);
      } else {
        setError("Could not generate messages. Please write one below.");
      }
    } catch {
      setError("Network error. Please write your message below.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Write your message</h2>
      <p className="text-[#888] text-sm mb-6">Pick a tone, then let AI help you express it.</p>

      {/* Tone pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TONES.map((t) => (
          <button
            key={t}
            onClick={() => onTone(t)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={
              tone === t
                ? { background: "#B76E79", color: "white" }
                : {
                    background: "rgba(255,255,255,0.05)",
                    color: "#aaa",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={!tone || loading}
        className="btn-pill w-full py-3 font-semibold text-sm mb-5 transition-all disabled:opacity-40"
        style={primaryBtnStyle}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">✨</span> Generating…
          </span>
        ) : (
          "Generate 3 messages ✨"
        )}
      </button>

      {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

      {/* AI message cards */}
      {aiMessages.length > 0 && (
        <div className="flex flex-col gap-3 mb-5">
          {aiMessages.map((msg, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onMessage(msg)}
              className="text-left rounded-2xl border p-4 text-sm leading-relaxed transition-all"
              style={{
                background:
                  message === msg
                    ? "rgba(183,110,121,0.15)"
                    : "rgba(255,255,255,0.03)",
                borderColor:
                  message === msg ? "#B76E79" : "rgba(255,255,255,0.08)",
                color: "#ddd",
              }}
            >
              {msg}
            </motion.button>
          ))}
        </div>
      )}

      {/* Editable textarea */}
      <label className="text-xs text-[#888] mb-1.5 block">
        Write or edit your message
      </label>
      <textarea
        className="w-full rounded-2xl border px-4 py-3 text-sm text-white bg-transparent outline-none placeholder-[#555] focus:border-[#B76E79] resize-none transition-all"
        style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", minHeight: 110 }}
        placeholder="Type something heartfelt…"
        value={message}
        onChange={(e) => onMessage(e.target.value)}
      />
    </div>
  );
}

// ─── STEP 5 — Theme Picker ────────────────────────────────────────────────────

function Step5({
  theme,
  onTheme,
}: {
  theme: string;
  onTheme: (t: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Pick a theme</h2>
      <p className="text-[#888] text-sm mb-6">Free plan includes Dark Rose.</p>
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((t) => {
          const selected = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => t.free && onTheme(t.id)}
              className="relative rounded-2xl overflow-hidden border transition-all"
              style={{
                borderColor: selected ? "#B76E79" : "rgba(255,255,255,0.08)",
                boxShadow: selected ? "0 0 16px rgba(183,110,121,0.3)" : "none",
                opacity: t.free ? 1 : 0.7,
              }}
            >
              {/* Swatch */}
              <div
                className="h-20 w-full flex items-center justify-center"
                style={{ background: t.bg }}
              >
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: t.accent, color: t.bg === "#FAFAFA" ? "#111" : "white" }}
                >
                  Aa
                </span>
              </div>
              <div
                className="px-3 py-2 text-left"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <p className="text-xs font-medium text-white">{t.label}</p>
                {!t.free && (
                  <p className="text-[10px] mt-0.5" style={{ color: "#B76E79" }}>
                    🔒 Premium
                  </p>
                )}
              </div>
              {!t.free && (
                <div className="absolute inset-0 rounded-2xl" style={{ background: "rgba(10,10,10,0.5)" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 6 — Schedule ────────────────────────────────────────────────────────

function Step6({
  scheduledAt,
  onSchedule,
  whatsapp,
  onWhatsapp,
}: {
  scheduledAt: string;
  onSchedule: (v: string) => void;
  whatsapp: string;
  onWhatsapp: (v: string) => void;
}) {
  const [sendLater, setSendLater] = useState(!!scheduledAt);

  const inputCls =
    "w-full rounded-2xl border px-4 py-3.5 text-sm text-white bg-transparent outline-none placeholder-[#555] focus:border-[#B76E79] transition-all";
  const inputStyle = { borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" };

  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Delivery</h2>
      <p className="text-[#888] text-sm mb-7">Schedule it or send it right away.</p>

      {/* Send Later toggle */}
      <div
        className="flex items-center justify-between rounded-2xl border p-4 mb-5"
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
      >
        <div>
          <p className="text-sm text-white font-medium">Send later?</p>
          <p className="text-xs text-[#666] mt-0.5">Pick a date & time</p>
        </div>
        <button
          onClick={() => {
            const next = !sendLater;
            setSendLater(next);
            if (!next) onSchedule("");
          }}
          className="w-12 h-6 rounded-full transition-all relative"
          style={{
            background: sendLater
              ? "linear-gradient(135deg, #B76E79, #8B4A56)"
              : "rgba(255,255,255,0.1)",
          }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
            animate={{ left: sendLater ? "calc(100% - 22px)" : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {sendLater && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden"
          >
            <label className="text-xs text-[#888] mb-1.5 block">Date & time</label>
            <input
              type="datetime-local"
              className={inputCls}
              style={{ ...inputStyle, colorScheme: "dark" }}
              value={scheduledAt}
              onChange={(e) => onSchedule(e.target.value)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <label className="text-xs text-[#888] mb-1.5 block">
        Receiver's WhatsApp (optional)
      </label>
      <input
        className={inputCls}
        style={inputStyle}
        placeholder="+91 98765 43210"
        value={whatsapp}
        onChange={(e) => onWhatsapp(e.target.value)}
      />
    </div>
  );
}

// ─── STEP 7 — Add-ons ─────────────────────────────────────────────────────────

function Step7({
  voiceNote,
  pdfDownload,
  onVoice,
  onPdf,
}: {
  voiceNote: boolean;
  pdfDownload: boolean;
  onVoice: (v: boolean) => void;
  onPdf: (v: boolean) => void;
}) {
  const [voiceAlert, setVoiceAlert] = useState(false);
  const [pdfAlert, setPdfAlert] = useState(false);

  const ToggleRow = ({
    emoji,
    label,
    sub,
    value,
    onToggle,
    showAlert,
  }: {
    emoji: string;
    label: string;
    sub: string;
    value: boolean;
    onToggle: () => void;
    showAlert: boolean;
  }) => (
    <div>
      <div
        className="flex items-center justify-between rounded-2xl border p-4"
        style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <div>
            <p className="text-sm text-white font-medium">{label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#B76E79" }}>
              Premium only
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-12 h-6 rounded-full transition-all relative"
          style={{
            background: value
              ? "linear-gradient(135deg, #B76E79, #8B4A56)"
              : "rgba(255,255,255,0.1)",
          }}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
            animate={{ left: value ? "calc(100% - 22px)" : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
      <AnimatePresence>
        {showAlert && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs px-4 mt-1.5"
            style={{ color: "#B76E79" }}
          >
            {sub}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Add-ons</h2>
      <p className="text-[#888] text-sm mb-7">Make it even more special.</p>
      <div className="flex flex-col gap-4">
        <ToggleRow
          emoji="🎙"
          label="Add voice note"
          sub="Upgrade to Premium to record a voice note."
          value={voiceNote}
          showAlert={voiceAlert}
          onToggle={() => {
            setVoiceAlert(true);
            setTimeout(() => setVoiceAlert(false), 3000);
            onVoice(false);
          }}
        />
        <ToggleRow
          emoji="📄"
          label="Download PDF version"
          sub="Upgrade to Premium to download a PDF."
          value={pdfDownload}
          showAlert={pdfAlert}
          onToggle={() => {
            setPdfAlert(true);
            setTimeout(() => setPdfAlert(false), 3000);
            onPdf(false);
          }}
        />
      </div>
    </div>
  );
}

// ─── STEP 8 — Preview + Pay ───────────────────────────────────────────────────

function Step8({
  state,
  onFree,
  onPremium,
  submitting,
}: {
  state: CardState;
  onFree: () => void;
  onPremium: () => void;
  submitting: boolean;
}) {
  const exp = EXPERIENCES.find((e) => e.id === state.experience);
  const theme = THEMES.find((t) => t.id === state.theme) ?? THEMES[0];

  return (
    <div>
      <h2 className="font-serif text-2xl text-white mb-1">Preview & Send</h2>
      <p className="text-[#888] text-sm mb-6">Looking good! Ready to drop your heart?</p>

      {/* Summary card */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{
          borderColor: "rgba(183,110,121,0.3)",
          background: "rgba(183,110,121,0.06)",
        }}
      >
        {/* Theme strip */}
        <div
          className="w-full h-10 rounded-xl mb-4 flex items-center justify-center"
          style={{ background: theme.bg }}
        >
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: theme.accent, color: "white" }}
          >
            {theme.label}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{exp?.emoji}</span>
          <p className="text-white font-semibold">{exp?.label}</p>
          <span className="text-[#666] text-xs">for</span>
          <p className="text-white font-semibold">{state.recipientName || "—"}</p>
        </div>

        {state.message && (
          <p className="text-sm text-[#aaa] leading-relaxed border-t border-white/5 pt-3">
            "{state.message.slice(0, 100)}{state.message.length > 100 ? "…" : ""}"
          </p>
        )}

        {state.scheduledAt && (
          <p className="text-xs text-[#666] mt-3">
            ⏰ Scheduled:{" "}
            {new Date(state.scheduledAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onFree}
          disabled={submitting}
          className="btn-pill w-full py-4 font-semibold text-sm border transition-all active:scale-95 disabled:opacity-40"
          style={{
            borderColor: "rgba(183,110,121,0.4)",
            color: "#B76E79",
            background: "rgba(183,110,121,0.06)",
          }}
        >
          {submitting ? "Creating…" : "Send Free (with watermark)"}
        </button>

        <button
          onClick={onPremium}
          disabled={submitting}
          className={primaryBtn}
          style={primaryBtnStyle}
        >
          {submitting ? "Processing…" : "Send Premium ₹179 →"}
        </button>
      </div>

      <p className="text-center text-[#555] text-xs mt-4">
        Premium cards never expire · Live tracking included
      </p>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 8;

const defaultMemories: StoryMemory[] = [
  { date: "", text: "" },
  { date: "", text: "" },
  { date: "", text: "" },
];

export default function Create() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitting, setSubmitting] = useState(false);

  const [state, setState] = useState<CardState>({
    experience: null,
    recipientName: "",
    senderName: "",
    photos: [],
    message: "",
    tone: null,
    theme: "dark_rose",
    scheduledAt: "",
    receiverWhatsapp: "",
    aiMessages: [],
    storyMemories: defaultMemories,
    voiceNote: false,
    pdfDownload: false,
  });

  const update = <K extends keyof CardState>(key: K, val: CardState[K]) =>
    setState((s) => ({ ...s, [key]: val }));

  // Determine which step number is active considering step 3B
  const isAnniversary = state.experience === "anniversary";
  const effectiveTotalSteps = isAnniversary ? TOTAL_STEPS + 1 : TOTAL_STEPS;

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 1) {
      navigate("/");
      return;
    }
    setDirection(-1);
    setStep((s) => s - 1);
  };

  // Map logical steps (with 3B insert for anniversary)
  const getStepLabel = () => {
    if (!isAnniversary) return step;
    if (step <= 3) return step;
    if (step === 4 && isAnniversary) return "3B";
    return step - 1;
  };

  const displayStep = (() => {
    if (!isAnniversary) return step;
    if (step <= 3) return step;
    if (step === 4) return "3B";
    return step - 1;
  })();

  const canProceed = (): boolean => {
    if (step === 1) return !!state.experience;
    if (step === 2) return !!state.recipientName.trim() && !!state.senderName.trim();
    return true;
  };

  const handleFree = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...state, watermarked: true }),
      });
      const data = await res.json();
      navigate(`/card/${data.token ?? "demo"}`);
    } catch {
      navigate("/card/demo");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePremium = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 17900, currency: "INR", cardData: state }),
      });
      const data = await res.json();
      // Razorpay popup wired in Phase 4
      console.log("Razorpay order:", data);
      navigate(`/payment/${data.orderId ?? "demo"}`);
    } catch {
      navigate("/payment/demo");
    } finally {
      setSubmitting(false);
    }
  };

  // Render the current step content
  const renderStep = () => {
    // Anniversary has an extra 3B step
    if (step === 1) {
      return (
        <Step1
          value={state.experience}
          onChange={(v) => {
            update("experience", v);
            goNext();
          }}
        />
      );
    }
    if (step === 2) {
      return (
        <Step2
          recipientName={state.recipientName}
          senderName={state.senderName}
          onRecipient={(v) => update("recipientName", v)}
          onSender={(v) => update("senderName", v)}
        />
      );
    }
    if (step === 3) {
      return (
        <Step3
          photos={state.photos}
          onAdd={(urls) => update("photos", [...state.photos, ...urls])}
          onRemove={(i) =>
            update("photos", state.photos.filter((_, idx) => idx !== i))
          }
        />
      );
    }
    if (step === 4 && isAnniversary) {
      return (
        <Step3B
          memories={state.storyMemories}
          onChange={(m) => update("storyMemories", m)}
        />
      );
    }
    const aiStep = isAnniversary ? 5 : 4;
    const themeStep = isAnniversary ? 6 : 5;
    const scheduleStep = isAnniversary ? 7 : 6;
    const addonsStep = isAnniversary ? 8 : 7;
    const previewStep = isAnniversary ? 9 : 8;

    if (step === aiStep) {
      return (
        <Step4
          tone={state.tone}
          onTone={(t) => update("tone", t)}
          message={state.message}
          onMessage={(m) => update("message", m)}
          aiMessages={state.aiMessages}
          onAiMessages={(msgs) => update("aiMessages", msgs)}
          experience={state.experience}
          recipientName={state.recipientName}
          senderName={state.senderName}
        />
      );
    }
    if (step === themeStep) {
      return (
        <Step5 theme={state.theme} onTheme={(t) => update("theme", t)} />
      );
    }
    if (step === scheduleStep) {
      return (
        <Step6
          scheduledAt={state.scheduledAt}
          onSchedule={(v) => update("scheduledAt", v)}
          whatsapp={state.receiverWhatsapp}
          onWhatsapp={(v) => update("receiverWhatsapp", v)}
        />
      );
    }
    if (step === addonsStep) {
      return (
        <Step7
          voiceNote={state.voiceNote}
          pdfDownload={state.pdfDownload}
          onVoice={(v) => update("voiceNote", v)}
          onPdf={(v) => update("pdfDownload", v)}
        />
      );
    }
    if (step === previewStep) {
      return (
        <Step8
          state={state}
          onFree={handleFree}
          onPremium={handlePremium}
          submitting={submitting}
        />
      );
    }
    return null;
  };

  const isLastStep = step === (isAnniversary ? 9 : 8);
  const isStep1 = step === 1;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <span className="text-white text-lg leading-none">←</span>
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#666]">
              Step {typeof displayStep === "string" ? displayStep : displayStep} of {effectiveTotalSteps}
            </span>
            <span className="text-xs font-medium" style={{ color: "#B76E79" }}>
              {Math.round(((step - 1) / (effectiveTotalSteps - 1)) * 100)}%
            </span>
          </div>
          <ProgressBar step={step} total={effectiveTotalSteps} />
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial={direction > 0 ? "enterRight" : "enterLeft"}
            animate="center"
            exit={direction > 0 ? "exitLeft" : "exitRight"}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 px-4 pt-2 pb-32 overflow-y-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Next button (hidden on step 1 & last step) ── */}
      {!isStep1 && !isLastStep && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-6 pt-3"
          style={{ background: "linear-gradient(to top, rgba(10,10,10,1) 60%, transparent)" }}
        >
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className={primaryBtn}
            style={primaryBtnStyle}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
