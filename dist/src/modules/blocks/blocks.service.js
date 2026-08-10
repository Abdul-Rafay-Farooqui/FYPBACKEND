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
exports.BlocksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let BlocksService = class BlocksService {
    blocks;
    reports;
    users;
    gateway;
    constructor(blocks, reports, users, gateway) {
        this.blocks = blocks;
        this.reports = reports;
        this.users = users;
        this.gateway = gateway;
    }
    async block(userId, targetId) {
        if (userId === targetId)
            throw new common_1.BadRequestException('Cannot block yourself');
        const exists = await this.blocks.findOne({
            where: { blocker_id: userId, blocked_id: targetId },
        });
        if (!exists) {
            await this.blocks.save(this.blocks.create({ blocker_id: userId, blocked_id: targetId }));
        }
        this.gateway.emitToUser(userId, 'block:update', { targetId, status: 'blocked' });
        this.gateway.emitToUser(targetId, 'block:update', { targetId: userId, status: 'blocked_by_other' });
        return { ok: true };
    }
    async unblock(userId, targetId) {
        await this.blocks.delete({ blocker_id: userId, blocked_id: targetId });
        this.gateway.emitToUser(userId, 'block:update', { targetId, status: 'unblocked' });
        this.gateway.emitToUser(targetId, 'block:update', { targetId: userId, status: 'unblocked_by_other' });
        return { ok: true };
    }
    async listBlocked(userId) {
        const rows = await this.blocks.find({ where: { blocker_id: userId } });
        if (!rows.length)
            return [];
        const ids = rows.map((r) => r.blocked_id);
        const users = await this.users
            .createQueryBuilder('u')
            .where('u.id IN (:...ids)', { ids })
            .getMany();
        return users.map((u) => ({
            id: u.id,
            display_name: u.display_name,
            phone: u.phone,
            avatar_url: u.avatar_url,
        }));
    }
    async isBlocked(blockerId, blockedId) {
        const row = await this.blocks.findOne({
            where: { blocker_id: blockerId, blocked_id: blockedId },
        });
        return !!row;
    }
    async report(userId, targetId, reason) {
        if (userId === targetId)
            throw new common_1.BadRequestException('Cannot report yourself');
        return this.reports.save(this.reports.create({
            reporter_id: userId,
            reported_id: targetId,
            reason: reason || null,
        }));
    }
};
exports.BlocksService = BlocksService;
exports.BlocksService = BlocksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.BlockedUser)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ReportedUser)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], BlocksService);
//# sourceMappingURL=blocks.service.js.map