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
exports.CbsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../entities");
let CbsService = class CbsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(class_id, batch_id, section_id) {
        const where = {};
        if (class_id)
            where.class_id = class_id;
        if (batch_id)
            where.batch_id = batch_id;
        if (section_id)
            where.section_id = section_id;
        return this.repo.find({
            where: Object.keys(where).length > 0 ? where : undefined,
            order: { created_at: 'DESC' },
            relations: ['class', 'batch', 'section']
        });
    }
    async findOne(id) {
        return this.repo.findOne({ where: { id }, relations: ['class', 'batch', 'section'] });
    }
    async findByCombo(class_id, batch_id, section_id) {
        return this.repo.findOne({ where: { class_id, batch_id, section_id } });
    }
    async count() {
        return this.repo.count();
    }
    async create(data) {
        return this.repo.save(this.repo.create(data));
    }
    async delete(id) {
        return this.repo.delete(id);
    }
};
exports.CbsService = CbsService;
exports.CbsService = CbsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.ClassBatchSection)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CbsService);
//# sourceMappingURL=cbs.service.js.map