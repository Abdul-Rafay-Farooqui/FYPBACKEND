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
exports.ResultsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const results_service_1 = require("./results.service");
let ResultsController = class ResultsController {
    service;
    constructor(service) {
        this.service = service;
    }
    find(studentId, teacherId, cbsId, subjectId) {
        console.log('📋 Results endpoint called with:', { studentId, teacherId, cbsId, subjectId });
        if (studentId) {
            console.log('🔍 Finding results by student:', studentId);
            return this.service.findByStudent(studentId);
        }
        if (teacherId && subjectId) {
            console.log('🔍 Finding results by teacher and subject:', { teacherId, subjectId });
            return this.service.findByTeacherAndSubject(teacherId, subjectId);
        }
        if (teacherId) {
            console.log('🔍 Finding results by teacher:', teacherId);
            return this.service.findByTeacher(teacherId);
        }
        if (cbsId) {
            console.log('🔍 Finding results by CBS:', cbsId);
            return this.service.findByCbs(cbsId, subjectId);
        }
        console.log('📋 No query parameters provided, returning all results');
        return this.service.findAll();
    }
    async count(studentId, teacherId) {
        if (studentId)
            return { count: await this.service.countByStudent(studentId) };
        if (teacherId)
            return { count: await this.service.countByTeacher(teacherId) };
        return { count: 0 };
    }
    create(data) {
        console.log('💾 Creating result:', data);
        return this.service.create(data);
    }
    update(id, data) {
        console.log('✏️ Updating result:', id, data);
        return this.service.update(id, data);
    }
    delete(id) {
        console.log('🗑️ Deleting result:', id);
        return this.service.delete(id);
    }
};
exports.ResultsController = ResultsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('student_id')),
    __param(1, (0, common_1.Query)('teacher_id')),
    __param(2, (0, common_1.Query)('cbs_id')),
    __param(3, (0, common_1.Query)('subject_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "find", null);
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, common_1.Query)('student_id')),
    __param(1, (0, common_1.Query)('teacher_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ResultsController.prototype, "count", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResultsController.prototype, "delete", null);
exports.ResultsController = ResultsController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('results'),
    __metadata("design:paramtypes", [results_service_1.ResultsService])
], ResultsController);
//# sourceMappingURL=results.controller.js.map