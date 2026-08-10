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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../entities");
const realtime_gateway_1 = require("../../realtime/realtime.gateway");
const institute_notifications_service_1 = require("../../institute-notifications/institute-notifications.service");
let AnnouncementsService = class AnnouncementsService {
    repo;
    enrollmentRepo;
    memberRepo;
    gateway;
    notificationsService;
    constructor(repo, enrollmentRepo, memberRepo, gateway, notificationsService) {
        this.repo = repo;
        this.enrollmentRepo = enrollmentRepo;
        this.memberRepo = memberRepo;
        this.gateway = gateway;
        this.notificationsService = notificationsService;
    }
    async findByTeacher(teacherId) {
        return this.repo.find({
            where: { teacher_id: teacherId },
            relations: ['class_batch_section', 'subject', 'student'],
            order: { published_date: 'DESC' },
        });
    }
    async findForStudent(studentId) {
        const enrolledSubjects = await this.enrollmentRepo.find({
            where: { student_id: studentId }
        });
        if (enrolledSubjects.length === 0) {
            return [];
        }
        const subjectIds = enrolledSubjects.map(e => e.subject_id);
        const instituteId = enrolledSubjects[0]?.institute_id;
        const qb = this.repo.createQueryBuilder('a')
            .leftJoinAndSelect('a.teacher', 'teacher')
            .leftJoinAndSelect('a.subject', 'subject')
            .leftJoinAndSelect('a.class_batch_section', 'class_batch_section')
            .where('a.institute_id = :instituteId', { instituteId });
        if (subjectIds.length > 0) {
            qb.andWhere('(a.subject_id IN (:...subjectIds) OR a.subject_id IS NULL)', { subjectIds });
        }
        qb.andWhere('(a.announcement_type = :general OR a.announcement_type = :section OR a.announcement_type = :cls OR (a.announcement_type = :individual AND a.student_id = :studentId))', { general: 'general', section: 'section', cls: 'class', individual: 'individual', studentId });
        qb.orderBy('a.published_date', 'DESC');
        return qb.getMany();
    }
    async findByInstitute(instituteId) {
        return this.repo.find({
            where: { institute_id: instituteId },
            relations: ['class_batch_section', 'teacher', 'subject'],
            order: { published_date: 'DESC' },
        });
    }
    async countForStudent(studentId) {
        const enrolledSubjects = await this.enrollmentRepo.find({
            where: { student_id: studentId },
            select: ['subject_id', 'institute_id']
        });
        if (enrolledSubjects.length === 0) {
            return 0;
        }
        const subjectIds = enrolledSubjects.map(e => e.subject_id);
        const instituteId = enrolledSubjects[0]?.institute_id;
        const qb = this.repo.createQueryBuilder('a')
            .where('a.institute_id = :instituteId', { instituteId })
            .andWhere('(a.subject_id IN (:...subjectIds) OR a.subject_id IS NULL)', { subjectIds })
            .andWhere('(a.announcement_type = :general OR a.announcement_type = :section OR a.announcement_type = :cls OR (a.announcement_type = :individual AND a.student_id = :studentId))', { general: 'general', section: 'section', cls: 'class', individual: 'individual', studentId });
        return qb.getCount();
    }
    async create(data) {
        const created = await this.repo.save(this.repo.create(data));
        if (created.institute_id) {
            this.gateway.emitToInstitute(created.institute_id, 'institute:announcement-created', {
                institute_id: created.institute_id,
                announcement: created,
            });
            try {
                let userIds = [];
                if (created.announcement_type === 'individual' && created.student_id) {
                    userIds = [created.student_id];
                }
                else if (created.subject_id) {
                    const enrollments = await this.enrollmentRepo.find({
                        where: { subject_id: created.subject_id },
                        select: ['student_id'],
                    });
                    userIds = enrollments.map(e => e.student_id);
                }
                else {
                    const members = await this.memberRepo.find({
                        where: { institute_id: created.institute_id },
                        select: ['user_id'],
                    });
                    userIds = members.map(m => m.user_id);
                }
                if (userIds.length > 0) {
                    await this.notificationsService.notifyAnnouncement(created.institute_id, userIds, created);
                }
            }
            catch (error) {
                console.error('Failed to send announcement notifications:', error);
            }
        }
        return created;
    }
    async delete(id) {
        const announcement = await this.repo.findOne({ where: { id } });
        const result = await this.repo.delete(id);
        if (announcement?.institute_id) {
            this.gateway.emitToInstitute(announcement.institute_id, 'institute:announcement-deleted', {
                institute_id: announcement.institute_id,
                announcement_id: id,
            });
        }
        return result;
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Announcement)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.CourseEnrollment)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.InstituteMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway,
        institute_notifications_service_1.InstituteNotificationsService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map