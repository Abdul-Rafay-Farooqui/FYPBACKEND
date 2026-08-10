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
exports.AnnouncementsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const announcements_service_1 = require("./announcements.service");
let AnnouncementsController = class AnnouncementsController {
    service;
    constructor(service) {
        this.service = service;
    }
    find(teacherId, cbsId, studentId, instituteId) {
        if (teacherId)
            return this.service.findByTeacher(teacherId);
        if (studentId)
            return this.service.findForStudent(studentId);
        if (instituteId)
            return this.service.findByInstitute(instituteId);
        return [];
    }
    async count(studentId) {
        return { count: await this.service.countForStudent(studentId) };
    }
    create(data) { return this.service.create(data); }
    delete(id) { return this.service.delete(id); }
};
exports.AnnouncementsController = AnnouncementsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('teacher_id')),
    __param(1, (0, common_1.Query)('cbs_id')),
    __param(2, (0, common_1.Query)('student_id')),
    __param(3, (0, common_1.Query)('institute_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "find", null);
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, common_1.Query)('student_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementsController.prototype, "count", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "delete", null);
exports.AnnouncementsController = AnnouncementsController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('announcements'),
    __metadata("design:paramtypes", [announcements_service_1.AnnouncementsService])
], AnnouncementsController);
//# sourceMappingURL=announcements.controller.js.map