"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let ConversationsService = class ConversationsService {
    convs;
    parts;
    users;
    arch;
    blocks;
    ds;
    gateway;
    constructor(convs, parts, users, arch, blocks, ds, gateway) {
        this.convs = convs;
        this.parts = parts;
        this.users = users;
        this.arch = arch;
        this.blocks = blocks;
        this.ds = ds;
        this.gateway = gateway;
    }
    async list(userId) {
        const rows = await this.ds.query(`SELECT
        cp.id AS cp_id,
        cp.is_muted,
        cp.is_pinned,
        cp.unread_count,
        cp.lock_pin,
        cp.cleared_at,
        c.id,
        c.type,
        COALESCE(comm.name, c.name) AS name,
        c.avatar_url,
        c.last_message_id,
        c.last_message_at,
        c.last_message_preview,
        c.disappearing_timer,
        c.send_permission,
        c.edit_permission,
        c.community_id,
        c.created_at,
        c.updated_at
      FROM public.conversation_participants cp
      INNER JOIN public.conversations c ON c.id = cp.conversation_id
      LEFT JOIN public.communities comm ON comm.id = c.community_id
      WHERE cp.user_id = $1
        AND cp.is_hidden = false
      ORDER BY cp.is_pinned DESC, c.last_message_at DESC`, [userId]);
        const archivedRows = await this.arch.find({ where: { user_id: userId } });
        const archivedSet = new Set(archivedRows.map(a => a.conversation_id));
        const result = [];
        for (const row of rows) {
            const participants = await this.parts
                .createQueryBuilder('p')
                .leftJoinAndSelect('p.user', 'user')
                .where('p.conversation_id = :cid', { cid: row.id })
                .getMany();
            const other = participants.find((p) => p.user_id !== userId)?.user || null;
            result.push({
                id: row.id,
                type: row.type,
                name: row.name,
                avatar_url: row.avatar_url,
                last_message_id: row.last_message_id,
                last_message_at: row.last_message_at,
                last_message_preview: row.last_message_preview,
                disappearing_timer: row.disappearing_timer,
                send_permission: row.send_permission,
                edit_permission: row.edit_permission,
                community_id: row.community_id,
                created_at: row.created_at,
                updated_at: row.updated_at,
                is_muted: row.is_muted,
                is_pinned: row.is_pinned,
                unread_count: row.unread_count,
                is_locked: !!row.lock_pin,
                _is_archived: archivedSet.has(row.id),
                cleared_at: row.cleared_at,
                participants,
                other_participant: other,
            });
        }
        return result;
    }
    async getOne(userId, conversationId) {
        const me = await this.parts.findOne({
            where: { conversation_id: conversationId, user_id: userId },
        });
        if (!me)
            throw new common_1.ForbiddenException('Not a participant');
        const conv = await this.convs.findOne({ where: { id: conversationId } });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        let displayName = conv.name;
        if (conv.community_id) {
            const communityRow = await this.ds.query('SELECT name FROM public.communities WHERE id = $1 LIMIT 1', [conv.community_id]);
            if (communityRow?.[0]?.name)
                displayName = communityRow[0].name;
        }
        const participants = await this.parts
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.user', 'user')
            .where('p.conversation_id = :cid', { cid: conversationId })
            .getMany();
        const other = participants.find((p) => p.user_id !== userId)?.user || null;
        const isArchived = await this.arch.findOne({
            where: { user_id: userId, conversation_id: conversationId },
        });
        return {
            ...conv,
            name: displayName,
            is_muted: me.is_muted,
            is_pinned: me.is_pinned,
            unread_count: me.unread_count,
            is_locked: !!me.lock_pin,
            _is_archived: !!isArchived,
            cleared_at: me.cleared_at,
            participants,
            other_participant: other,
        };
    }
    async getOrCreate1on1(userId, otherUserId) {
        if (userId === otherUserId)
            throw new common_1.BadRequestException('Cannot chat with yourself');
        const existing = await this.ds.query(`SELECT c.id FROM public.conversations c
       INNER JOIN public.conversation_participants p1 ON p1.conversation_id = c.id AND p1.user_id = $1
       INNER JOIN public.conversation_participants p2 ON p2.conversation_id = c.id AND p2.user_id = $2
       WHERE c.type = '1on1' LIMIT 1`, [userId, otherUserId]);
        let convId;
        if (existing.length) {
            convId = existing[0].id;
            await this.parts.update({ conversation_id: convId, user_id: userId }, { is_hidden: false });
        }
        else {
            const c = await this.convs.save(this.convs.create({ type: '1on1' }));
            convId = c.id;
            await this.parts.save([
                this.parts.create({ conversation_id: convId, user_id: userId }),
                this.parts.create({ conversation_id: convId, user_id: otherUserId }),
            ]);
            this.gateway.addUserToConversationRoom(userId, convId);
            this.gateway.addUserToConversationRoom(otherUserId, convId);
        }
        return this.getOne(userId, convId);
    }
    async markRead(userId, conversationId) {
        await this.parts.update({ conversation_id: conversationId, user_id: userId }, { unread_count: 0, last_read_at: new Date() });
        this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
        return { ok: true };
    }
    async setPin(userId, conversationId, pin) {
        await this.parts.update({ conversation_id: conversationId, user_id: userId }, { is_pinned: pin, pinned_at: pin ? new Date() : null });
        this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
        return { ok: true };
    }
    async setMute(userId, conversationId, mute, until) {
        await this.parts.update({ conversation_id: conversationId, user_id: userId }, { is_muted: mute, mute_until: until || null });
        this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
        return { ok: true };
    }
    async archive(userId, conversationId, archived) {
        if (archived) {
            await this.arch.save(this.arch.create({ user_id: userId, conversation_id: conversationId }));
        }
        else {
            await this.arch.delete({ user_id: userId, conversation_id: conversationId });
        }
        this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
        return { ok: true };
    }
    async listArchived(userId) {
        const rows = await this.arch.find({ where: { user_id: userId } });
        if (!rows.length)
            return [];
        const ids = rows.map((r) => r.conversation_id);
        const all = await this.list(userId);
        return all.filter((c) => ids.includes(c.id));
    }
    async clear(userId, conversationId) {
        await this.parts.update({ conversation_id: conversationId, user_id: userId }, { cleared_at: new Date() });
        this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
        return { ok: true };
    }
    async hide(userId, conversationId) {
        await this.parts.update({ conversation_id: conversationId, user_id: userId }, { is_hidden: true, cleared_at: new Date(), unread_count: 0 });
        this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
        return { ok: true };
    }
    async lock(userId, conversationId, pin) {
        if (!/^\d{4,6}$/.test(pin))
            throw new common_1.BadRequestException('PIN must be 4–6 digits');
        const hash = await bcrypt.hash(pin, 8);
        await this.parts.update({ conversation_id: conversationId, user_id: userId }, { lock_pin: hash });
        this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
        return { ok: true };
    }
    async unlock(userId, conversationId, pin) {
        const me = await this.parts.findOne({
            where: { conversation_id: conversationId, user_id: userId },
        });
        if (!me || !me.lock_pin)
            return { ok: true };
        const ok = await bcrypt.compare(pin, me.lock_pin);
        if (!ok)
            throw new common_1.BadRequestException('Incorrect PIN');
        return { ok: true };
    }
    async removeLock(userId, conversationId, pin) {
        const me = await this.parts.findOne({
            where: { conversation_id: conversationId, user_id: userId },
        });
        if (!me || !me.lock_pin)
            return { ok: true };
        const ok = await bcrypt.compare(pin, me.lock_pin);
        if (!ok)
            throw new common_1.BadRequestException('Incorrect PIN');
        await this.parts.update({ conversation_id: conversationId, user_id: userId }, { lock_pin: null });
        this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
        return { ok: true };
    }
    async setDisappearingTimer(userId, conversationId, seconds) {
        await this.assertParticipant(userId, conversationId);
        await this.convs.update({ id: conversationId }, { disappearing_timer: seconds });
        return { ok: true };
    }
    async assertParticipant(userId, conversationId) {
        const p = await this.parts.findOne({
            where: { conversation_id: conversationId, user_id: userId },
        });
        if (!p)
            throw new common_1.ForbiddenException('Not a participant');
        return p;
    }
    async createGroup(userId, dto) {
        if (!dto.name?.trim())
            throw new common_1.BadRequestException('Group name required');
        if (!dto.member_ids?.length)
            throw new common_1.BadRequestException('At least one member required');
        const conv = await this.convs.save(this.convs.create({
            type: 'group',
            name: dto.name.trim(),
            avatar_url: dto.avatar_url || null,
            created_by: userId,
        }));
        const memberIds = Array.from(new Set([userId, ...dto.member_ids]));
        await this.parts.save(memberIds.map((uid) => this.parts.create({
            conversation_id: conv.id,
            user_id: uid,
            role: uid === userId ? 'admin' : 'member',
        })));
        return this.getOne(userId, conv.id);
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ConversationParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.ArchivedConversation)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.BlockedUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        realtime_gateway_1.RealtimeGateway])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map