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
exports.LiveClassesController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const live_classes_service_1 = require("./live-classes.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const schedule_class_dto_1 = require("./dto/schedule-class.dto");
const start_class_now_dto_1 = require("./dto/start-class-now.dto");
let LiveClassesController = class LiveClassesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(data) {
        return this.service.create(data);
    }
    scheduleClass(data, user) {
        console.log("[LiveClassesController] schedule-class endpoint called");
        console.log("[LiveClassesController] User:", user);
        console.log("[LiveClassesController] User ID:", user?.id);
        console.log("[LiveClassesController] Request body:", data);
        return this.service.scheduleClass(data, user?.id);
    }
    startClassNow(data, user) {
        console.log("[LiveClassesController] start-now endpoint called");
        console.log("[LiveClassesController] User:", user);
        console.log("[LiveClassesController] User ID:", user?.id);
        console.log("[LiveClassesController] Request body:", data);
        console.log("[LiveClassesController] Subject ID being sent:", data.subject_id);
        return this.service.startClassNow(data, user?.id);
    }
    findAll(institute_id, teacher_id, class_batch_section_id, status) {
        return this.service.findAll({
            institute_id,
            teacher_id,
            class_batch_section_id,
            status,
        });
    }
    findUpcoming(institute_id, teacher_id, class_batch_section_id) {
        return this.service.findUpcoming({
            institute_id,
            teacher_id,
            class_batch_section_id,
        });
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, data) {
        return this.service.update(id, data);
    }
    updateStatus(id, status) {
        return this.service.updateStatus(id, status);
    }
    delete(id) {
        return this.service.delete(id);
    }
    joinClass(liveClassId, user) {
        return this.service.joinClass(liveClassId, user.id);
    }
    leaveClass(participantId) {
        return this.service.leaveClass(participantId);
    }
    getParticipants(liveClassId) {
        return this.service.getParticipants(liveClassId);
    }
    getActiveParticipants(liveClassId) {
        return this.service.getActiveParticipants(liveClassId);
    }
};
exports.LiveClassesController = LiveClassesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("schedule-class"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [schedule_class_dto_1.ScheduleClassDto, Object]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "scheduleClass", null);
__decorate([
    (0, common_1.Post)("start-now"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_class_now_dto_1.StartClassNowDto, Object]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "startClassNow", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("institute_id")),
    __param(1, (0, common_1.Query)("teacher_id")),
    __param(2, (0, common_1.Query)("class_batch_section_id")),
    __param(3, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("upcoming"),
    __param(0, (0, common_1.Query)("institute_id")),
    __param(1, (0, common_1.Query)("teacher_id")),
    __param(2, (0, common_1.Query)("class_batch_section_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "findUpcoming", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(":id/join"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "joinClass", null);
__decorate([
    (0, common_1.Post)("participants/:participantId/leave"),
    __param(0, (0, common_1.Param)("participantId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "leaveClass", null);
__decorate([
    (0, common_1.Get)(":id/participants"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "getParticipants", null);
__decorate([
    (0, common_1.Get)(":id/participants/active"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiveClassesController.prototype, "getActiveParticipants", null);
exports.LiveClassesController = LiveClassesController = __decorate([
    (0, common_1.Controller)("live-classes"),
    __metadata("design:paramtypes", [live_classes_service_1.LiveClassesService])
], LiveClassesController);
//# sourceMappingURL=live-classes.controller.js.map