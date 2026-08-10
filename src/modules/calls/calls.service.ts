import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Call, User } from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call) private readonly calls: Repository<Call>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly gateway: RealtimeGateway,
  ) {}

  async initiate(callerId: string, dto: {
    callee_id: string;
    type: 'voice' | 'video';
    conversation_id?: string;
  }) {
    const call = await this.calls.save(
      this.calls.create({
        caller_id: callerId,
        callee_id: dto.callee_id,
        conversation_id: dto.conversation_id || null,
        type: dto.type,
        channel_name: uuid(),
        status: 'ringing',
      }),
    );

    // Attach caller info so the callee can show the name immediately
    const caller = await this.users.findOne({ where: { id: callerId } });
    const payload = {
      ...call,
      caller: caller
        ? { id: caller.id, display_name: caller.display_name, avatar_url: caller.avatar_url }
        : null,
    };

    this.gateway.emitToUser(dto.callee_id, 'call:incoming', payload);
    this.gateway.emitToUser(callerId, 'call:outgoing', payload);
    return call;
  }

  async updateStatus(
    userId: string,
    callId: string,
    status: 'active' | 'ended' | 'missed' | 'declined' | 'failed',
  ) {
    const c = await this.calls.findOne({ where: { id: callId } });
    if (!c) throw new NotFoundException();
    const patch: Partial<Call> = { status };
    if (status === 'active') patch.answered_at = new Date();
    if (['ended', 'missed', 'declined', 'failed'].includes(status)) {
      patch.ended_at = new Date();
      if (c.answered_at) {
        patch.duration_seconds = Math.floor(
          (Date.now() - new Date(c.answered_at).getTime()) / 1000,
        );
      }
    }
    await this.calls.update({ id: callId }, patch);
    const updated = await this.calls.findOne({ where: { id: callId } });
    [c.caller_id, c.callee_id].forEach((uid) => {
      if (uid) this.gateway.emitToUser(uid, 'call:update', updated);
    });
    return updated;
  }

  async history(userId: string) {
    const calls = await this.calls
      .createQueryBuilder('c')
      .where('c.caller_id = :uid OR c.callee_id = :uid', { uid: userId })
      .orderBy('c.created_at', 'DESC')
      .limit(100)
      .getMany();

    // Attach caller and callee display info
    const userIds = new Set<string>();
    calls.forEach((c) => {
      if (c.caller_id) userIds.add(c.caller_id);
      if (c.callee_id) userIds.add(c.callee_id);
    });

    const userList = userIds.size
      ? await this.users
          .createQueryBuilder('u')
          .select(['u.id', 'u.display_name', 'u.avatar_url'])
          .whereInIds([...userIds])
          .getMany()
      : [];

    const userMap = new Map(userList.map((u) => [u.id, u]));

    return calls.map((c) => ({
      ...c,
      caller: c.caller_id ? (userMap.get(c.caller_id) ?? null) : null,
      callee: c.callee_id ? (userMap.get(c.callee_id) ?? null) : null,
    }));
  }
}