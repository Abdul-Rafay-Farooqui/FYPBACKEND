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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgCalendarEventAttendee = exports.OrgCalendarEvent = exports.OrgCallLogParticipant = exports.OrgCallLog = exports.OrgActivityLog = exports.OrgNotification = exports.OrgPraise = exports.OrgApproval = exports.OrgShift = exports.OrgAttendanceLog = exports.OrgTask = exports.OrgMeetingAttendee = exports.OrgMeeting = exports.TeamConversation = exports.TeamMember = exports.OrganizationTeam = exports.OrganizationMember = exports.Organization = void 0;
const typeorm_1 = require("typeorm");
let Organization = class Organization {
    id;
    name;
    slug;
    description;
    logo_url;
    website_url;
    created_by;
    is_active;
    created_at;
    updated_at;
};
exports.Organization = Organization;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Organization.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Organization.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, unique: true }),
    __metadata("design:type", String)
], Organization.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "logo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "website_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Organization.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Organization.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Organization.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Organization.prototype, "updated_at", void 0);
exports.Organization = Organization = __decorate([
    (0, typeorm_1.Entity)("organizations")
], Organization);
let OrganizationMember = class OrganizationMember {
    id;
    organization_id;
    user_id;
    role;
    title;
    department;
    employee_code;
    joined_at;
    invited_by;
    status;
    created_at;
    updated_at;
};
exports.OrganizationMember = OrganizationMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrganizationMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrganizationMember.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrganizationMember.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "member" }),
    __metadata("design:type", String)
], OrganizationMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrganizationMember.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrganizationMember.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrganizationMember.prototype, "employee_code", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrganizationMember.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrganizationMember.prototype, "invited_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "active" }),
    __metadata("design:type", String)
], OrganizationMember.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrganizationMember.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrganizationMember.prototype, "updated_at", void 0);
exports.OrganizationMember = OrganizationMember = __decorate([
    (0, typeorm_1.Entity)("organization_members"),
    (0, typeorm_1.Unique)(["organization_id", "user_id"])
], OrganizationMember);
let OrganizationTeam = class OrganizationTeam {
    id;
    organization_id;
    name;
    description;
    lead_user_id;
    visibility;
    is_active;
    created_by;
    created_at;
    updated_at;
};
exports.OrganizationTeam = OrganizationTeam;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrganizationTeam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrganizationTeam.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrganizationTeam.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrganizationTeam.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrganizationTeam.prototype, "lead_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "organization" }),
    __metadata("design:type", String)
], OrganizationTeam.prototype, "visibility", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], OrganizationTeam.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrganizationTeam.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrganizationTeam.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrganizationTeam.prototype, "updated_at", void 0);
exports.OrganizationTeam = OrganizationTeam = __decorate([
    (0, typeorm_1.Entity)("organization_teams"),
    (0, typeorm_1.Unique)(["organization_id", "name"])
], OrganizationTeam);
let TeamMember = class TeamMember {
    id;
    team_id;
    user_id;
    role;
    joined_at;
    added_by;
    created_at;
};
exports.TeamMember = TeamMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TeamMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TeamMember.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TeamMember.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "member" }),
    __metadata("design:type", String)
], TeamMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], TeamMember.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "added_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], TeamMember.prototype, "created_at", void 0);
exports.TeamMember = TeamMember = __decorate([
    (0, typeorm_1.Entity)("team_members"),
    (0, typeorm_1.Unique)(["team_id", "user_id"])
], TeamMember);
let TeamConversation = class TeamConversation {
    id;
    team_id;
    conversation_id;
    type;
    created_at;
};
exports.TeamConversation = TeamConversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TeamConversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TeamConversation.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], TeamConversation.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "main" }),
    __metadata("design:type", String)
], TeamConversation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], TeamConversation.prototype, "created_at", void 0);
exports.TeamConversation = TeamConversation = __decorate([
    (0, typeorm_1.Entity)("team_conversations"),
    (0, typeorm_1.Unique)(["team_id", "conversation_id"]),
    (0, typeorm_1.Unique)(["team_id", "type"])
], TeamConversation);
let OrgMeeting = class OrgMeeting {
    id;
    organization_id;
    team_id;
    title;
    description;
    starts_at;
    ends_at;
    created_by;
    location_type;
    meeting_link;
    status;
    created_at;
    updated_at;
};
exports.OrgMeeting = OrgMeeting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgMeeting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgMeeting.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgMeeting.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgMeeting.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgMeeting.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgMeeting.prototype, "starts_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgMeeting.prototype, "ends_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgMeeting.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "online" }),
    __metadata("design:type", String)
], OrgMeeting.prototype, "location_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgMeeting.prototype, "meeting_link", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "scheduled" }),
    __metadata("design:type", String)
], OrgMeeting.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgMeeting.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgMeeting.prototype, "updated_at", void 0);
exports.OrgMeeting = OrgMeeting = __decorate([
    (0, typeorm_1.Entity)("org_meetings")
], OrgMeeting);
let OrgMeetingAttendee = class OrgMeetingAttendee {
    id;
    meeting_id;
    user_id;
    response_status;
    attendance_status;
    joined_at;
    left_at;
    created_at;
};
exports.OrgMeetingAttendee = OrgMeetingAttendee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgMeetingAttendee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgMeetingAttendee.prototype, "meeting_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgMeetingAttendee.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "pending" }),
    __metadata("design:type", String)
], OrgMeetingAttendee.prototype, "response_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "not_marked" }),
    __metadata("design:type", String)
], OrgMeetingAttendee.prototype, "attendance_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgMeetingAttendee.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgMeetingAttendee.prototype, "left_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgMeetingAttendee.prototype, "created_at", void 0);
exports.OrgMeetingAttendee = OrgMeetingAttendee = __decorate([
    (0, typeorm_1.Entity)("org_meeting_attendees"),
    (0, typeorm_1.Unique)(["meeting_id", "user_id"])
], OrgMeetingAttendee);
let OrgTask = class OrgTask {
    id;
    organization_id;
    team_id;
    title;
    description;
    created_by;
    assignee_id;
    priority;
    status;
    due_date;
    completed_at;
    created_at;
    updated_at;
};
exports.OrgTask = OrgTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgTask.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgTask.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgTask.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgTask.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgTask.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgTask.prototype, "assignee_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "medium" }),
    __metadata("design:type", String)
], OrgTask.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "todo" }),
    __metadata("design:type", String)
], OrgTask.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", String)
], OrgTask.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgTask.prototype, "completed_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgTask.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgTask.prototype, "updated_at", void 0);
exports.OrgTask = OrgTask = __decorate([
    (0, typeorm_1.Entity)("org_tasks")
], OrgTask);
let OrgAttendanceLog = class OrgAttendanceLog {
    id;
    organization_id;
    user_id;
    attendance_date;
    sign_in_at;
    sign_out_at;
    status;
    work_minutes;
    source;
    created_at;
    updated_at;
};
exports.OrgAttendanceLog = OrgAttendanceLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgAttendanceLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgAttendanceLog.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgAttendanceLog.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], OrgAttendanceLog.prototype, "attendance_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgAttendanceLog.prototype, "sign_in_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgAttendanceLog.prototype, "sign_out_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "present" }),
    __metadata("design:type", String)
], OrgAttendanceLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", default: 0 }),
    __metadata("design:type", Number)
], OrgAttendanceLog.prototype, "work_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "manual" }),
    __metadata("design:type", String)
], OrgAttendanceLog.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgAttendanceLog.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgAttendanceLog.prototype, "updated_at", void 0);
exports.OrgAttendanceLog = OrgAttendanceLog = __decorate([
    (0, typeorm_1.Entity)("org_attendance_logs"),
    (0, typeorm_1.Unique)(["organization_id", "user_id", "attendance_date"])
], OrgAttendanceLog);
let OrgShift = class OrgShift {
    id;
    organization_id;
    team_id;
    user_id;
    shift_date;
    starts_at;
    ends_at;
    status;
    created_at;
    updated_at;
};
exports.OrgShift = OrgShift;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgShift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgShift.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgShift.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgShift.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], OrgShift.prototype, "shift_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgShift.prototype, "starts_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgShift.prototype, "ends_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "scheduled" }),
    __metadata("design:type", String)
], OrgShift.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgShift.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgShift.prototype, "updated_at", void 0);
exports.OrgShift = OrgShift = __decorate([
    (0, typeorm_1.Entity)("org_shifts")
], OrgShift);
let OrgApproval = class OrgApproval {
    id;
    organization_id;
    team_id;
    requested_by;
    approver_id;
    approval_type;
    title;
    description;
    amount;
    status;
    decided_at;
    decision_note;
    created_at;
    updated_at;
};
exports.OrgApproval = OrgApproval;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgApproval.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgApproval.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgApproval.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgApproval.prototype, "requested_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgApproval.prototype, "approver_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgApproval.prototype, "approval_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgApproval.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgApproval.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", String)
], OrgApproval.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "pending" }),
    __metadata("design:type", String)
], OrgApproval.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgApproval.prototype, "decided_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgApproval.prototype, "decision_note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgApproval.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgApproval.prototype, "updated_at", void 0);
exports.OrgApproval = OrgApproval = __decorate([
    (0, typeorm_1.Entity)("org_approvals")
], OrgApproval);
let OrgPraise = class OrgPraise {
    id;
    organization_id;
    team_id;
    from_user_id;
    to_user_id;
    badge;
    message;
    created_at;
};
exports.OrgPraise = OrgPraise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgPraise.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgPraise.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgPraise.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgPraise.prototype, "from_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgPraise.prototype, "to_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgPraise.prototype, "badge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgPraise.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgPraise.prototype, "created_at", void 0);
exports.OrgPraise = OrgPraise = __decorate([
    (0, typeorm_1.Entity)("org_praise")
], OrgPraise);
let OrgNotification = class OrgNotification {
    id;
    organization_id;
    user_id;
    type;
    title;
    message;
    read;
    metadata;
    created_at;
    read_at;
};
exports.OrgNotification = OrgNotification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgNotification.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgNotification.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgNotification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgNotification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgNotification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], OrgNotification.prototype, "read", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], OrgNotification.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgNotification.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgNotification.prototype, "read_at", void 0);
exports.OrgNotification = OrgNotification = __decorate([
    (0, typeorm_1.Entity)("org_notifications")
], OrgNotification);
let OrgActivityLog = class OrgActivityLog {
    id;
    organization_id;
    team_id;
    actor_id;
    target_user_id;
    activity_type;
    reference_table;
    reference_id;
    preview_text;
    is_unread;
    created_at;
};
exports.OrgActivityLog = OrgActivityLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "actor_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "target_user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "activity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "reference_table", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "reference_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgActivityLog.prototype, "preview_text", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], OrgActivityLog.prototype, "is_unread", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgActivityLog.prototype, "created_at", void 0);
exports.OrgActivityLog = OrgActivityLog = __decorate([
    (0, typeorm_1.Entity)("org_activity_logs")
], OrgActivityLog);
let OrgCallLog = class OrgCallLog {
    id;
    organization_id;
    team_id;
    call_id;
    conversation_id;
    initiated_by;
    call_type;
    direction;
    status;
    started_at;
    ended_at;
    duration_seconds;
    recording_url;
    notes;
    created_at;
};
exports.OrgCallLog = OrgCallLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgCallLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "call_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "initiated_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "call_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "outgoing" }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", default: () => "NOW()" }),
    __metadata("design:type", Date)
], OrgCallLog.prototype, "started_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgCallLog.prototype, "ended_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", default: 0 }),
    __metadata("design:type", Number)
], OrgCallLog.prototype, "duration_seconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "recording_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgCallLog.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgCallLog.prototype, "created_at", void 0);
exports.OrgCallLog = OrgCallLog = __decorate([
    (0, typeorm_1.Entity)("org_call_logs")
], OrgCallLog);
let OrgCallLogParticipant = class OrgCallLogParticipant {
    id;
    call_log_id;
    user_id;
    participant_role;
    joined_at;
    left_at;
    was_missed;
    created_at;
};
exports.OrgCallLogParticipant = OrgCallLogParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgCallLogParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgCallLogParticipant.prototype, "call_log_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgCallLogParticipant.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "participant" }),
    __metadata("design:type", String)
], OrgCallLogParticipant.prototype, "participant_role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgCallLogParticipant.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], OrgCallLogParticipant.prototype, "left_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], OrgCallLogParticipant.prototype, "was_missed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgCallLogParticipant.prototype, "created_at", void 0);
exports.OrgCallLogParticipant = OrgCallLogParticipant = __decorate([
    (0, typeorm_1.Entity)("org_call_log_participants"),
    (0, typeorm_1.Unique)(["call_log_id", "user_id"])
], OrgCallLogParticipant);
let OrgCalendarEvent = class OrgCalendarEvent {
    id;
    organization_id;
    team_id;
    title;
    description;
    date;
    start_time;
    end_time;
    location;
    type;
    created_by;
    created_at;
    updated_at;
};
exports.OrgCalendarEvent = OrgCalendarEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "organization_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time" }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time", nullable: true }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "meeting" }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], OrgCalendarEvent.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgCalendarEvent.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgCalendarEvent.prototype, "updated_at", void 0);
exports.OrgCalendarEvent = OrgCalendarEvent = __decorate([
    (0, typeorm_1.Entity)("org_calendar_events")
], OrgCalendarEvent);
let OrgCalendarEventAttendee = class OrgCalendarEventAttendee {
    id;
    event_id;
    user_id;
    response_status;
    created_at;
};
exports.OrgCalendarEventAttendee = OrgCalendarEventAttendee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrgCalendarEventAttendee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgCalendarEventAttendee.prototype, "event_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrgCalendarEventAttendee.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "pending" }),
    __metadata("design:type", String)
], OrgCalendarEventAttendee.prototype, "response_status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], OrgCalendarEventAttendee.prototype, "created_at", void 0);
exports.OrgCalendarEventAttendee = OrgCalendarEventAttendee = __decorate([
    (0, typeorm_1.Entity)("org_calendar_event_attendees"),
    (0, typeorm_1.Unique)(["event_id", "user_id"])
], OrgCalendarEventAttendee);
//# sourceMappingURL=organization.entities.js.map