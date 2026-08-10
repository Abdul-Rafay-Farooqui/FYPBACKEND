import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly svc: AiService) {}

  @Post('chat')
  chat(
    @Body()
    body: {
      messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
    },
  ) {
    return this.svc.chat(body?.messages || []);
  }
}