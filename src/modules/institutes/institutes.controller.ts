import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { User } from "../../entities";
import {
  AddMembersDto,
  CreateInstituteDto,
  InstitutesService,
  UpdateInstituteDto,
} from "./institutes.service";
import { AttendanceService } from "../cms/attendance/attendance.service";

@Controller("institutes")
export class InstitutesController {
  constructor(
    private readonly svc: InstitutesService,
    private readonly attendanceSvc: AttendanceService,
  ) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.svc.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateInstituteDto) {
    return this.svc.create(user.id, dto);
  }

  @Get(":id")
  get(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.get(user.id, id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdateInstituteDto,
  ) {
    return this.svc.update(user.id, id, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.delete(user.id, id);
  }

  @Post(":id/members")
  addMembers(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: AddMembersDto,
  ) {
    return this.svc.addMembers(user.id, id, dto);
  }

  @Get(":id/members")
  getMembers(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Query("role") role?: string,
  ) {
    return this.svc.getMembers(user.id, id, role);
  }

  @Patch(":id/members/:memberId")
  updateMember(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("memberId") memberId: string,
    @Body() dto: { role?: "admin" | "teacher" | "student"; status?: "active" | "invited" | "suspended" | "left" },
  ) {
    return this.svc.updateMember(user.id, id, memberId, dto);
  }

  @Delete(":id/members/:memberId")
  removeMember(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("memberId") memberId: string,
  ) {
    return this.svc.removeMember(user.id, id, memberId);
  }

  // Attendance endpoints
  @Get(":id/subjects/:subjectId/attendance")
  getAttendanceByDate(
    @Param("id") instituteId: string,
    @Param("subjectId") subjectId: string,
    @Query("date") date: string,
  ) {
    return this.attendanceSvc.findBySubjectAndDate(subjectId, date, instituteId);
  }

  @Get(":id/subjects/:subjectId/attendance/monthly")
  getMonthlyAttendance(
    @Param("id") instituteId: string,
    @Param("subjectId") subjectId: string,
    @Query("month") yearMonth: string,
  ) {
    return this.attendanceSvc.findBySubjectAndMonth(subjectId, yearMonth, instituteId);
  }

  @Get(":id/subjects/:subjectId/students/:studentId/attendance")
  getStudentAttendanceBySubject(
    @Param("id") instituteId: string,
    @Param("subjectId") subjectId: string,
    @Param("studentId") studentId: string,
  ) {
    return this.attendanceSvc.findBySubjectAndStudent(subjectId, studentId, instituteId);
  }

  @Post("attendance/bulk")
  saveBulkAttendance(@Body() records: any[]) {
    return this.attendanceSvc.saveBulkAttendance(records);
  }
}
