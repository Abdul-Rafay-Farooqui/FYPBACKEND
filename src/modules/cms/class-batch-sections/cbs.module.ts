import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassBatchSection } from '../../../entities';
import { CbsService } from './cbs.service';
import { CbsController } from './cbs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClassBatchSection])],
  controllers: [CbsController],
  providers: [CbsService],
  exports: [CbsService],
})
export class CbsModule {}
