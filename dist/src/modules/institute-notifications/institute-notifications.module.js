"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteNotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const institute_notifications_controller_1 = require("./institute-notifications.controller");
const institute_notifications_service_1 = require("./institute-notifications.service");
const realtime_module_1 = require("../realtime/realtime.module");
let InstituteNotificationsModule = class InstituteNotificationsModule {
};
exports.InstituteNotificationsModule = InstituteNotificationsModule;
exports.InstituteNotificationsModule = InstituteNotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.InstituteNotification]),
            realtime_module_1.RealtimeModule,
        ],
        controllers: [institute_notifications_controller_1.InstituteNotificationsController],
        providers: [institute_notifications_service_1.InstituteNotificationsService],
        exports: [institute_notifications_service_1.InstituteNotificationsService],
    })
], InstituteNotificationsModule);
//# sourceMappingURL=institute-notifications.module.js.map