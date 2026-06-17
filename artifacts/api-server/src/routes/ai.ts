import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

const EXPERIENCE_LABELS: Record<string, string> = {
  sorry: "Sorry Card",
  proposal: "Proposal",
  birthday: "Birthday",
  anniversary: "Anniversary",
  puzzle: "Puzzle",
  love_letter: "Love Letter",
  heartpage: "HeartPage",
};

const FALLBACK_MESSAGES = (recipientName: string, senderName: string, tone: string) => [
  `${tone === "Funny" ? "Hey" : "My dearest"} ${recipientName}, ${senderName} here — wanted to send you something special today. You mean the world to me. 💕`,
  `Dear ${recipientName}, there aren't enough words to describe how much you mean to ${senderName}. This card is just a tiny piece of what's in my heart. ❤`,
  `To ${recipientName} — from ${senderName} with all the love in the world. Some moments are too beautiful for words, but I had to try. 🙏`,
];

async function generateMessages(
  experience: string,
  recipientName: string,
  senderName: string,
  tone: string,
  log?: any
): Promise<string[]> {
  const ai = getAiClient();
  if (!ai) return FALLBACK_MESSAGES(recipientName, senderName, tone);

  const expLabel = EXPERIENCE_LABELS[experience] ?? experience;
  const prompt = `You are writing personalised card messages for an Indian couple's digital gifting app called HeartDrop.

Card type: ${expLabel}
Recipient: ${recipientName}
Sender: ${senderName}
Tone: ${tone}

Generate exactly 3 short, heartfelt card messages. Each should be 2-4 sentences, under 80 words. Make them feel personal and warm, appropriate for Indian couples. Hinglish is fine. Use the names naturally.

Return a JSON object with this exact shape:
{"messages": ["message1", "message2", "message3"]}

Only return valid JSON. No markdown, no explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192, responseMimeType: "application/json" },
    });

    const text = response.text ?? "{}";
    const parsed = JSON.parse(text) as { messages: string[] };

    if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      throw new Error("Invalid response shape");
    }

    return parsed.messages.slice(0, 3);
  } catch (err) {
    log?.error({ err }, "AI generate-message failed");
    return FALLBACK_MESSAGES(recipientName, senderName, tone);
  }
}

// POST /api/ai/message  (spec endpoint)
router.post("/message", async (req: Request, res: Response) => {
  const { experience, recipientName, senderName, tone } = req.body as {
    experience: string;
    recipientName: string;
    senderName: string;
    tone: string;
  };

  if (!experience || !recipientName || !senderName) {
    res.status(400).json({ error: "experience, recipientName and senderName are required" });
    return;
  }

  const messages = await generateMessages(experience, recipientName, senderName, tone ?? "Romantic", req.log);
  res.json({ messages });
});

// POST /api/ai/generate-message  (legacy — kept for existing frontend calls)
router.post("/generate-message", async (req: Request, res: Response) => {
  const { experience, recipientName, senderName, tone } = req.body as {
    experience: string;
    recipientName: string;
    senderName: string;
    tone: string;
  };

  if (!experience || !recipientName || !senderName) {
    res.status(400).json({ error: "experience, recipientName and senderName are required" });
    return;
  }

  const messages = await generateMessages(experience, recipientName, senderName, tone ?? "Romantic", req.log);
  res.json({ messages });
});

router.post("/suggest-experience", async (req: Request, res: Response) => {
  const { occasion, notes } = req.body as { occasion?: string; notes?: string };
  const ai = getAiClient();

  if (!ai || !occasion) {
    res.json({ experience: "anniversary", reason: "A timeless choice for any occasion." });
    return;
  }

  const prompt = `You are HeartDrop, an Indian couples gifting app. Based on the occasion below, suggest the best card experience.

Occasion: ${occasion}
Notes: ${notes ?? "none"}

Available experiences: sorry, proposal, birthday, anniversary, puzzle, love_letter, heartpage

Return JSON: {"experience": "<id>", "reason": "<one sentence why>"}
Only valid JSON, no markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 256, responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(response.text ?? "{}") as { experience: string; reason: string };
    res.json(parsed);
  } catch {
    res.json({ experience: "anniversary", reason: "A timeless choice for any occasion." });
  }
});

export default router;
