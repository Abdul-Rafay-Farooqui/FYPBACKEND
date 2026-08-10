import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../../entities';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  findById(id: string) {
    return this.users.findOne({ where: { id } });
  }

  findByPhone(phone: string) {
    return this.users.findOne({ where: { phone } });
  }

  async update(id: string, patch: Partial<User>) {
    const allowed: (keyof User)[] = [
      'display_name',
      'username',
      'avatar_url',
      'about',
      'onboarding_complete',
      'privacy_last_seen',
      'privacy_profile_pic',
      'privacy_about',
      'privacy_status',
      'notifications_enabled',
      'theme',
    ];
    const data: Partial<User> = {};
    for (const k of allowed) if (patch[k] !== undefined) (data as any)[k] = patch[k];
    if (Object.keys(data).length) await this.users.update({ id }, data);
    return this.findById(id);
  }

  async setPresence(id: string, is_online: boolean) {
    await this.users.update({ id }, { is_online, last_seen: new Date() });
  }

  async search(q: string, excludeId: string) {
    if (!q || !q.trim()) return [];
    const searchTerm = `%${q}%`;
    return this.users.find({
      where: [
        { phone: Like(searchTerm) },
        { display_name: Like(searchTerm) },
        { username: Like(searchTerm) },
        { email: Like(searchTerm) },
      ],
      take: 20,
    }).then(list => list.filter(u => u.id !== excludeId));
  }

  async ensure(id: string) {
    const u = await this.findById(id);
    if (!u) throw new NotFoundException('User not found');
    return u;
  }
}