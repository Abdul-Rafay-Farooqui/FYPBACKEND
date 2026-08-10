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
exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
    id;
    phone;
    password_hash;
    display_name;
    email;
    school_role;
    school_id;
    username;
    avatar_url;
    about;
    last_seen;
    is_online;
    onboarding_complete;
    privacy_last_seen;
    privacy_profile_pic;
    privacy_about;
    privacy_status;
    notifications_enabled;
    theme;
    created_at;
    updated_at;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'password_hash', select: false }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], User.prototype, "display_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, default: 'student' }),
    __metadata("design:type", String)
], User.prototype, "school_role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "school_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'Hey there! I am using WeConnect.' }),
    __metadata("design:type", String)
], User.prototype, "about", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], User.prototype, "last_seen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_online", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "onboarding_complete", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'everyone' }),
    __metadata("design:type", String)
], User.prototype, "privacy_last_seen", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'everyone' }),
    __metadata("design:type", String)
], User.prototype, "privacy_profile_pic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'everyone' }),
    __metadata("design:type", String)
], User.prototype, "privacy_about", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'contacts' }),
    __metadata("design:type", String)
], User.prototype, "privacy_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "notifications_enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'dark' }),
    __metadata("design:type", String)
], User.prototype, "theme", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map