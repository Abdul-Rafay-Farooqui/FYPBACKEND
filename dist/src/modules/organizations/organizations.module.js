"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const realtime_module_1 = require("../realtime/realtime.module");
const organizations_controller_1 = require("./organizations.controller");
const organizations_service_1 = require("./organizations.service");
let OrganizationsModule = class OrganizationsModule {
};
exports.OrganizationsModule = OrganizationsModule;
exports.OrganizationsModule = OrganizationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.Organization,
                entities_1.OrganizationMember,
                entities_1.OrganizationTeam,
                entities_1.TeamMember,
                entities_1.TeamConversation,
                entities_1.Conversation,
                entities_1.ConversationParticipant,
                entities_1.Message,
                entities_1.MessageReaction,
                entities_1.OrgTask,
                entities_1.OrgMeeting,
                entities_1.OrgMeetingAttendee,
                entities_1.OrgAttendanceLog,
                entities_1.OrgApproval,
                entities_1.OrgPraise,
                entities_1.OrgNotification,
                entities_1.OrgShift,
                entities_1.OrgActivityLog,
                entities_1.OrgCallLog,
                entities_1.OrgCallLogParticipant,
                entities_1.OrgCalendarEvent,
                entities_1.OrgCalendarEventAttendee,
                entities_1.User,
            ]),
            realtime_module_1.RealtimeModule,
        ],
        controllers: [organizations_controller_1.OrganizationsController],
        providers: [organizations_service_1.OrganizationsService],
        exports: [organizations_service_1.OrganizationsService],
    })
], OrganizationsModule);
//# sourceMappingURL=organizations.module.js.map