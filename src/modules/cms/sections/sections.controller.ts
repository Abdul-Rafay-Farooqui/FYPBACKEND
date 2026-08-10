import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { SectionsService } from './sections.service';

@Public()
@Controller('sections')
export class SectionsController {
  constructor(private readonly service: SectionsService) {}
  
  @Get()
  findAll(
    @Query('institute_id') institute_id?: string,
    @Query('search') search?: string,
    @Query('sortField') sortField: 'name' | 'created_at' | 'student_count' = 'name',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.service.findAll(institute_id, search, sortField, sortOrder, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/students')
  getSectionWithStudents(@Param('id') id: string) {
    return this.service.getSectionWithStudents(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Post(':id/students')
  addStudentsToSection(
    @Param('id') sectionId: string,
    @Body() data: { student_ids: string[]; class_batch_section_id: string }
  ) {
    return this.service.addStudentsToSection(sectionId, data.student_ids, data.class_batch_section_id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Delete('enrollments/:enrollmentId')
  removeStudent(@Param('enrollmentId') enrollmentId: string) {
    return this.service.removeStudentFromSection(enrollmentId);
  }
}
