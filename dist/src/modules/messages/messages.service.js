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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const blocks_service_1 = require("../blocks/blocks.service");
let MessagesService = class MessagesService {
    messages;
    reads;
    reactions;
    pins;
    stars;
    userDeleted;
    parts;
    convs;
    blocks;
    gateway;
    blocksSvc;
    constructor(messages, reads, reactions, pins, stars, userDeleted, parts, convs, blocks, gateway, blocksSvc) {
        this.messages = messages;
        this.reads = reads;
        this.reactions = reactions;
        this.pins = pins;
        this.stars = stars;
        this.userDeleted = userDeleted;
        this.parts = parts;
        this.convs = convs;
        this.blocks = blocks;
        this.gateway = gateway;
        this.blocksSvc = blocksSvc;
    }
    async assertParticipant(userId, conversationId) {
        const p = await this.parts.findOne({
            where: { conversation_id: conversationId, user_id: userId },
        });
        if (!p)
            throw new common_1.ForbiddenException('Not a participant');
        return p;
    }
    async list(userId, conversationId, limit = 200) {
        const me = await this.assertParticipant(userId, conversationId);
        const qb = this.messages
            .createQueryBuilder('m')
            .where('m.conversation_id = :cid', { cid: conversationId })
            .andWhere('(m.is_deleted_for_everyone = false OR m.sender_id = :uid)', { uid: userId })
            .orderBy('m.created_at', 'ASC')
            .limit(limit);
        if (me.cleared_at) {
            qb.andWhere('m.created_at > :cleared', { cleared: me.cleared_at });
        }
        const all = await qb.getMany();
        const deleted = await this.userDeleted.find({
            where: { user_id: userId, message_id: (0, typeorm_2.In)(all.map((m) => m.id)) },
        });
        const deletedSet = new Set(deleted.map((d) => d.message_id));
        const filtered = all.filter((m) => !deletedSet.has(m.id));
        const ids = filtered.map((m) => m.id);
        const [reactions, reads] = await Promise.all([
            ids.length
                ? this.reactions.find({ where: { message_id: (0, typeorm_2.In)(ids) } })
                : Promise.resolve([]),
            ids.length
                ? this.reads.find({ where: { message_id: (0, typeorm_2.In)(ids) } })
                : Promise.resolve([]),
        ]);
        return filtered.map((m) => ({
            ...m,
            reactions: reactions.filter((r) => r.message_id === m.id),
            reads: reads.filter((r) => r.message_id === m.id),
        }));
    }
    async send(userId, dto) {
        const me = await this.assertParticipant(userId, dto.conversation_id);
        const conv = await this.convs.findOne({
            where: { id: dto.conversation_id },
        });
        if (conv?.type === 'group' && conv.send_permission === 'admins' && me.role !== 'admin') {
            throw new common_1.ForbiddenException('Only admins can send messages in this group');
        }
        const participants = await this.parts.find({
            where: { conversation_id: dto.conversation_id },
        });
        if (conv?.type === '1on1') {
            const other = participants.find((p) => p.user_id !== userId);
            if (other) {
                const isBlocked = await this.blocksSvc.isBlocked(other.user_id, userId);
                const IBlockedThem = await this.blocksSvc.isBlocked(userId, other.user_id);
                if (isBlocked || IBlockedThem) {
                    throw new common_1.ForbiddenException('Cannot send message: blocking is active');
                }
            }
        }
        const expires_at = null;
        const msg = this.messages.create({
            conversation_id: dto.conversation_id,
            sender_id: userId,
            type: dto.type || 'text',
            content: dto.content ?? null,
            media_url: dto.media_url ?? null,
            media_mime_type: dto.media_mime_type ?? null,
            media_size: dto.media_size ?? null,
            media_duration: dto.media_duration ?? null,
            media_thumbnail: dto.media_thumbnail ?? null,
            media_filename: dto.media_filename ?? null,
            media_width: dto.media_width ?? null,
            media_height: dto.media_height ?? null,
            location_lat: dto.location_lat ?? null,
            location_lng: dto.location_lng ?? null,
            location_name: dto.location_name ?? null,
            reply_to_id: dto.reply_to_id ?? null,
            is_forwarded: !!dto.is_forwarded,
            expires_at,
        });
        const saved = await this.messages.save(msg);
        this.gateway.emitToConversation(dto.conversation_id, 'message:new', saved);
        return saved;
    }
    async edit(userId, messageId, content) {
        const m = await this.messages.findOne({ where: { id: messageId } });
        if (!m)
            throw new common_1.NotFoundException('Message not found');
        if (m.sender_id !== userId)
            throw new common_1.ForbiddenException('Not your message');
        await this.messages.update({ id: messageId }, { content, is_edited: true });
        const updated = await this.messages.findOne({ where: { id: messageId } });
        this.gateway.emitToConversation(m.conversation_id, 'message:update', updated);
        return updated;
    }
    async deleteForMe(userId, messageId) {
        await this.userDeleted.save(this.userDeleted.create({ user_id: userId, message_id: messageId }));
        return { ok: true };
    }
    async deleteForEveryone(userId, messageId) {
        const m = await this.messages.findOne({ where: { id: messageId } });
        if (!m)
            throw new common_1.NotFoundException('Message not found');
        if (m.sender_id !== userId)
            throw new common_1.ForbiddenException('Only the sender can delete for everyone');
        await this.messages.update({ id: messageId }, {
            is_deleted_for_everyone: true,
            deleted_at: new Date(),
            content: null,
            media_url: null,
        });
        const updated = await this.messages.findOne({ where: { id: messageId } });
        this.gateway.emitToConversation(m.conversation_id, 'message:update', updated);
        return updated;
    }
    async markRead(userId, messageIds) {
        if (!messageIds.length)
            return { ok: true };
        const rows = messageIds.map((id) => this.reads.create({ message_id: id, user_id: userId }));
        await this.reads
            .createQueryBuilder()
            .insert()
            .values(rows)
            .orIgnore()
            .execute();
        const msgs = await this.messages.find({ where: { id: (0, typeorm_2.In)(messageIds) } });
        const cids = Array.from(new Set(msgs.map((m) => m.conversation_id)));
        const payload = {
            user_id: userId,
            message_ids: messageIds,
        };
        cids.forEach((cid) => this.gateway.emitToConversation(cid, 'message:read', payload));
        const senderIds = Array.from(new Set(msgs.map((m) => m.sender_id).filter((id) => !!id && id !== userId)));
        for (const senderId of senderIds) {
            const readForSender = msgs
                .filter((m) => m.sender_id === senderId)
                .map((m) => m.id);
            this.gateway.emitToUser(senderId, 'message:read', {
                user_id: userId,
                message_ids: readForSender,
            });
        }
        return { ok: true };
    }
    async react(userId, messageId, emoji) {
        const m = await this.messages.findOne({ where: { id: messageId } });
        if (!m)
            throw new common_1.NotFoundException('Message not found');
        if (!emoji) {
            await this.reactions.delete({ message_id: messageId, user_id: userId });
        }
        else {
            await this.reactions
                .createQueryBuilder()
                .insert()
                .values({ message_id: messageId, user_id: userId, emoji })
                .orUpdate(['emoji'], ['message_id', 'user_id'])
                .execute();
        }
        const list = await this.reactions.find({ where: { message_id: messageId } });
        this.gateway.emitToConversation(m.conversation_id, 'message:reaction', {
            message_id: messageId,
            reactions: list,
        });
        return list;
    }
    async pin(userId, messageId) {
        const m = await this.messages.findOne({ where: { id: messageId } });
        if (!m)
            throw new common_1.NotFoundException('Message not found');
        await this.assertParticipant(userId, m.conversation_id);
        await this.pins
            .createQueryBuilder()
            .insert()
            .values({
            conversation_id: m.conversation_id,
            message_id: messageId,
            pinned_by: userId,
        })
            .orUpdate(['message_id', 'pinned_by', 'pinned_at'], ['conversation_id'])
            .execute();
        this.gateway.emitToConversation(m.conversation_id, 'message:pinned', {
            conversation_id: m.conversation_id,
            message_id: messageId,
        });
        return { ok: true };
    }
    async unpin(userId, conversationId) {
        await this.assertParticipant(userId, conversationId);
        await this.pins.delete({ conversation_id: conversationId });
        this.gateway.emitToConversation(conversationId, 'message:pinned', {
            conversation_id: conversationId,
            message_id: null,
        });
        return { ok: true };
    }
    async getPinned(userId, conversationId) {
        await this.assertParticipant(userId, conversationId);
        return this.pins.findOne({ where: { conversation_id: conversationId } });
    }
    async star(userId, messageId, starred) {
        if (starred) {
            await this.stars
                .createQueryBuilder()
                .insert()
                .values({ user_id: userId, message_id: messageId })
                .orIgnore()
                .execute();
        }
        else {
            await this.stars.delete({ user_id: userId, message_id: messageId });
        }
        return { ok: true };
    }
    async listStarred(userId) {
        const rows = await this.stars.find({ where: { user_id: userId } });
        if (!rows.length)
            return [];
        const ids = rows.map((r) => r.message_id);
        return this.messages.find({
            where: { id: (0, typeorm_2.In)(ids) },
            order: { created_at: 'DESC' },
        });
    }
    async listStarredIds(userId, conversationId) {
        const rows = await this.stars.find({ where: { user_id: userId } });
        if (!conversationId)
            return rows.map((r) => r.message_id);
        const ids = rows.map((r) => r.message_id);
        if (!ids.length)
            return [];
        const msgs = await this.messages.find({ where: { id: (0, typeorm_2.In)(ids) } });
        return msgs
            .filter((m) => m.conversation_id === conversationId)
            .map((m) => m.id);
    }
    async forward(userId, messageId, targetConversationIds) {
        const src = await this.messages.findOne({ where: { id: messageId } });
        if (!src)
            throw new common_1.NotFoundException('Source message not found');
        const results = [];
        for (const cid of targetConversationIds) {
            await this.assertParticipant(userId, cid);
            const fwd = await this.send(userId, {
                conversation_id: cid,
                type: src.type,
                content: src.content || undefined,
                media_url: src.media_url || undefined,
                media_mime_type: src.media_mime_type || undefined,
                media_size: src.media_size || undefined,
                media_duration: src.media_duration || undefined,
                media_thumbnail: src.media_thumbnail || undefined,
                media_filename: src.media_filename || undefined,
                media_width: src.media_width || undefined,
                media_height: src.media_height || undefined,
                location_lat: src.location_lat || undefined,
                location_lng: src.location_lng || undefined,
                location_name: src.location_name || undefined,
                is_forwarded: true,
            });
            results.push(fwd);
        }
        await this.messages.update({ id: messageId }, { forward_count: (src.forward_count || 0) + targetConversationIds.length });
        return results;
    }
    async search(userId, q, conversationId) {
        if (!q?.trim())
            return [];
        const qb = this.messages
            .createQueryBuilder('m')
            .innerJoin('conversation_participants', 'cp', 'cp.conversation_id = m.conversation_id AND cp.user_id = :uid', { uid: userId })
            .where('m.content ILIKE :q', { q: `%${q}%` })
            .andWhere('m.is_deleted_for_everyone = false')
            .orderBy('m.created_at', 'DESC')
            .limit(100);
        if (conversationId)
            qb.andWhere('m.conversation_id = :cid', { cid: conversationId });
        return qb.getMany();
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.MessageRead)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.MessageReaction)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.PinnedMessage)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.StarredMessage)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.UserDeletedMessage)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.ConversationParticipant)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.Conversation)),
    __param(8, (0, typeorm_1.InjectRepository)(entities_1.BlockedUser)),
    __param(9, (0, common_1.Inject)((0, common_1.forwardRef)(() => realtime_gateway_1.RealtimeGateway))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway,
        blocks_service_1.BlocksService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map