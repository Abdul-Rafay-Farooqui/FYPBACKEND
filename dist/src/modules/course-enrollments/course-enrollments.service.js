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
exports.CourseEnrollmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let CourseEnrollmentsService = class CourseEnrollmentsService {
    enrollments;
    subjects;
    gateway;
    constructor(enrollments, subjects, gateway) {
        this.enrollments = enrollments;
        this.subjects = subjects;
        this.gateway = gateway;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.student_id)
            where.student_id = filters.student_id;
        if (filters?.subject_id)
            where.subject_id = filters.subject_id;
        if (filters?.institute_id)
            where.institute_id = filters.institute_id;
        return this.enrollments.find({
            where,
            relations: ["subject"],
            order: { enrolled_at: "DESC" },
        });
    }
    async findBySubject(subjectId) {
        return this.enrollments.find({
            where: { subject_id: subjectId },
            order: { enrolled_at: "DESC" },
        });
    }
    async enroll(data) {
        const existing = await this.enrollments.findOne({
            where: {
                student_id: data.student_id,
                subject_id: data.subject_id,
                institute_id: data.institute_id,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException("Student is already enrolled in this course");
        }
        const enrollment = this.enrollments.create(data);
        const saved = await this.enrollments.save(enrollment);
        if (saved.institute_id) {
            this.gateway.emitToInstitute(saved.institute_id, 'institute:enrollment-created', {
                institute_id: saved.institute_id,
                enrollment: saved,
            });
        }
        return saved;
    }
    async joinByCode(data) {
        const subject = await this.subjects.findOne({
            where: {
                course_code: data.course_code,
                institute_id: data.institute_id,
            },
        });
        if (!subject) {
            throw new common_1.NotFoundException("Invalid course code");
        }
        return this.enroll({
            student_id: data.student_id,
            subject_id: subject.id,
            institute_id: data.institute_id,
        });
    }
    async unenroll(id) {
        const enrollment = await this.enrollments.findOne({ where: { id } });
        const result = await this.enrollments.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException("Enrollment not found");
        }
        if (enrollment?.institute_id) {
            this.gateway.emitToInstitute(enrollment.institute_id, 'institute:enrollment-deleted', {
                institute_id: enrollment.institute_id,
                enrollment_id: id,
                student_id: enrollment.student_id,
                subject_id: enrollment.subject_id,
            });
        }
        return { success: true };
    }
};
exports.CourseEnrollmentsService = CourseEnrollmentsService;
exports.CourseEnrollmentsService = CourseEnrollmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.CourseEnrollment)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], CourseEnrollmentsService);
//# sourceMappingURL=course-enrollments.service.js.map