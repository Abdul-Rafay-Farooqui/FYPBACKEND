import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuizzesController } from "./quizzes.controller";
import { QuizzesService } from "./quizzes.service";
import { Quiz, QuizQuestion, QuizAttempt, QuizAnswer, Result } from "../../entities";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizQuestion, QuizAttempt, QuizAnswer, Result]),
    RealtimeModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
