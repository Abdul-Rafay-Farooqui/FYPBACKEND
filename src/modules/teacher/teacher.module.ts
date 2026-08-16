import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";
import {
  SubjectAssignment,
  Quiz,
  Homework,
  Announcement,
  Schedule,
  CourseEnrollment,
} from "../../entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubjectAssignment,
      Quiz,
      Homework,
      Announcement,
      Schedule,
      CourseEnrollment,
    ]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}
