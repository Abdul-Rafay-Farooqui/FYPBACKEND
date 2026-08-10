import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Patch,
} from "@nestjs/common";
import { Public } from "../../common/decorators/public.decorator";
import { QuizzesService } from "./quizzes.service";
import {
  CreateQuizDto,
  UpdateQuizDto,
  CreateQuestionDto,
  SubmitQuizDto,
} from "./dto/quiz.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("quizzes")
export class QuizzesController {
  constructor(private readonly service: QuizzesService) {}

  // Quiz CRUD
  @Public()
  @Post()
  async create(@Body() data: CreateQuizDto) {
    try {
      console.log("[QuizzesController] POST /quizzes - Creating quiz:", data);
      return await this.service.create(data);
    } catch (error: any) {
      console.error("[QuizzesController] Error creating quiz:", error);
      throw error;
    }
  }

  @Public()
  @Get()
  findAll(
    @Query("institute_id") institute_id?: string,
    @Query("teacher_id") teacher_id?: string,
    @Query("class_batch_section_id") class_batch_section_id?: string,
    @Query("subject_id") subject_id?: string,
    @Query("subject_ids") subject_ids?: string,
    @Query("is_published") is_published?: string,
  ) {
    // Only include is_published if it's explicitly provided
    const filters: any = {
      institute_id,
      teacher_id,
      class_batch_section_id,
      subject_id,
    };
    if (subject_ids) {
      filters.subject_ids = subject_ids.split(",").filter((id) => id.trim());
    }
    if (is_published !== undefined) {
      filters.is_published = is_published === "true";
    }

    return this.service.findAll(filters);
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Public()
  @Put(":id")
  update(@Param("id") id: string, @Body() data: UpdateQuizDto) {
    return this.service.update(id, data);
  }

  @Public()
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }

  // Questions
  @Public()
  @Post(":id/questions")
  addQuestion(@Param("id") quizId: string, @Body() data: CreateQuestionDto) {
    return this.service.addQuestion(quizId, data);
  }

  @Public()
  @Get(":id/questions")
  getQuestions(@Param("id") quizId: string) {
    return this.service.getQuestions(quizId);
  }

  @Public()
  @Put("questions/:questionId")
  updateQuestion(
    @Param("questionId") questionId: string,
    @Body() data: Partial<CreateQuestionDto>,
  ) {
    return this.service.updateQuestion(questionId, data);
  }

  @Public()
  @Delete("questions/:questionId")
  deleteQuestion(@Param("questionId") questionId: string) {
    return this.service.deleteQuestion(questionId);
  }

  // Student: Start and Submit
  @Post(":id/start")
  startAttempt(@Param("id") quizId: string, @CurrentUser() user: any) {
    return this.service.startAttempt(quizId, user.id);
  }

  @Post("attempts/:attemptId/submit")
  submitQuiz(
    @Param("attemptId") attemptId: string,
    @CurrentUser() user: any,
    @Body() data: SubmitQuizDto,
  ) {
    return this.service.submitQuiz(attemptId, user.id, data);
  }

  // Get attempts
  @Get("attempts/my")
  getMyAttempts(@CurrentUser() user: any, @Query("quiz_id") quizId?: string) {
    return this.service.getStudentAttempts(user.id, quizId);
  }

  @Public()
  @Get("attempts/:attemptId")
  getAttemptDetails(@Param("attemptId") attemptId: string) {
    return this.service.getAttemptDetails(attemptId);
  }

  @Public()
  @Get(":id/attempts")
  getQuizAttempts(@Param("id") quizId: string) {
    return this.service.getQuizAttempts(quizId);
  }

  // Teacher: Grade
  @Public()
  @Patch("answers/:answerId/grade")
  gradeAnswer(
    @Param("answerId") answerId: string,
    @Body("marks_obtained") marksObtained: number,
  ) {
    return this.service.gradeAnswer(answerId, marksObtained);
  }
}
