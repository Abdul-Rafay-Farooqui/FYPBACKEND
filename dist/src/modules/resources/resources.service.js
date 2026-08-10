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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let ResourcesService = class ResourcesService {
    resources;
    gateway;
    constructor(resources, gateway) {
        this.resources = resources;
        this.gateway = gateway;
    }
    async create(data) {
        const resource = this.resources.create(data);
        const saved = await this.resources.save(resource);
        if (saved.institute_id) {
            this.gateway.emitToInstitute(saved.institute_id, 'institute:resource-created', {
                institute_id: saved.institute_id,
                resource: saved,
            });
        }
        return saved;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.institute_id)
            where.institute_id = filters.institute_id;
        if (filters?.teacher_id)
            where.teacher_id = filters.teacher_id;
        if (filters?.class_batch_section_id)
            where.class_batch_section_id = filters.class_batch_section_id;
        if (filters?.subject_id)
            where.subject_id = filters.subject_id;
        return this.resources.find({
            where,
            relations: ['teacher', 'subject', 'class_batch_section'],
            order: { uploaded_at: 'DESC' },
        });
    }
    async findOne(id) {
        return this.resources.findOne({
            where: { id },
            relations: ['teacher', 'subject', 'class_batch_section'],
        });
    }
    async delete(id) {
        const resource = await this.resources.findOne({ where: { id } });
        await this.resources.delete(id);
        if (resource?.institute_id) {
            this.gateway.emitToInstitute(resource.institute_id, 'institute:resource-deleted', {
                institute_id: resource.institute_id,
                resource_id: id,
            });
        }
        return { success: true };
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Resource)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map