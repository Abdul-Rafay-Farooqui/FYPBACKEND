import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstituteNotification } from '../../entities';
import { InstituteNotificationsController } from './institute-notifications.controller';
import { InstituteNotificationsService } from './institute-notifications.service';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstituteNotification]),
    RealtimeModule,
  ],
  controllers: [InstituteNotificationsController],
  providers: [InstituteNotificationsService],
  exports: [InstituteNotificationsService],
})
export class InstituteNotificationsModule {}
