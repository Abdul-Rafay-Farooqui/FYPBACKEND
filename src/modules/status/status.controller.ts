import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { CreateStatusDto, StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly svc: StatusService) {}

  @Get('feed')
  feed(@CurrentUser() u: User) {
    return this.svc.feed(u.id);
  }

  @Post()
  create(@CurrentUser() u: User, @Body() body: CreateStatusDto) {
    return this.svc.create(u.id, body);
  }

  @Post(':id/view')
  view(@CurrentUser() u: User, @Param('id') id: string) {
    return this.svc.view(u.id, id);
  }

  @Get(':id/viewers')
  viewers(@CurrentUser() u: User, @Param('id') id: string) {
    return this.svc.viewers(u.id, id);
  }

  @Put(':id/privacy')
  setPrivacy(
    @CurrentUser() u: User,
    @Param('id') id: string,
    @Body() body: { hide_from: string[] },
  ) {
    return this.svc.setPrivacy(u.id, id, body.hide_from || []);
  }

  @Delete(':id')
  remove(@CurrentUser() u: User, @Param('id') id: string) {
    return this.svc.remove(u.id, id);
  }
}