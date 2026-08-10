import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { SubjectsService } from './subjects.service';

@Public()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}
  @Get() findAll(@Query('institute_id') institute_id?: string) { return this.service.findAll(institute_id); }
  @Post() create(@Body() data: any) { return this.service.create(data); }
  @Put(':id') update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Patch(':id') patch(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }
  @Delete(':id') delete(@Param('id') id: string) { return this.service.delete(id); }
}
