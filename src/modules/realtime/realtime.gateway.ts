import { Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Server, Socket } from "socket.io";
import { ConversationParticipant, User, InstituteMember } from "../../entities";

interface AuthedSocket extends Socket {
  userId?: string;
}

/**
 * WeConnect Socket.IO gateway.
 *
 * Rooms:
 *   user:<userId>              – private room for a specific user
 *   conv:<conversationId>      – room for all participants of a conversation
 *
 * Emitted events (server → client):
 *   message:new, message:update, message:read, message:reaction, message:pinned
 *   typing, presence:update
 *   conversation:update, conversation:new
 *   call:incoming, call:outgoing, call:update
 *   status:new, status:viewed
 */
@WebSocketGateway({
  cors: { origin: true, credentials: true },
  transports: ["websocket", "polling"],
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger("RealtimeGateway");

  /** userId → Set<socketId> */
  private readonly userSockets = new Map<string, Set<string>>();
  /** meetingId → Set<userId> */
  private readonly meetingParticipants = new Map<string, Set<string>>();

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(ConversationParticipant)
    private readonly participants: Repository<ConversationParticipant>,
    @InjectRepository(InstituteMember)
    private readonly instituteMembers: Repository<InstituteMember>,
  ) {}

  // ---------------------------------------------------------------------------
  // Connection lifecycle
  // ---------------------------------------------------------------------------
  async handleConnection(client: AuthedSocket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.headers?.authorization as string)?.replace(
          /^Bearer\s+/i,
          "",
        ) ||
        (client.handshake.query?.token as string);

      if (!token) throw new UnauthorizedException("No token");

      const payload = this.jwt.verify<{ sub: string; phone: string }>(token, {
        secret: this.config.get<string>("JWT_SECRET"),
      });

      const user = await this.users.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException("User not found");

      client.userId = user.id;
      client.join(`user:${user.id}`);

      // Register socket
      if (!this.userSockets.has(user.id))
        this.userSockets.set(user.id, new Set());
      this.userSockets.get(user.id)!.add(client.id);

      // Join every conversation the user is part of
      const parts = await this.participants.find({
        where: { user_id: user.id },
      });
      for (const p of parts) client.join(`conv:${p.conversation_id}`);

      // Join every institute the user is a member of
      const instituteMemberships = await this.instituteMembers.find({
        where: { user_id: user.id, status: "active" },
      });
      for (const m of instituteMemberships) {
        client.join(`institute:${m.institute_id}`);
        this.logger.log(`User ${user.id} auto-joined institute:${m.institute_id}`);
      }

      // Mark online
      await this.users.update(
        { id: user.id },
        { is_online: true, last_seen: new Date() },
      );
      this.broadcastPresence(user.id, true);

      this.logger.log(`🔌 ${user.id} connected (${client.id})`);
    } catch (e: any) {
      this.logger.warn(`Rejected socket: ${e?.message || e}`);
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: AuthedSocket) {
    const uid = client.userId;
    if (!uid) return;

    for (const [meetingId, members] of this.meetingParticipants.entries()) {
      if (!members.has(uid)) continue;
      members.delete(uid);
      client.to(`meeting:${meetingId}`).emit("meeting:participant-left", {
        meeting_id: meetingId,
        user_id: uid,
      });
      if (members.size === 0) this.meetingParticipants.delete(meetingId);
    }

    const set = this.userSockets.get(uid);
    if (set) {
      set.delete(client.id);
      if (set.size === 0) {
        this.userSockets.delete(uid);
        // Mark offline
        await this.users.update(
          { id: uid },
          { is_online: false, last_seen: new Date() },
        );
        this.broadcastPresence(uid, false);
      }
    }
    this.logger.log(`❌ ${uid} disconnected (${client.id})`);
  }

  // ---------------------------------------------------------------------------
  // Subscriptions (client → server)
  // ---------------------------------------------------------------------------
  @SubscribeMessage("conversation:join")
  joinConv(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { conversation_id: string },
  ) {
    if (data?.conversation_id) client.join(`conv:${data.conversation_id}`);
    return { ok: true };
  }

  @SubscribeMessage("conversation:leave")
  leaveConv(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { conversation_id: string },
  ) {
    if (data?.conversation_id) client.leave(`conv:${data.conversation_id}`);
    return { ok: true };
  }

  @SubscribeMessage("institute:join")
  joinInstitute(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { institute_id: string },
  ) {
    if (data?.institute_id) client.join(`institute:${data.institute_id}`);
    return { ok: true };
  }

  @SubscribeMessage("institute:leave")
  leaveInstitute(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { institute_id: string },
  ) {
    if (data?.institute_id) client.leave(`institute:${data.institute_id}`);
    return { ok: true };
  }

  @SubscribeMessage("typing")
  typing(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { conversation_id: string; is_typing: boolean },
  ) {
    if (!client.userId || !data?.conversation_id) return;
    client.to(`conv:${data.conversation_id}`).emit("typing", {
      user_id: client.userId,
      conversation_id: data.conversation_id,
      is_typing: !!data.is_typing,
    });
  }

  @SubscribeMessage("call:signal")
  callSignal(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { to: string; payload: any },
  ) {
    if (!data?.to) return;
    this.server.to(`user:${data.to}`).emit("call:signal", {
      from: client.userId,
      payload: data.payload,
    });
  }

  @SubscribeMessage("meeting:join")
  joinMeeting(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { meeting_id: string },
  ) {
    if (!client.userId || !data?.meeting_id) return { ok: false };

    const roomName = `meeting:${data.meeting_id}`;
    client.join(roomName);

    if (!this.meetingParticipants.has(data.meeting_id)) {
      this.meetingParticipants.set(data.meeting_id, new Set());
    }

    const users = this.meetingParticipants.get(data.meeting_id)!;
    const existingParticipants = Array.from(users).filter(
      (userId) => userId !== client.userId,
    );
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

  @SubscribeMessage("meeting:leave")
  leaveMeeting(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { meeting_id: string },
  ) {
    if (!client.userId || !data?.meeting_id) return { ok: false };

    const roomName = `meeting:${data.meeting_id}`;
    client.leave(roomName);

    const users = this.meetingParticipants.get(data.meeting_id);
    if (users) {
      users.delete(client.userId);
      if (users.size === 0) this.meetingParticipants.delete(data.meeting_id);
    }

    client.to(roomName).emit("meeting:participant-left", {
      meeting_id: data.meeting_id,
      user_id: client.userId,
    });

    return { ok: true };
  }

  @SubscribeMessage("meeting:signal")
  meetingSignal(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody()
    data: { meeting_id: string; to: string; signal: any },
  ) {
    if (!client.userId || !data?.to || !data?.meeting_id) return;
    this.server.to(`user:${data.to}`).emit("meeting:signal", {
      from: client.userId,
      meeting_id: data.meeting_id,
      signal: data.signal,
    });
  }

  @SubscribeMessage("join:team")
  joinTeam(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { team_id: string; organization_id: string },
  ) {
    if (!client.userId || !data?.team_id) return { ok: false };

    const roomName = `team:${data.team_id}`;
    client.join(roomName);

    this.logger.log(`User ${client.userId} joined team room: ${roomName}`);

    return { ok: true };
  }

  @SubscribeMessage("join:organization")
  joinOrganization(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { organization_id: string },
  ) {
    if (!client.userId || !data?.organization_id) return { ok: false };

    const roomName = `org:${data.organization_id}`;
    client.join(roomName);

    this.logger.log(`User ${client.userId} joined organization room: ${roomName}`);

    return { ok: true };
  }

  @SubscribeMessage("leave:organization")
  leaveOrganization(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { organization_id: string },
  ) {
    if (!client.userId || !data?.organization_id) return { ok: false };

    const roomName = `org:${data.organization_id}`;
    client.leave(roomName);

    this.logger.log(`User ${client.userId} left organization room: ${roomName}`);

    return { ok: true };
  }

  @SubscribeMessage("meeting:start")
  async meetingStart(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody()
    data: { meeting_id: string; organization_id: string; team_id: string },
  ) {
    if (!client.userId || !data?.meeting_id || !data?.team_id) {
      return { ok: false };
    }

    this.logger.log(
      `Meeting started: ${data.meeting_id} by user ${client.userId}`,
    );

    // Get user info for the notification
    const user = await this.users.findOne({ where: { id: client.userId } });
    const userName = user?.display_name || "Someone";

    // Broadcast to all team members
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

  // ---------------------------------------------------------------------------
  // Public emitters (used by services)
  // ---------------------------------------------------------------------------
  emitToConversation(conversationId: string, event: string, payload: any) {
    this.server.to(`conv:${conversationId}`).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  emitToUsers(userIds: string[], event: string, payload: any) {
    for (const uid of userIds) this.emitToUser(uid, event, payload);
  }

  emitToOrganization(organizationId: string, event: string, payload: any) {
    this.server.to(`org:${organizationId}`).emit(event, payload);
  }

  emitToInstitute(instituteId: string, event: string, payload: any) {
    this.server.to(`institute:${instituteId}`).emit(event, payload);
  }

  emitToTeam(teamId: string, event: string, payload: any) {
    this.server.to(`team:${teamId}`).emit(event, payload);
  }

  /** Cause a user's active sockets to join a newly-created conversation room. */
  addUserToConversationRoom(userId: string, conversationId: string) {
    const socketIds = this.userSockets.get(userId);
    if (!socketIds) return;
    for (const sid of socketIds) {
      const sock = this.server.sockets.sockets.get(sid);
      if (sock) sock.join(`conv:${conversationId}`);
    }
  }

  /** Cause a user's active sockets to join an institute room. */
  addUserToInstituteRoom(userId: string, instituteId: string) {
    const socketIds = this.userSockets.get(userId);
    if (!socketIds) return;
    for (const sid of socketIds) {
      const sock = this.server.sockets.sockets.get(sid);
      if (sock) {
        sock.join(`institute:${instituteId}`);
        this.logger.log(`Added user ${userId} to institute:${instituteId} room`);
      }
    }
  }

  /** Remove a user's active sockets from an institute room. */
  removeUserFromInstituteRoom(userId: string, instituteId: string) {
    const socketIds = this.userSockets.get(userId);
    if (!socketIds) return;
    for (const sid of socketIds) {
      const sock = this.server.sockets.sockets.get(sid);
      if (sock) {
        sock.leave(`institute:${instituteId}`);
        this.logger.log(`Removed user ${userId} from institute:${instituteId} room`);
      }
    }
  }

  private broadcastPresence(userId: string, online: boolean) {
    this.server.emit("presence:update", {
      user_id: userId,
      is_online: online,
      last_seen: new Date().toISOString(),
    });
  }
}
