import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Institute,
  InstituteMember,
  User,
  ClassEntity,
  Batch,
  Section,
  Subject,
} from "../../entities";
import { InstitutesController } from "./institutes.controller";
import { InstitutesService } from "./institutes.service";
import { RealtimeModule } from "../realtime/realtime.module";
import { AttendanceModule } from "../cms/attendance/attendance.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Institute,
      InstituteMember,
      User,
      ClassEntity,
      Batch,
      Section,
      Subject,
    ]),
    RealtimeModule,
    AttendanceModule,
  ],
  controllers: [InstitutesController],
  providers: [InstitutesService],
  exports: [InstitutesService],
})
export class InstitutesModule {}
