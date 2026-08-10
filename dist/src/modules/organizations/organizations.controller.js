"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const entities_1 = require("../../entities");
const organizations_service_1 = require("./organizations.service");
let OrganizationsController = class OrganizationsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(user) {
        return this.svc.list(user.id);
    }
    create(user, dto) {
        return this.svc.create(user.id, dto);
    }
    get(user, id) {
        return this.svc.get(user.id, id);
    }
    update(user, id, dto) {
        return this.svc.update(user.id, id, dto);
    }
    remove(user, id) {
        return this.svc.delete(user.id, id);
    }
    addMembers(user, id, body) {
        return this.svc.addMembers(user.id, id, body.member_ids || []);
    }
    setMemberRole(user, id, memberId, body) {
        return this.svc.updateMemberRole(user.id, id, memberId, body.role);
    }
    removeMember(user, id, memberId) {
        return this.svc.removeMember(user.id, id, memberId);
    }
    leave(user, id) {
        return this.svc.leave(user.id, id);
    }
    listTeams(user, id) {
        return this.svc.listTeams(user.id, id);
    }
    createTeam(user, id, dto) {
        return this.svc.createTeam(user.id, id, dto);
    }
    getTeam(user, id, teamId) {
        return this.svc.getTeam(user.id, id, teamId);
    }
    updateTeam(user, id, teamId, dto) {
        return this.svc.updateTeam(user.id, id, teamId, dto);
    }
    removeTeam(user, id, teamId) {
        return this.svc.deleteTeam(user.id, id, teamId);
    }
    addTeamMembers(user, id, teamId, body) {
        return this.svc.addTeamMembers(user.id, id, teamId, body.member_ids || []);
    }
    setTeamMemberRole(user, id, teamId, memberId, body) {
        return this.svc.setTeamMemberRole(user.id, id, teamId, memberId, body.role);
    }
    removeTeamMember(user, id, teamId, memberId) {
        return this.svc.removeTeamMember(user.id, id, teamId, memberId);
    }
    workspace(user, id, teamId) {
        return this.svc.getTeamWorkspace(user.id, id, teamId);
    }
    createTask(user, id, teamId, body) {
        return this.svc.createTask(user.id, id, teamId, body);
    }
    scheduleMeeting(user, id, teamId, body) {
        return this.svc.scheduleMeeting(user.id, id, teamId, body);
    }
    startMeetingNow(user, id, teamId, body) {
        return this.svc.startMeetingNow(user.id, id, teamId, body);
    }
    startMeeting(user, id, teamId, meetingId, body) {
        return this.svc.startMeeting(user.id, id, teamId, meetingId, body.call_type);
    }
    endMeeting(user, id, teamId, meetingId) {
        return this.svc.endMeeting(user.id, id, teamId, meetingId);
    }
    joinMeeting(user, id, teamId, meetingId) {
        return this.svc.joinMeeting(user.id, id, teamId, meetingId);
    }
    leaveMeeting(user, id, teamId, meetingId) {
        return this.svc.leaveMeeting(user.id, id, teamId, meetingId);
    }
    deleteTask(user, id, teamId, taskId) {
        return this.svc.deleteTask(user.id, id, teamId, taskId);
    }
    updateTask(user, id, teamId, taskId, body) {
        return this.svc.updateTask(user.id, id, teamId, taskId, body);
    }
    createActivity(user, id, teamId, body) {
        return this.svc.createActivity(user.id, id, teamId, body);
    }
    deleteActivity(user, id, teamId, activityId) {
        return this.svc.deleteActivity(user.id, id, teamId, activityId);
    }
    createCalendarEvent(user, id, body) {
        return this.svc.createCalendarEvent(user.id, id, body);
    }
    deleteCalendarEvent(user, id, eventId) {
        return this.svc.deleteCalendarEvent(user.id, id, eventId);
    }
    clockIn(user, id, teamId) {
        return this.svc.clockIn(user.id, id, teamId);
    }
    clockOut(user, id, teamId) {
        return this.svc.clockOut(user.id, id, teamId);
    }
    orgClockIn(user, id) {
        return this.svc.orgClockIn(user.id, id);
    }
    orgClockOut(user, id) {
        return this.svc.orgClockOut(user.id, id);
    }
    getOrgAttendance(user, id) {
        return this.svc.getOrgAttendance(user.id, id);
    }
    createApproval(user, id, teamId, body) {
        return this.svc.createApproval(user.id, id, teamId, body);
    }
    approveApproval(user, id, teamId, approvalId, body) {
        return this.svc.approveApproval(user.id, id, teamId, approvalId, body.note);
    }
    rejectApproval(user, id, teamId, approvalId, body) {
        return this.svc.rejectApproval(user.id, id, teamId, approvalId, body.note);
    }
    cancelApproval(user, id, teamId, approvalId) {
        return this.svc.cancelApproval(user.id, id, teamId, approvalId);
    }
    sendOrgPraise(user, id, body) {
        return this.svc.sendOrgPraise(user.id, id, body);
    }
    getOrgPraise(user, id) {
        return this.svc.getOrgPraise(user.id, id);
    }
    getOrgCalendar(user, id) {
        return this.svc.getOrgCalendar(user.id, id);
    }
    getNotifications(user, id) {
        return this.svc.getNotifications(user.id, id);
    }
    markNotificationAsRead(user, id, notificationId) {
        return this.svc.markNotificationAsRead(user.id, id, notificationId);
    }
    markAllNotificationsAsRead(user, id) {
        return this.svc.markAllNotificationsAsRead(user.id, id);
    }
    deleteNotification(user, id, notificationId) {
        return this.svc.deleteNotification(user.id, id, notificationId);
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/members"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "addMembers", null);
__decorate([
    (0, common_1.Patch)(":id/members/:memberId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("memberId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "setMemberRole", null);
__decorate([
    (0, common_1.Delete)(":id/members/:memberId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("memberId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Post)(":id/leave"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "leave", null);
__decorate([
    (0, common_1.Get)(":id/teams"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "listTeams", null);
__decorate([
    (0, common_1.Post)(":id/teams"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createTeam", null);
__decorate([
    (0, common_1.Get)(":id/teams/:teamId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "getTeam", null);
__decorate([
    (0, common_1.Patch)(":id/teams/:teamId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "updateTeam", null);
__decorate([
    (0, common_1.Delete)(":id/teams/:teamId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "removeTeam", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/members"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "addTeamMembers", null);
__decorate([
    (0, common_1.Patch)(":id/teams/:teamId/members/:memberId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("memberId")),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "setTeamMemberRole", null);
__decorate([
    (0, common_1.Delete)(":id/teams/:teamId/members/:memberId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("memberId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "removeTeamMember", null);
__decorate([
    (0, common_1.Get)(":id/teams/:teamId/workspace"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "workspace", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/tasks"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createTask", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/meetings/schedule"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "scheduleMeeting", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/meetings/start-now"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "startMeetingNow", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/meetings/:meetingId/start"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("meetingId")),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "startMeeting", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/meetings/:meetingId/end"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("meetingId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "endMeeting", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/meetings/:meetingId/join"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("meetingId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "joinMeeting", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/meetings/:meetingId/leave"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("meetingId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "leaveMeeting", null);
__decorate([
    (0, common_1.Delete)(":id/teams/:teamId/tasks/:taskId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("taskId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Patch)(":id/teams/:teamId/tasks/:taskId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("taskId")),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/activities"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Delete)(":id/teams/:teamId/activities/:activityId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("activityId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "deleteActivity", null);
__decorate([
    (0, common_1.Post)(":id/calendar"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createCalendarEvent", null);
__decorate([
    (0, common_1.Delete)(":id/calendar/:eventId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "deleteCalendarEvent", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/attendance/clock-in"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/attendance/clock-out"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Post)(":id/attendance/clock-in"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "orgClockIn", null);
__decorate([
    (0, common_1.Post)(":id/attendance/clock-out"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "orgClockOut", null);
__decorate([
    (0, common_1.Get)(":id/attendance"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "getOrgAttendance", null);
__decorate([
    (0, common_1.Post)(":id/teams/:teamId/approvals"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "createApproval", null);
__decorate([
    (0, common_1.Patch)(":id/teams/:teamId/approvals/:approvalId/approve"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("approvalId")),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "approveApproval", null);
__decorate([
    (0, common_1.Patch)(":id/teams/:teamId/approvals/:approvalId/reject"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("approvalId")),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "rejectApproval", null);
__decorate([
    (0, common_1.Delete)(":id/teams/:teamId/approvals/:approvalId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("teamId")),
    __param(3, (0, common_1.Param)("approvalId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "cancelApproval", null);
__decorate([
    (0, common_1.Post)(":id/praise"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "sendOrgPraise", null);
__decorate([
    (0, common_1.Get)(":id/praise"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "getOrgPraise", null);
__decorate([
    (0, common_1.Get)(":id/calendar"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "getOrgCalendar", null);
__decorate([
    (0, common_1.Get)(":id/notifications"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)(":id/notifications/:notificationId/read"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("notificationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "markNotificationAsRead", null);
__decorate([
    (0, common_1.Post)(":id/notifications/mark-all-read"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "markAllNotificationsAsRead", null);
__decorate([
    (0, common_1.Delete)(":id/notifications/:notificationId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("notificationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "deleteNotification", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, common_1.Controller)("organizations"),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map