import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectAssignment } from '../../entities';
import { SubjectAssignmentsController } from './subject-assignments.controller';
import { SubjectAssignmentsService } from './subject-assignments.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectAssignment])],
  controllers: [SubjectAssignmentsController],
  providers: [SubjectAssignmentsService],
  exports: [SubjectAssignmentsService],
})
export class SubjectAssignmentsModule {}
