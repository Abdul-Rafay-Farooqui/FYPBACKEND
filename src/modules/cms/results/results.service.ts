import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from '../../../entities';

@Injectable()
export class ResultsService {
  constructor(@InjectRepository(Result) private repo: Repository<Result>) {}

  async findAll() {
    console.log('🔎 DB Query: Fetching ALL results');
    const results = await this.repo.find({
      relations: ['student', 'teacher', 'subject'],
      order: { published_date: 'DESC' },
    });
    console.log('📊 Found', results.length, 'total results');
    return results;
  }

  async findByStudent(studentId: string) {
    console.log('🔎 DB Query: Finding results for student:', studentId);
    const results = await this.repo.find({
      where: { student_id: studentId },
      relations: ['teacher', 'subject'],
      order: { published_date: 'DESC' },
    });
    console.log('📊 Found', results.length, 'results for student');
    return results;
  }

  async findByTeacher(teacherId: string) {
    console.log('🔎 DB Query: Finding results for teacher:', teacherId);
    const results = await this.repo.find({
      where: { teacher_id: teacherId },
      relations: ['student', 'subject'],
      order: { published_date: 'DESC' },
    });
    console.log('📊 Found', results.length, 'results for teacher');
    return results;
  }

  async findByTeacherAndSubject(teacherId: string, subjectId: string) {
    console.log('🔎 DB Query: Finding results for teacher and subject:', { teacherId, subjectId });
    const results = await this.repo.find({
      where: { teacher_id: teacherId, subject_id: subjectId },
      relations: ['student', 'subject'],
      order: { published_date: 'DESC' },
    });
    console.log('📊 Found', results.length, 'results for teacher+subject');
    return results;
  }

  async findByCbs(cbsId: string, subjectId?: string) {
    console.log('🔎 DB Query: Finding results by CBS:', { cbsId, subjectId });
    const where: any = { class_batch_section_id: cbsId };
    if (subjectId) where.subject_id = subjectId;
    const results = await this.repo.find({
      where,
      relations: ['student', 'subject', 'teacher'],
      order: { published_date: 'DESC' },
    });
    console.log('📊 Found', results.length, 'results for CBS');
    return results;
  }

  async countByTeacher(teacherId: string) {
    return this.repo.count({ where: { teacher_id: teacherId } });
  }

  async countByStudent(studentId: string) {
    return this.repo.count({ where: { student_id: studentId } });
  }

  async create(data: Partial<Result>) {
    console.log('💾 Creating result in DB:', data);
    const result = await this.repo.save(this.repo.create(data));
    console.log('✅ Result created with ID:', result.id);
    return result;
  }

  async update(id: string, data: Partial<Result>) {
    console.log('✏️ Updating result in DB:', id, data);
    await this.repo.update(id, data);
    const updated = await this.repo.findOne({
      where: { id },
      relations: ['student', 'teacher', 'subject'],
    });
    console.log('✅ Result updated:', updated);
    return updated;
  }

  async delete(id: string) {
    console.log('🗑️ Deleting result from DB:', id);
    const result = await this.repo.delete(id);
    console.log('✅ Result deleted:', result);
    return { success: true, affected: result.affected };
  }
}
