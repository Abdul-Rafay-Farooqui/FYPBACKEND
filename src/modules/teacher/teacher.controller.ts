import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly service: TeacherService) {}

  @Get('course/:courseId/overview')
  getCourseOverview(
    @Param('courseId') courseId: string,
    @CurrentUser() user: any,
  ) {
    return this.service.getCourseOverview(courseId, user.id);
  }
}
