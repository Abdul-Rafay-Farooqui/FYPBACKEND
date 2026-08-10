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
exports.Discussion = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const cms_entities_1 = require("./cms.entities");
const institute_entities_1 = require("./institute.entities");
let Discussion = class Discussion {
    id;
    student_id;
    teacher_id;
    institute_id;
    class_batch_section_id;
    subject_id;
    title;
    message;
    parent_id;
    created_by;
    is_read;
    student;
    teacher;
    institute;
    class_batch_section;
    subject;
    parent;
    created_at;
};
exports.Discussion = Discussion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Discussion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Discussion.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Discussion.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Discussion.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Discussion.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Discussion.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Discussion.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Discussion.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Discussion.prototype, "parent_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Discussion.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Discussion.prototype, "is_read", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], Discussion.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Discussion.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => institute_entities_1.Institute),
    (0, typeorm_1.JoinColumn)({ name: 'institute_id' }),
    __metadata("design:type", institute_entities_1.Institute)
], Discussion.prototype, "institute", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.ClassBatchSection, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", cms_entities_1.ClassBatchSection)
], Discussion.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", cms_entities_1.Subject)
], Discussion.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Discussion, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Discussion)
], Discussion.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Discussion.prototype, "created_at", void 0);
exports.Discussion = Discussion = __decorate([
    (0, typeorm_1.Entity)('discussions')
], Discussion);
//# sourceMappingURL=discussion.entity.js.map