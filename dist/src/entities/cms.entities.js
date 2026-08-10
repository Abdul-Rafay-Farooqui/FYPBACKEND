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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherAssignment = exports.StudentEnrollment = exports.Schedule = exports.Result = exports.Attendance = exports.Announcement = exports.HomeworkSubmission = exports.Homework = exports.ClassBatchSection = exports.Subject = exports.Section = exports.ClassEntity = exports.Batch = exports.School = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let School = class School {
    id;
    name;
    school_password;
    personal_code;
    admin_id;
    admin;
    created_at;
};
exports.School = School;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], School.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], School.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], School.prototype, "school_password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], School.prototype, "personal_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], School.prototype, "admin_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'admin_id' }),
    __metadata("design:type", user_entity_1.User)
], School.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], School.prototype, "created_at", void 0);
exports.School = School = __decorate([
    (0, typeorm_1.Entity)('schools')
], School);
let Batch = class Batch {
    id;
    institute_id;
    name;
    year;
    created_at;
};
exports.Batch = Batch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Batch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Batch.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Batch.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Batch.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Batch.prototype, "created_at", void 0);
exports.Batch = Batch = __decorate([
    (0, typeorm_1.Entity)('batches')
], Batch);
let ClassEntity = class ClassEntity {
    id;
    institute_id;
    name;
    description;
    created_at;
};
exports.ClassEntity = ClassEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClassEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ClassEntity.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClassEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ClassEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ClassEntity.prototype, "created_at", void 0);
exports.ClassEntity = ClassEntity = __decorate([
    (0, typeorm_1.Entity)('classes')
], ClassEntity);
let Section = class Section {
    id;
    institute_id;
    name;
    created_at;
};
exports.Section = Section;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Section.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Section.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Section.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Section.prototype, "created_at", void 0);
exports.Section = Section = __decorate([
    (0, typeorm_1.Entity)('sections')
], Section);
let Subject = class Subject {
    id;
    institute_id;
    name;
    code;
    course_code;
    created_at;
};
exports.Subject = Subject;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Subject.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Subject.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Subject.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Subject.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, nullable: true }),
    __metadata("design:type", String)
], Subject.prototype, "course_code", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Subject.prototype, "created_at", void 0);
exports.Subject = Subject = __decorate([
    (0, typeorm_1.Entity)('subjects')
], Subject);
let ClassBatchSection = class ClassBatchSection {
    id;
    class_id;
    batch_id;
    section_id;
    class;
    batch;
    section;
    created_at;
};
exports.ClassBatchSection = ClassBatchSection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClassBatchSection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClassBatchSection.prototype, "class_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClassBatchSection.prototype, "batch_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClassBatchSection.prototype, "section_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClassEntity, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_id' }),
    __metadata("design:type", ClassEntity)
], ClassBatchSection.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Batch, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", Batch)
], ClassBatchSection.prototype, "batch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Section, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'section_id' }),
    __metadata("design:type", Section)
], ClassBatchSection.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ClassBatchSection.prototype, "created_at", void 0);
exports.ClassBatchSection = ClassBatchSection = __decorate([
    (0, typeorm_1.Entity)('class_batch_sections')
], ClassBatchSection);
let Homework = class Homework {
    id;
    institute_id;
    teacher_id;
    class_batch_section_id;
    subject_id;
    title;
    description;
    image_url;
    due_date;
    published_date;
    teacher;
    class_batch_section;
    subject;
    created_at;
};
exports.Homework = Homework;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Homework.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Homework.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Homework.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Homework.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Homework.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Homework.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Homework.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Homework.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Homework.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Homework.prototype, "published_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Homework.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClassBatchSection, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", ClassBatchSection)
], Homework.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", Subject)
], Homework.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Homework.prototype, "created_at", void 0);
exports.Homework = Homework = __decorate([
    (0, typeorm_1.Entity)('homework')
], Homework);
let HomeworkSubmission = class HomeworkSubmission {
    id;
    homework_id;
    student_id;
    submission_text;
    image_url;
    stars;
    teacher_feedback;
    submitted_date;
    homework;
    student;
    created_at;
};
exports.HomeworkSubmission = HomeworkSubmission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "homework_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "submission_text", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], HomeworkSubmission.prototype, "stars", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "teacher_feedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], HomeworkSubmission.prototype, "submitted_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Homework),
    (0, typeorm_1.JoinColumn)({ name: 'homework_id' }),
    __metadata("design:type", Homework)
], HomeworkSubmission.prototype, "homework", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], HomeworkSubmission.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], HomeworkSubmission.prototype, "created_at", void 0);
exports.HomeworkSubmission = HomeworkSubmission = __decorate([
    (0, typeorm_1.Entity)('homework_submissions')
], HomeworkSubmission);
let Announcement = class Announcement {
    id;
    institute_id;
    teacher_id;
    class_batch_section_id;
    subject_id;
    announcement_type;
    student_id;
    title;
    content;
    published_date;
    teacher;
    class_batch_section;
    subject;
    student;
    created_at;
};
exports.Announcement = Announcement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Announcement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Announcement.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Announcement.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Announcement.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Announcement.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Announcement.prototype, "announcement_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Announcement.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Announcement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Announcement.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Announcement.prototype, "published_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Announcement.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClassBatchSection, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", ClassBatchSection)
], Announcement.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", Subject)
], Announcement.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], Announcement.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Announcement.prototype, "created_at", void 0);
exports.Announcement = Announcement = __decorate([
    (0, typeorm_1.Entity)('announcements')
], Announcement);
let Attendance = class Attendance {
    id;
    class_batch_section_id;
    student_id;
    teacher_id;
    subject_id;
    institute_id;
    attendance_date;
    status;
    class_batch_section;
    student;
    teacher;
    subject;
    created_at;
    updated_at;
};
exports.Attendance = Attendance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Attendance.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Attendance.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Attendance.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Attendance.prototype, "attendance_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClassBatchSection, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", ClassBatchSection)
], Attendance.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], Attendance.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Attendance.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", Subject)
], Attendance.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Attendance.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Attendance.prototype, "updated_at", void 0);
exports.Attendance = Attendance = __decorate([
    (0, typeorm_1.Entity)('attendance')
], Attendance);
let Result = class Result {
    id;
    student_id;
    teacher_id;
    class_batch_section_id;
    subject_id;
    result_type;
    marks_obtained;
    total_marks;
    grade;
    remarks;
    published_date;
    student;
    teacher;
    class_batch_section;
    subject;
    created_at;
};
exports.Result = Result;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Result.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Result.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Result.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Result.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Result.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Result.prototype, "result_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], Result.prototype, "marks_obtained", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric' }),
    __metadata("design:type", Number)
], Result.prototype, "total_marks", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Result.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Result.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Result.prototype, "published_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], Result.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Result.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClassBatchSection, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", ClassBatchSection)
], Result.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", Subject)
], Result.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Result.prototype, "created_at", void 0);
exports.Result = Result = __decorate([
    (0, typeorm_1.Entity)('results')
], Result);
let Schedule = class Schedule {
    id;
    teacher_id;
    class_batch_section_id;
    subject_id;
    day_of_week;
    start_time;
    end_time;
    teacher;
    class_batch_section;
    subject;
    created_at;
};
exports.Schedule = Schedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Schedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Schedule.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Schedule.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Schedule.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Schedule.prototype, "day_of_week", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Schedule.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Schedule.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Schedule.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClassBatchSection),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", ClassBatchSection)
], Schedule.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", Subject)
], Schedule.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Schedule.prototype, "created_at", void 0);
exports.Schedule = Schedule = __decorate([
    (0, typeorm_1.Entity)('schedules')
], Schedule);
let StudentEnrollment = class StudentEnrollment {
    id;
    student_id;
    class_batch_section_id;
    enrollment_date;
    is_active;
    student;
    class_batch_section;
    created_at;
};
exports.StudentEnrollment = StudentEnrollment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentEnrollment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentEnrollment.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentEnrollment.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], StudentEnrollment.prototype, "enrollment_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], StudentEnrollment.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], StudentEnrollment.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClassBatchSection, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", ClassBatchSection)
], StudentEnrollment.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], StudentEnrollment.prototype, "created_at", void 0);
exports.StudentEnrollment = StudentEnrollment = __decorate([
    (0, typeorm_1.Entity)('student_enrollments')
], StudentEnrollment);
let TeacherAssignment = class TeacherAssignment {
    id;
    teacher_id;
    class_batch_section_id;
    subject_id;
    teacher;
    class_batch_section;
    subject;
    created_at;
};
exports.TeacherAssignment = TeacherAssignment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TeacherAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherAssignment.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TeacherAssignment.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TeacherAssignment.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], TeacherAssignment.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ClassBatchSection, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", ClassBatchSection)
], TeacherAssignment.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Subject, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", Subject)
], TeacherAssignment.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TeacherAssignment.prototype, "created_at", void 0);
exports.TeacherAssignment = TeacherAssignment = __decorate([
    (0, typeorm_1.Entity)('teacher_assignments')
], TeacherAssignment);
//# sourceMappingURL=cms.entities.js.map