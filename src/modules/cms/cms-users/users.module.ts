import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, School } from '../../../entities';
import { CmsUsersService } from './users.service';
import { CmsUsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, School])],
  controllers: [CmsUsersController],
  providers: [CmsUsersService],
  exports: [CmsUsersService],
})
export class CmsUsersModule {}
