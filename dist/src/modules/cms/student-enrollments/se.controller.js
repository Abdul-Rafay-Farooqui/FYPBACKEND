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
exports.SeController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const se_service_1 = require("./se.service");
let SeController = class SeController {
    service;
    constructor(service) {
        this.service = service;
    }
    async find(studentId, cbsId, active) {
        const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
        if (studentId)
            return this.service.findByStudent(studentId, isActive);
        if (cbsId)
            return this.service.findByCbs(cbsId, isActive);
        return [];
    }
    findSingle(studentId) {
        return this.service.findByStudentSingle(studentId);
    }
    async count(cbsIds) {
        const ids = cbsIds ? cbsIds.split(',') : [];
        return { count: await this.service.countByCbs(ids) };
    }
    create(data) {
        return this.service.create(data);
    }
    deactivate(body) {
        return this.service.deactivate(body.cbs_id, body.student_ids);
    }
};
exports.SeController = SeController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('student_id')),
    __param(1, (0, common_1.Query)('cbs_id')),
    __param(2, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SeController.prototype, "find", null);
__decorate([
    (0, common_1.Get)('single'),
    __param(0, (0, common_1.Query)('student_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeController.prototype, "findSingle", null);
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, common_1.Query)('cbs_ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SeController.prototype, "count", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], SeController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('deactivate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SeController.prototype, "deactivate", null);
exports.SeController = SeController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('student-enrollments'),
    __metadata("design:paramtypes", [se_service_1.SeService])
], SeController);
//# sourceMappingURL=se.controller.js.map