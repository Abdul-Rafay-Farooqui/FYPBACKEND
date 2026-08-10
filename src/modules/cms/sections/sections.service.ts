import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Section, StudentEnrollment, ClassBatchSection, User } from '../../../entities';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section) private repo: Repository<Section>,
    @InjectRepository(StudentEnrollment) private enrollmentRepo: Repository<StudentEnrollment>,
    @InjectRepository(ClassBatchSection) private cbsRepo: Repository<ClassBatchSection>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findAll(
    institute_id?: string,
    search?: string,
    sortField: 'name' | 'created_at' | 'student_count' = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    page: number = 1,
    limit: number = 10
  ) {
    const queryBuilder = this.repo.createQueryBuilder('section');

    if (institute_id) {
      queryBuilder.where('section.institute_id = :institute_id', { institute_id });
    }

    if (search) {
      queryBuilder.andWhere('section.name ILIKE :search', { search: `%${search}%` });
    }

    // Add student count as a subquery
    queryBuilder.addSelect((subQuery) => {
      return subQuery
        .select('COUNT(DISTINCT se.id)', 'count')
        .from(ClassBatchSection, 'cbs')
        .leftJoin(StudentEnrollment, 'se', 'se.class_batch_section_id = cbs.id AND se.is_active = true')
        .where('cbs.section_id = section.id');
    }, 'student_count');

    // Sorting
    if (sortField === 'student_count') {
      queryBuilder.orderBy('student_count', sortOrder);
    } else {
      queryBuilder.orderBy(`section.${sortField}`, sortOrder);
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Get raw and entities to include the computed student_count
    const [rawResults, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      queryBuilder.getCount()
    ]);

    // Map the student_count from raw results to entities
    const sections = rawResults.entities.map((section, index) => ({
      ...section,
      student_count: parseInt(rawResults.raw[index]?.student_count || '0')
    }));

    return {
      data: sections,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string) {
    const section = await this.repo.findOne({ where: { id } });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  async getSectionWithStudents(sectionId: string) {
    const section = await this.findOne(sectionId);

    // Get all class_batch_sections for this section
    const cbsList = await this.cbsRepo.find({
      where: { section_id: sectionId },
      relations: ['class', 'batch']
    });

    // Get all students enrolled in these class_batch_sections
    const cbsIds = cbsList.map(cbs => cbs.id);
    const enrollments = await this.enrollmentRepo.find({
      where: { 
        class_batch_section_id: In(cbsIds),
        is_active: true 
      },
      relations: ['student', 'class_batch_section']
    });

    return {
      section,
      class_batch_sections: cbsList,
      students: enrollments.map(e => ({
        ...e.student,
        enrollment_id: e.id,
        class_batch_section: e.class_batch_section,
        enrollment_date: e.enrollment_date
      }))
    };
  }

  async addStudentsToSection(sectionId: string, studentIds: string[], classBatchSectionId: string) {
    // Verify section exists
    await this.findOne(sectionId);

    // Verify class_batch_section exists and belongs to this section
    const cbs = await this.cbsRepo.findOne({
      where: { id: classBatchSectionId, section_id: sectionId }
    });

    if (!cbs) {
      throw new BadRequestException('Invalid class_batch_section for this section');
    }

    // Verify all students exist and have student role
    const students = await this.userRepo.find({
      where: { 
        id: In(studentIds),
        school_role: 'student'
      }
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('Some student IDs are invalid or not students');
    }

    // Check for existing enrollments
    const existingEnrollments = await this.enrollmentRepo.find({
      where: {
        student_id: In(studentIds),
        class_batch_section_id: classBatchSectionId
      }
    });

    const existingStudentIds = existingEnrollments.map(e => e.student_id);
    const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));

    // Create new enrollments
    const enrollments = newStudentIds.map(studentId => 
      this.enrollmentRepo.create({
        student_id: studentId,
        class_batch_section_id: classBatchSectionId,
        is_active: true
      })
    );

    await this.enrollmentRepo.save(enrollments);

    return {
      added: newStudentIds.length,
      skipped: existingStudentIds.length,
      message: `Added ${newStudentIds.length} students to section`
    };
  }

  async removeStudentFromSection(enrollmentId: string) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id: enrollmentId }
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Soft delete by setting is_active to false
    enrollment.is_active = false;
    await this.enrollmentRepo.save(enrollment);

    return { message: 'Student removed from section successfully' };
  }

  async create(data: Partial<Section>) {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<Section>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: string) {
    await this.findOne(id);
    
    // Check if section has any enrollments
    const cbsList = await this.cbsRepo.find({ where: { section_id: id } });
    const cbsIds = cbsList.map(cbs => cbs.id);
    
    if (cbsIds.length > 0) {
      const enrollmentCount = await this.enrollmentRepo.count({
        where: { 
          class_batch_section_id: In(cbsIds),
          is_active: true 
        }
      });

      if (enrollmentCount > 0) {
        throw new BadRequestException('Cannot delete section with active student enrollments');
      }
    }

    return this.repo.delete(id);
  }
}
