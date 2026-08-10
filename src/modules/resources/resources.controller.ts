import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ResourcesService } from './resources.service';

@Public()
@Controller('resources')
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  findAll(
    @Query('institute_id') institute_id?: string,
    @Query('teacher_id') teacher_id?: string,
    @Query('class_batch_section_id') class_batch_section_id?: string,
    @Query('subject_id') subject_id?: string,
  ) {
    return this.service.findAll({ institute_id, teacher_id, class_batch_section_id, subject_id });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
