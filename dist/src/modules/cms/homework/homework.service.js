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
exports.HomeworkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../entities");
const institute_notifications_service_1 = require("../../institute-notifications/institute-notifications.service");
let HomeworkService = class HomeworkService {
    repo;
    enrollmentRepo;
    notificationsService;
    constructor(repo, enrollmentRepo, notificationsService) {
        this.repo = repo;
        this.enrollmentRepo = enrollmentRepo;
        this.notificationsService = notificationsService;
    }
    async findByTeacher(teacherId) {
        return this.repo.find({
            where: { teacher_id: teacherId },
            relations: [
                "class_batch_section",
                "class_batch_section.class",
                "class_batch_section.batch",
                "class_batch_section.section",
                "subject",
            ],
            order: { published_date: "DESC" },
        });
    }
    async findBySubject(subjectId) {
        return this.repo.find({
            where: { subject_id: subjectId },
            relations: ["teacher", "subject"],
            order: { published_date: "DESC" },
        });
    }
    async findBySubjects(subjectIds) {
        if (subjectIds.length === 0)
            return [];
        return this.repo.find({
            where: subjectIds.map((id) => ({ subject_id: id })),
            relations: ["teacher", "subject"],
            order: { published_date: "DESC" },
        });
    }
    async findByCbs(cbsId) {
        return this.repo.find({
            where: { class_batch_section_id: cbsId },
            relations: ["teacher", "subject"],
            order: { published_date: "DESC" },
        });
    }
    async findByInstitute(instituteId) {
        return this.repo.find({
            where: { institute_id: instituteId },
            relations: ["teacher", "subject"],
            order: { published_date: "DESC" },
        });
    }
    async findIdsByTeacher(teacherId) {
        const items = await this.repo.find({
            where: { teacher_id: teacherId },
            select: ["id"],
        });
        return items.map((i) => i.id);
    }
    async create(data) {
        return this.repo.save(this.repo.create(data));
    }
    async delete(id) {
        return this.repo.delete(id);
    }
};
exports.HomeworkService = HomeworkService;
exports.HomeworkService = HomeworkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Homework)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.CourseEnrollment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        institute_notifications_service_1.InstituteNotificationsService])
], HomeworkService);
//# sourceMappingURL=homework.service.js.map