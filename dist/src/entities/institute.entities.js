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
exports.InstituteNotification = exports.InstituteMember = exports.Institute = void 0;
const typeorm_1 = require("typeorm");
let Institute = class Institute {
    id;
    name;
    slug;
    description;
    logo_url;
    website_url;
    created_by;
    is_active;
    created_at;
    updated_at;
};
exports.Institute = Institute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Institute.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Institute.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, unique: true }),
    __metadata("design:type", String)
], Institute.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Institute.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Institute.prototype, "logo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Institute.prototype, "website_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Institute.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Institute.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Institute.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Institute.prototype, "updated_at", void 0);
exports.Institute = Institute = __decorate([
    (0, typeorm_1.Entity)("institutes")
], Institute);
let InstituteMember = class InstituteMember {
    id;
    institute_id;
    user_id;
    role;
    employee_code;
    student_code;
    joined_at;
    invited_by;
    status;
    created_at;
    updated_at;
};
exports.InstituteMember = InstituteMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], InstituteMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], InstituteMember.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], InstituteMember.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "student" }),
    __metadata("design:type", String)
], InstituteMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InstituteMember.prototype, "employee_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InstituteMember.prototype, "student_code", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], InstituteMember.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], InstituteMember.prototype, "invited_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "active" }),
    __metadata("design:type", String)
], InstituteMember.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], InstituteMember.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], InstituteMember.prototype, "updated_at", void 0);
exports.InstituteMember = InstituteMember = __decorate([
    (0, typeorm_1.Entity)("institute_members"),
    (0, typeorm_1.Unique)(["institute_id", "user_id"])
], InstituteMember);
let InstituteNotification = class InstituteNotification {
    id;
    institute_id;
    user_id;
    type;
    title;
    message;
    read;
    metadata;
    related_id;
    related_type;
    created_at;
    read_at;
};
exports.InstituteNotification = InstituteNotification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], InstituteNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], InstituteNotification.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], InstituteNotification.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], InstituteNotification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], InstituteNotification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], InstituteNotification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], InstituteNotification.prototype, "read", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], InstituteNotification.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], InstituteNotification.prototype, "related_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InstituteNotification.prototype, "related_type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], InstituteNotification.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], InstituteNotification.prototype, "read_at", void 0);
exports.InstituteNotification = InstituteNotification = __decorate([
    (0, typeorm_1.Entity)("institute_notifications")
], InstituteNotification);
//# sourceMappingURL=institute.entities.js.map