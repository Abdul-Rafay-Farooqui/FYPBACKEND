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
exports.SeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../entities");
let SeService = class SeService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findByStudent(studentId, isActive) {
        const where = { student_id: studentId };
        if (isActive !== undefined)
            where.is_active = isActive;
        return this.repo.find({
            where,
            relations: ['student', 'class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section'],
        });
    }
    async findByStudentSingle(studentId) {
        return this.repo.findOne({
            where: { student_id: studentId, is_active: true },
            relations: ['student', 'class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section'],
        });
    }
    async findByCbs(cbsId, isActive) {
        const where = { class_batch_section_id: cbsId };
        if (isActive !== undefined)
            where.is_active = isActive;
        return this.repo.find({
            where,
            relations: ['student'],
        });
    }
    async countByCbs(cbsIds) {
        if (!cbsIds.length)
            return 0;
        return this.repo.count({ where: { class_batch_section_id: (0, typeorm_2.In)(cbsIds), is_active: true } });
    }
    async create(data) {
        const entities = data.map(d => this.repo.create(d));
        return this.repo.save(entities);
    }
    async deactivate(cbsId, studentIds) {
        return this.repo.update({ class_batch_section_id: cbsId, student_id: (0, typeorm_2.In)(studentIds) }, { is_active: false });
    }
};
exports.SeService = SeService;
exports.SeService = SeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.StudentEnrollment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeService);
//# sourceMappingURL=se.service.js.map