import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Patch,
} from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { LiveClassesService } from "./live-classes.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ScheduleClassDto } from "./dto/schedule-class.dto";
import { StartClassNowDto } from "./dto/start-class-now.dto";

@Controller("live-classes")
export class LiveClassesController {
  constructor(private readonly service: LiveClassesService) {}

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Post("schedule-class")
  scheduleClass(@Body() data: ScheduleClassDto, @CurrentUser() user: any) {
    console.log("[LiveClassesController] schedule-class endpoint called");
    console.log("[LiveClassesController] User:", user);
    console.log("[LiveClassesController] User ID:", user?.id);
    console.log("[LiveClassesController] Request body:", data);
    return this.service.scheduleClass(data, user?.id);
  }

  @Post("start-now")
  startClassNow(@Body() data: StartClassNowDto, @CurrentUser() user: any) {
    console.log("[LiveClassesController] start-now endpoint called");
    console.log("[LiveClassesController] User:", user);
    console.log("[LiveClassesController] User ID:", user?.id);
    console.log("[LiveClassesController] Request body:", data);
    console.log(
      "[LiveClassesController] Subject ID being sent:",
      data.subject_id,
    );
    return this.service.startClassNow(data, user?.id);
  }

  @Public()
  @Get()
  findAll(
    @Query("institute_id") institute_id?: string,
    @Query("teacher_id") teacher_id?: string,
    @Query("class_batch_section_id") class_batch_section_id?: string,
    @Query("status") status?: string,
  ) {
    return this.service.findAll({
      institute_id,
      teacher_id,
      class_batch_section_id,
      status,
    });
  }

  @Public()
  @Get("upcoming")
  findUpcoming(
    @Query("institute_id") institute_id?: string,
    @Query("teacher_id") teacher_id?: string,
    @Query("class_batch_section_id") class_batch_section_id?: string,
  ) {
    return this.service.findUpcoming({
      institute_id,
      teacher_id,
      class_batch_section_id,
    });
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body("status") status: any) {
    return this.service.updateStatus(id, status);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }

  // Participants
  @Post(":id/join")
  joinClass(@Param("id") liveClassId: string, @CurrentUser() user: any) {
    return this.service.joinClass(liveClassId, user.id);
  }

  @Post("participants/:participantId/leave")
  leaveClass(@Param("participantId") participantId: string) {
    return this.service.leaveClass(participantId);
  }

  @Get(":id/participants")
  getParticipants(@Param("id") liveClassId: string) {
    return this.service.getParticipants(liveClassId);
  }

  @Get(":id/participants/active")
  getActiveParticipants(@Param("id") liveClassId: string) {
    return this.service.getActiveParticipants(liveClassId);
  }
}
