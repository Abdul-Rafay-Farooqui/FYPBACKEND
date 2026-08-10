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
exports.DiscussionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const institute_notifications_service_1 = require("../institute-notifications/institute-notifications.service");
let DiscussionsService = class DiscussionsService {
    discussions;
    users;
    gateway;
    notifications;
    constructor(discussions, users, gateway, notifications) {
        this.discussions = discussions;
        this.users = users;
        this.gateway = gateway;
        this.notifications = notifications;
    }
    async getUserDisplayName(userId) {
        if (!userId)
            return 'Someone';
        const user = await this.users.findOne({
            where: { id: userId },
            select: ['display_name', 'email'],
        });
        return user?.display_name || user?.email || 'Someone';
    }
    async create(data) {
        const discussion = this.discussions.create(data);
        const saved = await this.discussions.save(discussion);
        if (saved.institute_id) {
            this.gateway.emitToInstitute(saved.institute_id, 'institute:discussion-created', {
                institute_id: saved.institute_id,
                discussion: saved,
            });
            if (saved.teacher_id && saved.created_by === saved.student_id) {
                const studentName = await this.getUserDisplayName(saved.created_by);
                await this.notifications.notifyQuery(saved.institute_id, saved.teacher_id, saved, studentName);
            }
        }
        return saved;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.student_id)
            where.student_id = filters.student_id;
        if (filters?.teacher_id)
            where.teacher_id = filters.teacher_id;
        if (filters?.institute_id)
            where.institute_id = filters.institute_id;
        if (filters?.class_batch_section_id)
            where.class_batch_section_id = filters.class_batch_section_id;
        where.parent_id = null;
        return this.discussions.find({
            where,
            relations: ['student', 'teacher', 'subject'],
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const discussion = await this.discussions.findOne({
            where: { id },
            relations: ['student', 'teacher', 'subject'],
        });
        if (!discussion)
            throw new common_1.NotFoundException('Discussion not found');
        return discussion;
    }
    async getReplies(parentId) {
        return this.discussions.find({
            where: { parent_id: parentId },
            relations: ['student', 'teacher'],
            order: { created_at: 'ASC' },
        });
    }
    async reply(parentId, data) {
        const parent = await this.findOne(parentId);
        const reply = this.discussions.create({
            ...data,
            parent_id: parentId,
            institute_id: parent.institute_id,
            class_batch_section_id: parent.class_batch_section_id,
            subject_id: parent.subject_id,
        });
        const saved = await this.discussions.save(reply);
        if (parent.institute_id) {
            this.gateway.emitToInstitute(parent.institute_id, 'institute:discussion-replied', {
                institute_id: parent.institute_id,
                parent_id: parentId,
                reply: saved,
            });
            const senderId = saved.created_by;
            const senderIsTeacher = senderId === parent.teacher_id;
            const recipientId = senderIsTeacher ? parent.student_id : parent.teacher_id;
            if (recipientId && recipientId !== senderId) {
                const senderName = await this.getUserDisplayName(senderId);
                await this.notifications.notifyDiscussionReply(parent.institute_id, recipientId, parent, saved, senderName, senderIsTeacher);
            }
        }
        return saved;
    }
    async markAsRead(id) {
        await this.discussions.update(id, { is_read: true });
        return { success: true };
    }
    async delete(id) {
        await this.discussions.delete(id);
        return { success: true };
    }
    async getUnreadCount(userId, role) {
        const where = { is_read: false };
        if (role === 'student') {
            where.student_id = userId;
        }
        else {
            where.teacher_id = userId;
        }
        return this.discussions.count({ where });
    }
};
exports.DiscussionsService = DiscussionsService;
exports.DiscussionsService = DiscussionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Discussion)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway,
        institute_notifications_service_1.InstituteNotificationsService])
], DiscussionsService);
//# sourceMappingURL=discussions.service.js.map