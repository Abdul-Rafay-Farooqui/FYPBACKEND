import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly svc: BlocksService) {}

  @Get()
  list(@CurrentUser() u: User) {
    return this.svc.listBlocked(u.id);
  }

  @Get('check/:targetId')
  async check(@CurrentUser() u: User, @Param('targetId') targetId: string) {
    const iBlockedThem = await this.svc.isBlocked(u.id, targetId);
    const theyBlockedMe = await this.svc.isBlocked(targetId, u.id);
    return {
      i_blocked_them: iBlockedThem,
      they_blocked_me: theyBlockedMe,
      is_blocked: iBlockedThem || theyBlockedMe,
    };
  }

  @Post(':targetId')
  block(@CurrentUser() u: User, @Param('targetId') targetId: string) {
    return this.svc.block(u.id, targetId);
  }

  @Delete(':targetId')
  unblock(@CurrentUser() u: User, @Param('targetId') targetId: string) {
    return this.svc.unblock(u.id, targetId);
  }

  @Post('report/:targetId')
  report(
    @CurrentUser() u: User,
    @Param('targetId') targetId: string,
    @Body() body: { reason?: string },
  ) {
    return this.svc.report(u.id, targetId, body?.reason);
  }
}