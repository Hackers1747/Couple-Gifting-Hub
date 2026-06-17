import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-2xl p-4"
          style={{
            bottom: 88,
            background: "#141414",
            border: "1px solid #B76E79",
            boxShadow: "0 4px 32px rgba(183,110,121,0.25)",
            maxWidth: 398,
            margin: "0 auto",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">📱</span>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold leading-tight">
                Add HeartDrop to home screen
              </p>
              <p className="text-gray-400 text-xs mt-0.5">Open it like an app</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShow(false)}
              className="text-gray-500 text-xs px-2 py-1 rounded-lg hover:text-gray-300 transition-colors"
            >
              Not now
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={install}
              className="text-white text-xs font-semibold px-4 py-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #B76E79 0%, #8B4E5A 100%)" }}
            >
              Install
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
