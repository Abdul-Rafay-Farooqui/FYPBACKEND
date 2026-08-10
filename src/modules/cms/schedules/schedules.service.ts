import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Schedule, ClassBatchSection } from '../../../entities';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule) private repo: Repository<Schedule>,
    @InjectRepository(ClassBatchSection) private cbsRepo: Repository<ClassBatchSection>,
  ) {}

  async findByTeacher(teacherId: string) {
    return this.repo.find({
      where: { teacher_id: teacherId },
      relations: ['class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section', 'subject'],
      order: { day_of_week: 'ASC' },
    });
  }

  async findByCbs(cbsId: string) {
    return this.repo.find({
      where: { class_batch_section_id: cbsId },
      relations: ['teacher', 'subject'],
      order: { day_of_week: 'ASC' },
    });
  }

  async findByInstitute(instituteId: string) {
    // First, get all class_batch_sections for this institute
    // We need to check batches, classes, or sections that belong to this institute
    const allCBS = await this.cbsRepo.find({
      relations: ['class', 'batch', 'section']
    });
    
    // Filter CBS that belong to this institute (check via batch or class or section)
    const instituteCBS = allCBS.filter(cbs => 
      cbs.batch?.institute_id === instituteId || 
      cbs.class?.institute_id === instituteId || 
      cbs.section?.institute_id === instituteId
    );
    
    const cbsIds = instituteCBS.map(cbs => cbs.id);
    
    if (cbsIds.length === 0) return [];
    
    // Get all schedules for these CBS
    return this.repo.find({
      where: { class_batch_section_id: In(cbsIds) },
      relations: ['class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section', 'subject', 'teacher'],
      order: { day_of_week: 'ASC', start_time: 'ASC' },
    });
  }

  async create(data: Partial<Schedule>) {
    return this.repo.save(this.repo.create(data));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
