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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const entities_1 = require("../../entities");
const messages_service_1 = require("./messages.service");
let MessagesController = class MessagesController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(user, conversationId, conversationIdAlt, limit) {
        const cid = conversationId || conversationIdAlt;
        return this.svc.list(user.id, cid, limit ? +limit : 200);
    }
    send(user, dto) {
        return this.svc.send(user.id, dto);
    }
    edit(user, id, body) {
        return this.svc.edit(user.id, id, body.content);
    }
    deleteForMe(user, id) {
        return this.svc.deleteForMe(user.id, id);
    }
    deleteForAll(user, id) {
        return this.svc.deleteForEveryone(user.id, id);
    }
    read(user, body) {
        return this.svc.markRead(user.id, body.ids || body.message_ids || []);
    }
    react(user, id, body) {
        return this.svc.react(user.id, id, body.emoji);
    }
    pin(user, id) {
        return this.svc.pin(user.id, id);
    }
    unpin(user, cid) {
        return this.svc.unpin(user.id, cid);
    }
    pinned(user, cid) {
        return this.svc.getPinned(user.id, cid);
    }
    star(user, id, body) {
        return this.svc.star(user.id, id, !!body.starred);
    }
    starred(user) {
        return this.svc.listStarred(user.id);
    }
    starredIds(user, cid, cidAlt) {
        return this.svc.listStarredIds(user.id, cid || cidAlt);
    }
    forward(user, id, body) {
        return this.svc.forward(user.id, id, body.conversation_ids || []);
    }
    search(user, q, cid, cidAlt) {
        return this.svc.search(user.id, q, cid || cidAlt);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('conversationId')),
    __param(2, (0, common_1.Query)('conversation_id')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "send", null);
__decorate([
    (0, common_1.Post)(':id/edit'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "edit", null);
__decorate([
    (0, common_1.Delete)(':id/me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "deleteForMe", null);
__decorate([
    (0, common_1.Delete)(':id/everyone'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "deleteForAll", null);
__decorate([
    (0, common_1.Post)('read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "read", null);
__decorate([
    (0, common_1.Post)(':id/react'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "react", null);
__decorate([
    (0, common_1.Post)(':id/pin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "pin", null);
__decorate([
    (0, common_1.Post)('unpin/:conversationId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "unpin", null);
__decorate([
    (0, common_1.Get)('pinned/:conversationId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "pinned", null);
__decorate([
    (0, common_1.Post)(':id/star'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "star", null);
__decorate([
    (0, common_1.Get)('starred/all'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "starred", null);
__decorate([
    (0, common_1.Get)('starred/ids'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('conversationId')),
    __param(2, (0, common_1.Query)('conversation_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "starredIds", null);
__decorate([
    (0, common_1.Post)(':id/forward'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "forward", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('conversationId')),
    __param(3, (0, common_1.Query)('conversation_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "search", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map