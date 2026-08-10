import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CourseEnrollmentsService } from './course-enrollments.service';

@Public()
@Controller('course-enrollments')
export class CourseEnrollmentsController {
  constructor(private readonly service: CourseEnrollmentsService) {}

  @Get()
  findAll(
    @Query('student_id') studentId?: string,
    @Query('subject_id') subjectId?: string,
    @Query('institute_id') instituteId?: string,
  ) {
    return this.service.findAll({ student_id: studentId, subject_id: subjectId, institute_id: instituteId });
  }

  @Get('by-subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.service.findBySubject(subjectId);
  }

  @Post()
  enroll(@Body() data: { student_id: string; subject_id: string; institute_id: string }) {
    return this.service.enroll(data);
  }

  @Post('join-by-code')
  joinByCode(@Body() data: { student_id: string; course_code: string; institute_id: string }) {
    return this.service.joinByCode(data);
  }

  @Delete(':id')
  unenroll(@Param('id') id: string) {
    return this.service.unenroll(id);
  }
}
