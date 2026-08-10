import { Controller, Get, Patch, Delete, Param, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities';
import { InstituteNotificationsService } from './institute-notifications.service';

@Controller('institute-notifications')
export class InstituteNotificationsController {
  constructor(private readonly service: InstituteNotificationsService) {}

  @Get()
  getNotifications(
    @CurrentUser() user: User,
    @Query('institute_id') instituteId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findByUser(
      user.id,
      instituteId,
      limit ? parseInt(limit) : undefined,
    );
  }

  @Get('unread')
  getUnreadNotifications(
    @CurrentUser() user: User,
    @Query('institute_id') instituteId?: string,
  ) {
    return this.service.findUnreadByUser(user.id, instituteId);
  }

  @Get('unread-count')
  getUnreadCount(
    @CurrentUser() user: User,
    @Query('institute_id') instituteId?: string,
  ) {
    return this.service.countUnread(user.id, instituteId);
  }

  @Patch(':id/read')
  markAsRead(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.markAsRead(id, user.id);
  }

  @Patch('mark-all-read')
  markAllAsRead(
    @CurrentUser() user: User,
    @Query('institute_id') instituteId?: string,
  ) {
    return this.service.markAllAsRead(user.id, instituteId);
  }

  @Delete(':id')
  deleteNotification(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.delete(id, user.id);
  }

  @Delete()
  deleteAllNotifications(
    @CurrentUser() user: User,
    @Query('institute_id') instituteId?: string,
  ) {
    return this.service.deleteAll(user.id, instituteId);
  }
}
