import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * AI service — uses OpenRouter (`openrouter/auto`) so a single API key
 * automatically routes to the best available model.
 *
 * Required env:
 *   OPENROUTER_API_KEY   – https://openrouter.ai/keys
 *
 * Optional env:
 *   OPENROUTER_MODEL     – override model slug (default: openrouter/auto)
 *   OPENROUTER_REFERER   – HTTP-Referer header (recommended by OpenRouter)
 *   OPENROUTER_APP_TITLE – X-Title header (recommended by OpenRouter)
 */
@Injectable()
export class AiService {
  constructor(private readonly config: ConfigService) {}

  async chat(messages: ChatMessage[]): Promise<{ reply: string }> {
    const apiKey = this.config.get<string>('OPENROUTER_API_KEY');

    if (!apiKey) {
      // Graceful dev fallback so the UI keeps working without a key.
      const lastUser =
        [...messages].reverse().find((m) => m.role === 'user')?.content || '';
      return {
        reply:
          `🤖 (demo mode — set OPENROUTER_API_KEY in backend/.env to enable real AI)\n\n` +
          `You said: "${lastUser}".`,
      };
    }

    const model =
      this.config.get<string>('OPENROUTER_MODEL') || 'openrouter/auto';
    const referer =
      this.config.get<string>('OPENROUTER_REFERER') ||
      'http://localhost:3000';
    const title =
      this.config.get<string>('OPENROUTER_APP_TITLE') || 'WeConnect';

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': referer,
          'X-Title': title,
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
        'Sorry, I could not generate a response.';
      return { reply };
    } catch (e: any) {
      throw new ServiceUnavailableException(
        e?.message || 'AI request failed',
      );
    }
  }
}