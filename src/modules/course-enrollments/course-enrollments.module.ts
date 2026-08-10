import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEnrollment, Subject } from '../../entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { CourseEnrollmentsController } from './course-enrollments.controller';
import { CourseEnrollmentsService } from './course-enrollments.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEnrollment, Subject]), RealtimeModule],
  controllers: [CourseEnrollmentsController],
  providers: [CourseEnrollmentsService],
  exports: [CourseEnrollmentsService],
})
export class CourseEnrollmentsModule {}
