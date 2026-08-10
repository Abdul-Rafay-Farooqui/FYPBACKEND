import { Controller, Get, Post, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { DiscussionsService } from './discussions.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Public()
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly service: DiscussionsService) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  findAll(
    @Query('student_id') student_id?: string,
    @Query('teacher_id') teacher_id?: string,
    @Query('institute_id') institute_id?: string,
    @Query('class_batch_section_id') class_batch_section_id?: string,
  ) {
    return this.service.findAll({ student_id, teacher_id, institute_id, class_batch_section_id });
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: any, @Query('role') role: 'student' | 'teacher') {
    return this.service.getUnreadCount(user.id, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/replies')
  getReplies(@Param('id') id: string) {
    return this.service.getReplies(id);
  }

  @Post(':id/reply')
  reply(@Param('id') parentId: string, @Body() data: any) {
    return this.service.reply(parentId, data);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
