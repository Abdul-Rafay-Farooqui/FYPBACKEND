import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAssignment } from '../../../entities';

@Injectable()
export class TaService {
  constructor(@InjectRepository(TeacherAssignment) private repo: Repository<TeacherAssignment>) {}

  async findByTeacher(teacherId: string) {
    return this.repo.find({
      where: { teacher_id: teacherId },
      relations: ['teacher', 'class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section', 'subject'],
    });
  }

  async create(data: Partial<TeacherAssignment>) {
    return this.repo.save(this.repo.create(data));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
