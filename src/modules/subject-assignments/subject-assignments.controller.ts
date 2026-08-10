import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { SubjectAssignmentsService } from './subject-assignments.service';

@Controller('subject-assignments')
export class SubjectAssignmentsController {
  constructor(private readonly service: SubjectAssignmentsService) {}

  @Post()
  create(@Body() data: { subject_id: string; teacher_id: string; institute_id: string }) {
    return this.service.create(data);
  }

  @Get()
  findAll(@Query('institute_id') instituteId: string) {
    return this.service.findAll(instituteId);
  }

  @Get('teacher/:teacherId')
  findByTeacher(
    @Param('teacherId') teacherId: string,
    @Query('institute_id') instituteId: string,
  ) {
    return this.service.findByTeacher(teacherId, instituteId);
  }

  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.service.findBySubject(subjectId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
