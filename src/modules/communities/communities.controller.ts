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
  CommunitiesService,
  CreateCommunityDto,
  UpdateCommunityDto,
} from './communities.service';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly svc: CommunitiesService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.svc.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateCommunityDto) {
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
    @Body() dto: UpdateCommunityDto,
  ) {
    return this.svc.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.svc.delete(user.id, id);
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

  @Post(':id/groups')
  createGroup(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      description?: string;
      avatar_url?: string;
      member_ids?: string[];
    },
  ) {
    return this.svc.createGroupInCommunity(user.id, id, body);
  }

  @Post(':id/groups/:groupId/link')
  linkGroup(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('groupId') groupId: string,
  ) {
    return this.svc.linkGroup(user.id, id, groupId);
  }

  @Delete(':id/groups/:groupId')
  unlinkGroup(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('groupId') groupId: string,
  ) {
    return this.svc.unlinkGroup(user.id, id, groupId);
  }
}