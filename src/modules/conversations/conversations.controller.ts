import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly svc: ConversationsService) {}

  @Get()
  list(@CurrentUser() user: User, @Query('archived') archived?: string) {
    if (archived === 'true') return this.svc.listArchived(user.id);
    return this.svc.list(user.id);
  }

  @Post()
  getOrCreate(@CurrentUser() user: User, @Body() body: { other_user_id: string }) {
    return this.svc.getOrCreate1on1(user.id, body.other_user_id);
  }

  @Post('group')
  createGroup(
    @CurrentUser() user: User,
    @Body() body: { name: string; member_ids: string[]; avatar_url?: string },
  ) {
    return this.svc.createGroup(user.id, body);
  }

  @Get(':id')
  getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.getOne(user.id, id);
  }

  @Post(':id/read')
  markRead(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.markRead(user.id, id);
  }

  @Post(':id/pin')
  pin(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { pinned: boolean },
  ) {
    return this.svc.setPin(user.id, id, !!body.pinned);
  }

  @Post(':id/mute')
  mute(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { muted: boolean; until?: string },
  ) {
    return this.svc.setMute(
      user.id,
      id,
      !!body.muted,
      body.until ? new Date(body.until) : undefined,
    );
  }

  @Post(':id/archive')
  archive(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { archived: boolean },
  ) {
    return this.svc.archive(user.id, id, !!body.archived);
  }

  @Post(':id/clear')
  clear(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.clear(user.id, id);
  }

  @Post(':id/hide')
  hide(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.hide(user.id, id);
  }

  @Post(':id/lock')
  lock(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { pin: string },
  ) {
    return this.svc.lock(user.id, id, body.pin);
  }

  @Post(':id/unlock')
  unlock(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { pin: string },
  ) {
    return this.svc.unlock(user.id, id, body.pin);
  }

  @Post(':id/remove-lock')
  removeLock(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { pin: string },
  ) {
    return this.svc.removeLock(user.id, id, body.pin);
  }

  @Post(':id/disappearing')
  disappearing(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { seconds: number | null },
  ) {
    return this.svc.setDisappearingTimer(user.id, id, body.seconds);
  }
}