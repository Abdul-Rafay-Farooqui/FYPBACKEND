import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private readonly svc: CallsService) {}

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