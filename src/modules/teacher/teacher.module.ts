import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";
import {
  SubjectAssignment,
  StudentEnrollment,
  Quiz,
  Homework,
  Announcement,
  Schedule,
  ClassBatchSection,
  CourseEnrollment,
} from "../../entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubjectAssignment,
      StudentEnrollment,
      Quiz,
      Homework,
      Announcement,
      Schedule,
      ClassBatchSection,
      CourseEnrollment,
    ]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
