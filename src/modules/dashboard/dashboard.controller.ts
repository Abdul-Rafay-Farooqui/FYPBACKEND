import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('student')
  getStudentOverview(
    @CurrentUser() user: any,
    @Query('institute_id') instituteId: string,
  ) {
    return this.service.getStudentOverview(user.id, instituteId);
  }

  @Get('teacher')
  getTeacherOverview(
    @CurrentUser() user: any,
    @Query('institute_id') instituteId: string,
  ) {
    return this.service.getTeacherOverview(user.id, instituteId);
  }

  @Get('admin')
  getAdminOverview(
    @CurrentUser() user: any,
    @Query('institute_id') instituteId: string,
  ) {
    return this.service.getAdminOverview(user.id, instituteId);
  }
}
