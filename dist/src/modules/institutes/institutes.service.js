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
exports.InstitutesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let InstitutesService = class InstitutesService {
    institutes;
    members;
    users;
    classes;
    batches;
    sections;
    subjects;
    gateway;
    constructor(institutes, members, users, classes, batches, sections, subjects, gateway) {
        this.institutes = institutes;
        this.members = members;
        this.users = users;
        this.classes = classes;
        this.batches = batches;
        this.sections = sections;
        this.subjects = subjects;
        this.gateway = gateway;
    }
    async list(userId) {
        const memberships = await this.members.find({
            where: { user_id: userId, status: "active" },
        });
        const instituteIds = memberships.map((m) => m.institute_id);
        if (!instituteIds.length)
            return [];
        const institutes = await this.institutes.find({
            where: { id: (0, typeorm_2.In)(instituteIds), is_active: true },
        });
        return institutes.map((inst) => {
            const membership = memberships.find((m) => m.institute_id === inst.id);
            return {
                ...inst,
                current_user_role: membership?.role,
            };
        });
    }
    async create(userId, dto) {
        const institute = this.institutes.create({
            ...dto,
            created_by: userId,
        });
        await this.institutes.save(institute);
        const member = this.members.create({
            institute_id: institute.id,
            user_id: userId,
            role: "admin",
            status: "active",
        });
        await this.members.save(member);
        if (dto.member_ids?.length) {
            await this.addMembers(userId, institute.id, {
                user_ids: dto.member_ids,
                role: "student",
            });
        }
        return institute;
    }
    async get(userId, instituteId) {
        await this.checkMembership(userId, instituteId);
        const institute = await this.institutes.findOne({
            where: { id: instituteId },
        });
        if (!institute)
            throw new common_1.NotFoundException("Institute not found");
        return institute;
    }
    async update(userId, instituteId, dto) {
        await this.checkAdminRole(userId, instituteId);
        await this.institutes.update(instituteId, dto);
        return this.institutes.findOne({ where: { id: instituteId } });
    }
    async delete(userId, instituteId) {
        await this.checkAdminRole(userId, instituteId);
        await this.institutes.update(instituteId, { is_active: false });
        return { success: true };
    }
    async addMembers(userId, instituteId, dto) {
        await this.checkAdminRole(userId, instituteId);
        const members = dto.user_ids.map((uid) => this.members.create({
            institute_id: instituteId,
            user_id: uid,
            role: dto.role || "student",
            invited_by: userId,
            status: "active",
        }));
        await this.members.save(members);
        const institute = await this.institutes.findOne({ where: { id: instituteId } });
        for (const uid of dto.user_ids) {
            this.gateway.addUserToInstituteRoom(uid, instituteId);
            this.gateway.emitToUser(uid, "institute:member-added", {
                institute_id: instituteId,
                institute_name: institute?.name,
                role: dto.role || "student",
                added_by: userId,
            });
        }
        this.gateway.emitToInstitute(instituteId, "institute:members-added", {
            institute_id: instituteId,
            user_ids: dto.user_ids,
            role: dto.role || "student",
            added_by: userId,
        });
        return { success: true, count: members.length };
    }
    async getMembers(userId, instituteId, role) {
        await this.checkMembership(userId, instituteId);
        const where = { institute_id: instituteId, status: "active" };
        if (role)
            where.role = role;
        const memberships = await this.members.find({ where });
        const userIds = memberships.map((m) => m.user_id);
        if (!userIds.length)
            return [];
        const users = await this.users.find({ where: { id: (0, typeorm_2.In)(userIds) } });
        return memberships.map((m) => {
            const user = users.find((u) => u.id === m.user_id);
            return {
                ...m,
                user,
            };
        });
    }
    async updateMember(userId, instituteId, memberId, dto) {
        await this.checkAdminRole(userId, instituteId);
        await this.members.update(memberId, dto);
        return { success: true };
    }
    async removeMember(userId, instituteId, memberId) {
        await this.checkAdminRole(userId, instituteId);
        const member = await this.members.findOne({ where: { id: memberId } });
        await this.members.update(memberId, { status: "left" });
        if (member) {
            this.gateway.removeUserFromInstituteRoom(member.user_id, instituteId);
            this.gateway.emitToUser(member.user_id, "institute:member-removed", {
                institute_id: instituteId,
                removed_by: userId,
            });
            this.gateway.emitToInstitute(instituteId, "institute:member-removed", {
                institute_id: instituteId,
                user_id: member.user_id,
                removed_by: userId,
            });
        }
        return { success: true };
    }
    async checkMembership(userId, instituteId) {
        const member = await this.members.findOne({
            where: { user_id: userId, institute_id: instituteId, status: "active" },
        });
        if (!member)
            throw new common_1.ForbiddenException("Not a member of this institute");
        return member;
    }
    async checkAdminRole(userId, instituteId) {
        const member = await this.checkMembership(userId, instituteId);
        if (member.role !== "admin") {
            throw new common_1.ForbiddenException("Admin role required");
        }
        return member;
    }
};
exports.InstitutesService = InstitutesService;
exports.InstitutesService = InstitutesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Institute)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.InstituteMember)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.ClassEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.Batch)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.Section)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], InstitutesService);
//# sourceMappingURL=institutes.service.js.map