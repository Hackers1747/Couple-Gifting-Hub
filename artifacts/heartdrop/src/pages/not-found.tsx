import { Home, SearchX } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] px-6 flex items-center justify-center text-center">
      <div className="w-full max-w-md">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "rgba(183,110,121,0.12)", color: "#D98A96" }}
        >
          <SearchX size={30} aria-hidden="true" />
        </div>
        <p className="text-xs uppercase tracking-[0.24em] text-[#B76E79]">
          HeartDrop
        </p>
        <h1 className="mt-3 font-serif text-4xl text-white">This link drifted away</h1>
        <p className="mt-3 text-sm leading-6 text-[#8A8A9A]">
          We couldn’t find the page you were looking for. The moment may have
          moved, but you can still start a new one.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #B76E79, #8B4A56)",
            boxShadow: "0 4px 20px rgba(183,110,121,0.3)",
          }}
        >
          <Home size={16} aria-hidden="true" />
          Back home
        </button>
      </div>
    </div>
  );
}
