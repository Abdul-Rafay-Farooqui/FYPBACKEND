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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../entities");
let SubjectsService = class SubjectsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(institute_id) {
        const where = institute_id ? { institute_id } : {};
        return this.repo.find({ where, order: { name: 'ASC' } });
    }
    async create(data) {
        if (!data.course_code) {
            data.course_code = this.generateCourseCode();
        }
        return this.repo.save(this.repo.create(data));
    }
    generateCourseCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    async update(id, data) {
        await this.repo.update(id, data);
        return this.repo.findOne({ where: { id } });
    }
    async delete(id) { return this.repo.delete(id); }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map