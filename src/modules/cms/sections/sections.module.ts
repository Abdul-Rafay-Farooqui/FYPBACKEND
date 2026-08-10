import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section, StudentEnrollment, ClassBatchSection, User } from '../../../entities';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Section, StudentEnrollment, ClassBatchSection, User])],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
})
export class SectionsModule {}
