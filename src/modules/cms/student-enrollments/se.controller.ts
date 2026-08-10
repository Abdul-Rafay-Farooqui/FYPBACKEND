import { Controller, Get, Post, Put, Body, Query } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { SeService } from './se.service';

@Public()
@Controller('student-enrollments')
export class SeController {
  constructor(private readonly service: SeService) {}

  @Get()
  async find(@Query('student_id') studentId?: string, @Query('cbs_id') cbsId?: string, @Query('active') active?: string) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    if (studentId) return this.service.findByStudent(studentId, isActive);
    if (cbsId) return this.service.findByCbs(cbsId, isActive);
    return [];
  }

  @Get('single')
  findSingle(@Query('student_id') studentId: string) {
    return this.service.findByStudentSingle(studentId);
  }

  @Get('count')
  async count(@Query('cbs_ids') cbsIds: string) {
    const ids = cbsIds ? cbsIds.split(',') : [];
    return { count: await this.service.countByCbs(ids) };
  }

  @Post()
  create(@Body() data: any[]) {
    return this.service.create(data);
  }

  @Put('deactivate')
  deactivate(@Body() body: { cbs_id: string; student_ids: string[] }) {
    return this.service.deactivate(body.cbs_id, body.student_ids);
  }
}
