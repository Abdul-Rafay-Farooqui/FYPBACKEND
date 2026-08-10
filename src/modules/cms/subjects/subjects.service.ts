import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../../../entities';

@Injectable()
export class SubjectsService {
  constructor(@InjectRepository(Subject) private repo: Repository<Subject>) {}
  async findAll(institute_id?: string) { 
    const where = institute_id ? { institute_id } : {};
    return this.repo.find({ where, order: { name: 'ASC' } }); 
  }
  async create(data: Partial<Subject>) { 
    // Auto-generate course code if not provided
    if (!data.course_code) {
      data.course_code = this.generateCourseCode();
    }
    return this.repo.save(this.repo.create(data)); 
  }

  private generateCourseCode(): string {
    // Generate a random 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  async update(id: string, data: Partial<Subject>) { 
    await this.repo.update(id, data); 
    return this.repo.findOne({ where: { id } }); 
  }
  async delete(id: string) { return this.repo.delete(id); }
}
