import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Batch, StudentEnrollment, ClassBatchSection, User } from '../../../entities';
import { SortField, SortOrder } from './dto/batches.dto';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch) private repo: Repository<Batch>,
    @InjectRepository(StudentEnrollment) private enrollmentRepo: Repository<StudentEnrollment>,
    @InjectRepository(ClassBatchSection) private cbsRepo: Repository<ClassBatchSection>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findAll(
    institute_id?: string,
    search?: string,
    sortField: SortField = SortField.YEAR,
    sortOrder: SortOrder = SortOrder.DESC,
    page: number = 1,
    limit: number = 10
  ) {
    const queryBuilder = this.repo.createQueryBuilder('batch');

    if (institute_id) {
      queryBuilder.where('batch.institute_id = :institute_id', { institute_id });
    }

    if (search) {
      queryBuilder.andWhere('(batch.name ILIKE :search OR CAST(batch.year AS TEXT) LIKE :search)', {
        search: `%${search}%`
      });
    }

    // Add student count as a subquery
    queryBuilder.addSelect((subQuery) => {
      return subQuery
        .select('COUNT(DISTINCT se.id)', 'count')
        .from(ClassBatchSection, 'cbs')
        .leftJoin(StudentEnrollment, 'se', 'se.class_batch_section_id = cbs.id AND se.is_active = true')
        .where('cbs.batch_id = batch.id');
    }, 'student_count');

    // Sorting
    if (sortField === SortField.STUDENT_COUNT) {
      queryBuilder.orderBy('student_count', sortOrder);
    } else {
      queryBuilder.orderBy(`batch.${sortField}`, sortOrder);
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
    const batches = rawResults.entities.map((batch, index) => ({
      ...batch,
      student_count: parseInt(rawResults.raw[index]?.student_count || '0')
    }));

    return {
      data: batches,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string) {
    const batch = await this.repo.findOne({ where: { id } });
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return batch;
  }

  async getBatchWithStudents(batchId: string) {
    const batch = await this.findOne(batchId);

    // Get all class_batch_sections for this batch
    const cbsList = await this.cbsRepo.find({
      where: { batch_id: batchId },
      relations: ['class', 'section']
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
      batch,
      class_batch_sections: cbsList,
      students: enrollments.map(e => ({
        ...e.student,
        enrollment_id: e.id,
        class_batch_section: e.class_batch_section,
        enrollment_date: e.enrollment_date
      }))
    };
  }

  async addStudentsToBatch(batchId: string, studentIds: string[], classBatchSectionId: string) {
    // Verify batch exists
    await this.findOne(batchId);

    // Verify class_batch_section exists and belongs to this batch
    const cbs = await this.cbsRepo.findOne({
      where: { id: classBatchSectionId, batch_id: batchId }
    });

    if (!cbs) {
      throw new BadRequestException('Invalid class_batch_section for this batch');
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
      message: `Added ${newStudentIds.length} students to batch`
    };
  }

  async removeStudentFromBatch(enrollmentId: string) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id: enrollmentId }
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Soft delete by setting is_active to false
    enrollment.is_active = false;
    await this.enrollmentRepo.save(enrollment);

    return { message: 'Student removed from batch successfully' };
  }

  async updateStudentEnrollment(enrollmentId: string, classBatchSectionId: string) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id: enrollmentId }
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    enrollment.class_batch_section_id = classBatchSectionId;
    await this.enrollmentRepo.save(enrollment);

    return enrollment;
  }
  
  async create(data: Partial<Batch>) { 
    return this.repo.save(this.repo.create(data)); 
  }

  async update(id: string, data: Partial<Batch>) { 
    await this.findOne(id);
    await this.repo.update(id, data); 
    return this.repo.findOne({ where: { id } }); 
  }

  async delete(id: string) { 
    await this.findOne(id);
    
    // Check if batch has any enrollments
    const cbsList = await this.cbsRepo.find({ where: { batch_id: id } });
    const cbsIds = cbsList.map(cbs => cbs.id);
    
    if (cbsIds.length > 0) {
      const enrollmentCount = await this.enrollmentRepo.count({
        where: { 
          class_batch_section_id: In(cbsIds),
          is_active: true 
        }
      });

      if (enrollmentCount > 0) {
        throw new BadRequestException('Cannot delete batch with active student enrollments');
      }
    }

    return this.repo.delete(id); 
  }
}
