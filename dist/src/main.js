"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: false,
        bodyParser: true,
    });
    const config = app.get(config_1.ConfigService);
    app.use((req, res, next) => {
        if (req.path === '/api/media/upload') {
            return next();
        }
        next();
    });
    const express = require('express');
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: config.get('CORS_ORIGIN', 'http://localhost:3000').split(','),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    app.setGlobalPrefix('api');
    const uploadDir = config.get('UPLOAD_DIR', 'uploads');
    app.useStaticAssets((0, path_1.join)(process.cwd(), uploadDir), { prefix: '/uploads/' });
    const port = config.get('PORT', 4000);
    await app.listen(port);
    console.log(`🚀  WeConnect backend listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map