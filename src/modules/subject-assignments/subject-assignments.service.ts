import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectAssignment } from '../../entities';

@Injectable()
export class SubjectAssignmentsService {
  constructor(
    @InjectRepository(SubjectAssignment)
    private readonly assignments: Repository<SubjectAssignment>,
  ) {}

  async create(data: { subject_id: string; teacher_id: string; institute_id: string }) {
    // Check if already assigned
    const existing = await this.assignments.findOne({
      where: {
        subject_id: data.subject_id,
        teacher_id: data.teacher_id,
        institute_id: data.institute_id,
      },
    });

    if (existing) {
      throw new Error('Teacher is already assigned to this subject');
    }

    const assignment = this.assignments.create(data);
    return this.assignments.save(assignment);
  }

  async findAll(instituteId: string) {
    return this.assignments.find({
      where: { institute_id: instituteId },
      relations: ['subject', 'teacher'],
      order: { created_at: 'DESC' },
    });
  }

  async findByTeacher(teacherId: string, instituteId: string) {
    return this.assignments.find({
      where: { teacher_id: teacherId, institute_id: instituteId },
      relations: ['subject'],
      order: { created_at: 'DESC' },
    });
  }

  async findBySubject(subjectId: string) {
    return this.assignments.find({
      where: { subject_id: subjectId },
      relations: ['teacher'],
    });
  }

  async remove(id: string) {
    const assignment = await this.assignments.findOne({ where: { id } });
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    return this.assignments.remove(assignment);
  }
}
