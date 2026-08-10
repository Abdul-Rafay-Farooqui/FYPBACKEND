import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassBatchSection } from '../../../entities';

@Injectable()
export class CbsService {
  constructor(@InjectRepository(ClassBatchSection) private repo: Repository<ClassBatchSection>) {}

  async findAll(class_id?: string, batch_id?: string, section_id?: string) {
    const where: any = {};
    if (class_id) where.class_id = class_id;
    if (batch_id) where.batch_id = batch_id;
    if (section_id) where.section_id = section_id;
    
    return this.repo.find({ 
      where: Object.keys(where).length > 0 ? where : undefined,
      order: { created_at: 'DESC' }, 
      relations: ['class', 'batch', 'section'] 
    });
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['class', 'batch', 'section'] });
  }

  async findByCombo(class_id: string, batch_id: string, section_id: string) {
    return this.repo.findOne({ where: { class_id, batch_id, section_id } });
  }

  async count() {
    return this.repo.count();
  }

  async create(data: Partial<ClassBatchSection>) {
    return this.repo.save(this.repo.create(data));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
