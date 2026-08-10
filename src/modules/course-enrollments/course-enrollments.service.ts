import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseEnrollment, Subject } from "../../entities";
import { RealtimeGateway } from "../realtime/realtime.gateway";

@Injectable()
export class CourseEnrollmentsService {
  constructor(
    @InjectRepository(CourseEnrollment)
    private readonly enrollments: Repository<CourseEnrollment>,
    @InjectRepository(Subject)
    private readonly subjects: Repository<Subject>,
    private readonly gateway: RealtimeGateway,
  ) {}

  async findAll(filters?: {
    student_id?: string;
    subject_id?: string;
    institute_id?: string;
  }) {
    const where: any = {};
    if (filters?.student_id) where.student_id = filters.student_id;
    if (filters?.subject_id) where.subject_id = filters.subject_id;
    if (filters?.institute_id) where.institute_id = filters.institute_id;

    return this.enrollments.find({
      where,
      relations: ["subject"],
      order: { enrolled_at: "DESC" },
    });
  }

  async findBySubject(subjectId: string) {
    return this.enrollments.find({
      where: { subject_id: subjectId },
      order: { enrolled_at: "DESC" },
    });
  }

  async enroll(data: {
    student_id: string;
    subject_id: string;
    institute_id: string;
  }) {
    // Check if already enrolled
    const existing = await this.enrollments.findOne({
      where: {
        student_id: data.student_id,
        subject_id: data.subject_id,
        institute_id: data.institute_id,
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Student is already enrolled in this course",
      );
    }

    const enrollment = this.enrollments.create(data);
    const saved = await this.enrollments.save(enrollment);
    if (saved.institute_id) {
      this.gateway.emitToInstitute(saved.institute_id, 'institute:enrollment-created', {
        institute_id: saved.institute_id,
        enrollment: saved,
      });
    }
    return saved;
  }

  async joinByCode(data: {
    student_id: string;
    course_code: string;
    institute_id: string;
  }) {
    // Find subject by course code
    const subject = await this.subjects.findOne({
      where: {
        course_code: data.course_code,
        institute_id: data.institute_id,
      },
    });

    if (!subject) {
      throw new NotFoundException("Invalid course code");
    }

    // Enroll the student
    return this.enroll({
      student_id: data.student_id,
      subject_id: subject.id,
      institute_id: data.institute_id,
    });
  }

  async unenroll(id: string) {
    const enrollment = await this.enrollments.findOne({ where: { id } });
    const result = await this.enrollments.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Enrollment not found");
    }
    if (enrollment?.institute_id) {
      this.gateway.emitToInstitute(enrollment.institute_id, 'institute:enrollment-deleted', {
        institute_id: enrollment.institute_id,
        enrollment_id: id,
        student_id: enrollment.student_id,
        subject_id: enrollment.subject_id,
      });
    }
    return { success: true };
  }
}
