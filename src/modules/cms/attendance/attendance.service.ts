import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../../../entities';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private repo: Repository<Attendance>) {}

  async findByStudent(studentId: string) {
    return this.repo.find({
      where: { student_id: studentId },
      order: { attendance_date: 'DESC' },
    });
  }

  async findByCbsAndDate(cbsId: string, date: string) {
    return this.repo.find({
      where: { class_batch_section_id: cbsId, attendance_date: date },
    });
  }

  async deleteByCbsAndDate(cbsId: string, date: string) {
    return this.repo.delete({ class_batch_section_id: cbsId, attendance_date: date });
  }

  async createBulk(records: Partial<Attendance>[]) {
    const entities = records.map(r => this.repo.create(r));
    return this.repo.save(entities);
  }

  async findBySubjectAndDate(subjectId: string, date: string, instituteId: string) {
    return this.repo.find({
      where: { 
        subject_id: subjectId, 
        attendance_date: date,
        institute_id: instituteId
      },
      relations: ['student'],
    });
  }

  async findBySubjectAndMonth(subjectId: string, yearMonth: string, instituteId: string) {
    // yearMonth format: "2026-06"
    const [year, month] = yearMonth.split('-');
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;

    return this.repo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .where('attendance.subject_id = :subjectId', { subjectId })
      .andWhere('attendance.institute_id = :instituteId', { instituteId })
      .andWhere('attendance.attendance_date >= :startDate', { startDate })
      .andWhere('attendance.attendance_date <= :endDate', { endDate })
      .orderBy('attendance.attendance_date', 'ASC')
      .getMany();
  }

  async findBySubjectAndStudent(subjectId: string, studentId: string, instituteId: string) {
    return this.repo.find({
      where: {
        subject_id: subjectId,
        student_id: studentId,
        institute_id: instituteId,
      },
      order: {
        attendance_date: 'DESC',
      },
    });
  }

  async saveBulkAttendance(records: Partial<Attendance>[]) {
    // Upsert logic: for each record, check if it exists, update or create
    const results = [];
    
    for (const record of records) {
      const existing = await this.repo.findOne({
        where: {
          student_id: record.student_id,
          attendance_date: record.attendance_date,
          subject_id: record.subject_id,
          institute_id: record.institute_id,
        },
      });

      if (existing) {
        // Update existing record
        await this.repo.update(existing.id, {
          status: record.status,
          teacher_id: record.teacher_id,
          updated_at: new Date(),
        });
        results.push({ ...existing, status: record.status });
      } else {
        // Create new record
        const entity = this.repo.create(record);
        const saved = await this.repo.save(entity);
        results.push(saved);
      }
    }

    return results;
  }
}
