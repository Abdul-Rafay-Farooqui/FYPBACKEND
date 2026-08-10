import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { CmsUsersService } from './users.service';
import { CreateUserDto, LoginDto, RegisterSchoolDto } from './dto/users.dto';

@Public()
@Controller('cms/users')
export class CmsUsersController {
  constructor(private readonly usersService: CmsUsersService) {}

  @Post('register-school')
  async registerSchool(@Body() data: RegisterSchoolDto) {
    return this.usersService.registerSchool(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.usersService.login(data);
  }

  @Get()
  async findAll(@Query('school_id') schoolId: string, @Query('role') role?: string) {
    return this.usersService.findBySchool(schoolId, role);
  }

  @Get('count')
  async count(@Query('school_id') schoolId: string, @Query('role') role?: string) {
    const count = await this.usersService.countBySchool(schoolId, role);
    return { count };
  }

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
