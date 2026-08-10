import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, School } from '../../../entities';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CmsUsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(School) private schoolRepo: Repository<School>,
  ) {}

  async registerSchool(data: any) {
    const { org_name, school_password, personal_code } = data;

    if (!org_name || !school_password) {
      throw new BadRequestException('School name and school password are required');
    }

    // Check existing school password
    const existingSchool = await this.schoolRepo.findOne({ where: { school_password } });
    if (existingSchool) throw new BadRequestException('School password already taken');

    // Create School without admin initially
    const school = this.schoolRepo.create({
      name: org_name,
      school_password,
      admin_id: null,
      personal_code: personal_code || '',
    });
    await this.schoolRepo.save(school);

    return { success: true, data: { school } };
  }

  async login(data: any) {
    const { email, password, school_password } = data;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (school_password) {
      // Teacher / Student login via school password + email
      const school = await this.schoolRepo.findOne({ where: { school_password } });
      if (!school) throw new BadRequestException('Invalid school password');

      // Find user by email from WeConnect users table
      let user = await this.userRepo.findOne({ where: { email } });
      
      if (!user) {
        throw new BadRequestException('Email not found. Please sign up in WeConnect app first.');
      }

      // Update user's school info if not already set or joining new school
      if (!user.school_id || user.school_id !== school.id) {
        await this.userRepo.update(user.id, { 
          school_id: school.id,
          school_role: user.school_role || 'student'
        });
        user.school_id = school.id;
      }

      return { success: true, data: { user, school } };
    } else if (password) {
      // Admin login via email + password
      
      // Find user by email from WeConnect users table
      const user = await this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.password_hash')
        .where('user.email = :email', { email })
        .getOne();

      if (!user) throw new BadRequestException('Email not found. Please sign up in WeConnect app first.');
      if (!user.password_hash) throw new BadRequestException('Account has no password set');

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) throw new BadRequestException('Invalid password');

      // Check if there's a school without admin that this user can claim
      const schoolWithoutAdmin = await this.schoolRepo
        .createQueryBuilder('school')
        .where('school.admin_id IS NULL')
        .getOne();

      if (schoolWithoutAdmin) {
        // Make this user the admin of the school
        await this.schoolRepo.update(schoolWithoutAdmin.id, { admin_id: user.id });
        await this.userRepo.update(user.id, { 
          school_id: schoolWithoutAdmin.id,
          school_role: 'admin'
        });
        user.school_id = schoolWithoutAdmin.id;
        user.school_role = 'admin';
        
        delete (user as any).password_hash;
        return { success: true, data: { user, school: schoolWithoutAdmin } };
      }

      // Check if user is already admin of a school
      const existingSchool = await this.schoolRepo.findOne({ where: { admin_id: user.id } });
      if (existingSchool) {
        delete (user as any).password_hash;
        return { success: true, data: { user, school: existingSchool } };
      }

      throw new BadRequestException('No school available. Please register a school first.');
    } else {
      throw new BadRequestException('Either password or school_password is required');
    }
  }

  async findBySchool(schoolId: string, role?: string) {
    const where: any = { school_id: schoolId };
    if (role) where.school_role = role;
    return this.userRepo.find({ where, order: { display_name: 'ASC' } });
  }

  async countBySchool(schoolId: string, role?: string) {
    const where: any = { school_id: schoolId };
    if (role) where.school_role = role;
    return this.userRepo.count({ where });
  }

  async create(data: any) {
    // Check if user already exists with this email
    const existingUser = await this.userRepo.findOne({ where: { email: data.email } });
    
    if (existingUser) {
      // User exists - just update their school info
      await this.userRepo.update(existingUser.id, {
        school_id: data.school_id,
        school_role: data.school_role || 'student',
        display_name: data.display_name || existingUser.display_name,
      });
      return this.userRepo.findOne({ where: { id: existingUser.id } });
    }
    
    // User doesn't exist - create new user
    const password_hash = data.password ? await bcrypt.hash(data.password, 10) : await bcrypt.hash('default123', 10);
    const entity = this.userRepo.create({
      email: data.email,
      phone: null, // No phone for CMS-only users
      display_name: data.display_name || data.name || '',
      school_role: data.school_role || 'student',
      school_id: data.school_id,
      password_hash,
    });
    return this.userRepo.save(entity);
  }

  async delete(id: string) {
    return this.userRepo.delete(id);
  }
}
