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
exports.SectionsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const sections_service_1 = require("./sections.service");
let SectionsController = class SectionsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(institute_id, search, sortField = 'name', sortOrder = 'ASC', page = 1, limit = 10) {
        return this.service.findAll(institute_id, search, sortField, sortOrder, page, limit);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    getSectionWithStudents(id) {
        return this.service.getSectionWithStudents(id);
    }
    create(data) {
        return this.service.create(data);
    }
    addStudentsToSection(sectionId, data) {
        return this.service.addStudentsToSection(sectionId, data.student_ids, data.class_batch_section_id);
    }
    update(id, data) {
        return this.service.update(id, data);
    }
    delete(id) {
        return this.service.delete(id);
    }
    removeStudent(enrollmentId) {
        return this.service.removeStudentFromSection(enrollmentId);
    }
};
exports.SectionsController = SectionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('institute_id')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('sortField')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(5, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/students'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "getSectionWithStudents", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/students'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "addStudentsToSection", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('enrollments/:enrollmentId'),
    __param(0, (0, common_1.Param)('enrollmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "removeStudent", null);
exports.SectionsController = SectionsController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('sections'),
    __metadata("design:paramtypes", [sections_service_1.SectionsService])
], SectionsController);
//# sourceMappingURL=sections.controller.js.map