import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(
    private readonly svc: CallsService,
    private readonly config: ConfigService,
  ) {}

  @Get('turn-credentials')
  async getTurnCredentials() {
    const apiKey = this.config.get<string>('METERED_API_KEY');
    const appName = this.config.get<string>('METERED_APP_NAME');

    // If metered credentials are configured, fetch live credentials
    if (apiKey && appName) {
      try {
        const res = await fetch(
          `https://${appName}.metered.live/api/v1/turn/credentials?apiKey=${apiKey}`,
        );
        if (res.ok) {
          const iceServers = await res.json();
          return { iceServers };
        }
      } catch (e) {
        // fall through to hardcoded fallback
      }
    }

    // Fallback: well-known public STUN + open relay TURN
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
        {
          urls: 'turn:openrelay.metered.ca:443?transport=tcp',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
      ],
    };
  }

  @Get()
  history(@CurrentUser() user: User) {
    return this.svc.history(user.id);
  }

  @Post()
  initiate(
    @CurrentUser() user: User,
    @Body()
    body: { callee_id: string; type: 'voice' | 'video'; conversation_id?: string },
  ) {
    return this.svc.initiate(user.id, body);
  }

  @Post(':id/status')
  updateStatus(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { status: 'active' | 'ended' | 'missed' | 'declined' | 'failed' },
  ) {
    return this.svc.updateStatus(user.id, id, body.status);
  }
}