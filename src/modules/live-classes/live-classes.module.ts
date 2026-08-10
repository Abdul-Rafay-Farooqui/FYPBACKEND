import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LiveClassesController } from "./live-classes.controller";
import { LiveClassesService } from "./live-classes.service";
import { LiveClass, LiveClassParticipant, Subject } from "../../entities";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([LiveClass, LiveClassParticipant, Subject]),
    RealtimeModule,
  ],
  controllers: [LiveClassesController],
  providers: [LiveClassesService],
  exports: [LiveClassesService],
})
export class LiveClassesModule {}
