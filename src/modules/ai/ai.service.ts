import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * AI service — uses Gemini when a Gemini key is available, with OpenRouter
 * kept as a fallback for older environments.
 *
 * Required env:
 *   GEMINI_API_KEY       – https://aistudio.google.com/app/apikey
 *
 * Optional env:
 *   GEMINI_MODEL         – override model slug (default: gemini-3.7-flash)
 *   OPENROUTER_API_KEY   – fallback OpenRouter key
 *   OPENROUTER_MODEL     – override fallback model slug (default: openrouter/auto)
 *   OPENROUTER_REFERER   – HTTP-Referer header for OpenRouter fallback
 *   OPENROUTER_APP_TITLE – X-Title header for OpenRouter fallback
 */
@Injectable()
export class AiService {
  constructor(private readonly config: ConfigService) {}

  async chat(messages: ChatMessage[]): Promise<{ reply: string }> {
    const geminiKey =
      this.config.get<string>("GEMINI_API_KEY") ||
      this.config.get<string>("GOOGLE_GEMINI_API_KEY");
    const openRouterKey = this.config.get<string>("OPENROUTER_API_KEY");

    if (geminiKey) {
      return this.chatWithGemini(messages, geminiKey);
    }

    if (openRouterKey) {
      return this.chatWithOpenRouter(messages, openRouterKey);
    }

    // Graceful dev fallback so the UI keeps working without a key.
    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";
    return {
      reply:
        `🤖 (demo mode — set GEMINI_API_KEY to enable real AI)\n\n` +
        `You said: "${lastUser}".`,
    };
  }

  private async chatWithGemini(messages: ChatMessage[], apiKey: string) {
    const modelCandidates = [
      this.config.get<string>("GEMINI_MODEL"),
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
    ].filter((model): model is string => !!model);
    const systemPrompt = messages
      .filter((message) => message.role === "system")
      .map((message) => message.content)
      .join("\n\n")
      .trim();
    const contents = messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }));

    let lastError: string | null = null;

    for (const model of modelCandidates) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(systemPrompt
              ? { systemInstruction: { parts: [{ text: systemPrompt }] } }
              : {}),
            contents,
            generationConfig: {
              temperature: 0.7,
            },
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          const message = `Gemini error (${res.status}) using ${model}: ${err}`;
          const isRetriable =
            res.status === 404 ||
            res.status === 429 ||
            res.status === 503 ||
            res.status >= 500;

          if (isRetriable) {
            lastError = message;
            console.warn(
              `[AiService] ${model} failed (${res.status}). Trying next model...`,
            );
            continue;
          }

          throw new ServiceUnavailableException(message);
        }

        const data = (await res.json()) as any;
        const reply =
          data?.candidates?.[0]?.content?.parts
            ?.map((part: any) => part?.text || "")
            .join("")
            .trim() || "Sorry, I could not generate a response.";
        return { reply };
      } catch (e: any) {
        if (e instanceof ServiceUnavailableException) {
          throw e;
        }

        lastError = e?.message || "AI request failed";
        console.warn(
          `[AiService] Request exception on model ${model}: ${lastError}`,
        );
        continue;
      }
    }

    const openRouterKey = this.config.get<string>("OPENROUTER_API_KEY");
    if (openRouterKey) {
      console.warn(
        `[AiService] All Gemini models failed. Falling back to OpenRouter...`,
      );
      return this.chatWithOpenRouter(messages, openRouterKey);
    }

    throw new ServiceUnavailableException(
      lastError || "Gemini model not available",
    );
  }

  private async chatWithOpenRouter(messages: ChatMessage[], apiKey: string) {
    const model =
      this.config.get<string>("OPENROUTER_MODEL") || "openrouter/auto";
    const referer =
      this.config.get<string>("OPENROUTER_REFERER") || "http://localhost:3000";
    const title =
      this.config.get<string>("OPENROUTER_APP_TITLE") || "WeConnect";

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": referer,
          "X-Title": title,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new ServiceUnavailableException(
          `OpenRouter error (${res.status}): ${err}`,
        );
      }

      const data = (await res.json()) as any;
      const reply =
        data?.choices?.[0]?.message?.content ||
        "Sorry, I could not generate a response.";
      return { reply };
    } catch (e: any) {
      throw new ServiceUnavailableException(e?.message || "AI request failed");
    }
  }
}
