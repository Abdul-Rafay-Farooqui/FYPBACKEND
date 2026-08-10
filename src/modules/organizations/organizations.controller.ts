import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { User } from "../../entities";
import {
  CreateOrganizationDto,
  CreateTeamDto,
  OrganizationsService,
  UpdateOrganizationDto,
  UpdateTeamDto,
} from "./organizations.service";

@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly svc: OrganizationsService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.svc.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateOrganizationDto) {
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
    @Body() dto: UpdateOrganizationDto,
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
    @Body() body: { member_ids: string[] },
  ) {
    return this.svc.addMembers(user.id, id, body.member_ids || []);
  }

  @Patch(":id/members/:memberId")
  setMemberRole(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("memberId") memberId: string,
    @Body() body: { role: "owner" | "admin" | "manager" | "member" | "guest" },
  ) {
    return this.svc.updateMemberRole(user.id, id, memberId, body.role);
  }

  @Delete(":id/members/:memberId")
  removeMember(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("memberId") memberId: string,
  ) {
    return this.svc.removeMember(user.id, id, memberId);
  }

  @Post(":id/leave")
  leave(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.leave(user.id, id);
  }

  @Get(":id/teams")
  listTeams(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.listTeams(user.id, id);
  }

  @Post(":id/teams")
  createTeam(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: CreateTeamDto,
  ) {
    return this.svc.createTeam(user.id, id, dto);
  }

  @Get(":id/teams/:teamId")
  getTeam(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
  ) {
    return this.svc.getTeam(user.id, id, teamId);
  }

  @Patch(":id/teams/:teamId")
  updateTeam(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.svc.updateTeam(user.id, id, teamId, dto);
  }

  @Delete(":id/teams/:teamId")
  removeTeam(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
  ) {
    return this.svc.deleteTeam(user.id, id, teamId);
  }

  @Post(":id/teams/:teamId/members")
  addTeamMembers(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body() body: { member_ids: string[] },
  ) {
    return this.svc.addTeamMembers(user.id, id, teamId, body.member_ids || []);
  }

  @Patch(":id/teams/:teamId/members/:memberId")
  setTeamMemberRole(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("memberId") memberId: string,
    @Body() body: { role: "lead" | "member" | "guest" },
  ) {
    return this.svc.setTeamMemberRole(user.id, id, teamId, memberId, body.role);
  }

  @Delete(":id/teams/:teamId/members/:memberId")
  removeTeamMember(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("memberId") memberId: string,
  ) {
    return this.svc.removeTeamMember(user.id, id, teamId, memberId);
  }

  @Get(":id/teams/:teamId/workspace")
  workspace(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
  ) {
    return this.svc.getTeamWorkspace(user.id, id, teamId);
  }

  @Post(":id/teams/:teamId/tasks")
  createTask(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body()
    body: {
      title: string;
      description?: string;
      assignee_id?: string;
      priority?: string;
      due_date?: string;
    },
  ) {
    return this.svc.createTask(user.id, id, teamId, body);
  }

  @Post(":id/teams/:teamId/meetings/schedule")
  scheduleMeeting(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body()
    body: {
      title: string;
      description?: string;
      starts_at: string;
      ends_at: string;
      location_type?: "online" | "onsite" | "hybrid";
      attendee_ids?: string[];
      meeting_link?: string;
      call_type?: "voice" | "video";
    },
  ) {
    return this.svc.scheduleMeeting(user.id, id, teamId, body);
  }

  @Post(":id/teams/:teamId/meetings/start-now")
  startMeetingNow(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body()
    body: {
      title: string;
      description?: string;
      duration_minutes?: number;
      attendee_ids?: string[];
      call_type?: "voice" | "video";
    },
  ) {
    return this.svc.startMeetingNow(user.id, id, teamId, body);
  }

  @Post(":id/teams/:teamId/meetings/:meetingId/start")
  startMeeting(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("meetingId") meetingId: string,
    @Body() body: { call_type?: "voice" | "video" },
  ) {
    return this.svc.startMeeting(
      user.id,
      id,
      teamId,
      meetingId,
      body.call_type,
    );
  }

  @Post(":id/teams/:teamId/meetings/:meetingId/end")
  endMeeting(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("meetingId") meetingId: string,
  ) {
    return this.svc.endMeeting(user.id, id, teamId, meetingId);
  }

  @Post(":id/teams/:teamId/meetings/:meetingId/join")
  joinMeeting(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("meetingId") meetingId: string,
  ) {
    return this.svc.joinMeeting(user.id, id, teamId, meetingId);
  }

  @Post(":id/teams/:teamId/meetings/:meetingId/leave")
  leaveMeeting(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("meetingId") meetingId: string,
  ) {
    return this.svc.leaveMeeting(user.id, id, teamId, meetingId);
  }

  @Delete(":id/teams/:teamId/tasks/:taskId")
  deleteTask(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("taskId") taskId: string,
  ) {
    return this.svc.deleteTask(user.id, id, teamId, taskId);
  }

  @Patch(":id/teams/:teamId/tasks/:taskId")
  updateTask(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("taskId") taskId: string,
    @Body() body: { status?: string },
  ) {
    return this.svc.updateTask(user.id, id, teamId, taskId, body);
  }

  @Post(":id/teams/:teamId/activities")
  createActivity(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body() body: { activity_type: string; preview_text?: string },
  ) {
    return this.svc.createActivity(user.id, id, teamId, body);
  }

  @Delete(":id/teams/:teamId/activities/:activityId")
  deleteActivity(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("activityId") activityId: string,
  ) {
    return this.svc.deleteActivity(user.id, id, teamId, activityId);
  }

  @Post(":id/calendar")
  createCalendarEvent(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body()
    body: {
      title: string;
      description?: string;
      date: string;
      start_time: string;
      end_time?: string;
      location?: string;
      attendee_ids?: string[];
      type?: string;
    },
  ) {
    return this.svc.createCalendarEvent(user.id, id, body);
  }

  @Delete(":id/calendar/:eventId")
  deleteCalendarEvent(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("eventId") eventId: string,
  ) {
    return this.svc.deleteCalendarEvent(user.id, id, eventId);
  }

  @Post(":id/teams/:teamId/attendance/clock-in")
  clockIn(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
  ) {
    return this.svc.clockIn(user.id, id, teamId);
  }

  @Post(":id/teams/:teamId/attendance/clock-out")
  clockOut(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
  ) {
    return this.svc.clockOut(user.id, id, teamId);
  }

  // Organization-level attendance
  @Post(":id/attendance/clock-in")
  orgClockIn(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.orgClockIn(user.id, id);
  }

  @Post(":id/attendance/clock-out")
  orgClockOut(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.orgClockOut(user.id, id);
  }

  @Get(":id/attendance")
  getOrgAttendance(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.getOrgAttendance(user.id, id);
  }

  @Post(":id/teams/:teamId/approvals")
  createApproval(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body()
    body: {
      approval_type: string;
      title: string;
      description?: string;
      amount?: string;
    },
  ) {
    return this.svc.createApproval(user.id, id, teamId, body);
  }

  @Patch(":id/teams/:teamId/approvals/:approvalId/approve")
  approveApproval(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("approvalId") approvalId: string,
    @Body() body: { note?: string },
  ) {
    return this.svc.approveApproval(user.id, id, teamId, approvalId, body.note);
  }

  @Patch(":id/teams/:teamId/approvals/:approvalId/reject")
  rejectApproval(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("approvalId") approvalId: string,
    @Body() body: { note: string },
  ) {
    return this.svc.rejectApproval(user.id, id, teamId, approvalId, body.note);
  }

  @Delete(":id/teams/:teamId/approvals/:approvalId")
  cancelApproval(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("approvalId") approvalId: string,
  ) {
    return this.svc.cancelApproval(user.id, id, teamId, approvalId);
  }

  // Organization-level praise (removed team-level praise)
  @Post(":id/praise")
  sendOrgPraise(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body()
    body: {
      to_user_id: string;
      badge: string;
      message?: string;
    },
  ) {
    return this.svc.sendOrgPraise(user.id, id, body);
  }

  @Get(":id/praise")
  getOrgPraise(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.getOrgPraise(user.id, id);
  }

  @Get(":id/calendar")
  getOrgCalendar(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.getOrgCalendar(user.id, id);
  }

  // Notifications
  @Get(":id/notifications")
  getNotifications(@CurrentUser() user: User, @Param("id") id: string) {
    return this.svc.getNotifications(user.id, id);
  }

  @Patch(":id/notifications/:notificationId/read")
  markNotificationAsRead(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("notificationId") notificationId: string,
  ) {
    return this.svc.markNotificationAsRead(user.id, id, notificationId);
  }

  @Post(":id/notifications/mark-all-read")
  markAllNotificationsAsRead(
    @CurrentUser() user: User,
    @Param("id") id: string,
  ) {
    return this.svc.markAllNotificationsAsRead(user.id, id);
  }

  @Delete(":id/notifications/:notificationId")
  deleteNotification(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Param("notificationId") notificationId: string,
  ) {
    return this.svc.deleteNotification(user.id, id, notificationId);
  }
}
