import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedUser, ReportedUser, User } from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(BlockedUser) private readonly blocks: Repository<BlockedUser>,
    @InjectRepository(ReportedUser) private readonly reports: Repository<ReportedUser>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly gateway: RealtimeGateway,
  ) {}

  async block(userId: string, targetId: string) {
    if (userId === targetId) throw new BadRequestException('Cannot block yourself');
    const exists = await this.blocks.findOne({
      where: { blocker_id: userId, blocked_id: targetId },
    });
    if (!exists) {
      await this.blocks.save(
        this.blocks.create({ blocker_id: userId, blocked_id: targetId }),
      );
    }
    // Broadcast to both users
    this.gateway.emitToUser(userId, 'block:update', { targetId, status: 'blocked' });
    this.gateway.emitToUser(targetId, 'block:update', { targetId: userId, status: 'blocked_by_other' });
    return { ok: true };
  }

  async unblock(userId: string, targetId: string) {
    await this.blocks.delete({ blocker_id: userId, blocked_id: targetId });
    // Broadcast to both users
    this.gateway.emitToUser(userId, 'block:update', { targetId, status: 'unblocked' });
    this.gateway.emitToUser(targetId, 'block:update', { targetId: userId, status: 'unblocked_by_other' });
    return { ok: true };
  }

  async listBlocked(userId: string) {
    const rows = await this.blocks.find({ where: { blocker_id: userId } });
    if (!rows.length) return [];
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

  async isBlocked(blockerId: string, blockedId: string) {
    const row = await this.blocks.findOne({
      where: { blocker_id: blockerId, blocked_id: blockedId },
    });
    return !!row;
  }

  async report(userId: string, targetId: string, reason?: string) {
    if (userId === targetId) throw new BadRequestException('Cannot report yourself');
    return this.reports.save(
      this.reports.create({
        reporter_id: userId,
        reported_id: targetId,
        reason: reason || null,
      }),
    );
  }
}