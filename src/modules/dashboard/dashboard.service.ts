import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import {
  User,
  Institute,
  InstituteMember,
  Homework,
  HomeworkSubmission,
  Attendance,
  Result,
  Announcement,
  Quiz,
  QuizAttempt,
  LiveClass,
  Resource,
  ClassBatchSection,
  StudentEnrollment,
  CourseEnrollment,
  Batch,
  Section,
  Schedule,
  SubjectAssignment,
} from '../../entities';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(InstituteMember)
    private readonly members: Repository<InstituteMember>,
    @InjectRepository(Homework)
    private readonly homework: Repository<Homework>,
    @InjectRepository(HomeworkSubmission)
    private readonly submissions: Repository<HomeworkSubmission>,
    @InjectRepository(Attendance)
    private readonly attendance: Repository<Attendance>,
    @InjectRepository(Result)
    private readonly results: Repository<Result>,
    @InjectRepository(Announcement)
    private readonly announcements: Repository<Announcement>,
    @InjectRepository(Quiz)
    private readonly quizzes: Repository<Quiz>,
    @InjectRepository(QuizAttempt)
    private readonly quizAttempts: Repository<QuizAttempt>,
    @InjectRepository(LiveClass)
    private readonly liveClasses: Repository<LiveClass>,
    @InjectRepository(Resource)
    private readonly resources: Repository<Resource>,
    @InjectRepository(StudentEnrollment)
    private readonly enrollments: Repository<StudentEnrollment>,
    @InjectRepository(CourseEnrollment)
    private readonly courseEnrollments: Repository<CourseEnrollment>,
    @InjectRepository(Batch)
    private readonly batches: Repository<Batch>,
    @InjectRepository(Section)
    private readonly sections: Repository<Section>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    @InjectRepository(SubjectAssignment)
    private readonly subjectAssignments: Repository<SubjectAssignment>,
  ) {}

  async getStudentOverview(userId: string, instituteId: string) {
    // Get student's course enrollments (new system with subject_id)
    const enrollments = await this.courseEnrollments.find({
      where: { student_id: userId, institute_id: instituteId },
    });

    const subjectIds = enrollments.map((e) => e.subject_id);

    // Count assignments for enrolled subjects
    const totalAssignments = subjectIds.length > 0
      ? await this.homework.count({ where: { subject_id: In(subjectIds) } })
      : 0;

    // Count submitted assignments
    const submittedAssignments = await this.submissions.count({
      where: { student_id: userId },
    });

    // Count quizzes for enrolled subjects
    const totalQuizzes = subjectIds.length > 0
      ? await this.quizzes.count({ where: { subject_id: In(subjectIds), is_published: true } })
      : 0;

    // Count attempted quizzes
    const attemptedQuizzes = await this.quizAttempts.count({
      where: { student_id: userId, status: 'submitted' },
    });

    // Calculate attendance percentage
    const totalAttendance = await this.attendance.count({
      where: { student_id: userId },
    });

    const presentCount = await this.attendance.count({
      where: { student_id: userId, status: 'present' },
    });

    const attendancePercentage = totalAttendance > 0 
      ? Math.round((presentCount / totalAttendance) * 100) 
      : 0;

    // Calculate overall grade percentage from enrolled subjects only
    const results = subjectIds.length > 0
      ? await this.results.find({ where: { student_id: userId, subject_id: In(subjectIds) } })
      : [];

    let overallGrade = 0;
    if (results.length > 0) {
      const totalMarks = results.reduce((sum, r) => sum + Number(r.total_marks), 0);
      const obtainedMarks = results.reduce((sum, r) => sum + Number(r.marks_obtained), 0);
      overallGrade = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    }

    // Get recent announcements for enrolled subjects or general announcements
    const announcementsQuery = this.announcements.createQueryBuilder('a')
      .leftJoinAndSelect('a.teacher', 'teacher')
      .leftJoinAndSelect('a.subject', 'subject')
      .where('a.institute_id = :instituteId', { instituteId })
      .orderBy('a.published_date', 'DESC')
      .take(5);

    if (subjectIds.length > 0) {
      announcementsQuery.andWhere(
        '(a.subject_id IN (:...subjectIds) OR a.subject_id IS NULL)',
        { subjectIds }
      );
    }

    const recentAnnouncements = await announcementsQuery.getMany();

    // Get upcoming assignments for enrolled subjects
    const upcomingAssignments = subjectIds.length > 0
      ? await this.homework.find({
          where: { 
            subject_id: In(subjectIds),
            due_date: MoreThan(new Date()),
          },
          order: { due_date: 'ASC' },
          take: 5,
        })
      : [];

    // Get upcoming live classes for enrolled subjects
    const upcomingClasses = subjectIds.length > 0
      ? await this.liveClasses.find({
          where: {
            subject_id: In(subjectIds),
            scheduled_at: MoreThan(new Date()),
            status: 'scheduled',
          },
          order: { scheduled_at: 'ASC' },
          take: 5,
        })
      : [];

    return {
      stats: {
        totalAssignments,
        submittedAssignments,
        pendingAssignments: totalAssignments - submittedAssignments,
        totalQuizzes,
        attemptedQuizzes,
        pendingQuizzes: totalQuizzes - attemptedQuizzes,
        attendancePercentage,
        overallGrade,
      },
      recentAnnouncements,
      upcomingAssignments,
      upcomingClasses,
    };
  }

  async getTeacherOverview(userId: string, instituteId: string) {
    // Get teacher's assigned classes
    const assignedClasses = await this.homework.createQueryBuilder('h')
      .select('DISTINCT h.class_batch_section_id')
      .where('h.teacher_id = :userId', { userId })
      .andWhere('h.institute_id = :instituteId', { instituteId })
      .getRawMany();

    const cbsIds = assignedClasses.map((c) => c.class_batch_section_id);

    // Count total students in assigned classes
    const totalStudents = await this.enrollments.count({
      where: cbsIds.length > 0 ? { class_batch_section_id: In(cbsIds), is_active: true } : {},
    });

    // Count pending submissions to grade
    const pendingSubmissions = await this.submissions.count({
      where: { 
        homework: { teacher_id: userId },
        stars: 0, // Not graded yet
      },
      relations: ['homework'],
    });

    // Count assignments created
    const totalAssignments = await this.homework.count({
      where: { teacher_id: userId, institute_id: instituteId },
    });

    // Count quizzes created
    const totalQuizzes = await this.quizzes.count({
      where: { teacher_id: userId, institute_id: instituteId },
    });

    // Get upcoming live classes
    const upcomingClasses = await this.liveClasses.find({
      where: {
        teacher_id: userId,
        institute_id: instituteId,
        scheduled_at: MoreThan(new Date()),
        status: 'scheduled',
      },
      order: { scheduled_at: 'ASC' },
      take: 5,
    });

    // Get weekly schedules assigned to this teacher
    // Find via direct teacher_id OR via subject assignments (subjects this teacher teaches)
    const teacherSubjectAssignments = await this.subjectAssignments.find({
      where: { teacher_id: userId, institute_id: instituteId },
    });
    const teacherSubjectIds = teacherSubjectAssignments.map((a) => a.subject_id);

    const weeklySchedules = await this.schedules.find({
      where: teacherSubjectIds.length > 0
        ? [
            { teacher_id: userId },
            { subject_id: In(teacherSubjectIds) },
          ]
        : { teacher_id: userId },
      relations: ['class_batch_section', 'class_batch_section.class', 'class_batch_section.batch', 'class_batch_section.section', 'subject'],
      order: { day_of_week: 'ASC', start_time: 'ASC' },
    });

    // Get recent submissions
    const recentSubmissions = await this.submissions.find({
      where: { homework: { teacher_id: userId } },
      relations: ['homework', 'student'],
      order: { submitted_date: 'DESC' },
      take: 10,
    });

    return {
      stats: {
        totalStudents,
        totalAssignments,
        totalQuizzes,
        pendingSubmissions,
        upcomingClassesCount: upcomingClasses.length,
      },
      upcomingClasses,
      weeklySchedules,
      recentSubmissions,
    };
  }

  async getAdminOverview(userId: string, instituteId: string) {
    // Count total members
    const totalStudents = await this.members.count({
      where: { institute_id: instituteId, role: 'student', status: 'active' },
    });

    const totalTeachers = await this.members.count({
      where: { institute_id: instituteId, role: 'teacher', status: 'active' },
    });

    const totalAdmins = await this.members.count({
      where: { institute_id: instituteId, role: 'admin', status: 'active' },
    });

    // Count batches and sections
    const totalBatches = await this.batches.count({
      where: { institute_id: instituteId },
    });

    const totalSections = await this.sections.count({
      where: { institute_id: instituteId },
    });

    const totalResources = await this.resources.count({
      where: { institute_id: instituteId },
    });

    const totalLiveClasses = await this.liveClasses.count({
      where: { institute_id: instituteId },
    });

    // Get recent activities (announcements)
    const recentActivities = await this.announcements.find({
      where: { institute_id: instituteId },
      order: { published_date: 'DESC' },
      take: 10,
      relations: ['teacher'],
    });

    return {
      stats: {
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalMembers: totalStudents + totalTeachers + totalAdmins,
        totalBatches,
        totalSections,
        totalResources,
        totalLiveClasses,
      },
      recentActivities,
    };
  }
}
