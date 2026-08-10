import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUser, ReportedUser, User } from '../../entities';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    RealtimeModule,
    TypeOrmModule.forFeature([BlockedUser, ReportedUser, User]),
  ],
  controllers: [BlocksController],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}