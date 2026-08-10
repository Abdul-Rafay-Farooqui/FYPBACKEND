"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("../../entities");
const blocks_controller_1 = require("./blocks.controller");
const blocks_service_1 = require("./blocks.service");
const realtime_module_1 = require("../realtime/realtime.module");
let BlocksModule = class BlocksModule {
};
exports.BlocksModule = BlocksModule;
exports.BlocksModule = BlocksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            realtime_module_1.RealtimeModule,
            typeorm_1.TypeOrmModule.forFeature([entities_1.BlockedUser, entities_1.ReportedUser, entities_1.User]),
        ],
        controllers: [blocks_controller_1.BlocksController],
        providers: [blocks_service_1.BlocksService],
        exports: [blocks_service_1.BlocksService],
    })
], BlocksModule);
//# sourceMappingURL=blocks.module.js.map