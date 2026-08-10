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
exports.CbsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const cbs_service_1 = require("./cbs.service");
let CbsController = class CbsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(class_id, batch_id, section_id) {
        return this.service.findAll(class_id, batch_id, section_id);
    }
    async count() { return { count: await this.service.count() }; }
    findByCombo(c, b, s) {
        return this.service.findByCombo(c, b, s);
    }
    findOne(id) { return this.service.findOne(id); }
    create(data) { return this.service.create(data); }
    delete(id) { return this.service.delete(id); }
};
exports.CbsController = CbsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('class_id')),
    __param(1, (0, common_1.Query)('batch_id')),
    __param(2, (0, common_1.Query)('section_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CbsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CbsController.prototype, "count", null);
__decorate([
    (0, common_1.Get)('find'),
    __param(0, (0, common_1.Query)('class_id')),
    __param(1, (0, common_1.Query)('batch_id')),
    __param(2, (0, common_1.Query)('section_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CbsController.prototype, "findByCombo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CbsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CbsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CbsController.prototype, "delete", null);
exports.CbsController = CbsController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('class-batch-sections'),
    __metadata("design:paramtypes", [cbs_service_1.CbsService])
], CbsController);
//# sourceMappingURL=cbs.controller.js.map