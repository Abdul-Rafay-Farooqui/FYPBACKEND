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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let ContactsService = class ContactsService {
    repo;
    users;
    constructor(repo, users) {
        this.repo = repo;
        this.users = users;
    }
    async list(userId) {
        const rows = await this.repo
            .createQueryBuilder('c')
            .innerJoinAndSelect('c.contact', 'contact')
            .where('c.user_id = :userId', { userId })
            .orderBy('c.is_favourite', 'DESC')
            .addOrderBy('contact.display_name', 'ASC')
            .getMany();
        return rows;
    }
    async addByPhone(userId, phone, nickname) {
        const target = await this.users.findOne({ where: { phone } });
        if (!target)
            throw new common_1.NotFoundException('No user with that phone');
        if (target.id === userId)
            throw new common_1.BadRequestException('You cannot add yourself');
        const existing = await this.repo.findOne({
            where: { user_id: userId, contact_id: target.id },
        });
        if (existing)
            return existing;
        const entity = this.repo.create({
            user_id: userId,
            contact_id: target.id,
            nickname: nickname || null,
        });
        return this.repo.save(entity);
    }
    async remove(userId, contactRowId) {
        await this.repo.delete({ id: contactRowId, user_id: userId });
        return { ok: true };
    }
    async favourite(userId, contactRowId, fav) {
        await this.repo.update({ id: contactRowId, user_id: userId }, { is_favourite: fav });
        return this.repo.findOne({ where: { id: contactRowId } });
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Contact)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map