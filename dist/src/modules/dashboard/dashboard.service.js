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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let DashboardService = class DashboardService {
    members;
    homework;
    submissions;
    attendance;
    results;
    announcements;
    quizzes;
    quizAttempts;
    liveClasses;
    resources;
    enrollments;
    courseEnrollments;
    batches;
    sections;
    constructor(members, homework, submissions, attendance, results, announcements, quizzes, quizAttempts, liveClasses, resources, enrollments, courseEnrollments, batches, sections) {
        this.members = members;
        this.homework = homework;
        this.submissions = submissions;
        this.attendance = attendance;
        this.results = results;
        this.announcements = announcements;
        this.quizzes = quizzes;
        this.quizAttempts = quizAttempts;
        this.liveClasses = liveClasses;
        this.resources = resources;
        this.enrollments = enrollments;
        this.courseEnrollments = courseEnrollments;
        this.batches = batches;
        this.sections = sections;
    }
    async getStudentOverview(userId, instituteId) {
        const enrollments = await this.courseEnrollments.find({
            where: { student_id: userId, institute_id: instituteId },
        });
        const subjectIds = enrollments.map((e) => e.subject_id);
        const totalAssignments = subjectIds.length > 0
            ? await this.homework.count({ where: { subject_id: (0, typeorm_2.In)(subjectIds) } })
            : 0;
        const submittedAssignments = await this.submissions.count({
            where: { student_id: userId },
        });
        const totalQuizzes = subjectIds.length > 0
            ? await this.quizzes.count({ where: { subject_id: (0, typeorm_2.In)(subjectIds), is_published: true } })
            : 0;
        const attemptedQuizzes = await this.quizAttempts.count({
            where: { student_id: userId, status: 'submitted' },
        });
        const totalAttendance = await this.attendance.count({
            where: { student_id: userId },
        });
        const presentCount = await this.attendance.count({
            where: { student_id: userId, status: 'present' },
        });
        const attendancePercentage = totalAttendance > 0
            ? Math.round((presentCount / totalAttendance) * 100)
            : 0;
        const results = subjectIds.length > 0
            ? await this.results.find({ where: { student_id: userId, subject_id: (0, typeorm_2.In)(subjectIds) } })
            : [];
        let overallGrade = 0;
        if (results.length > 0) {
            const totalMarks = results.reduce((sum, r) => sum + Number(r.total_marks), 0);
            const obtainedMarks = results.reduce((sum, r) => sum + Number(r.marks_obtained), 0);
            overallGrade = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
        }
        const announcementsQuery = this.announcements.createQueryBuilder('a')
            .leftJoinAndSelect('a.teacher', 'teacher')
            .leftJoinAndSelect('a.subject', 'subject')
            .where('a.institute_id = :instituteId', { instituteId })
            .orderBy('a.published_date', 'DESC')
            .take(5);
        if (subjectIds.length > 0) {
            announcementsQuery.andWhere('(a.subject_id IN (:...subjectIds) OR a.subject_id IS NULL)', { subjectIds });
        }
        const recentAnnouncements = await announcementsQuery.getMany();
        const upcomingAssignments = subjectIds.length > 0
            ? await this.homework.find({
                where: {
                    subject_id: (0, typeorm_2.In)(subjectIds),
                    due_date: (0, typeorm_2.MoreThan)(new Date()),
                },
                order: { due_date: 'ASC' },
                take: 5,
            })
            : [];
        const upcomingClasses = subjectIds.length > 0
            ? await this.liveClasses.find({
                where: {
                    subject_id: (0, typeorm_2.In)(subjectIds),
                    scheduled_at: (0, typeorm_2.MoreThan)(new Date()),
                    status: 'scheduled',
                },
                order: { scheduled_at: 'ASC' },
                take: 5,
            })
            : [];
        return {
            stats: {
                totalAssignments,
                submittedAssignments,
                pendingAssignments: totalAssignments - submittedAssignments,
                totalQuizzes,
                attemptedQuizzes,
                pendingQuizzes: totalQuizzes - attemptedQuizzes,
                attendancePercentage,
                overallGrade,
            },
            recentAnnouncements,
            upcomingAssignments,
            upcomingClasses,
        };
    }
    async getTeacherOverview(userId, instituteId) {
        const assignedClasses = await this.homework.createQueryBuilder('h')
            .select('DISTINCT h.class_batch_section_id')
            .where('h.teacher_id = :userId', { userId })
            .andWhere('h.institute_id = :instituteId', { instituteId })
            .getRawMany();
        const cbsIds = assignedClasses.map((c) => c.class_batch_section_id);
        const totalStudents = await this.enrollments.count({
            where: cbsIds.length > 0 ? { class_batch_section_id: (0, typeorm_2.In)(cbsIds), is_active: true } : {},
        });
        const pendingSubmissions = await this.submissions.count({
            where: {
                homework: { teacher_id: userId },
                stars: 0,
            },
            relations: ['homework'],
        });
        const totalAssignments = await this.homework.count({
            where: { teacher_id: userId, institute_id: instituteId },
        });
        const totalQuizzes = await this.quizzes.count({
            where: { teacher_id: userId, institute_id: instituteId },
        });
        const upcomingClasses = await this.liveClasses.find({
            where: {
                teacher_id: userId,
                institute_id: instituteId,
                scheduled_at: (0, typeorm_2.MoreThan)(new Date()),
                status: 'scheduled',
            },
            order: { scheduled_at: 'ASC' },
            take: 5,
        });
        const recentSubmissions = await this.submissions.find({
            where: { homework: { teacher_id: userId } },
            relations: ['homework', 'student'],
            order: { submitted_date: 'DESC' },
            take: 10,
        });
        return {
            stats: {
                totalStudents,
                totalAssignments,
                totalQuizzes,
                pendingSubmissions,
                upcomingClassesCount: upcomingClasses.length,
            },
            upcomingClasses,
            recentSubmissions,
        };
    }
    async getAdminOverview(userId, instituteId) {
        const totalStudents = await this.members.count({
            where: { institute_id: instituteId, role: 'student', status: 'active' },
        });
        const totalTeachers = await this.members.count({
            where: { institute_id: instituteId, role: 'teacher', status: 'active' },
        });
        const totalAdmins = await this.members.count({
            where: { institute_id: instituteId, role: 'admin', status: 'active' },
        });
        const totalBatches = await this.batches.count({
            where: { institute_id: instituteId },
        });
        const totalSections = await this.sections.count({
            where: { institute_id: instituteId },
        });
        const totalResources = await this.resources.count({
            where: { institute_id: instituteId },
        });
        const totalLiveClasses = await this.liveClasses.count({
            where: { institute_id: instituteId },
        });
        const recentActivities = await this.announcements.find({
            where: { institute_id: instituteId },
            order: { published_date: 'DESC' },
            take: 10,
            relations: ['teacher'],
        });
        return {
            stats: {
                totalStudents,
                totalTeachers,
                totalAdmins,
                totalMembers: totalStudents + totalTeachers + totalAdmins,
                totalBatches,
                totalSections,
                totalResources,
                totalLiveClasses,
            },
            recentActivities,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.InstituteMember)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Homework)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.HomeworkSubmission)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Attendance)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.Result)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.Announcement)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.Quiz)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.QuizAttempt)),
    __param(8, (0, typeorm_1.InjectRepository)(entities_1.LiveClass)),
    __param(9, (0, typeorm_1.InjectRepository)(entities_1.Resource)),
    __param(10, (0, typeorm_1.InjectRepository)(entities_1.StudentEnrollment)),
    __param(11, (0, typeorm_1.InjectRepository)(entities_1.CourseEnrollment)),
    __param(12, (0, typeorm_1.InjectRepository)(entities_1.Batch)),
    __param(13, (0, typeorm_1.InjectRepository)(entities_1.Section)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map