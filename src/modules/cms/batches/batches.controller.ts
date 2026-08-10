import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { BatchesService } from './batches.service';
import { CreateBatchDto, UpdateBatchDto, AddStudentsToBatchDto, SortField, SortOrder } from './dto/batches.dto';

@Public()
@Controller('batches')
export class BatchesController {
  constructor(private readonly service: BatchesService) {}

  @Get()
  findAll(
    @Query('institute_id') institute_id?: string,
    @Query('search') search?: string,
    @Query('sortField') sortField: SortField = SortField.YEAR,
    @Query('sortOrder') sortOrder: SortOrder = SortOrder.DESC,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.service.findAll(institute_id, search, sortField, sortOrder, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/students')
  getBatchWithStudents(@Param('id') id: string) {
    return this.service.getBatchWithStudents(id);
  }

  @Post()
  create(@Body() data: CreateBatchDto) {
    return this.service.create(data);
  }

  @Post(':id/students')
  addStudentsToBatch(
    @Param('id') batchId: string,
    @Body() data: AddStudentsToBatchDto
  ) {
    return this.service.addStudentsToBatch(batchId, data.student_ids, data.class_batch_section_id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateBatchDto) {
    return this.service.update(id, data);
  }

  @Put('enrollments/:enrollmentId')
  updateEnrollment(
    @Param('enrollmentId') enrollmentId: string,
    @Body('class_batch_section_id') classBatchSectionId: string
  ) {
    return this.service.updateStudentEnrollment(enrollmentId, classBatchSectionId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Delete('enrollments/:enrollmentId')
  removeStudent(@Param('enrollmentId') enrollmentId: string) {
    return this.service.removeStudentFromBatch(enrollmentId);
  }
}
