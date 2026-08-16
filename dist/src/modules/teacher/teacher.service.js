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
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let TeacherService = class TeacherService {
    subjectAssignments;
    quizzes;
    homework;
    announcements;
    schedules;
    courseEnrollments;
    constructor(subjectAssignments, quizzes, homework, announcements, schedules, courseEnrollments) {
        this.subjectAssignments = subjectAssignments;
        this.quizzes = quizzes;
        this.homework = homework;
        this.announcements = announcements;
        this.schedules = schedules;
        this.courseEnrollments = courseEnrollments;
    }
    async getCourseOverview(courseId, teacherId) {
        const assignment = await this.subjectAssignments.findOne({
            where: { id: courseId, teacher_id: teacherId },
            relations: ["subject"],
        });
        if (!assignment) {
            throw new Error("Course not found or not assigned to you");
        }
        const totalStudents = await this.courseEnrollments.count({
            where: {
                subject_id: assignment.subject_id,
                institute_id: assignment.institute_id,
            },
        });
        const totalQuizzes = await this.quizzes.count({
            where: {
                teacher_id: teacherId,
                institute_id: assignment.institute_id,
                subject_id: assignment.subject_id,
            },
        });
        const totalAssignments = await this.homework.count({
            where: {
                teacher_id: teacherId,
                institute_id: assignment.institute_id,
                subject_id: assignment.subject_id,
            },
        });
        const totalAnnouncements = await this.announcements.count({
            where: {
                teacher_id: teacherId,
                institute_id: assignment.institute_id,
                subject_id: assignment.subject_id,
            },
        });
        const schedules = await this.schedules.find({
            where: {
                subject_id: assignment.subject_id,
            },
            relations: ['class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section', 'subject'],
            order: { day_of_week: 'ASC', start_time: 'ASC' },
        });
        const recentAnnouncements = await this.announcements.find({
            where: {
                teacher_id: teacherId,
                subject_id: assignment.subject_id,
            },
            order: { published_date: "DESC" },
            take: 5,
        });
        return {
            stats: {
                totalStudents,
                totalQuizzes,
                totalAssignments,
                totalAnnouncements,
            },
            schedules,
            recentAnnouncements,
            course: assignment,
        };
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.SubjectAssignment)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Quiz)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Homework)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Announcement)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.Schedule)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.CourseEnrollment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map