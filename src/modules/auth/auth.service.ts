import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../../entities';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findOne({ where: { phone: dto.phone } });
    if (existing) throw new BadRequestException('Phone already registered');

    const existingEmail = await this.users.findOne({ where: { email: dto.email } });
    if (existingEmail) throw new BadRequestException('Email already registered');

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      phone: dto.phone,
      email: dto.email,
      password_hash,
      display_name: dto.display_name || '',
    });
    const saved = await this.users.save(user);
    return this.issueToken(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.password_hash')
      .where('u.phone = :phone', { phone: dto.phone })
      .getOne();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Update last_seen / online on login
    await this.users.update({ id: user.id }, { is_online: true, last_seen: new Date() });
    return this.issueToken(user);
  }

  async phoneExists(phone: string) {
    const count = await this.users.count({ where: { phone } });
    return { exists: count > 0 };
  }

  async me(userId: string) {
    return this.users.findOne({ where: { id: userId } });
  }

  private issueToken(user: User) {
    const payload = { sub: user.id, phone: user.phone };
    const access_token = this.jwt.sign(payload);
    // Strip password_hash
    const { password_hash, ...safe } = user as any;
    return { access_token, user: safe };
  }
}