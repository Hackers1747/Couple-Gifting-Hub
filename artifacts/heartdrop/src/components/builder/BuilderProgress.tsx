import { motion } from "framer-motion";

interface BuilderProgressProps {
  currentStep: number;
  totalSteps?: number;
}

export function BuilderProgress({ currentStep, totalSteps = 8 }: BuilderProgressProps) {
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-[#8a8a9a] mb-3">
        <span className="uppercase tracking-wider">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-[#c9a96e] font-medium">{pct}%</span>
      </div>

      <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#c9a96e] to-[#e8c99a] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={[
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              i < currentStep - 1
                ? "bg-[#c9a96e]"
                : i === currentStep - 1
                ? "bg-[#e8c99a] scale-125"
                : "bg-white/10",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
