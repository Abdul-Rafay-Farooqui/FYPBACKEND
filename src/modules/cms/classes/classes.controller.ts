import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto } from './dto/classes.dto';

@Public()
@Controller('classes')
export class ClassesController {
  constructor(private readonly service: ClassesService) {}

  @Get()
  findAll(@Query('institute_id') institute_id?: string) { 
    return this.service.findAll(institute_id); 
  }

  @Get('count')
  async count(@Query('institute_id') institute_id?: string) { 
    return { count: await this.service.count(institute_id) }; 
  }

  @Post()
  create(@Body() data: CreateClassDto) { return this.service.create(data); }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateClassDto) { return this.service.update(id, data); }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.service.delete(id); }
}
