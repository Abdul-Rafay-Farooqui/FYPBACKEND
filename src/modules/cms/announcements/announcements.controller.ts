import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { AnnouncementsService } from './announcements.service';

@Public()
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  @Get()
  find(
    @Query('teacher_id') teacherId?: string, 
    @Query('cbs_id') cbsId?: string, 
    @Query('student_id') studentId?: string,
    @Query('institute_id') instituteId?: string
  ) {
    if (teacherId) return this.service.findByTeacher(teacherId);
    if (studentId) return this.service.findForStudent(studentId);
    if (instituteId) return this.service.findByInstitute(instituteId);
    return [];
  }

  @Get('count')
  async count(@Query('student_id') studentId: string) {
    return { count: await this.service.countForStudent(studentId) };
  }

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.service.delete(id); }
}
