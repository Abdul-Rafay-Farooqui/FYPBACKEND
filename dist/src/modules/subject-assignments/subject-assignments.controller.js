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
exports.SubjectAssignmentsController = void 0;
const common_1 = require("@nestjs/common");
const subject_assignments_service_1 = require("./subject-assignments.service");
let SubjectAssignmentsController = class SubjectAssignmentsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(data) {
        return this.service.create(data);
    }
    findAll(instituteId) {
        return this.service.findAll(instituteId);
    }
    findByTeacher(teacherId, instituteId) {
        return this.service.findByTeacher(teacherId, instituteId);
    }
    findBySubject(subjectId) {
        return this.service.findBySubject(subjectId);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.SubjectAssignmentsController = SubjectAssignmentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubjectAssignmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('institute_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubjectAssignmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    __param(0, (0, common_1.Param)('teacherId')),
    __param(1, (0, common_1.Query)('institute_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SubjectAssignmentsController.prototype, "findByTeacher", null);
__decorate([
    (0, common_1.Get)('subject/:subjectId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubjectAssignmentsController.prototype, "findBySubject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubjectAssignmentsController.prototype, "remove", null);
exports.SubjectAssignmentsController = SubjectAssignmentsController = __decorate([
    (0, common_1.Controller)('subject-assignments'),
    __metadata("design:paramtypes", [subject_assignments_service_1.SubjectAssignmentsService])
], SubjectAssignmentsController);
//# sourceMappingURL=subject-assignments.controller.js.map