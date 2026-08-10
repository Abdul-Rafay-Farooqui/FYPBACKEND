"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const institutes_controller_1 = require("./institutes.controller");
const institutes_service_1 = require("./institutes.service");
const realtime_module_1 = require("../realtime/realtime.module");
const attendance_module_1 = require("../cms/attendance/attendance.module");
let InstitutesModule = class InstitutesModule {
};
exports.InstitutesModule = InstitutesModule;
exports.InstitutesModule = InstitutesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.Institute,
                entities_1.InstituteMember,
                entities_1.User,
                entities_1.ClassEntity,
                entities_1.Batch,
                entities_1.Section,
                entities_1.Subject,
            ]),
            realtime_module_1.RealtimeModule,
            attendance_module_1.AttendanceModule,
        ],
        controllers: [institutes_controller_1.InstitutesController],
        providers: [institutes_service_1.InstitutesService],
        exports: [institutes_service_1.InstitutesService],
    })
], InstitutesModule);
//# sourceMappingURL=institutes.module.js.map