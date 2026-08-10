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
exports.RealtimeGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const socket_io_1 = require("socket.io");
const entities_1 = require("../../entities");
let RealtimeGateway = class RealtimeGateway {
    jwt;
    config;
    users;
    participants;
    instituteMembers;
    server;
    logger = new common_1.Logger("RealtimeGateway");
    userSockets = new Map();
    meetingParticipants = new Map();
    constructor(jwt, config, users, participants, instituteMembers) {
        this.jwt = jwt;
        this.config = config;
        this.users = users;
        this.participants = participants;
        this.instituteMembers = instituteMembers;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "") ||
                client.handshake.query?.token;
            if (!token)
                throw new common_1.UnauthorizedException("No token");
            const payload = this.jwt.verify(token, {
                secret: this.config.get("JWT_SECRET"),
            });
            const user = await this.users.findOne({ where: { id: payload.sub } });
            if (!user)
                throw new common_1.UnauthorizedException("User not found");
            client.userId = user.id;
            client.join(`user:${user.id}`);
            if (!this.userSockets.has(user.id))
                this.userSockets.set(user.id, new Set());
            this.userSockets.get(user.id).add(client.id);
            const parts = await this.participants.find({
                where: { user_id: user.id },
            });
            for (const p of parts)
                client.join(`conv:${p.conversation_id}`);
            const instituteMemberships = await this.instituteMembers.find({
                where: { user_id: user.id, status: "active" },
            });
            for (const m of instituteMemberships) {
                client.join(`institute:${m.institute_id}`);
                this.logger.log(`User ${user.id} auto-joined institute:${m.institute_id}`);
            }
            await this.users.update({ id: user.id }, { is_online: true, last_seen: new Date() });
            this.broadcastPresence(user.id, true);
            this.logger.log(`🔌 ${user.id} connected (${client.id})`);
        }
        catch (e) {
            this.logger.warn(`Rejected socket: ${e?.message || e}`);
            client.disconnect(true);
        }
    }
    async handleDisconnect(client) {
        const uid = client.userId;
        if (!uid)
            return;
        for (const [meetingId, members] of this.meetingParticipants.entries()) {
            if (!members.has(uid))
                continue;
            members.delete(uid);
            client.to(`meeting:${meetingId}`).emit("meeting:participant-left", {
                meeting_id: meetingId,
                user_id: uid,
            });
            if (members.size === 0)
                this.meetingParticipants.delete(meetingId);
        }
        const set = this.userSockets.get(uid);
        if (set) {
            set.delete(client.id);
            if (set.size === 0) {
                this.userSockets.delete(uid);
                await this.users.update({ id: uid }, { is_online: false, last_seen: new Date() });
                this.broadcastPresence(uid, false);
            }
        }
        this.logger.log(`❌ ${uid} disconnected (${client.id})`);
    }
    joinConv(client, data) {
        if (data?.conversation_id)
            client.join(`conv:${data.conversation_id}`);
        return { ok: true };
    }
    leaveConv(client, data) {
        if (data?.conversation_id)
            client.leave(`conv:${data.conversation_id}`);
        return { ok: true };
    }
    joinInstitute(client, data) {
        if (data?.institute_id)
            client.join(`institute:${data.institute_id}`);
        return { ok: true };
    }
    leaveInstitute(client, data) {
        if (data?.institute_id)
            client.leave(`institute:${data.institute_id}`);
        return { ok: true };
    }
    typing(client, data) {
        if (!client.userId || !data?.conversation_id)
            return;
        client.to(`conv:${data.conversation_id}`).emit("typing", {
            user_id: client.userId,
            conversation_id: data.conversation_id,
            is_typing: !!data.is_typing,
        });
    }
    callSignal(client, data) {
        if (!data?.to)
            return;
        this.server.to(`user:${data.to}`).emit("call:signal", {
            from: client.userId,
            payload: data.payload,
        });
    }
    joinMeeting(client, data) {
        if (!client.userId || !data?.meeting_id)
            return { ok: false };
        const roomName = `meeting:${data.meeting_id}`;
        client.join(roomName);
        if (!this.meetingParticipants.has(data.meeting_id)) {
            this.meetingParticipants.set(data.meeting_id, new Set());
        }
        const users = this.meetingParticipants.get(data.meeting_id);
        const existingParticipants = Array.from(users).filter((userId) => userId !== client.userId);
        users.add(client.userId);
        client.to(roomName).emit("meeting:participant-joined", {
            meeting_id: data.meeting_id,
            user_id: client.userId,
        });
        return {
            ok: true,
            participants: existingParticipants,
        };
    }
    leaveMeeting(client, data) {
        if (!client.userId || !data?.meeting_id)
            return { ok: false };
        const roomName = `meeting:${data.meeting_id}`;
        client.leave(roomName);
        const users = this.meetingParticipants.get(data.meeting_id);
        if (users) {
            users.delete(client.userId);
            if (users.size === 0)
                this.meetingParticipants.delete(data.meeting_id);
        }
        client.to(roomName).emit("meeting:participant-left", {
            meeting_id: data.meeting_id,
            user_id: client.userId,
        });
        return { ok: true };
    }
    meetingSignal(client, data) {
        if (!client.userId || !data?.to || !data?.meeting_id)
            return;
        this.server.to(`user:${data.to}`).emit("meeting:signal", {
            from: client.userId,
            meeting_id: data.meeting_id,
            signal: data.signal,
        });
    }
    joinTeam(client, data) {
        if (!client.userId || !data?.team_id)
            return { ok: false };
        const roomName = `team:${data.team_id}`;
        client.join(roomName);
        this.logger.log(`User ${client.userId} joined team room: ${roomName}`);
        return { ok: true };
    }
    joinOrganization(client, data) {
        if (!client.userId || !data?.organization_id)
            return { ok: false };
        const roomName = `org:${data.organization_id}`;
        client.join(roomName);
        this.logger.log(`User ${client.userId} joined organization room: ${roomName}`);
        return { ok: true };
    }
    leaveOrganization(client, data) {
        if (!client.userId || !data?.organization_id)
            return { ok: false };
        const roomName = `org:${data.organization_id}`;
        client.leave(roomName);
        this.logger.log(`User ${client.userId} left organization room: ${roomName}`);
        return { ok: true };
    }
    async meetingStart(client, data) {
        if (!client.userId || !data?.meeting_id || !data?.team_id) {
            return { ok: false };
        }
        this.logger.log(`Meeting started: ${data.meeting_id} by user ${client.userId}`);
        const user = await this.users.findOne({ where: { id: client.userId } });
        const userName = user?.display_name || "Someone";
        const teamRoom = `team:${data.team_id}`;
        this.server.to(teamRoom).emit("meeting:started", {
            meeting: {
                id: data.meeting_id,
                organization_id: data.organization_id,
                team_id: data.team_id,
                title: "Team Meeting",
                call_type: "video",
                started_by: client.userId,
                started_by_name: userName,
            },
        });
        this.logger.log(`Broadcasted meeting:started to ${teamRoom}`);
        return { ok: true };
    }
    emitToConversation(conversationId, event, payload) {
        this.server.to(`conv:${conversationId}`).emit(event, payload);
    }
    emitToUser(userId, event, payload) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }
    emitToUsers(userIds, event, payload) {
        for (const uid of userIds)
            this.emitToUser(uid, event, payload);
    }
    emitToOrganization(organizationId, event, payload) {
        this.server.to(`org:${organizationId}`).emit(event, payload);
    }
    emitToInstitute(instituteId, event, payload) {
        this.server.to(`institute:${instituteId}`).emit(event, payload);
    }
    emitToTeam(teamId, event, payload) {
        this.server.to(`team:${teamId}`).emit(event, payload);
    }
    addUserToConversationRoom(userId, conversationId) {
        const socketIds = this.userSockets.get(userId);
        if (!socketIds)
            return;
        for (const sid of socketIds) {
            const sock = this.server.sockets.sockets.get(sid);
            if (sock)
                sock.join(`conv:${conversationId}`);
        }
    }
    addUserToInstituteRoom(userId, instituteId) {
        const socketIds = this.userSockets.get(userId);
        if (!socketIds)
            return;
        for (const sid of socketIds) {
            const sock = this.server.sockets.sockets.get(sid);
            if (sock) {
                sock.join(`institute:${instituteId}`);
                this.logger.log(`Added user ${userId} to institute:${instituteId} room`);
            }
        }
    }
    removeUserFromInstituteRoom(userId, instituteId) {
        const socketIds = this.userSockets.get(userId);
        if (!socketIds)
            return;
        for (const sid of socketIds) {
            const sock = this.server.sockets.sockets.get(sid);
            if (sock) {
                sock.leave(`institute:${instituteId}`);
                this.logger.log(`Removed user ${userId} from institute:${instituteId} room`);
            }
        }
    }
    broadcastPresence(userId, online) {
        this.server.emit("presence:update", {
            user_id: userId,
            is_online: online,
            last_seen: new Date().toISOString(),
        });
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("conversation:join"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "joinConv", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("conversation:leave"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "leaveConv", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("institute:join"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "joinInstitute", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("institute:leave"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "leaveInstitute", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("typing"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "typing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("call:signal"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "callSignal", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("meeting:join"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "joinMeeting", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("meeting:leave"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "leaveMeeting", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("meeting:signal"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "meetingSignal", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("join:team"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "joinTeam", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("join:organization"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "joinOrganization", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leave:organization"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "leaveOrganization", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("meeting:start"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "meetingStart", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: true, credentials: true },
        transports: ["websocket", "polling"],
    }),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.ConversationParticipant)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.InstituteMember)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map