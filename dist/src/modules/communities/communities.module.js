"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunitiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const realtime_module_1 = require("../realtime/realtime.module");
const communities_controller_1 = require("./communities.controller");
const communities_service_1 = require("./communities.service");
let CommunitiesModule = class CommunitiesModule {
};
exports.CommunitiesModule = CommunitiesModule;
exports.CommunitiesModule = CommunitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.Community,
                entities_1.CommunityMember,
                entities_1.CommunityGroup,
                entities_1.Conversation,
                entities_1.ConversationParticipant,
                entities_1.User,
            ]),
            realtime_module_1.RealtimeModule,
        ],
        controllers: [communities_controller_1.CommunitiesController],
        providers: [communities_service_1.CommunitiesService],
        exports: [communities_service_1.CommunitiesService],
    })
], CommunitiesModule);
//# sourceMappingURL=communities.module.js.map