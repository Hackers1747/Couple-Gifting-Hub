import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useCardData } from "@/hooks/useCardData";
import Watermark from "@/components/card/Watermark";
import SorryCard from "@/components/experiences/SorryCard";
import ProposalCard from "@/components/experiences/ProposalCard";
import BirthdayBash from "@/components/experiences/BirthdayBash";
import Anniversary from "@/components/experiences/Anniversary";
import PuzzleCard from "@/components/experiences/Puzzle";
import LoveLetter from "@/components/experiences/LoveLetter";
import HeartPageCard from "@/components/experiences/HeartPage";

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-10 h-10 rounded-full border-2"
        style={{ borderColor: "rgba(183,110,121,0.2)", borderTopColor: "#B76E79" }}
      />
      <p className="text-[#666] text-sm">Opening your surprise…</p>
    </div>
  );
}

function ErrorState() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center gap-4">
      <span className="text-5xl">💔</span>
      <h1 className="font-serif text-2xl text-white">Couldn't find this card</h1>
      <p className="text-[#666] text-sm">The link may be broken or the card no longer exists.</p>
      <button
        onClick={() => navigate("/create")}
        className="btn-pill px-6 py-3 text-sm font-semibold text-white mt-2"
        style={{ background: "linear-gradient(135deg, #B76E79, #8B4A56)" }}
      >
        Create your own →
      </button>
    </div>
  );
}

export default function Card() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { data, loading, error, trackEvent } = useCardData(slug ?? "");

  const handleReact = (emoji: string) => {
    trackEvent("reacted", { emojiReaction: emoji });
  };

  const handleWatermarkClick = () => {
    trackEvent("watermark_click");
  };

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState />;
  if (data.isExpired) {
    navigate("/expired");
    return null;
  }

  const experienceProps = { card: data, onReact: handleReact };

  const ExperienceComponent = {
    sorry: <SorryCard {...experienceProps} />,
    proposal: <ProposalCard {...experienceProps} />,
    birthday: <BirthdayBash {...experienceProps} />,
    anniversary: <Anniversary {...experienceProps} />,
    puzzle: <PuzzleCard {...experienceProps} />,
    love_letter: <LoveLetter {...experienceProps} />,
    heartpage: <HeartPageCard {...experienceProps} />,
  }[data.experience] ?? <HeartPageCard {...experienceProps} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {ExperienceComponent}
      {data.isWatermarked && (
        <Watermark
          experience={data.experience}
          cardId={data.id}
          onTrack={handleWatermarkClick}
        />
      )}
    </motion.div>
  );
}
