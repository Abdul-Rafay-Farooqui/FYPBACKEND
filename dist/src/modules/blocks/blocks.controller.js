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
exports.BlocksController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const entities_1 = require("../../entities");
const blocks_service_1 = require("./blocks.service");
let BlocksController = class BlocksController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(u) {
        return this.svc.listBlocked(u.id);
    }
    async check(u, targetId) {
        const iBlockedThem = await this.svc.isBlocked(u.id, targetId);
        const theyBlockedMe = await this.svc.isBlocked(targetId, u.id);
        return {
            i_blocked_them: iBlockedThem,
            they_blocked_me: theyBlockedMe,
            is_blocked: iBlockedThem || theyBlockedMe,
        };
    }
    block(u, targetId) {
        return this.svc.block(u.id, targetId);
    }
    unblock(u, targetId) {
        return this.svc.unblock(u.id, targetId);
    }
    report(u, targetId, body) {
        return this.svc.report(u.id, targetId, body?.reason);
    }
};
exports.BlocksController = BlocksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", void 0)
], BlocksController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('check/:targetId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "check", null);
__decorate([
    (0, common_1.Post)(':targetId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], BlocksController.prototype, "block", null);
__decorate([
    (0, common_1.Delete)(':targetId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], BlocksController.prototype, "unblock", null);
__decorate([
    (0, common_1.Post)('report/:targetId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('targetId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], BlocksController.prototype, "report", null);
exports.BlocksController = BlocksController = __decorate([
    (0, common_1.Controller)('blocks'),
    __metadata("design:paramtypes", [blocks_service_1.BlocksService])
], BlocksController);
//# sourceMappingURL=blocks.controller.js.map