import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEnrollment } from '../../../entities';
import { SeService } from './se.service';
import { SeController } from './se.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEnrollment])],
  controllers: [SeController],
  providers: [SeService],
  exports: [SeService],
})
export class SeModule {}
