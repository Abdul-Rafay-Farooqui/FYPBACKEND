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
exports.LiveClassParticipant = exports.LiveClass = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const cms_entities_1 = require("./cms.entities");
const institute_entities_1 = require("./institute.entities");
let LiveClass = class LiveClass {
    id;
    title;
    description;
    institute_id;
    teacher_id;
    class_batch_section_id;
    subject_id;
    meeting_url;
    meeting_id;
    meeting_password;
    scheduled_at;
    ends_at;
    duration_minutes;
    status;
    location_type;
    call_type;
    recording_url;
    institute;
    teacher;
    class_batch_section;
    subject;
    created_at;
    updated_at;
};
exports.LiveClass = LiveClass;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], LiveClass.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], LiveClass.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], LiveClass.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], LiveClass.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], LiveClass.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], LiveClass.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], LiveClass.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], LiveClass.prototype, "meeting_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], LiveClass.prototype, "meeting_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], LiveClass.prototype, "meeting_password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], LiveClass.prototype, "scheduled_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], LiveClass.prototype, "ends_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", default: 60 }),
    __metadata("design:type", Number)
], LiveClass.prototype, "duration_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "scheduled" }),
    __metadata("design:type", String)
], LiveClass.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "online" }),
    __metadata("design:type", String)
], LiveClass.prototype, "location_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "video" }),
    __metadata("design:type", String)
], LiveClass.prototype, "call_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], LiveClass.prototype, "recording_url", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => institute_entities_1.Institute),
    (0, typeorm_1.JoinColumn)({ name: "institute_id" }),
    __metadata("design:type", institute_entities_1.Institute)
], LiveClass.prototype, "institute", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "teacher_id" }),
    __metadata("design:type", user_entity_1.User)
], LiveClass.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.ClassBatchSection, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "class_batch_section_id" }),
    __metadata("design:type", cms_entities_1.ClassBatchSection)
], LiveClass.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "subject_id" }),
    __metadata("design:type", cms_entities_1.Subject)
], LiveClass.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], LiveClass.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], LiveClass.prototype, "updated_at", void 0);
exports.LiveClass = LiveClass = __decorate([
    (0, typeorm_1.Entity)("live_classes")
], LiveClass);
let LiveClassParticipant = class LiveClassParticipant {
    id;
    live_class_id;
    user_id;
    joined_at;
    left_at;
    duration_minutes;
    live_class;
    user;
    created_at;
};
exports.LiveClassParticipant = LiveClassParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], LiveClassParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], LiveClassParticipant.prototype, "live_class_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], LiveClassParticipant.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], LiveClassParticipant.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], LiveClassParticipant.prototype, "left_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", nullable: true }),
    __metadata("design:type", Number)
], LiveClassParticipant.prototype, "duration_minutes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LiveClass),
    (0, typeorm_1.JoinColumn)({ name: "live_class_id" }),
    __metadata("design:type", LiveClass)
], LiveClassParticipant.prototype, "live_class", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], LiveClassParticipant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], LiveClassParticipant.prototype, "created_at", void 0);
exports.LiveClassParticipant = LiveClassParticipant = __decorate([
    (0, typeorm_1.Entity)("live_class_participants")
], LiveClassParticipant);
//# sourceMappingURL=live-class.entity.js.map