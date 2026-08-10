import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import {
  BlockedUser,
  Conversation,
  ConversationParticipant,
  Message,
  MessageReaction,
  MessageRead,
  MessageType,
  PinnedMessage,
  StarredMessage,
  UserDeletedMessage,
} from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BlocksService } from '../blocks/blocks.service';

export interface SendMessageDto {
  conversation_id: string;
  type?: MessageType;
  content?: string;
  media_url?: string;
  media_mime_type?: string;
  media_size?: number;
  media_duration?: number;
  media_thumbnail?: string;
  media_filename?: string;
  media_width?: number;
  media_height?: number;
  location_lat?: number;
  location_lng?: number;
  location_name?: string;
  reply_to_id?: string;
  is_forwarded?: boolean;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly messages: Repository<Message>,
    @InjectRepository(MessageRead) private readonly reads: Repository<MessageRead>,
    @InjectRepository(MessageReaction)
    private readonly reactions: Repository<MessageReaction>,
    @InjectRepository(PinnedMessage) private readonly pins: Repository<PinnedMessage>,
    @InjectRepository(StarredMessage) private readonly stars: Repository<StarredMessage>,
    @InjectRepository(UserDeletedMessage)
    private readonly userDeleted: Repository<UserDeletedMessage>,
    @InjectRepository(ConversationParticipant)
    private readonly parts: Repository<ConversationParticipant>,
    @InjectRepository(Conversation)
    private readonly convs: Repository<Conversation>,
    @InjectRepository(BlockedUser) private readonly blocks: Repository<BlockedUser>,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly gateway: RealtimeGateway,
    private readonly blocksSvc: BlocksService,
  ) {}

  private async assertParticipant(userId: string, conversationId: string) {
    const p = await this.parts.findOne({
      where: { conversation_id: conversationId, user_id: userId },
    });
    if (!p) throw new ForbiddenException('Not a participant');
    return p;
  }

  /** Fetch messages for a conversation, applying "cleared_at" and "user_deleted_messages". */
  async list(userId: string, conversationId: string, limit = 200) {
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

    // Filter out messages soft-deleted by this user
    const deleted = await this.userDeleted.find({
      where: { user_id: userId, message_id: In(all.map((m) => m.id)) },
    });
    const deletedSet = new Set(deleted.map((d) => d.message_id));
    const filtered = all.filter((m) => !deletedSet.has(m.id));

    // Attach reactions and reads for these messages
    const ids = filtered.map((m) => m.id);
    const [reactions, reads] = await Promise.all([
      ids.length
        ? this.reactions.find({ where: { message_id: In(ids) } })
        : Promise.resolve([] as MessageReaction[]),
      ids.length
        ? this.reads.find({ where: { message_id: In(ids) } })
        : Promise.resolve([] as MessageRead[]),
    ]);

    return filtered.map((m) => ({
      ...m,
      reactions: reactions.filter((r) => r.message_id === m.id),
      reads: reads.filter((r) => r.message_id === m.id),
    }));
  }

  async send(userId: string, dto: SendMessageDto) {
    const me = await this.assertParticipant(userId, dto.conversation_id);

    // Group send-permission check (view-only groups / announcement channels)
    const conv = await this.convs.findOne({
      where: { id: dto.conversation_id },
    });
    if (conv?.type === 'group' && conv.send_permission === 'admins' && me.role !== 'admin') {
      throw new ForbiddenException('Only admins can send messages in this group');
    }

    // Block check (for 1on1 chats only)
    const participants = await this.parts.find({
      where: { conversation_id: dto.conversation_id },
    });
    if (conv?.type === '1on1') {
      const other = participants.find((p) => p.user_id !== userId);
      if (other) {
        const isBlocked = await this.blocksSvc.isBlocked(other.user_id, userId);
        const IBlockedThem = await this.blocksSvc.isBlocked(userId, other.user_id);
        if (isBlocked || IBlockedThem) {
          throw new ForbiddenException('Cannot send message: blocking is active');
        }
      }
    }

    // Disappearing timer: derive expires_at from conversation setting
    const expires_at: Date | null = null;

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

    // broadcast to conversation
    this.gateway.emitToConversation(dto.conversation_id, 'message:new', saved);

    return saved;
  }

  async edit(userId: string, messageId: string, content: string) {
    const m = await this.messages.findOne({ where: { id: messageId } });
    if (!m) throw new NotFoundException('Message not found');
    if (m.sender_id !== userId) throw new ForbiddenException('Not your message');

    await this.messages.update(
      { id: messageId },
      { content, is_edited: true },
    );
    const updated = await this.messages.findOne({ where: { id: messageId } });
    this.gateway.emitToConversation(m.conversation_id, 'message:update', updated);
    return updated;
  }

  async deleteForMe(userId: string, messageId: string) {
    await this.userDeleted.save(
      this.userDeleted.create({ user_id: userId, message_id: messageId }),
    );
    return { ok: true };
  }

  async deleteForEveryone(userId: string, messageId: string) {
    const m = await this.messages.findOne({ where: { id: messageId } });
    if (!m) throw new NotFoundException('Message not found');
    if (m.sender_id !== userId)
      throw new ForbiddenException('Only the sender can delete for everyone');

    await this.messages.update(
      { id: messageId },
      {
        is_deleted_for_everyone: true,
        deleted_at: new Date(),
        content: null,
        media_url: null,
      },
    );
    const updated = await this.messages.findOne({ where: { id: messageId } });
    this.gateway.emitToConversation(m.conversation_id, 'message:update', updated);
    return updated;
  }

  // ---------- Read receipts ----------
  async markRead(userId: string, messageIds: string[]) {
    if (!messageIds.length) return { ok: true };
    const rows = messageIds.map((id) =>
      this.reads.create({ message_id: id, user_id: userId }),
    );
    await this.reads
      .createQueryBuilder()
      .insert()
      .values(rows)
      .orIgnore()
      .execute();

    const msgs = await this.messages.find({ where: { id: In(messageIds) } });
    const cids = Array.from(new Set(msgs.map((m) => m.conversation_id)));
    const payload = {
      user_id: userId,
      message_ids: messageIds,
    };

    cids.forEach((cid) =>
      this.gateway.emitToConversation(cid, 'message:read', payload),
    );

    const senderIds = Array.from(
      new Set(msgs.map((m) => m.sender_id).filter((id): id is string => !!id && id !== userId)),
    );
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

  // ---------- Reactions ----------
  async react(userId: string, messageId: string, emoji: string | null) {
    const m = await this.messages.findOne({ where: { id: messageId } });
    if (!m) throw new NotFoundException('Message not found');

    if (!emoji) {
      await this.reactions.delete({ message_id: messageId, user_id: userId });
    } else {
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

  // ---------- Pins ----------
  async pin(userId: string, messageId: string) {
    const m = await this.messages.findOne({ where: { id: messageId } });
    if (!m) throw new NotFoundException('Message not found');
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

  async unpin(userId: string, conversationId: string) {
    await this.assertParticipant(userId, conversationId);
    await this.pins.delete({ conversation_id: conversationId });
    this.gateway.emitToConversation(conversationId, 'message:pinned', {
      conversation_id: conversationId,
      message_id: null,
    });
    return { ok: true };
  }

  async getPinned(userId: string, conversationId: string) {
    await this.assertParticipant(userId, conversationId);
    return this.pins.findOne({ where: { conversation_id: conversationId } });
  }

  // ---------- Stars ----------
  async star(userId: string, messageId: string, starred: boolean) {
    if (starred) {
      await this.stars
        .createQueryBuilder()
        .insert()
        .values({ user_id: userId, message_id: messageId })
        .orIgnore()
        .execute();
    } else {
      await this.stars.delete({ user_id: userId, message_id: messageId });
    }
    return { ok: true };
  }

  async listStarred(userId: string) {
    const rows = await this.stars.find({ where: { user_id: userId } });
    if (!rows.length) return [];
    const ids = rows.map((r) => r.message_id);
    return this.messages.find({
      where: { id: In(ids) },
      order: { created_at: 'DESC' },
    });
  }

  async listStarredIds(userId: string, conversationId?: string) {
    const rows = await this.stars.find({ where: { user_id: userId } });
    if (!conversationId) return rows.map((r) => r.message_id);
    const ids = rows.map((r) => r.message_id);
    if (!ids.length) return [];
    const msgs = await this.messages.find({ where: { id: In(ids) } });
    return msgs
      .filter((m) => m.conversation_id === conversationId)
      .map((m) => m.id);
  }

  // ---------- Forward ----------
  async forward(
    userId: string,
    messageId: string,
    targetConversationIds: string[],
  ) {
    const src = await this.messages.findOne({ where: { id: messageId } });
    if (!src) throw new NotFoundException('Source message not found');

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

    await this.messages.update(
      { id: messageId },
      { forward_count: (src.forward_count || 0) + targetConversationIds.length },
    );

    return results;
  }

  // ---------- Search ----------
  async search(userId: string, q: string, conversationId?: string) {
    if (!q?.trim()) return [];
    const qb = this.messages
      .createQueryBuilder('m')
      .innerJoin(
        'conversation_participants',
        'cp',
        'cp.conversation_id = m.conversation_id AND cp.user_id = :uid',
        { uid: userId },
      )
      .where('m.content ILIKE :q', { q: `%${q}%` })
      .andWhere('m.is_deleted_for_everyone = false')
      .orderBy('m.created_at', 'DESC')
      .limit(100);

    if (conversationId) qb.andWhere('m.conversation_id = :cid', { cid: conversationId });
    return qb.getMany();
  }
}