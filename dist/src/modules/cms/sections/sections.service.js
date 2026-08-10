"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../entities");
let SectionsService = class SectionsService {
    repo;
    enrollmentRepo;
    cbsRepo;
    userRepo;
    constructor(repo, enrollmentRepo, cbsRepo, userRepo) {
        this.repo = repo;
        this.enrollmentRepo = enrollmentRepo;
        this.cbsRepo = cbsRepo;
        this.userRepo = userRepo;
    }
    async findAll(institute_id, search, sortField = 'name', sortOrder = 'ASC', page = 1, limit = 10) {
        const queryBuilder = this.repo.createQueryBuilder('section');
        if (institute_id) {
            queryBuilder.where('section.institute_id = :institute_id', { institute_id });
        }
        if (search) {
            queryBuilder.andWhere('section.name ILIKE :search', { search: `%${search}%` });
        }
        queryBuilder.addSelect((subQuery) => {
            return subQuery
                .select('COUNT(DISTINCT se.id)', 'count')
                .from(entities_1.ClassBatchSection, 'cbs')
                .leftJoin(entities_1.StudentEnrollment, 'se', 'se.class_batch_section_id = cbs.id AND se.is_active = true')
                .where('cbs.section_id = section.id');
        }, 'student_count');
        if (sortField === 'student_count') {
            queryBuilder.orderBy('student_count', sortOrder);
        }
        else {
            queryBuilder.orderBy(`section.${sortField}`, sortOrder);
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        const [rawResults, total] = await Promise.all([
            queryBuilder.getRawAndEntities(),
            queryBuilder.getCount()
        ]);
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
    async findOne(id) {
        const section = await this.repo.findOne({ where: { id } });
        if (!section) {
            throw new common_1.NotFoundException(`Section with ID ${id} not found`);
        }
        return section;
    }
    async getSectionWithStudents(sectionId) {
        const section = await this.findOne(sectionId);
        const cbsList = await this.cbsRepo.find({
            where: { section_id: sectionId },
            relations: ['class', 'batch']
        });
        const cbsIds = cbsList.map(cbs => cbs.id);
        const enrollments = await this.enrollmentRepo.find({
            where: {
                class_batch_section_id: (0, typeorm_2.In)(cbsIds),
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
    async addStudentsToSection(sectionId, studentIds, classBatchSectionId) {
        await this.findOne(sectionId);
        const cbs = await this.cbsRepo.findOne({
            where: { id: classBatchSectionId, section_id: sectionId }
        });
        if (!cbs) {
            throw new common_1.BadRequestException('Invalid class_batch_section for this section');
        }
        const students = await this.userRepo.find({
            where: {
                id: (0, typeorm_2.In)(studentIds),
                school_role: 'student'
            }
        });
        if (students.length !== studentIds.length) {
            throw new common_1.BadRequestException('Some student IDs are invalid or not students');
        }
        const existingEnrollments = await this.enrollmentRepo.find({
            where: {
                student_id: (0, typeorm_2.In)(studentIds),
                class_batch_section_id: classBatchSectionId
            }
        });
        const existingStudentIds = existingEnrollments.map(e => e.student_id);
        const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));
        const enrollments = newStudentIds.map(studentId => this.enrollmentRepo.create({
            student_id: studentId,
            class_batch_section_id: classBatchSectionId,
            is_active: true
        }));
        await this.enrollmentRepo.save(enrollments);
        return {
            added: newStudentIds.length,
            skipped: existingStudentIds.length,
            message: `Added ${newStudentIds.length} students to section`
        };
    }
    async removeStudentFromSection(enrollmentId) {
        const enrollment = await this.enrollmentRepo.findOne({
            where: { id: enrollmentId }
        });
        if (!enrollment) {
            throw new common_1.NotFoundException('Enrollment not found');
        }
        enrollment.is_active = false;
        await this.enrollmentRepo.save(enrollment);
        return { message: 'Student removed from section successfully' };
    }
    async create(data) {
        return this.repo.save(this.repo.create(data));
    }
    async update(id, data) {
        await this.findOne(id);
        await this.repo.update(id, data);
        return this.repo.findOne({ where: { id } });
    }
    async delete(id) {
        await this.findOne(id);
        const cbsList = await this.cbsRepo.find({ where: { section_id: id } });
        const cbsIds = cbsList.map(cbs => cbs.id);
        if (cbsIds.length > 0) {
            const enrollmentCount = await this.enrollmentRepo.count({
                where: {
                    class_batch_section_id: (0, typeorm_2.In)(cbsIds),
                    is_active: true
                }
            });
            if (enrollmentCount > 0) {
                throw new common_1.BadRequestException('Cannot delete section with active student enrollments');
            }
        }
        return this.repo.delete(id);
    }
};
exports.SectionsService = SectionsService;
exports.SectionsService = SectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Section)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.StudentEnrollment)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.ClassBatchSection)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SectionsService);
//# sourceMappingURL=sections.service.js.map