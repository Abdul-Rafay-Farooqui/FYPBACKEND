import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassEntity } from '../../../entities';

@Injectable()
export class ClassesService {
  constructor(@InjectRepository(ClassEntity) private repo: Repository<ClassEntity>) {}

  async findAll(institute_id?: string) {
    const where = institute_id ? { institute_id } : {};
    return this.repo.find({ where, order: { name: 'ASC' } });
  }

  async count(institute_id?: string) {
    const where = institute_id ? { institute_id } : {};
    return this.repo.count({ where });
  }

  async create(data: Partial<ClassEntity>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<ClassEntity>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
