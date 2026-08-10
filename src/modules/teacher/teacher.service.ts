import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import {
  SubjectAssignment,
  StudentEnrollment,
  Quiz,
  Homework,
  Announcement,
  Schedule,
  ClassBatchSection,
  CourseEnrollment,
} from "../../entities";

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(SubjectAssignment)
    private readonly subjectAssignments: Repository<SubjectAssignment>,
    @InjectRepository(StudentEnrollment)
    private readonly enrollments: Repository<StudentEnrollment>,
    @InjectRepository(Quiz)
    private readonly quizzes: Repository<Quiz>,
    @InjectRepository(Homework)
    private readonly homework: Repository<Homework>,
    @InjectRepository(Announcement)
    private readonly announcements: Repository<Announcement>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    @InjectRepository(ClassBatchSection)
    private readonly classBatchSections: Repository<ClassBatchSection>,
    @InjectRepository(CourseEnrollment)
    private readonly courseEnrollments: Repository<CourseEnrollment>,
  ) {}

  async getCourseOverview(courseId: string, teacherId: string) {
    // Verify the teacher is assigned to this course
    const assignment = await this.subjectAssignments.findOne({
      where: { id: courseId, teacher_id: teacherId },
      relations: ["subject"],
    });

    if (!assignment) {
      throw new Error("Course not found or not assigned to you");
    }

    // Count ONLY students enrolled in THIS specific course/subject
    const totalStudents = await this.courseEnrollments.count({
      where: {
        subject_id: assignment.subject_id,
        institute_id: assignment.institute_id,
      },
    });

    // Count quizzes for THIS specific course (exact subject match only)
    const totalQuizzes = await this.quizzes.count({
      where: {
        teacher_id: teacherId,
        institute_id: assignment.institute_id,
        subject_id: assignment.subject_id,
      },
    });

    // Count assignments for THIS specific course (exact subject match only)
    const totalAssignments = await this.homework.count({
      where: {
        teacher_id: teacherId,
        institute_id: assignment.institute_id,
        subject_id: assignment.subject_id,
      },
    });

    // Count announcements for THIS specific course (exact subject match only)
    const totalAnnouncements = await this.announcements.count({
      where: {
        teacher_id: teacherId,
        institute_id: assignment.institute_id,
        subject_id: assignment.subject_id,
      },
    });

    // Get all class-batch-sections for this institute
    const allCBS = await this.classBatchSections.find({
      where: { class: { institute_id: assignment.institute_id } },
      relations: ["class", "batch", "section"],
    });

    const cbsIds = allCBS.map((cbs) => cbs.id);

    // Get schedules for this course
    const schedules = await this.schedules.find({
      where:
        cbsIds.length > 0
          ? {
              teacher_id: teacherId,
              class_batch_section_id: In(cbsIds),
            }
          : { teacher_id: teacherId },
      relations: ["class_batch_section", "subject"],
      order: { day_of_week: "ASC", start_time: "ASC" },
      take: 10,
    });

    // Get recent announcements for THIS specific course
    const recentAnnouncements = await this.announcements.find({
      where: {
        teacher_id: teacherId,
        subject_id: assignment.subject_id,
      },
      order: { published_date: "DESC" },
      take: 5,
    });

    return {
      stats: {
        totalStudents,
        totalQuizzes,
        totalAssignments,
        totalAnnouncements,
      },
      schedules,
      recentAnnouncements,
      course: assignment,
    };
  }
}
