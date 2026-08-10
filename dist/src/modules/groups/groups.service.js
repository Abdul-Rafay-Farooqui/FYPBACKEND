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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let GroupsService = class GroupsService {
    convs;
    parts;
    users;
    gateway;
    constructor(convs, parts, users, gateway) {
        this.convs = convs;
        this.parts = parts;
        this.users = users;
        this.gateway = gateway;
    }
    async getMe(userId, groupId) {
        const me = await this.parts.findOne({
            where: { conversation_id: groupId, user_id: userId },
        });
        if (!me)
            throw new common_1.ForbiddenException('Not a member of this group');
        return me;
    }
    async assertAdmin(userId, groupId) {
        const me = await this.getMe(userId, groupId);
        if (me.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        return me;
    }
    async loadGroup(groupId) {
        const g = await this.convs.findOne({ where: { id: groupId, type: 'group' } });
        if (!g)
            throw new common_1.NotFoundException('Group not found');
        return g;
    }
    async list(userId) {
        const parts = await this.parts
            .createQueryBuilder('cp')
            .innerJoin('conversations', 'c', 'c.id = cp.conversation_id')
            .where('cp.user_id = :userId', { userId })
            .andWhere("c.type = 'group'")
            .orderBy('c.last_message_at', 'DESC')
            .select([
            'cp.role AS role',
            'cp.is_muted AS is_muted',
            'cp.is_pinned AS is_pinned',
            'cp.unread_count AS unread_count',
            'c.id AS id',
            'c.name AS name',
            'c.description AS description',
            'c.avatar_url AS avatar_url',
            'c.created_by AS created_by',
            'c.send_permission AS send_permission',
            'c.edit_permission AS edit_permission',
            'c.community_id AS community_id',
            'c.last_message_at AS last_message_at',
            'c.last_message_preview AS last_message_preview',
        ])
            .getRawMany();
        const result = [];
        for (const row of parts) {
            const memberCount = await this.parts.count({
                where: { conversation_id: row.id },
            });
            result.push({ ...row, member_count: memberCount });
        }
        return result;
    }
    async get(userId, groupId) {
        await this.getMe(userId, groupId);
        const group = await this.loadGroup(groupId);
        const rows = await this.parts
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.user', 'user')
            .where('p.conversation_id = :gid', { gid: groupId })
            .getMany();
        const members = rows.map((r) => ({
            user_id: r.user_id,
            role: r.role,
            display_name: r.user?.display_name || '',
            avatar_url: r.user?.avatar_url || null,
            phone: r.user?.phone || null,
            is_online: r.user?.is_online || false,
            joined_at: r.joined_at,
        }));
        return { ...group, members };
    }
    async create(userId, dto) {
        if (!dto.name?.trim())
            throw new common_1.BadRequestException('Group name required');
        if (!dto.member_ids?.length)
            throw new common_1.BadRequestException('Add at least one member');
        const ids = Array.from(new Set([userId, ...dto.member_ids]));
        const existingUsers = await this.users.find({ where: { id: (0, typeorm_2.In)(ids) } });
        if (existingUsers.length !== ids.length)
            throw new common_1.BadRequestException('One or more members not found');
        const group = await this.convs.save(this.convs.create({
            type: 'group',
            name: dto.name.trim(),
            description: dto.description?.trim() || null,
            avatar_url: dto.avatar_url || null,
            created_by: userId,
            send_permission: 'all',
            edit_permission: 'all',
        }));
        await this.parts.save(ids.map((uid) => this.parts.create({
            conversation_id: group.id,
            user_id: uid,
            role: uid === userId ? 'admin' : 'member',
        })));
        ids.forEach((uid) => this.gateway.addUserToConversationRoom(uid, group.id));
        ids.forEach((uid) => this.gateway.emitToUser(uid, 'group:created', { group_id: group.id }));
        return this.get(userId, group.id);
    }
    async update(userId, groupId, dto) {
        const me = await this.getMe(userId, groupId);
        const g = await this.loadGroup(groupId);
        if (g.edit_permission === 'admins' && me.role !== 'admin') {
            throw new common_1.ForbiddenException('Only admins can edit group info');
        }
        const patch = {};
        if (dto.name !== undefined)
            patch.name = dto.name.trim();
        if (dto.description !== undefined)
            patch.description = dto.description;
        if (dto.avatar_url !== undefined)
            patch.avatar_url = dto.avatar_url;
        if (dto.send_permission || dto.edit_permission) {
            if (me.role !== 'admin')
                throw new common_1.ForbiddenException('Only admins can change permissions');
            if (dto.send_permission)
                patch.send_permission = dto.send_permission;
            if (dto.edit_permission)
                patch.edit_permission = dto.edit_permission;
        }
        await this.convs.update({ id: groupId }, patch);
        this.gateway.emitToConversation(groupId, 'group:updated', { group_id: groupId });
        return this.get(userId, groupId);
    }
    async addMembers(userId, groupId, memberIds) {
        await this.assertAdmin(userId, groupId);
        const existing = await this.parts.find({
            where: { conversation_id: groupId, user_id: (0, typeorm_2.In)(memberIds) },
        });
        const existingSet = new Set(existing.map((p) => p.user_id));
        const toAdd = memberIds.filter((id) => !existingSet.has(id));
        if (!toAdd.length)
            return { ok: true, added: 0 };
        await this.parts.save(toAdd.map((uid) => this.parts.create({
            conversation_id: groupId,
            user_id: uid,
            role: 'member',
        })));
        toAdd.forEach((uid) => this.gateway.addUserToConversationRoom(uid, groupId));
        this.gateway.emitToConversation(groupId, 'group:member-added', {
            group_id: groupId,
            user_ids: toAdd,
        });
        return { ok: true, added: toAdd.length };
    }
    async removeMember(userId, groupId, targetId) {
        await this.assertAdmin(userId, groupId);
        if (targetId === userId)
            throw new common_1.BadRequestException('Use leave endpoint to remove yourself');
        await this.parts.delete({ conversation_id: groupId, user_id: targetId });
        this.gateway.emitToConversation(groupId, 'group:member-removed', {
            group_id: groupId,
            user_id: targetId,
        });
        return { ok: true };
    }
    async leave(userId, groupId) {
        const me = await this.getMe(userId, groupId);
        if (me.role === 'admin') {
            const otherAdmin = await this.parts.findOne({
                where: { conversation_id: groupId, role: 'admin' },
            });
            if (otherAdmin?.user_id === userId) {
                const candidate = await this.parts.findOne({
                    where: { conversation_id: groupId, role: 'member' },
                });
                if (candidate) {
                    await this.parts.update({ id: candidate.id }, { role: 'admin' });
                }
            }
        }
        await this.parts.delete({ conversation_id: groupId, user_id: userId });
        this.gateway.emitToConversation(groupId, 'group:member-left', {
            group_id: groupId,
            user_id: userId,
        });
        return { ok: true };
    }
    async setRole(userId, groupId, targetId, role) {
        await this.assertAdmin(userId, groupId);
        await this.parts.update({ conversation_id: groupId, user_id: targetId }, { role });
        this.gateway.emitToConversation(groupId, 'group:role-changed', {
            group_id: groupId,
            user_id: targetId,
            role,
        });
        return { ok: true };
    }
    async canSend(userId, groupId) {
        const me = await this.parts.findOne({
            where: { conversation_id: groupId, user_id: userId },
        });
        if (!me)
            return false;
        const g = await this.convs.findOne({ where: { id: groupId } });
        if (!g)
            return false;
        if (g.send_permission === 'admins' && me.role !== 'admin')
            return false;
        return true;
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ConversationParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], GroupsService);
//# sourceMappingURL=groups.service.js.map