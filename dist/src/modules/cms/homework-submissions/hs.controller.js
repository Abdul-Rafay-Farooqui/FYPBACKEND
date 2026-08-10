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
exports.HsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const hs_service_1 = require("./hs.service");
let HsController = class HsController {
    service;
    constructor(service) {
        this.service = service;
    }
    find(homeworkId, studentId) {
        if (homeworkId)
            return this.service.findByHomework(homeworkId);
        if (studentId)
            return this.service.findByStudent(studentId);
        return this.service.findAll();
    }
    async pendingCount(ids) {
        const homeworkIds = ids ? ids.split(",") : [];
        return { count: await this.service.countPending(homeworkIds) };
    }
    create(data) {
        return this.service.create(data);
    }
    update(id, data) {
        return this.service.update(id, data);
    }
};
exports.HsController = HsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("homework_id")),
    __param(1, (0, common_1.Query)("student_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HsController.prototype, "find", null);
__decorate([
    (0, common_1.Get)("pending-count"),
    __param(0, (0, common_1.Query)("homework_ids")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HsController.prototype, "pendingCount", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HsController.prototype, "update", null);
exports.HsController = HsController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)("homework-submissions"),
    __metadata("design:paramtypes", [hs_service_1.HsService])
], HsController);
//# sourceMappingURL=hs.controller.js.map