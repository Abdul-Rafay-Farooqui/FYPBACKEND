import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherAssignment } from '../../../entities';
import { TaService } from './ta.service';
import { TaController } from './ta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherAssignment])],
  controllers: [TaController],
  providers: [TaService],
  exports: [TaService],
})
export class TaModule {}
