import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resources: Repository<Resource>,
    private readonly gateway: RealtimeGateway,
  ) {}

  async create(data: Partial<Resource>) {
    const resource = this.resources.create(data);
    const saved = await this.resources.save(resource);
    if (saved.institute_id) {
      this.gateway.emitToInstitute(saved.institute_id, 'institute:resource-created', {
        institute_id: saved.institute_id,
        resource: saved,
      });
    }
    return saved;
  }

  async findAll(filters?: { 
    institute_id?: string; 
    teacher_id?: string; 
    class_batch_section_id?: string;
    subject_id?: string;
  }) {
    const where: any = {};
    if (filters?.institute_id) where.institute_id = filters.institute_id;
    if (filters?.teacher_id) where.teacher_id = filters.teacher_id;
    if (filters?.class_batch_section_id) where.class_batch_section_id = filters.class_batch_section_id;
    if (filters?.subject_id) where.subject_id = filters.subject_id;

    return this.resources.find({
      where,
      relations: ['teacher', 'subject', 'class_batch_section'],
      order: { uploaded_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.resources.findOne({ 
      where: { id },
      relations: ['teacher', 'subject', 'class_batch_section'],
    });
  }

  async delete(id: string) {
    const resource = await this.resources.findOne({ where: { id } });
    await this.resources.delete(id);
    if (resource?.institute_id) {
      this.gateway.emitToInstitute(resource.institute_id, 'institute:resource-deleted', {
        institute_id: resource.institute_id,
        resource_id: id,
      });
    }
    return { success: true };
  }
}
