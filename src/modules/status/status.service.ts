import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import {
  Contact,
  StatusHiddenFrom,
  StatusUpdate,
  StatusView,
  User,
} from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';

export interface CreateStatusDto {
  type: 'text' | 'image' | 'video';
  content?: string;
  caption?: string;
  bg_color?: string;
  media_url?: string;
  media_thumbnail?: string;
  media_duration?: number;
  /** user_ids this status should be hidden from */
  hide_from?: string[];
}

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(StatusUpdate) private readonly su: Repository<StatusUpdate>,
    @InjectRepository(StatusView) private readonly sv: Repository<StatusView>,
    @InjectRepository(StatusHiddenFrom) private readonly hidden: Repository<StatusHiddenFrom>,
    @InjectRepository(Contact) private readonly contacts: Repository<Contact>,
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly gateway: RealtimeGateway,
  ) {}

  // ---------- create ----------
  async create(userId: string, dto: CreateStatusDto) {
    const status = await this.su.save(
      this.su.create({
        user_id: userId,
        type: dto.type,
        content: dto.content || null,
        caption: dto.caption || null,
        bg_color: dto.bg_color || null,
        media_url: dto.media_url || null,
        media_thumbnail: dto.media_thumbnail || null,
        media_duration: dto.media_duration || null,
        expires_at: new Date(Date.now() + 24 * 3600 * 1000),
      }),
    );

    if (dto.hide_from?.length) {
      await this.hidden.save(
        dto.hide_from.map((uid) =>
          this.hidden.create({
            status_id: status.id,
            user_id: uid,
          }),
        ),
      );
    }

    // Notify contacts (except hidden)
    const hiddenSet = new Set(dto.hide_from || []);
    const myContacts = await this.contacts.find({ where: { user_id: userId } });
    myContacts.forEach((c) => {
      if (!hiddenSet.has(c.contact_id)) {
        this.gateway.emitToUser(c.contact_id, 'status:new', {
          status_id: status.id,
          user_id: userId,
        });
      }
    });

    return status;
  }

  // ---------- feed (WhatsApp style: my statuses + contacts statuses) --------
  async feed(userId: string) {
    // My own statuses
    const mine = await this.su.find({
      where: { user_id: userId, expires_at: MoreThan(new Date()) },
      order: { created_at: 'DESC' },
    });

    // Contacts whose statuses I can see (i.e. they haven't hidden from me)
    const myContacts = await this.contacts.find({ where: { user_id: userId } });
    const contactIds = myContacts.map((c) => c.contact_id);

    const recent: any[] = [];
    if (contactIds.length) {
      const rawRows = await this.su
        .createQueryBuilder('s')
        .where('s.expires_at > NOW()')
        .andWhere('s.user_id IN (:...ids)', { ids: contactIds })
        .andWhere(
          `NOT EXISTS (SELECT 1 FROM status_hidden_from h WHERE h.status_id = s.id AND h.user_id = :me)`,
          { me: userId },
        )
        .orderBy('s.created_at', 'DESC')
        .getMany();
      recent.push(...rawRows);
    }

    // Attach uploader info + view state
    const userIds = Array.from(
      new Set([userId, ...recent.map((r) => r.user_id)]),
    );
    const users = await this.users.find({
      where: userIds.map((id) => ({ id })),
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const allIds = [...mine, ...recent].map((s) => s.id);
    const views = allIds.length
      ? await this.sv.find({
          where: allIds.map((sid) => ({ status_id: sid, viewer_id: userId })),
        })
      : [];
    const viewedSet = new Set(views.map((v) => v.status_id));

    // Group by user_id
    const group = (arr: StatusUpdate[]) => {
      const byUser = new Map<string, any>();
      for (const s of arr) {
        if (!byUser.has(s.user_id)) {
          const u = userMap.get(s.user_id);
          byUser.set(s.user_id, {
            user_id: s.user_id,
            display_name: u?.display_name || 'Unknown',
            avatar_url: u?.avatar_url || null,
            statuses: [],
          });
        }
        byUser.get(s.user_id).statuses.push({
          ...s,
          viewed_by_me: viewedSet.has(s.id),
        });
      }
      return Array.from(byUser.values());
    };

    return {
      my_statuses: mine.map((s) => ({
        ...s,
        viewed_by_me: true,
      })),
      recent: group(recent),
    };
  }

  // ---------- views ----------
  async view(userId: string, statusId: string) {
    const status = await this.su.findOne({ where: { id: statusId } });
    if (!status) throw new NotFoundException('Status not found');
    if (status.expires_at < new Date())
      throw new ForbiddenException('Status expired');

    const isHidden = await this.hidden.findOne({
      where: { status_id: statusId, user_id: userId },
    });
    if (isHidden) throw new ForbiddenException('You cannot view this status');

    await this.sv
      .createQueryBuilder()
      .insert()
      .values({ status_id: statusId, viewer_id: userId })
      .orIgnore()
      .execute();

    this.gateway.emitToUser(status.user_id, 'status:viewed', {
      status_id: statusId,
      viewer_id: userId,
    });
    return { ok: true };
  }

  async viewers(userId: string, statusId: string) {
    const status = await this.su.findOne({ where: { id: statusId } });
    if (!status) throw new NotFoundException('Status not found');
    if (status.user_id !== userId)
      throw new ForbiddenException('Only the owner can see viewers');

    const rows = await this.sv
      .createQueryBuilder('sv')
      .leftJoin('users', 'u', 'u.id = sv.viewer_id')
      .where('sv.status_id = :id', { id: statusId })
      .orderBy('sv.viewed_at', 'DESC')
      .select([
        'sv.viewer_id AS viewer_id',
        'sv.viewed_at AS viewed_at',
        'u.display_name AS display_name',
        'u.avatar_url AS avatar_url',
      ])
      .getRawMany();
    return rows;
  }

  async remove(userId: string, statusId: string) {
    const status = await this.su.findOne({ where: { id: statusId } });
    if (!status) throw new NotFoundException('Status not found');
    if (status.user_id !== userId)
      throw new ForbiddenException('Cannot delete others statuses');
    await this.su.delete({ id: statusId });
    return { ok: true };
  }

  // ---------- privacy ----------
  async setPrivacy(userId: string, statusId: string, hideFrom: string[]) {
    const status = await this.su.findOne({ where: { id: statusId } });
    if (!status) throw new NotFoundException('Status not found');
    if (status.user_id !== userId) throw new ForbiddenException();

    await this.hidden.delete({ status_id: statusId });
    if (hideFrom.length) {
      await this.hidden.save(
        hideFrom.map((uid) =>
          this.hidden.create({
            status_id: statusId,
            user_id: uid,
          }),
        ),
      );
    }
    return { ok: true };
  }
}