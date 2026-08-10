import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, IsNull } from "typeorm";
import { HomeworkSubmission } from "../../../entities";

@Injectable()
export class HsService {
  constructor(
    @InjectRepository(HomeworkSubmission)
    private repo: Repository<HomeworkSubmission>,
  ) {}

  async findByHomework(homeworkId: string) {
    return this.repo.find({
      where: { homework_id: homeworkId },
      relations: ["student"],
      order: { submitted_date: "DESC" },
    });
  }

  async findByStudent(studentId: string) {
    return this.repo.find({ where: { student_id: studentId } });
  }

  async findAll() {
    return this.repo.find({
      relations: ["student"],
      order: { submitted_date: "DESC" },
    });
  }

  async countPending(homeworkIds: string[]) {
    if (!homeworkIds.length) return 0;
    return this.repo.count({
      where: { homework_id: In(homeworkIds), stars: IsNull() as any },
    });
  }

  async create(data: Partial<HomeworkSubmission>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<HomeworkSubmission>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }
}
