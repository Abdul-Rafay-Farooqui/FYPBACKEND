"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../../entities");
const bcrypt = __importStar(require("bcryptjs"));
let CmsUsersService = class CmsUsersService {
    userRepo;
    schoolRepo;
    constructor(userRepo, schoolRepo) {
        this.userRepo = userRepo;
        this.schoolRepo = schoolRepo;
    }
    async registerSchool(data) {
        const { org_name, school_password, personal_code } = data;
        if (!org_name || !school_password) {
            throw new common_1.BadRequestException('School name and school password are required');
        }
        const existingSchool = await this.schoolRepo.findOne({ where: { school_password } });
        if (existingSchool)
            throw new common_1.BadRequestException('School password already taken');
        const school = this.schoolRepo.create({
            name: org_name,
            school_password,
            admin_id: null,
            personal_code: personal_code || '',
        });
        await this.schoolRepo.save(school);
        return { success: true, data: { school } };
    }
    async login(data) {
        const { email, password, school_password } = data;
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
        }
        if (school_password) {
            const school = await this.schoolRepo.findOne({ where: { school_password } });
            if (!school)
                throw new common_1.BadRequestException('Invalid school password');
            let user = await this.userRepo.findOne({ where: { email } });
            if (!user) {
                throw new common_1.BadRequestException('Email not found. Please sign up in WeConnect app first.');
            }
            if (!user.school_id || user.school_id !== school.id) {
                await this.userRepo.update(user.id, {
                    school_id: school.id,
                    school_role: user.school_role || 'student'
                });
                user.school_id = school.id;
            }
            return { success: true, data: { user, school } };
        }
        else if (password) {
            const user = await this.userRepo
                .createQueryBuilder('user')
                .addSelect('user.password_hash')
                .where('user.email = :email', { email })
                .getOne();
            if (!user)
                throw new common_1.BadRequestException('Email not found. Please sign up in WeConnect app first.');
            if (!user.password_hash)
                throw new common_1.BadRequestException('Account has no password set');
            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid)
                throw new common_1.BadRequestException('Invalid password');
            const schoolWithoutAdmin = await this.schoolRepo
                .createQueryBuilder('school')
                .where('school.admin_id IS NULL')
                .getOne();
            if (schoolWithoutAdmin) {
                await this.schoolRepo.update(schoolWithoutAdmin.id, { admin_id: user.id });
                await this.userRepo.update(user.id, {
                    school_id: schoolWithoutAdmin.id,
                    school_role: 'admin'
                });
                user.school_id = schoolWithoutAdmin.id;
                user.school_role = 'admin';
                delete user.password_hash;
                return { success: true, data: { user, school: schoolWithoutAdmin } };
            }
            const existingSchool = await this.schoolRepo.findOne({ where: { admin_id: user.id } });
            if (existingSchool) {
                delete user.password_hash;
                return { success: true, data: { user, school: existingSchool } };
            }
            throw new common_1.BadRequestException('No school available. Please register a school first.');
        }
        else {
            throw new common_1.BadRequestException('Either password or school_password is required');
        }
    }
    async findBySchool(schoolId, role) {
        const where = { school_id: schoolId };
        if (role)
            where.school_role = role;
        return this.userRepo.find({ where, order: { display_name: 'ASC' } });
    }
    async countBySchool(schoolId, role) {
        const where = { school_id: schoolId };
        if (role)
            where.school_role = role;
        return this.userRepo.count({ where });
    }
    async create(data) {
        const existingUser = await this.userRepo.findOne({ where: { email: data.email } });
        if (existingUser) {
            await this.userRepo.update(existingUser.id, {
                school_id: data.school_id,
                school_role: data.school_role || 'student',
                display_name: data.display_name || existingUser.display_name,
            });
            return this.userRepo.findOne({ where: { id: existingUser.id } });
        }
        const password_hash = data.password ? await bcrypt.hash(data.password, 10) : await bcrypt.hash('default123', 10);
        const entity = this.userRepo.create({
            email: data.email,
            phone: null,
            display_name: data.display_name || data.name || '',
            school_role: data.school_role || 'student',
            school_id: data.school_id,
            password_hash,
        });
        return this.userRepo.save(entity);
    }
    async delete(id) {
        return this.userRepo.delete(id);
    }
};
exports.CmsUsersService = CmsUsersService;
exports.CmsUsersService = CmsUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.School)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CmsUsersService);
//# sourceMappingURL=users.service.js.map