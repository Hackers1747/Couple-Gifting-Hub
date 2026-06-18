import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BuilderProgress } from "./BuilderProgress";

interface BuilderStepWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  currentStep: number;
  totalSteps?: number;
  isLastStep?: boolean;
  nextDisabled?: boolean;
}

export function BuilderStepWrapper({
  title,
  subtitle,
  children,
  onBack,
  onNext,
  currentStep,
  totalSteps = 8,
  isLastStep = false,
  nextDisabled = false,
}: BuilderStepWrapperProps) {
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <BuilderProgress currentStep={currentStep} totalSteps={totalSteps} />

        <div className="bg-[#13132a] border border-white/[0.06] rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-[#f5f0e8] mb-1">{title}</h2>
            {subtitle && <p className="text-[#8a8a9a] text-sm">{subtitle}</p>}
          </div>

          <div className="mb-8">{children}</div>

          <div className="flex gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 border border-white/20 text-white/60 px-6 py-3 rounded-full text-sm hover:border-[#c9a96e]/50 hover:text-[#c9a96e] transition-all duration-300"
              >
                ← Back
              </button>
            )}
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={[
                "flex-1 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-300",
                nextDisabled
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#c9a96e] to-[#e8c99a] text-[#080810] hover:shadow-[0_0_24px_rgba(201,169,110,0.4)] hover:scale-[1.02] active:scale-[0.98]",
              ].join(" ")}
            >
              {isLastStep ? "✨ Create Card" : "Next →"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
