import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
} from "@nestjs/common";
import { Public } from "../../../common/decorators/public.decorator";
import { HomeworkService } from "./homework.service";

@Public()
@Controller("homework")
export class HomeworkController {
  constructor(private readonly service: HomeworkService) {}

  @Get()
  find(
    @Query("teacher_id") teacherId?: string,
    @Query("cbs_id") cbsId?: string,
    @Query("institute_id") instituteId?: string,
    @Query("subject_id") subjectId?: string,
    @Query("subject_ids") subjectIds?: string,
  ) {
    if (teacherId) return this.service.findByTeacher(teacherId);
    if (subjectIds) {
      const ids = subjectIds.split(",").filter((id) => id.trim());
      return this.service.findBySubjects(ids);
    }
    if (subjectId) return this.service.findBySubject(subjectId);
    if (cbsId) return this.service.findByCbs(cbsId);
    if (instituteId) return this.service.findByInstitute(instituteId);
    return [];
  }

  @Get("ids")
  async getIds(@Query("teacher_id") teacherId: string) {
    const ids = await this.service.findIdsByTeacher(teacherId);
    return { ids };
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
