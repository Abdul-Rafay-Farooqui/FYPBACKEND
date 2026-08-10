import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Homework, CourseEnrollment } from "../../../entities";
import { InstituteNotificationsService } from "../../institute-notifications/institute-notifications.service";

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Homework) private repo: Repository<Homework>,
    @InjectRepository(CourseEnrollment) private enrollmentRepo: Repository<CourseEnrollment>,
    private notificationsService: InstituteNotificationsService,
  ) {}

  async findByTeacher(teacherId: string) {
    return this.repo.find({
      where: { teacher_id: teacherId },
      relations: [
        "class_batch_section",
        "class_batch_section.class",
        "class_batch_section.batch",
        "class_batch_section.section",
        "subject",
      ],
      order: { published_date: "DESC" },
    });
  }

  async findBySubject(subjectId: string) {
    return this.repo.find({
      where: { subject_id: subjectId },
      relations: ["teacher", "subject"],
      order: { published_date: "DESC" },
    });
  }

  async findBySubjects(subjectIds: string[]) {
    if (subjectIds.length === 0) return [];
    return this.repo.find({
      where: subjectIds.map((id) => ({ subject_id: id })),
      relations: ["teacher", "subject"],
      order: { published_date: "DESC" },
    });
  }

  async findByCbs(cbsId: string) {
    return this.repo.find({
      where: { class_batch_section_id: cbsId },
      relations: ["teacher", "subject"],
      order: { published_date: "DESC" },
    });
  }

  async findByInstitute(instituteId: string) {
    return this.repo.find({
      where: { institute_id: instituteId },
      relations: ["teacher", "subject"],
      order: { published_date: "DESC" },
    });
  }

  async findIdsByTeacher(teacherId: string) {
    const items = await this.repo.find({
      where: { teacher_id: teacherId },
      select: ["id"],
    });
    return items.map((i) => i.id);
  }

  async create(data: Partial<Homework>) {
    return this.repo.save(this.repo.create(data));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
