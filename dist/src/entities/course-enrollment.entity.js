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
exports.CourseEnrollment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const cms_entities_1 = require("./cms.entities");
const institute_entities_1 = require("./institute.entities");
let CourseEnrollment = class CourseEnrollment {
    id;
    student_id;
    subject_id;
    institute_id;
    enrolled_at;
    student;
    subject;
    institute;
    created_at;
};
exports.CourseEnrollment = CourseEnrollment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CourseEnrollment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CourseEnrollment.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CourseEnrollment.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CourseEnrollment.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], CourseEnrollment.prototype, "enrolled_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], CourseEnrollment.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.Subject, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", cms_entities_1.Subject)
], CourseEnrollment.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => institute_entities_1.Institute),
    (0, typeorm_1.JoinColumn)({ name: 'institute_id' }),
    __metadata("design:type", institute_entities_1.Institute)
], CourseEnrollment.prototype, "institute", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CourseEnrollment.prototype, "created_at", void 0);
exports.CourseEnrollment = CourseEnrollment = __decorate([
    (0, typeorm_1.Entity)('course_enrollments')
], CourseEnrollment);
//# sourceMappingURL=course-enrollment.entity.js.map