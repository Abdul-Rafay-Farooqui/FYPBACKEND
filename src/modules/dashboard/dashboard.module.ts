import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import {
  User,
  Institute,
  InstituteMember,
  Homework,
  HomeworkSubmission,
  Attendance,
  Result,
  Announcement,
  Quiz,
  QuizAttempt,
  LiveClass,
  Resource,
  ClassBatchSection,
  StudentEnrollment,
  CourseEnrollment,
  Batch,
  Section,
  Schedule,
  SubjectAssignment,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Institute,
      InstituteMember,
      Homework,
      HomeworkSubmission,
      Attendance,
      Result,
      Announcement,
      Quiz,
      QuizAttempt,
      LiveClass,
      Resource,
      ClassBatchSection,
      StudentEnrollment,
      CourseEnrollment,
      Batch,
      Section,
      Schedule,
      SubjectAssignment,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
