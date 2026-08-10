import { Controller, Get, Post, Put, Body, Param, Query } from "@nestjs/common";
import { Public } from "../../../common/decorators/public.decorator";
import { HsService } from "./hs.service";

@Public()
@Controller("homework-submissions")
export class HsController {
  constructor(private readonly service: HsService) {}

  @Get()
  find(
    @Query("homework_id") homeworkId?: string,
    @Query("student_id") studentId?: string,
  ) {
    if (homeworkId) return this.service.findByHomework(homeworkId);
    if (studentId) return this.service.findByStudent(studentId);
    return this.service.findAll();
  }

  @Get("pending-count")
  async pendingCount(@Query("homework_ids") ids: string) {
    const homeworkIds = ids ? ids.split(",") : [];
    return { count: await this.service.countPending(homeworkIds) };
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.service.update(id, data);
  }
}
