import {
  SUMMARIZER_SYSTEM_PROMPT,
  DOCUMENT_USER_PROMPT,
  YOUTUBE_USER_PROMPT,
} from "./prompts";
import type { SummaryOutput } from "@/types";
import Groq from "groq-sdk";

interface SummarizeOptions {
  content: string;
  sourceType: "document" | "youtube";
  title?: string;
  isMetadataOnly?: boolean;
}

/**
 * Summarize content using Google Gemini API with Groq fallback.
 */
export async function summarizeContent(
  options: SummarizeOptions
): Promise<SummaryOutput> {
  const { content, sourceType, title, isMetadataOnly } = options;

  const userPrompt =
    sourceType === "youtube"
      ? YOUTUBE_USER_PROMPT(content, title, isMetadataOnly)
      : DOCUMENT_USER_PROMPT(content, title);

  // Try Gemini first, then fall back to Groq
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!geminiKey && !groqKey) {
    throw new Error("No AI API key configured. Set GEMINI_API_KEY or GROQ_API_KEY in .env.local");
  }

  // --- Try Gemini ---
  if (geminiKey) {
    const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];
    const requestBody = JSON.stringify({
      contents: [{ parts: [{ text: `${SUMMARIZER_SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
      generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
    });

    for (const model of models) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody }
      );

      if (response.status === 429) {
        console.warn(`[AI] Rate limited on Gemini ${model}, trying next...`);
        continue;
      }

      if (!response.ok) {
        console.warn(`[AI] Gemini ${model} error: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resultText) {
        console.log(`[AI] Success with Gemini ${model}`);
        return JSON.parse(resultText);
      }
    }
    console.warn("[AI] All Gemini models failed, trying Groq fallback...");
  }

  // --- Groq fallback ---
  if (groqKey) {
    const groq = new Groq({ apiKey: groqKey });
    console.log("[AI] Using Groq (llama-3.3-70b-versatile)...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SUMMARIZER_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const resultText = completion.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error("No content returned from Groq");
    }

    console.log("[AI] Success with Groq");
    return JSON.parse(resultText);
  }

  throw new Error("AI tidak tersedia saat ini. Semua provider sedang rate limited. Coba lagi nanti.");
}
