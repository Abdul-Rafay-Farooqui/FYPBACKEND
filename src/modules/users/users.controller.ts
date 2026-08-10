import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get('search')
  search(@Query('q') q: string, @CurrentUser() user: User) {
    return this.svc.search(q, user.id);
  }

  @Get('by-phone')
  byPhone(@Query('phone') phone: string) {
    return this.svc.findByPhone(phone);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: User, @Body() patch: any) {
    return this.svc.update(user.id, patch);
  }

  @Patch('me/presence')
  setPresence(@CurrentUser() user: User, @Body() body: { is_online: boolean }) {
    return this.svc.setPresence(user.id, !!body.is_online);
  }
}