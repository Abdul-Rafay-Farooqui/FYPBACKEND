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
exports.Resource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const cms_entities_1 = require("./cms.entities");
const institute_entities_1 = require("./institute.entities");
let Resource = class Resource {
    id;
    title;
    description;
    file_url;
    file_name;
    file_type;
    file_size;
    institute_id;
    teacher_id;
    class_batch_section_id;
    subject_id;
    resource_type;
    uploaded_at;
    institute;
    teacher;
    class_batch_section;
    subject;
    created_at;
};
exports.Resource = Resource;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Resource.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Resource.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Resource.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Resource.prototype, "file_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Resource.prototype, "file_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Resource.prototype, "file_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], Resource.prototype, "file_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Resource.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Resource.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Resource.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Resource.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'document' }),
    __metadata("design:type", String)
], Resource.prototype, "resource_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Resource.prototype, "uploaded_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => institute_entities_1.Institute),
    (0, typeorm_1.JoinColumn)({ name: 'institute_id' }),
    __metadata("design:type", institute_entities_1.Institute)
], Resource.prototype, "institute", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Resource.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.ClassBatchSection, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", cms_entities_1.ClassBatchSection)
], Resource.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", cms_entities_1.Subject)
], Resource.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Resource.prototype, "created_at", void 0);
exports.Resource = Resource = __decorate([
    (0, typeorm_1.Entity)('resources')
], Resource);
//# sourceMappingURL=resource.entity.js.map