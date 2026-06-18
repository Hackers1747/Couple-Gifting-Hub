import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

// ─── GlassCard ──────────────────────────────────────────────────────────────

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowAccent?: boolean;
  hover?: boolean;
}

export function GlassCard({ children, className = "", glowAccent = false, hover = false }: GlassCardProps) {
  return (
    <div
      className={[
        "bg-[#13132a] border rounded-2xl p-6",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        glowAccent
          ? "border-[#c9a96e]/30 shadow-[0_0_32px_rgba(201,169,110,0.12)]"
          : "border-white/[0.06]",
        hover
          ? "hover:border-[#c9a96e]/20 hover:shadow-[0_0_24px_rgba(201,169,110,0.08)] transition-all duration-300 cursor-pointer"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

type ButtonSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

interface RoseGoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
}

export function RoseGoldButton({ children, className = "", size = "md", ...props }: RoseGoldButtonProps) {
  return (
    <button
      {...props}
      className={[
        "bg-gradient-to-r from-[#c9a96e] to-[#e8c99a]",
        "text-[#080810] font-semibold rounded-full",
        "hover:shadow-[0_0_24px_rgba(201,169,110,0.4)]",
        "hover:scale-[1.02] active:scale-[0.98]",
        "transition-all duration-300 ease-out",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        SIZE_CLASSES[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
}

export function GhostButton({ children, className = "", size = "md", ...props }: GhostButtonProps) {
  return (
    <button
      {...props}
      className={[
        "border border-white/20 text-white/60 rounded-full",
        "hover:border-[#c9a96e]/50 hover:text-[#c9a96e]",
        "active:scale-[0.98] transition-all duration-300 ease-out",
        SIZE_CLASSES[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function IconButton({ children, className = "", ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={[
        "w-10 h-10 flex items-center justify-center rounded-full",
        "border border-white/10 text-white/40",
        "hover:border-[#c9a96e]/40 hover:text-[#c9a96e]",
        "transition-all duration-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Inputs ──────────────────────────────────────────────────────────────────

const INPUT_BASE =
  "w-full bg-[#0f0f1e] border border-white/10 rounded-xl " +
  "text-[#f5f0e8] placeholder:text-white/20 px-4 py-3 " +
  "focus:outline-none focus:border-[#c9a96e] " +
  "focus:ring-1 focus:ring-[#c9a96e]/30 " +
  "transition-all duration-300";

const LABEL_CLASS = "text-xs text-[#8a8a9a] uppercase tracking-wider font-medium";

interface DarkInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function DarkInput({ label, className = "", ...props }: DarkInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className={LABEL_CLASS}>{label}</label>}
      <input {...props} className={[INPUT_BASE, className].filter(Boolean).join(" ")} />
    </div>
  );
}

interface DarkTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function DarkTextarea({ label, className = "", ...props }: DarkTextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className={LABEL_CLASS}>{label}</label>}
      <textarea
        {...props}
        className={[INPUT_BASE, "min-h-[120px] resize-none", className].filter(Boolean).join(" ")}
      />
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface DarkSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
}

export function DarkSelect({ label, options = [], className = "", ...props }: DarkSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className={LABEL_CLASS}>{label}</label>}
      <select
        {...props}
        className={[INPUT_BASE, "appearance-none cursor-pointer", className].filter(Boolean).join(" ")}
      >
        {options.map(({ value, label: optLabel }) => (
          <option key={value} value={value} className="bg-[#13132a]">
            {optLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

type BadgeStatus = "paid" | "free" | "expired";

const BADGE_STYLES: Record<BadgeStatus, string> = {
  paid:    "bg-[#c9a96e]/20 text-[#c9a96e] border-[#c9a96e]/30",
  free:    "bg-white/10 text-white/50 border-white/20",
  expired: "bg-[#c0394b]/20 text-[#c0394b] border-[#c0394b]/30",
};

const BADGE_LABELS: Record<BadgeStatus, string> = {
  paid: "✓ Paid",
  free: "Free",
  expired: "Expired",
};

interface StatusBadgeProps {
  status: BadgeStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const key = status as BadgeStatus;
  return (
    <span
      className={[
        "text-xs px-3 py-1 rounded-full border font-medium",
        BADGE_STYLES[key] ?? BADGE_STYLES.free,
      ].join(" ")}
    >
      {BADGE_LABELS[key] ?? status}
    </span>
  );
}

interface ShimmerSkeletonProps {
  className?: string;
}

export function ShimmerSkeleton({ className = "" }: ShimmerSkeletonProps) {
  return (
    <div
      className={[
        "bg-gradient-to-r from-[#13132a] via-[#c9a96e]/10 to-[#13132a]",
        "bg-[length:200%_100%] animate-shimmer rounded-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

interface RealtimeIndicatorProps {
  active?: boolean;
}

export function RealtimeIndicator({ active = true }: RealtimeIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`relative flex h-2 w-2 ${!active ? "opacity-30" : ""}`}>
        {active && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a96e] opacity-75" />
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a96e]" />
      </span>
      <span className="text-xs text-[#8a8a9a]">{active ? "Live" : "Offline"}</span>
    </div>
  );
}

interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-white/[0.06]" />
      {label && (
        <span className="text-xs text-[#8a8a9a] uppercase tracking-wider">{label}</span>
      )}
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-[#13132a] border border-white/[0.06] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col gap-1">
      <span className="text-[#8a8a9a] text-xs uppercase tracking-wider">{label}</span>
      <span className="font-serif text-3xl text-[#c9a96e]">{value}</span>
      {sub && <span className="text-[#8a8a9a] text-xs">{sub}</span>}
    </div>
  );
}
