import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Conversation,
  ConversationParticipant,
  User,
} from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';

export interface CreateGroupDto {
  name: string;
  description?: string;
  avatar_url?: string;
  member_ids: string[];
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
  avatar_url?: string;
  send_permission?: 'all' | 'admins';
  edit_permission?: 'all' | 'admins';
}

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Conversation) private readonly convs: Repository<Conversation>,
    @InjectRepository(ConversationParticipant) private readonly parts: Repository<ConversationParticipant>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly gateway: RealtimeGateway,
  ) {}

  // ---------- helpers ----------
  private async getMe(userId: string, groupId: string) {
    const me = await this.parts.findOne({
      where: { conversation_id: groupId, user_id: userId },
    });
    if (!me) throw new ForbiddenException('Not a member of this group');
    return me;
  }

  private async assertAdmin(userId: string, groupId: string) {
    const me = await this.getMe(userId, groupId);
    if (me.role !== 'admin') throw new ForbiddenException('Admins only');
    return me;
  }

  private async loadGroup(groupId: string) {
    const g = await this.convs.findOne({ where: { id: groupId, type: 'group' } });
    if (!g) throw new NotFoundException('Group not found');
    return g;
  }

  // ---------- CRUD ----------
  async list(userId: string) {
    const parts = await this.convs.manager.query(
      `SELECT
        cp.role,
        cp.is_muted,
        cp.is_pinned,
        cp.unread_count,
        c.id,
        COALESCE(comm.name, c.name) AS name,
        c.description,
        c.avatar_url,
        c.created_by,
        c.send_permission,
        c.edit_permission,
        c.community_id,
        c.last_message_at,
        c.last_message_preview
      FROM public.conversation_participants cp
      INNER JOIN public.conversations c ON c.id = cp.conversation_id
      LEFT JOIN public.communities comm ON comm.id = c.community_id
      WHERE cp.user_id = $1
        AND c.type = 'group'
      ORDER BY c.last_message_at DESC`,
      [userId],
    );

    // attach member_count
    const result = [];
    for (const row of parts) {
      const memberCount = await this.parts.count({
        where: { conversation_id: row.id },
      });
      result.push({ ...row, member_count: memberCount });
    }
    return result;
  }

  async get(userId: string, groupId: string) {
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

  async create(userId: string, dto: CreateGroupDto) {
    if (!dto.name?.trim()) throw new BadRequestException('Group name required');
    if (!dto.member_ids?.length)
      throw new BadRequestException('Add at least one member');

    const ids = Array.from(new Set([userId, ...dto.member_ids]));
    const existingUsers = await this.users.find({ where: { id: In(ids) } });
    if (existingUsers.length !== ids.length)
      throw new BadRequestException('One or more members not found');

    const group = await this.convs.save(
      this.convs.create({
        type: 'group',
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        avatar_url: dto.avatar_url || null,
        created_by: userId,
        send_permission: 'all',
        edit_permission: 'all',
      }),
    );

    await this.parts.save(
      ids.map((uid) =>
        this.parts.create({
          conversation_id: group.id,
          user_id: uid,
          role: uid === userId ? 'admin' : 'member',
        }),
      ),
    );

    // realtime: join sockets to the new room
    ids.forEach((uid) =>
      this.gateway.addUserToConversationRoom(uid, group.id),
    );
    ids.forEach((uid) =>
      this.gateway.emitToUser(uid, 'group:created', { group_id: group.id }),
    );

    return this.get(userId, group.id);
  }

  async update(userId: string, groupId: string, dto: UpdateGroupDto) {
    const me = await this.getMe(userId, groupId);
    const g = await this.loadGroup(groupId);
    if (g.edit_permission === 'admins' && me.role !== 'admin') {
      throw new ForbiddenException('Only admins can edit group info');
    }
    const patch: Partial<Conversation> = {};
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.description !== undefined) patch.description = dto.description;
    if (dto.avatar_url !== undefined) patch.avatar_url = dto.avatar_url;
    // permission changes require admin
    if (dto.send_permission || dto.edit_permission) {
      if (me.role !== 'admin')
        throw new ForbiddenException('Only admins can change permissions');
      if (dto.send_permission) patch.send_permission = dto.send_permission;
      if (dto.edit_permission) patch.edit_permission = dto.edit_permission;
    }
    await this.convs.update({ id: groupId }, patch);
    this.gateway.emitToConversation(groupId, 'group:updated', { group_id: groupId });
    return this.get(userId, groupId);
  }

  // ---------- members ----------
  async addMembers(userId: string, groupId: string, memberIds: string[]) {
    await this.assertAdmin(userId, groupId);
    const existing = await this.parts.find({
      where: { conversation_id: groupId, user_id: In(memberIds) },
    });
    const existingSet = new Set(existing.map((p) => p.user_id));
    const toAdd = memberIds.filter((id) => !existingSet.has(id));
    if (!toAdd.length) return { ok: true, added: 0 };

    await this.parts.save(
      toAdd.map((uid) =>
        this.parts.create({
          conversation_id: groupId,
          user_id: uid,
          role: 'member',
        }),
      ),
    );
    toAdd.forEach((uid) => this.gateway.addUserToConversationRoom(uid, groupId));
    this.gateway.emitToConversation(groupId, 'group:member-added', {
      group_id: groupId,
      user_ids: toAdd,
    });
    return { ok: true, added: toAdd.length };
  }

  async removeMember(userId: string, groupId: string, targetId: string) {
    await this.assertAdmin(userId, groupId);
    if (targetId === userId)
      throw new BadRequestException('Use leave endpoint to remove yourself');
    await this.parts.delete({ conversation_id: groupId, user_id: targetId });
    this.gateway.emitToConversation(groupId, 'group:member-removed', {
      group_id: groupId,
      user_id: targetId,
    });
    return { ok: true };
  }

  async leave(userId: string, groupId: string) {
    const me = await this.getMe(userId, groupId);
    // If last admin is leaving, promote another member
    if (me.role === 'admin') {
      const otherAdmin = await this.parts.findOne({
        where: { conversation_id: groupId, role: 'admin' },
      });
      if (otherAdmin?.user_id === userId) {
        const candidate = await this.parts.findOne({
          where: { conversation_id: groupId, role: 'member' },
        });
        if (candidate) {
          await this.parts.update(
            { id: candidate.id },
            { role: 'admin' },
          );
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

  async setRole(userId: string, groupId: string, targetId: string, role: 'admin' | 'member') {
    await this.assertAdmin(userId, groupId);
    await this.parts.update(
      { conversation_id: groupId, user_id: targetId },
      { role },
    );
    this.gateway.emitToConversation(groupId, 'group:role-changed', {
      group_id: groupId,
      user_id: targetId,
      role,
    });
    return { ok: true };
  }

  async canSend(userId: string, groupId: string): Promise<boolean> {
    const me = await this.parts.findOne({
      where: { conversation_id: groupId, user_id: userId },
    });
    if (!me) return false;
    const g = await this.convs.findOne({ where: { id: groupId } });
    if (!g) return false;
    if (g.send_permission === 'admins' && me.role !== 'admin') return false;
    return true;
  }
}