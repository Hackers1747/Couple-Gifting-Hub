import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

export default function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine,
  );

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-3 border-b border-[#8B4A56]/40 bg-[#211318] px-4 py-3 text-sm text-[#F2D8DC] shadow-lg"
    >
      <WifiOff size={16} aria-hidden="true" />
      <span className="text-center">
        You’re offline. Some HeartDrop features may be unavailable.
      </span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#B76E79]/50 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#B76E79]/20"
      >
        <RefreshCw size={13} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}