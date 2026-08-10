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
exports.InstituteNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let InstituteNotificationsService = class InstituteNotificationsService {
    repo;
    realtime;
    constructor(repo, realtime) {
        this.repo = repo;
        this.realtime = realtime;
    }
    async create(data) {
        const notification = this.repo.create(data);
        const saved = await this.repo.save(notification);
        this.realtime.emitToUser(data.user_id, 'institute-notification', saved);
        return saved;
    }
    async createBulk(notifications) {
        const entities = this.repo.create(notifications);
        const saved = await this.repo.save(entities);
        saved.forEach((notification) => {
            this.realtime.emitToUser(notification.user_id, 'institute-notification', notification);
        });
        return saved;
    }
    async findByUser(userId, instituteId, limit = 50) {
        const query = this.repo
            .createQueryBuilder('n')
            .where('n.user_id = :userId', { userId })
            .orderBy('n.created_at', 'DESC')
            .take(limit);
        if (instituteId) {
            query.andWhere('n.institute_id = :instituteId', { instituteId });
        }
        return query.getMany();
    }
    async findUnreadByUser(userId, instituteId) {
        const query = this.repo
            .createQueryBuilder('n')
            .where('n.user_id = :userId', { userId })
            .andWhere('n.read = :read', { read: false })
            .orderBy('n.created_at', 'DESC');
        if (instituteId) {
            query.andWhere('n.institute_id = :instituteId', { instituteId });
        }
        return query.getMany();
    }
    async countUnread(userId, instituteId) {
        const query = this.repo
            .createQueryBuilder('n')
            .where('n.user_id = :userId', { userId })
            .andWhere('n.read = :read', { read: false });
        if (instituteId) {
            query.andWhere('n.institute_id = :instituteId', { instituteId });
        }
        return query.getCount();
    }
    async markAsRead(notificationId, userId) {
        const result = await this.repo.update({ id: notificationId, user_id: userId }, { read: true, read_at: new Date() });
        if (result.affected && result.affected > 0) {
            this.realtime.emitToUser(userId, 'institute-notification-read', { notificationId });
        }
        return result;
    }
    async markAllAsRead(userId, instituteId) {
        const query = this.repo
            .createQueryBuilder()
            .update(entities_1.InstituteNotification)
            .set({ read: true, read_at: new Date() })
            .where('user_id = :userId', { userId })
            .andWhere('read = :read', { read: false });
        if (instituteId) {
            query.andWhere('institute_id = :instituteId', { instituteId });
        }
        const result = await query.execute();
        if (result.affected && result.affected > 0) {
            this.realtime.emitToUser(userId, 'institute-notifications-all-read', { instituteId });
        }
        return result;
    }
    async delete(notificationId, userId) {
        return this.repo.delete({ id: notificationId, user_id: userId });
    }
    async deleteAll(userId, instituteId) {
        if (instituteId) {
            return this.repo.delete({ user_id: userId, institute_id: instituteId });
        }
        return this.repo.delete({ user_id: userId });
    }
    async notifyAnnouncement(instituteId, userIds, announcement) {
        const notifications = userIds.map((userId) => ({
            institute_id: instituteId,
            user_id: userId,
            type: 'announcement',
            title: 'New Announcement',
            message: announcement.title,
            related_id: announcement.id,
            related_type: 'announcement',
            metadata: {
                announcement_type: announcement.announcement_type,
                teacher_id: announcement.teacher_id,
            },
        }));
        return this.createBulk(notifications);
    }
    async notifyAssignment(instituteId, userIds, assignment) {
        const notifications = userIds.map((userId) => ({
            institute_id: instituteId,
            user_id: userId,
            type: 'assignment',
            title: 'New Assignment',
            message: `${assignment.title} - Due: ${new Date(assignment.due_date).toLocaleDateString()}`,
            related_id: assignment.id,
            related_type: 'homework',
            metadata: {
                due_date: assignment.due_date,
                subject_id: assignment.subject_id,
            },
        }));
        return this.createBulk(notifications);
    }
    async notifyAssignmentSubmission(instituteId, teacherId, submission, studentName) {
        return this.create({
            institute_id: instituteId,
            user_id: teacherId,
            type: 'assignment_submission',
            title: 'New Assignment Submission',
            message: `${studentName} submitted an assignment`,
            related_id: submission.id,
            related_type: 'homework_submission',
            metadata: {
                homework_id: submission.homework_id,
                student_id: submission.student_id,
            },
        });
    }
    async notifyQuiz(instituteId, userIds, quiz) {
        const notifications = userIds.map((userId) => ({
            institute_id: instituteId,
            user_id: userId,
            type: 'quiz',
            title: 'New Quiz Available',
            message: quiz.title,
            related_id: quiz.id,
            related_type: 'quiz',
            metadata: {
                subject_id: quiz.subject_id,
                total_marks: quiz.total_marks,
            },
        }));
        return this.createBulk(notifications);
    }
    async notifyLiveClass(instituteId, userIds, liveClass) {
        const notifications = userIds.map((userId) => ({
            institute_id: instituteId,
            user_id: userId,
            type: 'live_class',
            title: 'Live Class Scheduled',
            message: `${liveClass.title} - ${new Date(liveClass.scheduled_at).toLocaleString()}`,
            related_id: liveClass.id,
            related_type: 'live_class',
            metadata: {
                scheduled_at: liveClass.scheduled_at,
                subject_id: liveClass.subject_id,
            },
        }));
        return this.createBulk(notifications);
    }
    async notifyLiveClassStarted(instituteId, userIds, liveClass) {
        const notifications = userIds.map((userId) => ({
            institute_id: instituteId,
            user_id: userId,
            type: 'live_class_started',
            title: 'Live Class Started',
            message: `${liveClass.title} is now live!`,
            related_id: liveClass.id,
            related_type: 'live_class',
            metadata: {
                meeting_url: liveClass.meeting_url,
                subject_id: liveClass.subject_id,
            },
        }));
        return this.createBulk(notifications);
    }
    async notifyGrade(instituteId, studentId, grade, subjectName) {
        return this.create({
            institute_id: instituteId,
            user_id: studentId,
            type: 'grade',
            title: 'Grade Updated',
            message: `Your grade for ${subjectName}: ${grade.marks_obtained}/${grade.total_marks}`,
            related_id: grade.id,
            related_type: 'result',
            metadata: {
                subject_id: grade.subject_id,
                marks_obtained: grade.marks_obtained,
                total_marks: grade.total_marks,
                grade: grade.grade,
            },
        });
    }
    async notifyDiscussion(instituteId, userIds, discussion) {
        const notifications = userIds.map((userId) => ({
            institute_id: instituteId,
            user_id: userId,
            type: 'discussion',
            title: 'New Discussion',
            message: discussion.title || 'A new discussion was posted',
            related_id: discussion.id,
            related_type: 'discussion',
            metadata: {
                subject_id: discussion.subject_id,
                teacher_id: discussion.teacher_id,
            },
        }));
        return this.createBulk(notifications);
    }
    async notifyResource(instituteId, userIds, resource) {
        const notifications = userIds.map((userId) => ({
            institute_id: instituteId,
            user_id: userId,
            type: 'resource',
            title: 'New Resource Added',
            message: resource.title,
            related_id: resource.id,
            related_type: 'resource',
            metadata: {
                subject_id: resource.subject_id,
                resource_type: resource.resource_type,
            },
        }));
        return this.createBulk(notifications);
    }
    async notifyQuery(instituteId, teacherId, query, studentName) {
        return this.create({
            institute_id: instituteId,
            user_id: teacherId,
            type: 'query',
            title: 'Student Query',
            message: `${studentName} asked a question in discussion`,
            related_id: query.id,
            related_type: 'discussion',
            metadata: {
                subject_id: query.subject_id,
                student_id: query.created_by,
            },
        });
    }
    async notifyDiscussionReply(instituteId, recipientId, parentDiscussion, reply, senderName, senderIsTeacher) {
        const threadTitle = parentDiscussion.title || 'your discussion';
        return this.create({
            institute_id: instituteId,
            user_id: recipientId,
            type: 'discussion',
            title: senderIsTeacher ? 'Teacher Reply' : 'Student Reply',
            message: senderIsTeacher
                ? `${senderName} replied to "${threadTitle}"`
                : `${senderName} replied in "${threadTitle}"`,
            related_id: parentDiscussion.id,
            related_type: 'discussion',
            metadata: {
                subject_id: parentDiscussion.subject_id,
                parent_id: parentDiscussion.id,
                reply_id: reply.id,
                sender_id: reply.created_by,
            },
        });
    }
};
exports.InstituteNotificationsService = InstituteNotificationsService;
exports.InstituteNotificationsService = InstituteNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.InstituteNotification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], InstituteNotificationsService);
//# sourceMappingURL=institute-notifications.service.js.map