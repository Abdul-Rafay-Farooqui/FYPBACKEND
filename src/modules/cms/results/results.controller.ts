import { Controller, Get, Post, Patch, Delete, Body, Query, Param } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { ResultsService } from './results.service';

@Public()
@Controller('results')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get()
  find(
    @Query('student_id') studentId?: string, 
    @Query('teacher_id') teacherId?: string,
    @Query('cbs_id') cbsId?: string,
    @Query('subject_id') subjectId?: string
  ) {
    console.log('📋 Results endpoint called with:', { studentId, teacherId, cbsId, subjectId });
    
    if (studentId) {
      console.log('🔍 Finding results by student:', studentId);
      return this.service.findByStudent(studentId);
    }
    if (teacherId && subjectId) {
      console.log('🔍 Finding results by teacher and subject:', { teacherId, subjectId });
      return this.service.findByTeacherAndSubject(teacherId, subjectId);
    }
    if (teacherId) {
      console.log('🔍 Finding results by teacher:', teacherId);
      return this.service.findByTeacher(teacherId);
    }
    if (cbsId) {
      console.log('🔍 Finding results by CBS:', cbsId);
      return this.service.findByCbs(cbsId, subjectId);
    }
    // Return all results when no parameters provided (for admin/dashboard views)
    console.log('📋 No query parameters provided, returning all results');
    return this.service.findAll();
  }

  @Get('count')
  async count(@Query('student_id') studentId?: string, @Query('teacher_id') teacherId?: string) {
    if (studentId) return { count: await this.service.countByStudent(studentId) };
    if (teacherId) return { count: await this.service.countByTeacher(teacherId) };
    return { count: 0 };
  }

  @Post()
  create(@Body() data: any) { 
    console.log('💾 Creating result:', data);
    return this.service.create(data); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    console.log('✏️ Updating result:', id, data);
    return this.service.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    console.log('🗑️ Deleting result:', id);
    return this.service.delete(id);
  }
}
