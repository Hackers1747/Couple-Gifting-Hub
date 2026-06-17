import { useLocation } from "wouter";

interface WatermarkProps {
  experience?: string;
  cardId?: string;
  onTrack?: () => void;
}

export default function Watermark({ experience, onTrack }: WatermarkProps) {
  const [, navigate] = useLocation();
  return (
    <div className="text-center py-4">
      <button
        onClick={() => {
          onTrack?.();
          navigate(`/create${experience ? `?type=${experience}` : ""}`);
        }}
        className="text-xs font-medium transition-all opacity-60 hover:opacity-100"
        style={{ color: "#B76E79" }}
      >
        Made with ❤ HeartDrop
      </button>
    </div>
  );
}
