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
exports.CmsUsersController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const users_service_1 = require("./users.service");
const users_dto_1 = require("./dto/users.dto");
let CmsUsersController = class CmsUsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async registerSchool(data) {
        return this.usersService.registerSchool(data);
    }
    async login(data) {
        return this.usersService.login(data);
    }
    async findAll(schoolId, role) {
        return this.usersService.findBySchool(schoolId, role);
    }
    async count(schoolId, role) {
        const count = await this.usersService.countBySchool(schoolId, role);
        return { count };
    }
    async create(data) {
        return this.usersService.create(data);
    }
    async delete(id) {
        return this.usersService.delete(id);
    }
};
exports.CmsUsersController = CmsUsersController;
__decorate([
    (0, common_1.Post)('register-school'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.RegisterSchoolDto]),
    __metadata("design:returntype", Promise)
], CmsUsersController.prototype, "registerSchool", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], CmsUsersController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('school_id')),
    __param(1, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CmsUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    __param(0, (0, common_1.Query)('school_id')),
    __param(1, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CmsUsersController.prototype, "count", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], CmsUsersController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsUsersController.prototype, "delete", null);
exports.CmsUsersController = CmsUsersController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('cms/users'),
    __metadata("design:paramtypes", [users_service_1.CmsUsersService])
], CmsUsersController);
//# sourceMappingURL=users.controller.js.map