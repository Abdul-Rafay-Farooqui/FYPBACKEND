import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discussion, User } from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { InstituteNotificationsService } from '../institute-notifications/institute-notifications.service';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(Discussion)
    private readonly discussions: Repository<Discussion>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly gateway: RealtimeGateway,
    private readonly notifications: InstituteNotificationsService,
  ) {}

  private async getUserDisplayName(userId?: string | null) {
    if (!userId) return 'Someone';
    const user = await this.users.findOne({
      where: { id: userId },
      select: ['display_name', 'email'],
    });
    return user?.display_name || user?.email || 'Someone';
  }

  async create(data: Partial<Discussion>) {
    const discussion = this.discussions.create(data);
    const saved = await this.discussions.save(discussion);
    if (saved.institute_id) {
      this.gateway.emitToInstitute(saved.institute_id, 'institute:discussion-created', {
        institute_id: saved.institute_id,
        discussion: saved,
      });

      if (saved.teacher_id && saved.created_by === saved.student_id) {
        const studentName = await this.getUserDisplayName(saved.created_by);
        await this.notifications.notifyQuery(
          saved.institute_id,
          saved.teacher_id,
          saved,
          studentName,
        );
      }
    }
    return saved;
  }

  async findAll(filters?: {
    student_id?: string;
    teacher_id?: string;
    institute_id?: string;
    class_batch_section_id?: string;
  }) {
    const where: any = {};
    if (filters?.student_id) where.student_id = filters.student_id;
    if (filters?.teacher_id) where.teacher_id = filters.teacher_id;
    if (filters?.institute_id) where.institute_id = filters.institute_id;
    if (filters?.class_batch_section_id) where.class_batch_section_id = filters.class_batch_section_id;

    // Only get parent discussions (not replies)
    where.parent_id = null;

    return this.discussions.find({
      where,
      relations: ['student', 'teacher', 'subject'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const discussion = await this.discussions.findOne({
      where: { id },
      relations: ['student', 'teacher', 'subject'],
    });
    if (!discussion) throw new NotFoundException('Discussion not found');
    return discussion;
  }

  async getReplies(parentId: string) {
    return this.discussions.find({
      where: { parent_id: parentId },
      relations: ['student', 'teacher'],
      order: { created_at: 'ASC' },
    });
  }

  async reply(parentId: string, data: Partial<Discussion>) {
    const parent = await this.findOne(parentId);
    
    const reply = this.discussions.create({
      ...data,
      parent_id: parentId,
      institute_id: parent.institute_id,
      class_batch_section_id: parent.class_batch_section_id,
      subject_id: parent.subject_id,
    });

    const saved = await this.discussions.save(reply);
    if (parent.institute_id) {
      this.gateway.emitToInstitute(parent.institute_id, 'institute:discussion-replied', {
        institute_id: parent.institute_id,
        parent_id: parentId,
        reply: saved,
      });

      const senderId = saved.created_by;
      const senderIsTeacher = senderId === parent.teacher_id;
      const recipientId = senderIsTeacher ? parent.student_id : parent.teacher_id;

      if (recipientId && recipientId !== senderId) {
        const senderName = await this.getUserDisplayName(senderId);
        await this.notifications.notifyDiscussionReply(
          parent.institute_id,
          recipientId,
          parent,
          saved,
          senderName,
          senderIsTeacher,
        );
      }
    }
    return saved;
  }

  async markAsRead(id: string) {
    await this.discussions.update(id, { is_read: true });
    return { success: true };
  }

  async delete(id: string) {
    await this.discussions.delete(id);
    return { success: true };
  }

  // Get unread count for a user
  async getUnreadCount(userId: string, role: 'student' | 'teacher') {
    const where: any = { is_read: false };
    
    if (role === 'student') {
      where.student_id = userId;
    } else {
      where.teacher_id = userId;
    }

    return this.discussions.count({ where });
  }
}
