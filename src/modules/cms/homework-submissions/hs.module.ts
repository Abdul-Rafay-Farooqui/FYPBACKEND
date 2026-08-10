import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkSubmission } from '../../../entities';
import { HsService } from './hs.service';
import { HsController } from './hs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HomeworkSubmission])],
  controllers: [HsController],
  providers: [HsService],
  exports: [HsService],
})
export class HsModule {}
