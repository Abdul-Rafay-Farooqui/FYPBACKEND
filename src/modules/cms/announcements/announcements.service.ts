import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement, CourseEnrollment, InstituteMember } from '../../../entities';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { InstituteNotificationsService } from '../../institute-notifications/institute-notifications.service';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement) private repo: Repository<Announcement>,
    @InjectRepository(CourseEnrollment) private enrollmentRepo: Repository<CourseEnrollment>,
    @InjectRepository(InstituteMember) private memberRepo: Repository<InstituteMember>,
    private readonly gateway: RealtimeGateway,
    private notificationsService: InstituteNotificationsService,
  ) {}

  async findByTeacher(teacherId: string) {
    return this.repo.find({
      where: { teacher_id: teacherId },
      relations: ['class_batch_section', 'subject', 'student'],
      order: { published_date: 'DESC' },
    });
  }

  async findForStudent(studentId: string) {
    // Get all subjects the student is enrolled in
    const enrolledSubjects = await this.enrollmentRepo.find({
      where: { student_id: studentId }
    });

    if (enrolledSubjects.length === 0) {
      // Return empty array if no enrollments
      return [];
    }

    const subjectIds = enrolledSubjects.map(e => e.subject_id);
    const instituteId = enrolledSubjects[0]?.institute_id;

    // Build the query
    const qb = this.repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.teacher', 'teacher')
      .leftJoinAndSelect('a.subject', 'subject')
      .leftJoinAndSelect('a.class_batch_section', 'class_batch_section')
      .where('a.institute_id = :instituteId', { instituteId });

    // Add subject filter - include announcements for enrolled subjects OR general announcements (null subject_id)
    if (subjectIds.length > 0) {
      qb.andWhere('(a.subject_id IN (:...subjectIds) OR a.subject_id IS NULL)', { subjectIds });
    }

    // Add announcement type filter
    qb.andWhere(
      '(a.announcement_type = :general OR a.announcement_type = :section OR a.announcement_type = :cls OR (a.announcement_type = :individual AND a.student_id = :studentId))',
      { general: 'general', section: 'section', cls: 'class', individual: 'individual', studentId }
    );

    qb.orderBy('a.published_date', 'DESC');

    return qb.getMany();
  }

  async findByInstitute(instituteId: string) {
    return this.repo.find({
      where: { institute_id: instituteId },
      relations: ['class_batch_section', 'teacher', 'subject'],
      order: { published_date: 'DESC' },
    });
  }

  async countForStudent(studentId: string) {
    // Get all subjects the student is enrolled in
    const enrolledSubjects = await this.enrollmentRepo.find({
      where: { student_id: studentId },
      select: ['subject_id', 'institute_id']
    });

    if (enrolledSubjects.length === 0) {
      return 0;
    }

    const subjectIds = enrolledSubjects.map(e => e.subject_id);
    const instituteId = enrolledSubjects[0]?.institute_id;

    const qb = this.repo.createQueryBuilder('a')
      .where('a.institute_id = :instituteId', { instituteId })
      .andWhere('(a.subject_id IN (:...subjectIds) OR a.subject_id IS NULL)', { subjectIds })
      .andWhere(
        '(a.announcement_type = :general OR a.announcement_type = :section OR a.announcement_type = :cls OR (a.announcement_type = :individual AND a.student_id = :studentId))',
        { general: 'general', section: 'section', cls: 'class', individual: 'individual', studentId }
      );
    return qb.getCount();
  }

  async create(data: Partial<Announcement>) {
    const created = await this.repo.save(this.repo.create(data));
    
    // Emit websocket event
    if (created.institute_id) {
      this.gateway.emitToInstitute(created.institute_id, 'institute:announcement-created', {
        institute_id: created.institute_id,
        announcement: created,
      });
      
      // Send notifications
      try {
        let userIds: string[] = [];
        
        if (created.announcement_type === 'individual' && created.student_id) {
          // Notify specific student
          userIds = [created.student_id];
        } else if (created.subject_id) {
          // Notify students enrolled in this subject
          const enrollments = await this.enrollmentRepo.find({
            where: { subject_id: created.subject_id },
            select: ['student_id'],
          });
          userIds = enrollments.map(e => e.student_id);
        } else {
          // General announcement - notify all institute members (students and teachers)
          const members = await this.memberRepo.find({
            where: { institute_id: created.institute_id },
            select: ['user_id'],
          });
          userIds = members.map(m => m.user_id);
        }
        
        if (userIds.length > 0) {
          await this.notificationsService.notifyAnnouncement(
            created.institute_id,
            userIds,
            created,
          );
        }
      } catch (error) {
        console.error('Failed to send announcement notifications:', error);
      }
    }
    
    return created;
  }

  async delete(id: string) {
    const announcement = await this.repo.findOne({ where: { id } });
    const result = await this.repo.delete(id);
    
    // Emit websocket event
    if (announcement?.institute_id) {
      this.gateway.emitToInstitute(announcement.institute_id, 'institute:announcement-deleted', {
        institute_id: announcement.institute_id,
        announcement_id: id,
      });
    }
    
    return result;
  }
}
