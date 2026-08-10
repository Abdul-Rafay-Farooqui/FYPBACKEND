"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const fs_1 = require("fs");
const media_controller_1 = require("./media.controller");
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (c) => {
                    const base = c.get('UPLOAD_DIR', 'uploads');
                    if (!(0, fs_1.existsSync)(base))
                        (0, fs_1.mkdirSync)(base, { recursive: true });
                    return {
                        storage: (0, multer_1.diskStorage)({
                            destination: (req, file, cb) => {
                                try {
                                    const sub = guessBucket(file.mimetype);
                                    const dir = (0, path_1.join)(process.cwd(), base, sub);
                                    if (!(0, fs_1.existsSync)(dir))
                                        (0, fs_1.mkdirSync)(dir, { recursive: true });
                                    cb(null, dir);
                                }
                                catch (e) {
                                    cb(e, '');
                                }
                            },
                            filename: (req, file, cb) => {
                                try {
                                    const ext = file.originalname ? (0, path_1.extname)(file.originalname) : '';
                                    cb(null, `${(0, uuid_1.v4)()}${ext}`);
                                }
                                catch (e) {
                                    cb(e, '');
                                }
                            },
                        }),
                        limits: { fileSize: +c.get('MAX_FILE_SIZE', 10485760) },
                    };
                },
            }),
        ],
        controllers: [media_controller_1.MediaController],
    })
], MediaModule);
function guessBucket(mime) {
    if (!mime)
        return 'documents';
    if (mime.startsWith('image/'))
        return 'images';
    if (mime.startsWith('video/'))
        return 'videos';
    if (mime.startsWith('audio/'))
        return 'voice';
    return 'documents';
}
//# sourceMappingURL=media.module.js.map