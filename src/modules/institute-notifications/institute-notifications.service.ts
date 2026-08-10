import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstituteNotification } from '../../entities';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class InstituteNotificationsService {
  constructor(
    @InjectRepository(InstituteNotification)
    private readonly repo: Repository<InstituteNotification>,
    private readonly realtime: RealtimeGateway,
  ) {}

  async create(data: Partial<InstituteNotification>) {
    const notification = this.repo.create(data);
    const saved = await this.repo.save(notification);
    
    // Emit realtime notification
    this.realtime.emitToUser(data.user_id!, 'institute-notification', saved);
    
    return saved;
  }

  async createBulk(notifications: Partial<InstituteNotification>[]) {
    const entities = this.repo.create(notifications);
    const saved = await this.repo.save(entities);
    
    // Emit realtime notifications
    saved.forEach((notification) => {
      this.realtime.emitToUser(notification.user_id, 'institute-notification', notification);
    });
    
    return saved;
  }

  async findByUser(userId: string, instituteId?: string, limit = 50) {
    const query = this.repo
      .createQueryBuilder('n')
      .where('n.user_id = :userId', { userId })
      .orderBy('n.created_at', 'DESC')
      .take(limit);

    if (instituteId) {
      query.andWhere('n.institute_id = :instituteId', { instituteId });
    }

    return query.getMany();
  }

  async findUnreadByUser(userId: string, instituteId?: string) {
    const query = this.repo
      .createQueryBuilder('n')
      .where('n.user_id = :userId', { userId })
      .andWhere('n.read = :read', { read: false })
      .orderBy('n.created_at', 'DESC');

    if (instituteId) {
      query.andWhere('n.institute_id = :instituteId', { instituteId });
    }

    return query.getMany();
  }

  async countUnread(userId: string, instituteId?: string) {
    const query = this.repo
      .createQueryBuilder('n')
      .where('n.user_id = :userId', { userId })
      .andWhere('n.read = :read', { read: false });

    if (instituteId) {
      query.andWhere('n.institute_id = :instituteId', { instituteId });
    }

    return query.getCount();
  }

  async markAsRead(notificationId: string, userId: string) {
    const result = await this.repo.update(
      { id: notificationId, user_id: userId },
      { read: true, read_at: new Date() }
    );
    
    if (result.affected && result.affected > 0) {
      // Emit realtime update
      this.realtime.emitToUser(userId, 'institute-notification-read', { notificationId });
    }
    
    return result;
  }

  async markAllAsRead(userId: string, instituteId?: string) {
    const query = this.repo
      .createQueryBuilder()
      .update(InstituteNotification)
      .set({ read: true, read_at: new Date() })
      .where('user_id = :userId', { userId })
      .andWhere('read = :read', { read: false });

    if (instituteId) {
      query.andWhere('institute_id = :instituteId', { instituteId });
    }

    const result = await query.execute();
    
    if (result.affected && result.affected > 0) {
      // Emit realtime update
      this.realtime.emitToUser(userId, 'institute-notifications-all-read', { instituteId });
    }
    
    return result;
  }

  async delete(notificationId: string, userId: string) {
    return this.repo.delete({ id: notificationId, user_id: userId });
  }

  async deleteAll(userId: string, instituteId?: string) {
    if (instituteId) {
      return this.repo.delete({ user_id: userId, institute_id: instituteId });
    }
    return this.repo.delete({ user_id: userId });
  }

  // Helper methods to create specific notification types

  async notifyAnnouncement(
    instituteId: string,
    userIds: string[],
    announcement: any,
  ) {
    const notifications = userIds.map((userId) => ({
      institute_id: instituteId,
      user_id: userId,
      type: 'announcement' as const,
      title: 'New Announcement',
      message: announcement.title,
      related_id: announcement.id,
      related_type: 'announcement',
      metadata: {
        announcement_type: announcement.announcement_type,
        teacher_id: announcement.teacher_id,
      },
    }));

    return this.createBulk(notifications);
  }

  async notifyAssignment(
    instituteId: string,
    userIds: string[],
    assignment: any,
  ) {
    const notifications = userIds.map((userId) => ({
      institute_id: instituteId,
      user_id: userId,
      type: 'assignment' as const,
      title: 'New Assignment',
      message: `${assignment.title} - Due: ${new Date(assignment.due_date).toLocaleDateString()}`,
      related_id: assignment.id,
      related_type: 'homework',
      metadata: {
        due_date: assignment.due_date,
        subject_id: assignment.subject_id,
      },
    }));

    return this.createBulk(notifications);
  }

  async notifyAssignmentSubmission(
    instituteId: string,
    teacherId: string,
    submission: any,
    studentName: string,
  ) {
    return this.create({
      institute_id: instituteId,
      user_id: teacherId,
      type: 'assignment_submission',
      title: 'New Assignment Submission',
      message: `${studentName} submitted an assignment`,
      related_id: submission.id,
      related_type: 'homework_submission',
      metadata: {
        homework_id: submission.homework_id,
        student_id: submission.student_id,
      },
    });
  }

  async notifyQuiz(
    instituteId: string,
    userIds: string[],
    quiz: any,
  ) {
    const notifications = userIds.map((userId) => ({
      institute_id: instituteId,
      user_id: userId,
      type: 'quiz' as const,
      title: 'New Quiz Available',
      message: quiz.title,
      related_id: quiz.id,
      related_type: 'quiz',
      metadata: {
        subject_id: quiz.subject_id,
        total_marks: quiz.total_marks,
      },
    }));

    return this.createBulk(notifications);
  }

  async notifyLiveClass(
    instituteId: string,
    userIds: string[],
    liveClass: any,
  ) {
    const notifications = userIds.map((userId) => ({
      institute_id: instituteId,
      user_id: userId,
      type: 'live_class' as const,
      title: 'Live Class Scheduled',
      message: `${liveClass.title} - ${new Date(liveClass.scheduled_at).toLocaleString()}`,
      related_id: liveClass.id,
      related_type: 'live_class',
      metadata: {
        scheduled_at: liveClass.scheduled_at,
        subject_id: liveClass.subject_id,
      },
    }));

    return this.createBulk(notifications);
  }

  async notifyLiveClassStarted(
    instituteId: string,
    userIds: string[],
    liveClass: any,
  ) {
    const notifications = userIds.map((userId) => ({
      institute_id: instituteId,
      user_id: userId,
      type: 'live_class_started' as const,
      title: 'Live Class Started',
      message: `${liveClass.title} is now live!`,
      related_id: liveClass.id,
      related_type: 'live_class',
      metadata: {
        meeting_url: liveClass.meeting_url,
        subject_id: liveClass.subject_id,
      },
    }));

    return this.createBulk(notifications);
  }

  async notifyGrade(
    instituteId: string,
    studentId: string,
    grade: any,
    subjectName: string,
  ) {
    return this.create({
      institute_id: instituteId,
      user_id: studentId,
      type: 'grade',
      title: 'Grade Updated',
      message: `Your grade for ${subjectName}: ${grade.marks_obtained}/${grade.total_marks}`,
      related_id: grade.id,
      related_type: 'result',
      metadata: {
        subject_id: grade.subject_id,
        marks_obtained: grade.marks_obtained,
        total_marks: grade.total_marks,
        grade: grade.grade,
      },
    });
  }

  async notifyDiscussion(
    instituteId: string,
    userIds: string[],
    discussion: any,
  ) {
    const notifications = userIds.map((userId) => ({
      institute_id: instituteId,
      user_id: userId,
      type: 'discussion' as const,
      title: 'New Discussion',
      message: discussion.title || 'A new discussion was posted',
      related_id: discussion.id,
      related_type: 'discussion',
      metadata: {
        subject_id: discussion.subject_id,
        teacher_id: discussion.teacher_id,
      },
    }));

    return this.createBulk(notifications);
  }

  async notifyResource(
    instituteId: string,
    userIds: string[],
    resource: any,
  ) {
    const notifications = userIds.map((userId) => ({
      institute_id: instituteId,
      user_id: userId,
      type: 'resource' as const,
      title: 'New Resource Added',
      message: resource.title,
      related_id: resource.id,
      related_type: 'resource',
      metadata: {
        subject_id: resource.subject_id,
        resource_type: resource.resource_type,
      },
    }));

    return this.createBulk(notifications);
  }

  async notifyQuery(
    instituteId: string,
    teacherId: string,
    query: any,
    studentName: string,
  ) {
    return this.create({
      institute_id: instituteId,
      user_id: teacherId,
      type: 'query',
      title: 'Student Query',
      message: `${studentName} asked a question in discussion`,
      related_id: query.id,
      related_type: 'discussion',
      metadata: {
        subject_id: query.subject_id,
        student_id: query.created_by,
      },
    });
  }

  async notifyDiscussionReply(
    instituteId: string,
    recipientId: string,
    parentDiscussion: any,
    reply: any,
    senderName: string,
    senderIsTeacher: boolean,
  ) {
    const threadTitle = parentDiscussion.title || 'your discussion';

    return this.create({
      institute_id: instituteId,
      user_id: recipientId,
      type: 'discussion',
      title: senderIsTeacher ? 'Teacher Reply' : 'Student Reply',
      message: senderIsTeacher
        ? `${senderName} replied to "${threadTitle}"`
        : `${senderName} replied in "${threadTitle}"`,
      related_id: parentDiscussion.id,
      related_type: 'discussion',
      metadata: {
        subject_id: parentDiscussion.subject_id,
        parent_id: parentDiscussion.id,
        reply_id: reply.id,
        sender_id: reply.created_by,
      },
    });
  }
}
