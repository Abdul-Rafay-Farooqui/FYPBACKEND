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
exports.SubjectAssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let SubjectAssignmentsService = class SubjectAssignmentsService {
    assignments;
    constructor(assignments) {
        this.assignments = assignments;
    }
    async create(data) {
        const existing = await this.assignments.findOne({
            where: {
                subject_id: data.subject_id,
                teacher_id: data.teacher_id,
                institute_id: data.institute_id,
            },
        });
        if (existing) {
            throw new Error('Teacher is already assigned to this subject');
        }
        const assignment = this.assignments.create(data);
        return this.assignments.save(assignment);
    }
    async findAll(instituteId) {
        return this.assignments.find({
            where: { institute_id: instituteId },
            relations: ['subject', 'teacher'],
            order: { created_at: 'DESC' },
        });
    }
    async findByTeacher(teacherId, instituteId) {
        return this.assignments.find({
            where: { teacher_id: teacherId, institute_id: instituteId },
            relations: ['subject'],
            order: { created_at: 'DESC' },
        });
    }
    async findBySubject(subjectId) {
        return this.assignments.find({
            where: { subject_id: subjectId },
            relations: ['teacher'],
        });
    }
    async remove(id) {
        const assignment = await this.assignments.findOne({ where: { id } });
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        return this.assignments.remove(assignment);
    }
};
exports.SubjectAssignmentsService = SubjectAssignmentsService;
exports.SubjectAssignmentsService = SubjectAssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.SubjectAssignment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectAssignmentsService);
//# sourceMappingURL=subject-assignments.service.js.map