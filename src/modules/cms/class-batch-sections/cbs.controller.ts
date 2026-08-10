import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { CbsService } from './cbs.service';

@Public()
@Controller('class-batch-sections')
export class CbsController {
  constructor(private readonly service: CbsService) {}

  @Get()
  findAll(
    @Query('class_id') class_id?: string,
    @Query('batch_id') batch_id?: string,
    @Query('section_id') section_id?: string
  ) { 
    return this.service.findAll(class_id, batch_id, section_id); 
  }

  @Get('count')
  async count() { return { count: await this.service.count() }; }

  @Get('find')
  findByCombo(@Query('class_id') c: string, @Query('batch_id') b: string, @Query('section_id') s: string) {
    return this.service.findByCombo(c, b, s);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.service.delete(id); }
}
