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
exports.ConversationsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const entities_1 = require("../../entities");
const conversations_service_1 = require("./conversations.service");
let ConversationsController = class ConversationsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(user, archived) {
        if (archived === 'true')
            return this.svc.listArchived(user.id);
        return this.svc.list(user.id);
    }
    getOrCreate(user, body) {
        return this.svc.getOrCreate1on1(user.id, body.other_user_id);
    }
    createGroup(user, body) {
        return this.svc.createGroup(user.id, body);
    }
    getOne(user, id) {
        return this.svc.getOne(user.id, id);
    }
    markRead(user, id) {
        return this.svc.markRead(user.id, id);
    }
    pin(user, id, body) {
        return this.svc.setPin(user.id, id, !!body.pinned);
    }
    mute(user, id, body) {
        return this.svc.setMute(user.id, id, !!body.muted, body.until ? new Date(body.until) : undefined);
    }
    archive(user, id, body) {
        return this.svc.archive(user.id, id, !!body.archived);
    }
    clear(user, id) {
        return this.svc.clear(user.id, id);
    }
    hide(user, id) {
        return this.svc.hide(user.id, id);
    }
    lock(user, id, body) {
        return this.svc.lock(user.id, id, body.pin);
    }
    unlock(user, id, body) {
        return this.svc.unlock(user.id, id, body.pin);
    }
    removeLock(user, id, body) {
        return this.svc.removeLock(user.id, id, body.pin);
    }
    disappearing(user, id, body) {
        return this.svc.setDisappearingTimer(user.id, id, body.seconds);
    }
};
exports.ConversationsController = ConversationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('archived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "getOrCreate", null);
__decorate([
    (0, common_1.Post)('group'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "markRead", null);
__decorate([
    (0, common_1.Post)(':id/pin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "pin", null);
__decorate([
    (0, common_1.Post)(':id/mute'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "mute", null);
__decorate([
    (0, common_1.Post)(':id/archive'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "archive", null);
__decorate([
    (0, common_1.Post)(':id/clear'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "clear", null);
__decorate([
    (0, common_1.Post)(':id/hide'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "hide", null);
__decorate([
    (0, common_1.Post)(':id/lock'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "lock", null);
__decorate([
    (0, common_1.Post)(':id/unlock'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "unlock", null);
__decorate([
    (0, common_1.Post)(':id/remove-lock'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "removeLock", null);
__decorate([
    (0, common_1.Post)(':id/disappearing'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "disappearing", null);
exports.ConversationsController = ConversationsController = __decorate([
    (0, common_1.Controller)('conversations'),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], ConversationsController);
//# sourceMappingURL=conversations.controller.js.map