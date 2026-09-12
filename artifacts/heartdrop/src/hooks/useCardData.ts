import { useState, useEffect, useCallback } from "react";

export interface StoryMemory {
  date: string;
  text: string;
  photoUrl?: string;
}

export interface CardData {
  id: string;
  token: string;
  experience: "sorry" | "proposal" | "birthday" | "anniversary" | "puzzle" | "love_letter" | "heartpage";
  recipientName: string;
  senderName: string;
  message: string;
  photos: string[];
  theme: string;
  isWatermarked: boolean;
  isExpired: boolean;
  scheduledAt?: string;
  anniversaryDate?: string;
  storyMemories?: StoryMemory[];
}

export function useCardData(token: string) {
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCard = useCallback(() => {
    if (!token) {
      setData(null);
      setError("Card link is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetch(`/api/cards/slug/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((d: CardData) => {
        setData(d);
        // Fire-and-forget open tracking
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId: d.id, eventType: "opened" }),
        }).catch(() => {});
      })
      .catch(() => setError("Failed to load card"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    void loadCard();
  }, [loadCard]);

  const trackEvent = useCallback(
    (eventType: string, extra?: Record<string, string>) => {
      if (!data) return;
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: data.id, eventType, ...extra }),
      }).catch(() => {});
    },
    [data]
  );

  return { data, loading, error, trackEvent, retry: loadCard };
}
