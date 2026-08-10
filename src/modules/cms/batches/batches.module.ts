import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch, StudentEnrollment, ClassBatchSection, User } from '../../../entities';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, StudentEnrollment, ClassBatchSection, User])],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
