import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly svc: ContactsService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.svc.list(user.id);
  }

  @Post()
  add(
    @CurrentUser() user: User,
    @Body() body: { phone: string; nickname?: string },
  ) {
    return this.svc.addByPhone(user.id, body.phone, body.nickname);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.remove(user.id, id);
  }

  @Patch(':id/favourite')
  fav(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { is_favourite: boolean },
  ) {
    return this.svc.favourite(user.id, id, !!body.is_favourite);
  }
}