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
exports.StatusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let StatusService = class StatusService {
    su;
    sv;
    hidden;
    contacts;
    users;
    gateway;
    constructor(su, sv, hidden, contacts, users, gateway) {
        this.su = su;
        this.sv = sv;
        this.hidden = hidden;
        this.contacts = contacts;
        this.users = users;
        this.gateway = gateway;
    }
    async create(userId, dto) {
        const status = await this.su.save(this.su.create({
            user_id: userId,
            type: dto.type,
            content: dto.content || null,
            caption: dto.caption || null,
            bg_color: dto.bg_color || null,
            media_url: dto.media_url || null,
            media_thumbnail: dto.media_thumbnail || null,
            media_duration: dto.media_duration || null,
            expires_at: new Date(Date.now() + 24 * 3600 * 1000),
        }));
        if (dto.hide_from?.length) {
            await this.hidden.save(dto.hide_from.map((uid) => this.hidden.create({
                status_id: status.id,
                user_id: uid,
            })));
        }
        const hiddenSet = new Set(dto.hide_from || []);
        const myContacts = await this.contacts.find({ where: { user_id: userId } });
        const theyAddedMe = await this.contacts.find({ where: { contact_id: userId } });
        const convPartners = await this.contacts.manager.query(`SELECT DISTINCT cp2.user_id
       FROM conversation_participants cp1
       INNER JOIN conversation_participants cp2
         ON cp2.conversation_id = cp1.conversation_id AND cp2.user_id <> $1
       INNER JOIN conversations c ON c.id = cp1.conversation_id AND c.type = '1on1'
       WHERE cp1.user_id = $1`, [userId]);
        const allNotifyIds = Array.from(new Set([
            ...myContacts.map((c) => c.contact_id),
            ...theyAddedMe.map((c) => c.user_id),
            ...convPartners.map((r) => r.user_id),
        ]));
        allNotifyIds.forEach((cid) => {
            if (!hiddenSet.has(cid)) {
                this.gateway.emitToUser(cid, 'status:new', {
                    status_id: status.id,
                    user_id: userId,
                });
            }
        });
        return status;
    }
    async feed(userId) {
        const mine = await this.su.find({
            where: { user_id: userId, expires_at: (0, typeorm_2.MoreThan)(new Date()) },
            order: { created_at: 'DESC' },
        });
        const myContacts = await this.contacts.find({ where: { user_id: userId } });
        const theyAddedMe = await this.contacts.find({ where: { contact_id: userId } });
        const convPartners = await this.contacts.manager.query(`SELECT DISTINCT cp2.user_id
       FROM conversation_participants cp1
       INNER JOIN conversation_participants cp2
         ON cp2.conversation_id = cp1.conversation_id AND cp2.user_id <> $1
       INNER JOIN conversations c ON c.id = cp1.conversation_id AND c.type = '1on1'
       WHERE cp1.user_id = $1`, [userId]);
        const visibleIds = Array.from(new Set([
            ...myContacts.map((c) => c.contact_id),
            ...theyAddedMe.map((c) => c.user_id),
            ...convPartners.map((r) => r.user_id),
        ])).filter((id) => id !== userId);
        const recent = [];
        if (visibleIds.length) {
            const rawRows = await this.su
                .createQueryBuilder('s')
                .where('s.expires_at > NOW()')
                .andWhere('s.user_id IN (:...ids)', { ids: visibleIds })
                .andWhere(`NOT EXISTS (SELECT 1 FROM status_hidden_from h WHERE h.status_id = s.id AND h.user_id = :me)`, { me: userId })
                .orderBy('s.created_at', 'DESC')
                .getMany();
            recent.push(...rawRows);
        }
        const userIds = Array.from(new Set([userId, ...recent.map((r) => r.user_id)]));
        const users = await this.users.find({ where: userIds.map((id) => ({ id })) });
        const userMap = new Map(users.map((u) => [u.id, u]));
        const statusIds = [...mine, ...recent].map((s) => s.id);
        const views = statusIds.length
            ? await this.sv.find({
                where: statusIds.map((sid) => ({ status_id: sid, viewer_id: userId })),
            })
            : [];
        const viewedSet = new Set(views.map((v) => v.status_id));
        const group = (arr) => {
            const byUser = new Map();
            for (const s of arr) {
                if (!byUser.has(s.user_id)) {
                    const u = userMap.get(s.user_id);
                    byUser.set(s.user_id, {
                        user_id: s.user_id,
                        display_name: u?.display_name || 'Unknown',
                        avatar_url: u?.avatar_url || null,
                        statuses: [],
                    });
                }
                byUser.get(s.user_id).statuses.push({ ...s, viewed_by_me: viewedSet.has(s.id) });
            }
            return Array.from(byUser.values());
        };
        return {
            my_statuses: mine.map((s) => ({ ...s, viewed_by_me: true })),
            recent: group(recent),
        };
    }
    async view(userId, statusId) {
        const status = await this.su.findOne({ where: { id: statusId } });
        if (!status)
            throw new common_1.NotFoundException('Status not found');
        if (status.expires_at < new Date())
            throw new common_1.ForbiddenException('Status expired');
        const isHidden = await this.hidden.findOne({
            where: { status_id: statusId, user_id: userId },
        });
        if (isHidden)
            throw new common_1.ForbiddenException('You cannot view this status');
        await this.sv
            .createQueryBuilder()
            .insert()
            .values({ status_id: statusId, viewer_id: userId })
            .orIgnore()
            .execute();
        this.gateway.emitToUser(status.user_id, 'status:viewed', {
            status_id: statusId,
            viewer_id: userId,
        });
        return { ok: true };
    }
    async viewers(userId, statusId) {
        const status = await this.su.findOne({ where: { id: statusId } });
        if (!status)
            throw new common_1.NotFoundException('Status not found');
        if (status.user_id !== userId)
            throw new common_1.ForbiddenException('Only the owner can see viewers');
        const rows = await this.sv
            .createQueryBuilder('sv')
            .leftJoin('users', 'u', 'u.id = sv.viewer_id')
            .where('sv.status_id = :id', { id: statusId })
            .orderBy('sv.viewed_at', 'DESC')
            .select([
            'sv.viewer_id AS viewer_id',
            'sv.viewed_at AS viewed_at',
            'u.display_name AS display_name',
            'u.avatar_url AS avatar_url',
        ])
            .getRawMany();
        return rows;
    }
    async remove(userId, statusId) {
        const status = await this.su.findOne({ where: { id: statusId } });
        if (!status)
            throw new common_1.NotFoundException('Status not found');
        if (status.user_id !== userId)
            throw new common_1.ForbiddenException('Cannot delete others statuses');
        await this.su.delete({ id: statusId });
        return { ok: true };
    }
    async setPrivacy(userId, statusId, hideFrom) {
        const status = await this.su.findOne({ where: { id: statusId } });
        if (!status)
            throw new common_1.NotFoundException('Status not found');
        if (status.user_id !== userId)
            throw new common_1.ForbiddenException();
        await this.hidden.delete({ status_id: statusId });
        if (hideFrom.length) {
            await this.hidden.save(hideFrom.map((uid) => this.hidden.create({
                status_id: statusId,
                user_id: uid,
            })));
        }
        return { ok: true };
    }
};
exports.StatusService = StatusService;
exports.StatusService = StatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.StatusUpdate)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StatusView)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.StatusHiddenFrom)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Contact)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], StatusService);
//# sourceMappingURL=status.service.js.map