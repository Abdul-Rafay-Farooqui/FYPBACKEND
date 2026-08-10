"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscussionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const discussions_controller_1 = require("./discussions.controller");
const discussions_service_1 = require("./discussions.service");
const entities_1 = require("../../entities");
const realtime_module_1 = require("../realtime/realtime.module");
const institute_notifications_module_1 = require("../institute-notifications/institute-notifications.module");
let DiscussionsModule = class DiscussionsModule {
};
exports.DiscussionsModule = DiscussionsModule;
exports.DiscussionsModule = DiscussionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.Discussion, entities_1.User]),
            realtime_module_1.RealtimeModule,
            institute_notifications_module_1.InstituteNotificationsModule,
        ],
        controllers: [discussions_controller_1.DiscussionsController],
        providers: [discussions_service_1.DiscussionsService],
        exports: [discussions_service_1.DiscussionsService],
    })
], DiscussionsModule);
//# sourceMappingURL=discussions.module.js.map