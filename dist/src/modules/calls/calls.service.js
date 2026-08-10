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
exports.CallsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let CallsService = class CallsService {
    calls;
    gateway;
    constructor(calls, gateway) {
        this.calls = calls;
        this.gateway = gateway;
    }
    async initiate(callerId, dto) {
        const call = await this.calls.save(this.calls.create({
            caller_id: callerId,
            callee_id: dto.callee_id,
            conversation_id: dto.conversation_id || null,
            type: dto.type,
            channel_name: (0, uuid_1.v4)(),
            status: 'ringing',
        }));
        this.gateway.emitToUser(dto.callee_id, 'call:incoming', call);
        this.gateway.emitToUser(callerId, 'call:outgoing', call);
        return call;
    }
    async updateStatus(userId, callId, status) {
        const c = await this.calls.findOne({ where: { id: callId } });
        if (!c)
            throw new common_1.NotFoundException();
        const patch = { status };
        if (status === 'active')
            patch.answered_at = new Date();
        if (['ended', 'missed', 'declined', 'failed'].includes(status)) {
            patch.ended_at = new Date();
            if (c.answered_at) {
                patch.duration_seconds = Math.floor((Date.now() - new Date(c.answered_at).getTime()) / 1000);
            }
        }
        await this.calls.update({ id: callId }, patch);
        const updated = await this.calls.findOne({ where: { id: callId } });
        [c.caller_id, c.callee_id].forEach((uid) => {
            if (uid)
                this.gateway.emitToUser(uid, 'call:update', updated);
        });
        return updated;
    }
    async history(userId) {
        return this.calls
            .createQueryBuilder('c')
            .where('c.caller_id = :uid OR c.callee_id = :uid', { uid: userId })
            .orderBy('c.created_at', 'DESC')
            .limit(100)
            .getMany();
    }
};
exports.CallsService = CallsService;
exports.CallsService = CallsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Call)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => realtime_gateway_1.RealtimeGateway))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], CallsService);
//# sourceMappingURL=calls.service.js.map