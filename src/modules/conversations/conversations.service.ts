import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { BlockedUser, Conversation, ConversationParticipant, User, ArchivedConversation } from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation) private readonly convs: Repository<Conversation>,
    @InjectRepository(ConversationParticipant) private readonly parts: Repository<ConversationParticipant>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(ArchivedConversation) private readonly arch: Repository<ArchivedConversation>,
    @InjectRepository(BlockedUser) private readonly blocks: Repository<BlockedUser>,
    private readonly ds: DataSource,
    private readonly gateway: RealtimeGateway,
  ) {}

  /** List all conversations for a user, with the other participant's profile embedded. */
  async list(userId: string) {
    const rows = await this.ds.query(
      `SELECT
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
      ORDER BY cp.is_pinned DESC, c.last_message_at DESC`,
      [userId],
    );

    const archivedRows = await this.arch.find({ where: { user_id: userId } });
    const archivedSet = new Set(archivedRows.map(a => a.conversation_id));

    // For each conv get participants (with profile)
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

  async getOne(userId: string, conversationId: string) {
    const me = await this.parts.findOne({
      where: { conversation_id: conversationId, user_id: userId },
    });
    if (!me) throw new ForbiddenException('Not a participant');

    const conv = await this.convs.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');

    // If this conversation belongs to a community, show the community name
    let displayName = conv.name;
    if (conv.community_id) {
      const communityRow = await this.ds.query(
        'SELECT name FROM public.communities WHERE id = $1 LIMIT 1',
        [conv.community_id],
      );
      if (communityRow?.[0]?.name) displayName = communityRow[0].name;
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

  async getOrCreate1on1(userId: string, otherUserId: string) {
    if (userId === otherUserId) throw new BadRequestException('Cannot chat with yourself');

    const existing = await this.ds.query(
      `SELECT c.id FROM public.conversations c
       INNER JOIN public.conversation_participants p1 ON p1.conversation_id = c.id AND p1.user_id = $1
       INNER JOIN public.conversation_participants p2 ON p2.conversation_id = c.id AND p2.user_id = $2
       WHERE c.type = '1on1' LIMIT 1`,
      [userId, otherUserId],
    );

    let convId: string;
    if (existing.length) {
      convId = existing[0].id;
      // Unhide for the creator
      await this.parts.update(
        { conversation_id: convId, user_id: userId },
        { is_hidden: false },
      );
    } else {
      const c = await this.convs.save(this.convs.create({ type: '1on1' }));
      convId = c.id;
      await this.parts.save([
        this.parts.create({ conversation_id: convId, user_id: userId }),
        this.parts.create({ conversation_id: convId, user_id: otherUserId }),
      ]);
      // Force any currently connected sockets to join the new room so they can receive future messages instantly
      this.gateway.addUserToConversationRoom(userId, convId);
      this.gateway.addUserToConversationRoom(otherUserId, convId);
    }

    return this.getOne(userId, convId);
  }

  async markRead(userId: string, conversationId: string) {
    await this.parts.update(
      { conversation_id: conversationId, user_id: userId },
      { unread_count: 0, last_read_at: new Date() },
    );
    this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
    return { ok: true };
  }

  async setPin(userId: string, conversationId: string, pin: boolean) {
    await this.parts.update(
      { conversation_id: conversationId, user_id: userId },
      { is_pinned: pin, pinned_at: pin ? new Date() : null },
    );
    this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
    return { ok: true };
  }

  async setMute(userId: string, conversationId: string, mute: boolean, until?: Date) {
    await this.parts.update(
      { conversation_id: conversationId, user_id: userId },
      { is_muted: mute, mute_until: until || null },
    );
    this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
    return { ok: true };
  }

  async archive(userId: string, conversationId: string, archived: boolean) {
    if (archived) {
      await this.arch.save(
        this.arch.create({ user_id: userId, conversation_id: conversationId }),
      );
    } else {
      await this.arch.delete({ user_id: userId, conversation_id: conversationId });
    }
    this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
    return { ok: true };
  }

  async listArchived(userId: string) {
    const rows = await this.arch.find({ where: { user_id: userId } });
    if (!rows.length) return [];
    const ids = rows.map((r) => r.conversation_id);
    const all = await this.list(userId);
    return all.filter((c) => ids.includes(c.id));
  }

  async clear(userId: string, conversationId: string) {
    await this.parts.update(
      { conversation_id: conversationId, user_id: userId },
      { cleared_at: new Date() },
    );
    this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
    return { ok: true };
  }

  /** Hide the chat from my list (WhatsApp "Delete chat"). */
  async hide(userId: string, conversationId: string) {
    await this.parts.update(
      { conversation_id: conversationId, user_id: userId },
      { is_hidden: true, cleared_at: new Date(), unread_count: 0 },
    );
    this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
    return { ok: true };
  }

  async lock(userId: string, conversationId: string, pin: string) {
    if (!/^\d{4,6}$/.test(pin)) throw new BadRequestException('PIN must be 4–6 digits');
    const hash = await bcrypt.hash(pin, 8);
    await this.parts.update(
      { conversation_id: conversationId, user_id: userId },
      { lock_pin: hash },
    );
    this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
    return { ok: true };
  }

  async unlock(userId: string, conversationId: string, pin: string) {
    const me = await this.parts.findOne({
      where: { conversation_id: conversationId, user_id: userId },
    });
    if (!me || !me.lock_pin) return { ok: true };
    const ok = await bcrypt.compare(pin, me.lock_pin);
    if (!ok) throw new BadRequestException('Incorrect PIN');
    return { ok: true };
  }

  async removeLock(userId: string, conversationId: string, pin: string) {
    const me = await this.parts.findOne({
      where: { conversation_id: conversationId, user_id: userId },
    });
    if (!me || !me.lock_pin) return { ok: true };
    const ok = await bcrypt.compare(pin, me.lock_pin);
    if (!ok) throw new BadRequestException('Incorrect PIN');
    await this.parts.update(
      { conversation_id: conversationId, user_id: userId },
      { lock_pin: null },
    );
    this.gateway.emitToUser(userId, 'conversation:update', { conversation_id: conversationId });
    return { ok: true };
  }

  async setDisappearingTimer(userId: string, conversationId: string, seconds: number | null) {
    await this.assertParticipant(userId, conversationId);
    await this.convs.update({ id: conversationId }, { disappearing_timer: seconds });
    return { ok: true };
  }

  async assertParticipant(userId: string, conversationId: string) {
    const p = await this.parts.findOne({
      where: { conversation_id: conversationId, user_id: userId },
    });
    if (!p) throw new ForbiddenException('Not a participant');
    return p;
  }

  // ---------- group helpers (minimal, future-extensible) ----------
  async createGroup(userId: string, dto: { name: string; member_ids: string[]; avatar_url?: string }) {
    if (!dto.name?.trim()) throw new BadRequestException('Group name required');
    if (!dto.member_ids?.length) throw new BadRequestException('At least one member required');

    const conv = await this.convs.save(
      this.convs.create({
        type: 'group',
        name: dto.name.trim(),
        avatar_url: dto.avatar_url || null,
        created_by: userId,
      }),
    );

    const memberIds = Array.from(new Set([userId, ...dto.member_ids]));
    await this.parts.save(
      memberIds.map((uid) =>
        this.parts.create({
          conversation_id: conv.id,
          user_id: uid,
          role: uid === userId ? 'admin' : 'member',
        }),
      ),
    );

    return this.getOne(userId, conv.id);
  }
}