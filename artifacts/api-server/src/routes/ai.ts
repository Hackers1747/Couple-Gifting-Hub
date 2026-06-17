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

router.post("/generate-message", async (req: Request, res: Response) => {
  const { experience, recipientName, senderName, tone } = req.body as {
    experience: string;
    recipientName: string;
    senderName: string;
    tone: string;
  };

  const ai = getAiClient();
  if (!ai) {
    return res.status(200).json({
      messages: [
        `${tone === "Funny" ? "Hey" : "My dearest"} ${recipientName}, ${senderName} here — wanted to send you something special today. You mean the world to me.`,
        `Dear ${recipientName}, there aren't enough words to describe how much you mean to ${senderName}. This card is just a tiny piece of what's in my heart.`,
        `To ${recipientName} — from ${senderName} with all the love in the world. Some moments are too beautiful for words, but I had to try.`,
      ],
    });
  }

  const expLabel = EXPERIENCE_LABELS[experience] ?? experience;
  const prompt = `You are writing personalised card messages for an Indian couple's digital gifting app called HeartDrop.

Card type: ${expLabel}
Recipient: ${recipientName}
Sender: ${senderName}
Tone: ${tone}

Generate exactly 3 short, heartfelt card messages. Each should be 2-4 sentences. Make them feel personal and warm, appropriate for Indian couples. Use the names naturally.

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

    res.json({ messages: parsed.messages.slice(0, 3) });
  } catch (err) {
    req.log?.error({ err }, "AI generate-message failed");
    res.status(500).json({ error: "Failed to generate messages" });
  }
});

router.post("/suggest-experience", async (req: Request, res: Response) => {
  res.json({ message: "AI experience suggestion stub", data: req.body });
});

export default router;
