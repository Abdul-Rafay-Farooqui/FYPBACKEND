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
        const apiKey = this.config.get('OPENROUTER_API_KEY');
        if (!apiKey) {
            const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
            return {
                reply: `🤖 (demo mode — set OPENROUTER_API_KEY in backend/.env to enable real AI)\n\n` +
                    `You said: "${lastUser}".`,
            };
        }
        const model = this.config.get('OPENROUTER_MODEL') || 'openrouter/auto';
        const referer = this.config.get('OPENROUTER_REFERER') ||
            'http://localhost:3000';
        const title = this.config.get('OPENROUTER_APP_TITLE') || 'WeConnect';
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
                throw new common_1.ServiceUnavailableException(`OpenRouter error (${res.status}): ${err}`);
            }
            const data = (await res.json());
            const reply = data?.choices?.[0]?.message?.content ||
                'Sorry, I could not generate a response.';
            return { reply };
        }
        catch (e) {
            throw new common_1.ServiceUnavailableException(e?.message || 'AI request failed');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map