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
exports.InstituteNotificationsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const entities_1 = require("../../entities");
const institute_notifications_service_1 = require("./institute-notifications.service");
let InstituteNotificationsController = class InstituteNotificationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    getNotifications(user, instituteId, limit) {
        return this.service.findByUser(user.id, instituteId, limit ? parseInt(limit) : undefined);
    }
    getUnreadNotifications(user, instituteId) {
        return this.service.findUnreadByUser(user.id, instituteId);
    }
    getUnreadCount(user, instituteId) {
        return this.service.countUnread(user.id, instituteId);
    }
    markAsRead(user, id) {
        return this.service.markAsRead(id, user.id);
    }
    markAllAsRead(user, instituteId) {
        return this.service.markAllAsRead(user.id, instituteId);
    }
    deleteNotification(user, id) {
        return this.service.delete(id, user.id);
    }
    deleteAllNotifications(user, instituteId) {
        return this.service.deleteAll(user.id, instituteId);
    }
};
exports.InstituteNotificationsController = InstituteNotificationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('institute_id')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String, String]),
    __metadata("design:returntype", void 0)
], InstituteNotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('unread'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('institute_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], InstituteNotificationsController.prototype, "getUnreadNotifications", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('institute_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], InstituteNotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], InstituteNotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('institute_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], InstituteNotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], InstituteNotificationsController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('institute_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.User, String]),
    __metadata("design:returntype", void 0)
], InstituteNotificationsController.prototype, "deleteAllNotifications", null);
exports.InstituteNotificationsController = InstituteNotificationsController = __decorate([
    (0, common_1.Controller)('institute-notifications'),
    __metadata("design:paramtypes", [institute_notifications_service_1.InstituteNotificationsService])
], InstituteNotificationsController);
//# sourceMappingURL=institute-notifications.controller.js.map