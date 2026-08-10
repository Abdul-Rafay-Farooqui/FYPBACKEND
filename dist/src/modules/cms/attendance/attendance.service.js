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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../entities");
let AttendanceService = class AttendanceService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findByStudent(studentId) {
        return this.repo.find({
            where: { student_id: studentId },
            order: { attendance_date: 'DESC' },
        });
    }
    async findByCbsAndDate(cbsId, date) {
        return this.repo.find({
            where: { class_batch_section_id: cbsId, attendance_date: date },
        });
    }
    async deleteByCbsAndDate(cbsId, date) {
        return this.repo.delete({ class_batch_section_id: cbsId, attendance_date: date });
    }
    async createBulk(records) {
        const entities = records.map(r => this.repo.create(r));
        return this.repo.save(entities);
    }
    async findBySubjectAndDate(subjectId, date, instituteId) {
        return this.repo.find({
            where: {
                subject_id: subjectId,
                attendance_date: date,
                institute_id: instituteId
            },
            relations: ['student'],
        });
    }
    async findBySubjectAndMonth(subjectId, yearMonth, instituteId) {
        const [year, month] = yearMonth.split('-');
        const startDate = `${year}-${month}-01`;
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        const endDate = `${year}-${month}-${lastDay}`;
        return this.repo
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.student', 'student')
            .where('attendance.subject_id = :subjectId', { subjectId })
            .andWhere('attendance.institute_id = :instituteId', { instituteId })
            .andWhere('attendance.attendance_date >= :startDate', { startDate })
            .andWhere('attendance.attendance_date <= :endDate', { endDate })
            .orderBy('attendance.attendance_date', 'ASC')
            .getMany();
    }
    async findBySubjectAndStudent(subjectId, studentId, instituteId) {
        return this.repo.find({
            where: {
                subject_id: subjectId,
                student_id: studentId,
                institute_id: instituteId,
            },
            order: {
                attendance_date: 'DESC',
            },
        });
    }
    async saveBulkAttendance(records) {
        const results = [];
        for (const record of records) {
            const existing = await this.repo.findOne({
                where: {
                    student_id: record.student_id,
                    attendance_date: record.attendance_date,
                    subject_id: record.subject_id,
                    institute_id: record.institute_id,
                },
            });
            if (existing) {
                await this.repo.update(existing.id, {
                    status: record.status,
                    teacher_id: record.teacher_id,
                    updated_at: new Date(),
                });
                results.push({ ...existing, status: record.status });
            }
            else {
                const entity = this.repo.create(record);
                const saved = await this.repo.save(entity);
                results.push(saved);
            }
        }
        return results;
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map