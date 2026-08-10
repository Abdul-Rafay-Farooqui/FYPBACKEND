import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Call } from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call) private readonly calls: Repository<Call>,
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
    this.gateway.emitToUser(dto.callee_id, 'call:incoming', call);
    this.gateway.emitToUser(callerId, 'call:outgoing', call);
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
    return this.calls
      .createQueryBuilder('c')
      .where('c.caller_id = :uid OR c.callee_id = :uid', { uid: userId })
      .orderBy('c.created_at', 'DESC')
      .limit(100)
      .getMany();
  }
}