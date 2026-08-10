import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StudentEnrollment } from '../../../entities';

@Injectable()
export class SeService {
  constructor(@InjectRepository(StudentEnrollment) private repo: Repository<StudentEnrollment>) {}

  async findByStudent(studentId: string, isActive?: boolean) {
    const where: any = { student_id: studentId };
    if (isActive !== undefined) where.is_active = isActive;
    return this.repo.find({
      where,
      relations: ['student', 'class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section'],
    });
  }

  async findByStudentSingle(studentId: string) {
    return this.repo.findOne({
      where: { student_id: studentId, is_active: true },
      relations: ['student', 'class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section'],
    });
  }

  async findByCbs(cbsId: string, isActive?: boolean) {
    const where: any = { class_batch_section_id: cbsId };
    if (isActive !== undefined) where.is_active = isActive;
    return this.repo.find({
      where,
      relations: ['student'],
    });
  }

  async countByCbs(cbsIds: string[]) {
    if (!cbsIds.length) return 0;
    return this.repo.count({ where: { class_batch_section_id: In(cbsIds), is_active: true } });
  }

  async create(data: Partial<StudentEnrollment>[]) {
    const entities = data.map(d => this.repo.create(d));
    return this.repo.save(entities);
  }

  async deactivate(cbsId: string, studentIds: string[]) {
    return this.repo.update(
      { class_batch_section_id: cbsId, student_id: In(studentIds) },
      { is_active: false },
    );
  }
}
