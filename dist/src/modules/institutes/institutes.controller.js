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
exports.InstitutesController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const entities_1 = require("../../entities");
const institutes_service_1 = require("./institutes.service");
const attendance_service_1 = require("../cms/attendance/attendance.service");
let InstitutesController = class InstitutesController {
    svc;
    attendanceSvc;
    constructor(svc, attendanceSvc) {
        this.svc = svc;
        this.attendanceSvc = attendanceSvc;
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
    addMembers(user, id, dto) {
        return this.svc.addMembers(user.id, id, dto);
    }
    getMembers(user, id, role) {
        return this.svc.getMembers(user.id, id, role);
    }
    updateMember(user, id, memberId, dto) {
        return this.svc.updateMember(user.id, id, memberId, dto);
    }
    removeMember(user, id, memberId) {
        return this.svc.removeMember(user.id, id, memberId);
    }
    getAttendanceByDate(instituteId, subjectId, date) {
        return this.attendanceSvc.findBySubjectAndDate(subjectId, date, instituteId);
    }
    getMonthlyAttendance(instituteId, subjectId, yearMonth) {
        return this.attendanceSvc.findBySubjectAndMonth(subjectId, yearMonth, instituteId);
    }
    getStudentAttendanceBySubject(instituteId, subjectId, studentId) {
        return this.attendanceSvc.findBySubjectAndStudent(subjectId, studentId, instituteId);
    }
    saveBulkAttendance(records) {
        return this.attendanceSvc.saveBulkAttendance(records);
    }
};
exports.InstitutesController = InstitutesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Object]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/members"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "addMembers", null);
__decorate([
    (0, common_1.Get)(":id/members"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Patch)(":id/members/:memberId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("memberId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)(":id/members/:memberId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("memberId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Get)(":id/subjects/:subjectId/attendance"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("subjectId")),
    __param(2, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "getAttendanceByDate", null);
__decorate([
    (0, common_1.Get)(":id/subjects/:subjectId/attendance/monthly"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("subjectId")),
    __param(2, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "getMonthlyAttendance", null);
__decorate([
    (0, common_1.Get)(":id/subjects/:subjectId/students/:studentId/attendance"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("subjectId")),
    __param(2, (0, common_1.Param)("studentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "getStudentAttendanceBySubject", null);
__decorate([
    (0, common_1.Post)("attendance/bulk"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "saveBulkAttendance", null);
exports.InstitutesController = InstitutesController = __decorate([
    (0, common_1.Controller)("institutes"),
    __metadata("design:paramtypes", [institutes_service_1.InstitutesService,
        attendance_service_1.AttendanceService])
], InstitutesController);
//# sourceMappingURL=institutes.controller.js.map