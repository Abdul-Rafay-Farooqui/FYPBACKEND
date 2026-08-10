import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, User } from '../../entities';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact) private readonly repo: Repository<Contact>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async list(userId: string) {
    const rows = await this.repo
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.contact', 'contact')
      .where('c.user_id = :userId', { userId })
      .orderBy('c.is_favourite', 'DESC')
      .addOrderBy('contact.display_name', 'ASC')
      .getMany();
    return rows;
  }

  async addByPhone(userId: string, phone: string, nickname?: string) {
    const target = await this.users.findOne({ where: { phone } });
    if (!target) throw new NotFoundException('No user with that phone');
    if (target.id === userId) throw new BadRequestException('You cannot add yourself');

    const existing = await this.repo.findOne({
      where: { user_id: userId, contact_id: target.id },
    });
    if (existing) return existing;

    const entity = this.repo.create({
      user_id: userId,
      contact_id: target.id,
      nickname: nickname || null,
    });
    return this.repo.save(entity);
  }

  async remove(userId: string, contactRowId: string) {
    await this.repo.delete({ id: contactRowId, user_id: userId });
    return { ok: true };
  }

  async favourite(userId: string, contactRowId: string, fav: boolean) {
    await this.repo.update({ id: contactRowId, user_id: userId }, { is_favourite: fav });
    return this.repo.findOne({ where: { id: contactRowId } });
  }
}