import { Router, Request, Response } from "express";

const router = Router();

function routeParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

// ── Demo card data ────────────────────────────────────────────────────────────
const EXPERIENCE_MAP: Record<string, string> = {
  sorry:        "sorry",
  proposal:     "proposal",
  birthday:     "birthday",
  anniversary:  "anniversary",
  puzzle:       "puzzle",
  "love-letter":"love_letter",
  heartpage:    "heartpage",
};

function mockCard(slug: string) {
  const key = Object.keys(EXPERIENCE_MAP).find((k) => slug.startsWith(k)) ?? "sorry";
  const experience = EXPERIENCE_MAP[key];
  const isExpired = slug.startsWith("expired");

  const messages: Record<string, string> = {
    sorry:
      "I've been holding this in my heart for too long — I'm truly sorry. You mean everything to me and the last thing I ever want is to hurt you. Please forgive me.",
    proposal:
      "From the moment I met you, I knew you were someone extraordinary. Every day with you feels like the best day of my life. I don't want to spend a single day without you — will you be mine forever?",
    birthday:
      "On your special day, I just want you to know how much joy you bring into my life. You light up every room and every moment. Wishing you the most magical birthday yet!",
    anniversary:
      "Every year with you is better than the last. You've been my best friend, my partner, my home. Here's to a lifetime more of laughter, love, and adventures together.",
    puzzle:
      "You solved it! 🎉 Just like this puzzle, you've put all the missing pieces of my heart together. Thank you for being exactly who you are.",
    love_letter:
      "My dearest, there are a thousand things I want to tell you — but most importantly, that you are loved beyond measure. Every morning I wake up grateful to have you in my life.",
    heartpage:
      "Some people come into your life and change it forever. You are that person for me. This is just a small token of how much I think about you, and how much you mean to me.",
  };

  return {
    id: slug,
    token: slug,
    experience,
    recipientName: "Priya",
    senderName: "Rohan",
    message: messages[experience] ?? messages.sorry,
    photos: [],
    theme: "dark_rose",
    isWatermarked: true,
    isExpired,
    anniversaryDate: "2020-06-17",
    storyMemories: [
      { date: "2020-06-17", text: "The day we first met at that little café in Bangalore ☕" },
      { date: "2021-02-14", text: "Our first Valentine's Day — you wore red and I was speechless 🌹" },
      { date: "2022-12-25", text: "Christmas in Manali, snowed in together — absolutely perfect ❄️" },
    ],
  };
}

// ── Routes ────────────────────────────────────────────────────────────────────

router.get("/", (_req: Request, res: Response) => {
  res.json({ cards: [] });
});

router.post("/", (req: Request, res: Response) => {
  const token = `${req.body?.experience ?? "sorry"}-${Math.random().toString(36).slice(2, 8)}`;
  res.status(201).json({ token, message: "Card created" });
});

router.get("/slug/:slug", (req: Request, res: Response) => {
  res.json(mockCard(routeParam(req.params.slug)));
});

router.get("/:id", (req: Request, res: Response) => {
  res.json(mockCard(routeParam(req.params.id)));
});

router.patch("/:id", (req: Request, res: Response) => {
  res.json({ message: "Card updated", id: req.params.id });
});

router.delete("/:id", (req: Request, res: Response) => {
  res.json({ message: "Card deleted", id: req.params.id });
});

export default router;
