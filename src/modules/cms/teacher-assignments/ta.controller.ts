import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { TaService } from './ta.service';

@Public()
@Controller('teacher-assignments')
export class TaController {
  constructor(private readonly service: TaService) {}

  @Get()
  findByTeacher(@Query('teacher_id') teacherId: string) {
    return this.service.findByTeacher(teacherId);
  }

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.service.delete(id); }
}
