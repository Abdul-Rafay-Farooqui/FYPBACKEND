import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import {
  CreateGroupDto,
  GroupsService,
  UpdateGroupDto,
} from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly svc: GroupsService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.svc.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateGroupDto) {
    return this.svc.create(user.id, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.get(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.svc.update(user.id, id, dto);
  }

  @Post(':id/members')
  addMembers(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: { member_ids: string[] },
  ) {
    return this.svc.addMembers(user.id, id, body.member_ids || []);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.svc.removeMember(user.id, id, memberId);
  }

  @Post(':id/leave')
  leave(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.leave(user.id, id);
  }

  @Post(':id/members/:memberId/role')
  setRole(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() body: { role: 'admin' | 'member' },
  ) {
    return this.svc.setRole(user.id, id, memberId, body.role);
  }
}