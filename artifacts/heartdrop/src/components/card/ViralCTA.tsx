import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface ViralCTAProps {
  experience?: string;
}

export default function ViralCTA({ experience }: ViralCTAProps) {
  const [, navigate] = useLocation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-center py-6 px-4"
    >
      <p className="text-[#9CA3AF] text-sm mb-3">Surprise someone special 💝</p>
      <button
        onClick={() => navigate(`/create${experience ? `?type=${experience}` : ""}`)}
        className="btn-pill px-6 py-3 text-sm font-semibold transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #B76E79 0%, #8B4A56 100%)",
          color: "white",
          boxShadow: "0 0 16px rgba(183,110,121,0.3)",
        }}
      >
        Create yours — it's free
      </button>
    </motion.div>
  );
}
