import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { MessagesService, SendMessageDto } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly svc: MessagesService) {}

  @Get()
  list(
    @CurrentUser() user: User,
    @Query('conversationId') conversationId: string,
    @Query('conversation_id') conversationIdAlt: string,
    @Query('limit') limit?: string,
  ) {
    const cid = conversationId || conversationIdAlt;
    return this.svc.list(user.id, cid, limit ? +limit : 200);
  }

  @Post()
  send(@CurrentUser() user: User, @Body() dto: SendMessageDto) {
    return this.svc.send(user.id, dto);
  }

  @Post(':id/edit')
  edit(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.svc.edit(user.id, id, body.content);
  }

  @Delete(':id/me')
  deleteForMe(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.deleteForMe(user.id, id);
  }

  @Delete(':id/everyone')
  deleteForAll(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.deleteForEveryone(user.id, id);
  }

  @Post('read')
  read(@CurrentUser() user: User, @Body() body: { ids?: string[]; message_ids?: string[] }) {
    return this.svc.markRead(user.id, body.ids || body.message_ids || []);
  }

  @Post(':id/react')
  react(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { emoji: string | null },
  ) {
    return this.svc.react(user.id, id, body.emoji);
  }

  @Post(':id/pin')
  pin(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.pin(user.id, id);
  }

  @Post('unpin/:conversationId')
  unpin(@CurrentUser() user: User, @Param('conversationId') cid: string) {
    return this.svc.unpin(user.id, cid);
  }

  @Get('pinned/:conversationId')
  pinned(@CurrentUser() user: User, @Param('conversationId') cid: string) {
    return this.svc.getPinned(user.id, cid);
  }

  @Post(':id/star')
  star(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { starred: boolean },
  ) {
    return this.svc.star(user.id, id, !!body.starred);
  }

  @Get('starred/all')
  starred(@CurrentUser() user: User) {
    return this.svc.listStarred(user.id);
  }

  @Get('starred/ids')
  starredIds(
    @CurrentUser() user: User,
    @Query('conversationId') cid?: string,
    @Query('conversation_id') cidAlt?: string,
  ) {
    return this.svc.listStarredIds(user.id, cid || cidAlt);
  }

  @Post(':id/forward')
  forward(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { conversation_ids: string[] },
  ) {
    return this.svc.forward(user.id, id, body.conversation_ids || []);
  }

  @Get('search')
  search(
    @CurrentUser() user: User,
    @Query('q') q: string,
    @Query('conversationId') cid?: string,
    @Query('conversation_id') cidAlt?: string,
  ) {
    return this.svc.search(user.id, q, cid || cidAlt);
  }
}