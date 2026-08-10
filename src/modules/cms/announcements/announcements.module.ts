import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement, CourseEnrollment, InstituteMember } from '../../../entities';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { RealtimeModule } from '../../realtime/realtime.module';
import { InstituteNotificationsModule } from '../../institute-notifications/institute-notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announcement, CourseEnrollment, InstituteMember]),
    RealtimeModule,
    InstituteNotificationsModule,
  ],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService],
})
export class AnnouncementsModule {}
