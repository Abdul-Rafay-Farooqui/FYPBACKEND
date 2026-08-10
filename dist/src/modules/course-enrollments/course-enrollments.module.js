"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseEnrollmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const realtime_module_1 = require("../realtime/realtime.module");
const course_enrollments_controller_1 = require("./course-enrollments.controller");
const course_enrollments_service_1 = require("./course-enrollments.service");
let CourseEnrollmentsModule = class CourseEnrollmentsModule {
};
exports.CourseEnrollmentsModule = CourseEnrollmentsModule;
exports.CourseEnrollmentsModule = CourseEnrollmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.CourseEnrollment, entities_1.Subject]), realtime_module_1.RealtimeModule],
        controllers: [course_enrollments_controller_1.CourseEnrollmentsController],
        providers: [course_enrollments_service_1.CourseEnrollmentsService],
        exports: [course_enrollments_service_1.CourseEnrollmentsService],
    })
], CourseEnrollmentsModule);
//# sourceMappingURL=course-enrollments.module.js.map