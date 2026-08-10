import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { AttendanceService } from './attendance.service';

@Public()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get()
  find(@Query('student_id') studentId?: string, @Query('cbs_id') cbsId?: string, @Query('date') date?: string) {
    if (studentId) return this.service.findByStudent(studentId);
    if (cbsId && date) return this.service.findByCbsAndDate(cbsId, date);
    return [];
  }

  @Post('bulk')
  createBulk(@Body() records: any[]) {
    return this.service.createBulk(records);
  }

  @Delete()
  delete(@Query('cbs_id') cbsId: string, @Query('date') date: string) {
    return this.service.deleteByCbsAndDate(cbsId, date);
  }
}
