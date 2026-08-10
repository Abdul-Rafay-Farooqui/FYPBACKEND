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
exports.CommunitiesController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const entities_1 = require("../../entities");
const communities_service_1 = require("./communities.service");
let CommunitiesController = class CommunitiesController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(user) {
        return this.svc.list(user.id);
    }
    create(user, dto) {
        return this.svc.create(user.id, dto);
    }
    get(user, id) {
        return this.svc.get(user.id, id);
    }
    update(user, id, dto) {
        return this.svc.update(user.id, id, dto);
    }
    remove(user, id) {
        return this.svc.delete(user.id, id);
    }
    addMembers(user, id, body) {
        return this.svc.addMembers(user.id, id, body.member_ids || []);
    }
    removeMember(user, id, memberId) {
        return this.svc.removeMember(user.id, id, memberId);
    }
    leave(user, id) {
        return this.svc.leave(user.id, id);
    }
    setRole(user, id, memberId, body) {
        return this.svc.setRole(user.id, id, memberId, body.role);
    }
    createGroup(user, id, body) {
        return this.svc.createGroupInCommunity(user.id, id, body);
    }
    linkGroup(user, id, groupId) {
        return this.svc.linkGroup(user.id, id, groupId);
    }
    unlinkGroup(user, id, groupId) {
        return this.svc.unlinkGroup(user.id, id, groupId);
    }
};
exports.CommunitiesController = CommunitiesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Object]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "addMembers", null);
__decorate([
    (0, common_1.Delete)(':id/members/:memberId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "leave", null);
__decorate([
    (0, common_1.Post)(':id/members/:memberId/role'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('memberId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, Object]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "setRole", null);
__decorate([
    (0, common_1.Post)(':id/groups'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Post)(':id/groups/:groupId/link'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "linkGroup", null);
__decorate([
    (0, common_1.Delete)(':id/groups/:groupId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "unlinkGroup", null);
exports.CommunitiesController = CommunitiesController = __decorate([
    (0, common_1.Controller)('communities'),
    __metadata("design:paramtypes", [communities_service_1.CommunitiesService])
], CommunitiesController);
//# sourceMappingURL=communities.controller.js.map