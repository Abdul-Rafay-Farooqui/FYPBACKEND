"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AiService = class AiService {
    config;
    constructor(config) {
        this.config = config;
    }
    async chat(messages) {
        const geminiKey = this.config.get("GEMINI_API_KEY") ||
            this.config.get("GOOGLE_GEMINI_API_KEY");
        const openRouterKey = this.config.get("OPENROUTER_API_KEY");
        if (geminiKey) {
            return this.chatWithGemini(messages, geminiKey);
        }
        if (openRouterKey) {
            return this.chatWithOpenRouter(messages, openRouterKey);
        }
        const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content || "";
        return {
            reply: `🤖 (demo mode — set GEMINI_API_KEY to enable real AI)\n\n` +
                `You said: "${lastUser}".`,
        };
    }
    async chatWithGemini(messages, apiKey) {
        const modelCandidates = [
            this.config.get("GEMINI_MODEL"),
            "gemini-3.7-flash",
            "gemini-3.6-flash",
            "gemini-3.5-flash-lite",
        ].filter((model) => !!model);
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
        let lastError = null;
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
                    const isRetriable = res.status === 404 ||
                        res.status === 429 ||
                        res.status === 503 ||
                        res.status >= 500;
                    if (isRetriable) {
                        lastError = message;
                        console.warn(`[AiService] ${model} failed (${res.status}). Trying next model...`);
                        continue;
                    }
                    throw new common_1.ServiceUnavailableException(message);
                }
                const data = (await res.json());
                const reply = data?.candidates?.[0]?.content?.parts
                    ?.map((part) => part?.text || "")
                    .join("")
                    .trim() || "Sorry, I could not generate a response.";
                return { reply };
            }
            catch (e) {
                if (e instanceof common_1.ServiceUnavailableException) {
                    throw e;
                }
                lastError = e?.message || "AI request failed";
                console.warn(`[AiService] Request exception on model ${model}: ${lastError}`);
                continue;
            }
        }
        const openRouterKey = this.config.get("OPENROUTER_API_KEY");
        if (openRouterKey) {
            console.warn(`[AiService] All Gemini models failed. Falling back to OpenRouter...`);
            return this.chatWithOpenRouter(messages, openRouterKey);
        }
        throw new common_1.ServiceUnavailableException(lastError || "Gemini model not available");
    }
    async chatWithOpenRouter(messages, apiKey) {
        const model = this.config.get("OPENROUTER_MODEL") || "openrouter/auto";
        const referer = this.config.get("OPENROUTER_REFERER") || "http://localhost:3000";
        const title = this.config.get("OPENROUTER_APP_TITLE") || "WeConnect";
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
                throw new common_1.ServiceUnavailableException(`OpenRouter error (${res.status}): ${err}`);
            }
            const data = (await res.json());
            const reply = data?.choices?.[0]?.message?.content ||
                "Sorry, I could not generate a response.";
            return { reply };
        }
        catch (e) {
            throw new common_1.ServiceUnavailableException(e?.message || "AI request failed");
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map