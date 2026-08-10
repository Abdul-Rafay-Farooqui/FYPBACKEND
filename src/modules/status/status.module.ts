import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Contact,
  StatusHiddenFrom,
  StatusUpdate,
  StatusView,
  User,
} from '../../entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatusUpdate,
      StatusView,
      StatusHiddenFrom,
      Contact,
      User,
    ]),
    RealtimeModule,
  ],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}