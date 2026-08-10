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
exports.CommunitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let CommunitiesService = class CommunitiesService {
    comms;
    members;
    cgroups;
    convs;
    parts;
    users;
    gateway;
    constructor(comms, members, cgroups, convs, parts, users, gateway) {
        this.comms = comms;
        this.members = members;
        this.cgroups = cgroups;
        this.convs = convs;
        this.parts = parts;
        this.users = users;
        this.gateway = gateway;
    }
    async getMembership(userId, communityId) {
        const m = await this.members.findOne({
            where: { community_id: communityId, user_id: userId },
        });
        if (!m)
            throw new common_1.ForbiddenException('Not a community member');
        return m;
    }
    async assertAdmin(userId, communityId) {
        const m = await this.getMembership(userId, communityId);
        if (m.role !== 'admin')
            throw new common_1.ForbiddenException('Admins only');
        return m;
    }
    async list(userId) {
        const rows = await this.members
            .createQueryBuilder('m')
            .innerJoin('communities', 'c', 'c.id = m.community_id')
            .where('m.user_id = :uid', { uid: userId })
            .orderBy('c.updated_at', 'DESC')
            .select([
            'm.role AS role',
            'c.id AS id',
            'c.name AS name',
            'c.description AS description',
            'c.avatar_url AS avatar_url',
            'c.created_by AS created_by',
            'c.updated_at AS updated_at',
        ])
            .getRawMany();
        const result = [];
        for (const row of rows) {
            const memberCount = await this.members.count({
                where: { community_id: row.id },
            });
            const groupCount = await this.cgroups.count({
                where: { community_id: row.id },
            });
            result.push({ ...row, member_count: memberCount, group_count: groupCount });
        }
        return result;
    }
    async get(userId, id) {
        await this.getMembership(userId, id);
        const c = await this.comms.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Community not found');
        const members = await this.members
            .createQueryBuilder('m')
            .leftJoin('users', 'u', 'u.id = m.user_id')
            .where('m.community_id = :id', { id })
            .select([
            'm.id AS id',
            'm.user_id AS user_id',
            'm.role AS role',
            'm.joined_at AS joined_at',
            'u.display_name AS display_name',
            'u.avatar_url AS avatar_url',
            'u.phone AS phone',
        ])
            .getRawMany();
        const groupRows = await this.cgroups
            .createQueryBuilder('cg')
            .innerJoin('conversations', 'c', 'c.id = cg.conversation_id')
            .where('cg.community_id = :id', { id })
            .orderBy('cg.is_announcement', 'DESC')
            .addOrderBy('c.last_message_at', 'DESC')
            .select([
            'cg.id AS link_id',
            'cg.conversation_id AS conversation_id',
            'cg.is_announcement AS is_announcement',
            'c.name AS name',
            'c.avatar_url AS avatar_url',
            'c.last_message_preview AS last_message_preview',
            'c.last_message_at AS last_message_at',
        ])
            .getRawMany();
        const groups = [];
        for (const g of groupRows) {
            const mc = await this.parts.count({
                where: { conversation_id: g.conversation_id },
            });
            groups.push({
                id: g.conversation_id,
                link_id: g.link_id,
                is_announcement: g.is_announcement,
                name: g.name,
                avatar_url: g.avatar_url,
                last_message_preview: g.last_message_preview,
                last_message_at: g.last_message_at,
                member_count: mc,
            });
        }
        return { ...c, members, groups };
    }
    async create(userId, dto) {
        if (!dto.name?.trim())
            throw new common_1.BadRequestException('Name required');
        const community = await this.comms.save(this.comms.create({
            name: dto.name.trim(),
            description: dto.description?.trim() || null,
            avatar_url: dto.avatar_url || null,
            created_by: userId,
        }));
        await this.members.save(this.members.create({
            community_id: community.id,
            user_id: userId,
            role: 'admin',
        }));
        const inviteIds = (dto.member_ids || []).filter((id) => id !== userId);
        if (inviteIds.length) {
            const existingUsers = await this.users.find({ where: { id: (0, typeorm_2.In)(inviteIds) } });
            if (existingUsers.length !== inviteIds.length)
                throw new common_1.BadRequestException('Some users do not exist');
            await this.members.save(inviteIds.map((uid) => this.members.create({
                community_id: community.id,
                user_id: uid,
                role: 'member',
            })));
        }
        const announcement = await this.convs.save(this.convs.create({
            type: 'group',
            name: dto.name.trim(),
            description: `${community.name} community announcements`,
            created_by: userId,
            send_permission: 'admins',
            edit_permission: 'admins',
            community_id: community.id,
        }));
        const allIds = Array.from(new Set([userId, ...inviteIds]));
        await this.parts.save(allIds.map((uid) => this.parts.create({
            conversation_id: announcement.id,
            user_id: uid,
            role: uid === userId ? 'admin' : 'member',
        })));
        await this.cgroups.save(this.cgroups.create({
            community_id: community.id,
            conversation_id: announcement.id,
            is_announcement: true,
        }));
        allIds.forEach((uid) => this.gateway.addUserToConversationRoom(uid, announcement.id));
        allIds.forEach((uid) => this.gateway.emitToUser(uid, 'community:created', {
            community_id: community.id,
        }));
        return this.get(userId, community.id);
    }
    async update(userId, id, dto) {
        await this.assertAdmin(userId, id);
        const patch = {};
        if (dto.name !== undefined)
            patch.name = dto.name.trim();
        if (dto.description !== undefined)
            patch.description = dto.description;
        if (dto.avatar_url !== undefined)
            patch.avatar_url = dto.avatar_url;
        await this.comms.update({ id }, patch);
        this.gateway
            .emitToUsers((await this.members.find({ where: { community_id: id } })).map((m) => m.user_id), 'community:updated', { community_id: id });
        return this.get(userId, id);
    }
    async delete(userId, id) {
        await this.assertAdmin(userId, id);
        const c = await this.comms.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Community not found');
        if (c.created_by !== userId)
            throw new common_1.ForbiddenException('Only the creator can delete the community');
        await this.comms.delete({ id });
        return { ok: true };
    }
    async addMembers(userId, id, memberIds) {
        await this.assertAdmin(userId, id);
        const existing = await this.members.find({
            where: { community_id: id, user_id: (0, typeorm_2.In)(memberIds) },
        });
        const existingSet = new Set(existing.map((m) => m.user_id));
        const toAdd = memberIds.filter((uid) => !existingSet.has(uid));
        if (!toAdd.length)
            return { ok: true, added: 0 };
        await this.members.save(toAdd.map((uid) => this.members.create({
            community_id: id,
            user_id: uid,
            role: 'member',
        })));
        const announcement = await this.cgroups.findOne({
            where: { community_id: id, is_announcement: true },
        });
        if (announcement) {
            await this.parts.save(toAdd.map((uid) => this.parts.create({
                conversation_id: announcement.conversation_id,
                user_id: uid,
                role: 'member',
            })));
            toAdd.forEach((uid) => this.gateway.addUserToConversationRoom(uid, announcement.conversation_id));
        }
        toAdd.forEach((uid) => this.gateway.emitToUser(uid, 'community:joined', { community_id: id }));
        return { ok: true, added: toAdd.length };
    }
    async removeMember(userId, id, targetId) {
        await this.assertAdmin(userId, id);
        if (targetId === userId)
            throw new common_1.BadRequestException('Use leave endpoint');
        await this.members.delete({ community_id: id, user_id: targetId });
        const groups = await this.cgroups.find({ where: { community_id: id } });
        for (const g of groups) {
            await this.parts.delete({
                conversation_id: g.conversation_id,
                user_id: targetId,
            });
        }
        this.gateway.emitToUser(targetId, 'community:removed', {
            community_id: id,
        });
        return { ok: true };
    }
    async leave(userId, id) {
        const m = await this.getMembership(userId, id);
        const community = await this.comms.findOne({ where: { id } });
        if (community?.created_by === userId) {
            throw new common_1.BadRequestException('Creator cannot leave. Delete the community or transfer ownership.');
        }
        await this.members.delete({ id: m.id });
        const groups = await this.cgroups.find({ where: { community_id: id } });
        for (const g of groups) {
            await this.parts.delete({
                conversation_id: g.conversation_id,
                user_id: userId,
            });
        }
        return { ok: true };
    }
    async setRole(userId, id, targetId, role) {
        await this.assertAdmin(userId, id);
        await this.members.update({ community_id: id, user_id: targetId }, { role });
        return { ok: true };
    }
    async linkGroup(userId, communityId, groupId) {
        await this.assertAdmin(userId, communityId);
        const g = await this.convs.findOne({ where: { id: groupId, type: 'group' } });
        if (!g)
            throw new common_1.NotFoundException('Group not found');
        if (g.community_id && g.community_id !== communityId)
            throw new common_1.BadRequestException('Group already belongs to another community');
        await this.convs.update({ id: groupId }, { community_id: communityId });
        await this.cgroups.save(this.cgroups.create({
            community_id: communityId,
            conversation_id: groupId,
        }));
        return { ok: true };
    }
    async unlinkGroup(userId, communityId, groupId) {
        await this.assertAdmin(userId, communityId);
        await this.convs.update({ id: groupId }, { community_id: null });
        await this.cgroups.delete({
            community_id: communityId,
            conversation_id: groupId,
        });
        return { ok: true };
    }
    async createGroupInCommunity(userId, communityId, dto) {
        await this.assertAdmin(userId, communityId);
        if (!dto.name?.trim())
            throw new common_1.BadRequestException('Group name required');
        const communityMemberIds = (await this.members.find({ where: { community_id: communityId } })).map((m) => m.user_id);
        const invited = (dto.member_ids || []).filter((id) => communityMemberIds.includes(id));
        const groupMemberIds = Array.from(new Set([userId, ...invited]));
        const group = await this.convs.save(this.convs.create({
            type: 'group',
            name: dto.name.trim(),
            description: dto.description?.trim() || null,
            avatar_url: dto.avatar_url || null,
            created_by: userId,
            community_id: communityId,
        }));
        await this.parts.save(groupMemberIds.map((uid) => this.parts.create({
            conversation_id: group.id,
            user_id: uid,
            role: uid === userId ? 'admin' : 'member',
        })));
        await this.cgroups.save(this.cgroups.create({
            community_id: communityId,
            conversation_id: group.id,
        }));
        groupMemberIds.forEach((uid) => this.gateway.addUserToConversationRoom(uid, group.id));
        return { ok: true, group_id: group.id };
    }
};
exports.CommunitiesService = CommunitiesService;
exports.CommunitiesService = CommunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Community)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.CommunityMember)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.CommunityGroup)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Conversation)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.ConversationParticipant)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], CommunitiesService);
//# sourceMappingURL=communities.service.js.map