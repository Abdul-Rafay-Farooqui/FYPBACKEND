import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscussionsController } from './discussions.controller';
import { DiscussionsService } from './discussions.service';
import { Discussion, User } from '../../entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { InstituteNotificationsModule } from '../institute-notifications/institute-notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discussion, User]),
    RealtimeModule,
    InstituteNotificationsModule,
  ],
  controllers: [DiscussionsController],
  providers: [DiscussionsService],
  exports: [DiscussionsService],
})
export class DiscussionsModule {}
