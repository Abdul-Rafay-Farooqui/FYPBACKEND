import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework, CourseEnrollment } from '../../../entities';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { InstituteNotificationsModule } from '../../institute-notifications/institute-notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Homework, CourseEnrollment]),
    InstituteNotificationsModule,
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService],
  exports: [HomeworkService],
})
export class HomeworkModule {}
