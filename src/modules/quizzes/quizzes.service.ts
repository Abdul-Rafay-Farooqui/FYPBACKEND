import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import {
  Quiz,
  QuizQuestion,
  QuizAttempt,
  QuizAnswer,
  Result,
} from "../../entities";
import {
  CreateQuizDto,
  UpdateQuizDto,
  CreateQuestionDto,
  SubmitQuizDto,
} from "./dto/quiz.dto";
import { RealtimeGateway } from "../realtime/realtime.gateway";

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizzes: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private readonly questions: Repository<QuizQuestion>,
    @InjectRepository(QuizAttempt)
    private readonly attempts: Repository<QuizAttempt>,
    @InjectRepository(QuizAnswer)
    private readonly answers: Repository<QuizAnswer>,
    @InjectRepository(Result)
    private readonly results: Repository<Result>,
    private readonly gateway: RealtimeGateway,
  ) {}

  // CRUD for Quizzes
  async create(data: CreateQuizDto): Promise<Quiz> {
    const { questions, ...quizData } = data as any;

    console.log("[QuizzesService] Creating quiz with data:", quizData);

    // Validate required fields
    if (!quizData.title) {
      throw new Error("Quiz title is required");
    }
    if (!quizData.institute_id) {
      throw new Error("Institute ID is required");
    }
    if (!quizData.teacher_id) {
      throw new Error("Teacher ID is required");
    }

    try {
      // Create the quiz
      const quiz = this.quizzes.create(quizData);
      const result = await this.quizzes.save(quiz);
      const savedQuiz = Array.isArray(result) ? result[0] : result;

      console.log("[QuizzesService] Quiz saved successfully:", savedQuiz.id);

      // If questions are provided, create them
      if (questions && Array.isArray(questions) && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const questionData = {
            ...questions[i],
            quiz_id: savedQuiz.id,
            order_number: i + 1,
          };
          const question = this.questions.create(questionData);
          await this.questions.save(question);
        }
      }

      // Return the quiz with relations loaded
      try {
        const fullQuiz = await this.findOne(savedQuiz.id);
        // Emit realtime event
        if (fullQuiz.institute_id) {
          this.gateway.emitToInstitute(fullQuiz.institute_id, 'institute:quiz-created', {
            institute_id: fullQuiz.institute_id,
            quiz: fullQuiz,
          });
        }
        return fullQuiz;
      } catch (error) {
        // If findOne fails, return the saved quiz
        return savedQuiz;
      }
    } catch (error: any) {
      console.error("[QuizzesService] Error creating quiz:", error);
      throw error;
    }
  }

  async findAll(filters?: {
    institute_id?: string;
    teacher_id?: string;
    class_batch_section_id?: string;
    subject_id?: string;
    subject_ids?: string[];
    is_published?: boolean;
  }) {
    const where: any = {};
    if (filters?.institute_id) where.institute_id = filters.institute_id;
    if (filters?.teacher_id) where.teacher_id = filters.teacher_id;
    if (filters?.class_batch_section_id)
      where.class_batch_section_id = filters.class_batch_section_id;
    if (filters?.subject_id) where.subject_id = filters.subject_id;
    // Only filter by is_published if explicitly provided (not undefined)
    if (typeof filters?.is_published === "boolean")
      where.is_published = filters.is_published;

    let quizzesQuery;
    if (filters?.subject_ids && filters.subject_ids.length > 0) {
      // For multiple subject IDs, use In operator
      quizzesQuery = this.quizzes.find({
        where: { subject_id: In(filters.subject_ids) },
        relations: ["teacher", "subject"],
        order: { created_at: "DESC" },
      });
    } else {
      quizzesQuery = this.quizzes.find({
        where,
        relations: ["teacher", "subject"],
        order: { created_at: "DESC" },
      });
    }

    const quizzes = await quizzesQuery;

    // Load questions for each quiz
    const quizzesWithQuestions = await Promise.all(
      quizzes.map(async (quiz) => {
        const questions = await this.questions.find({
          where: { quiz_id: quiz.id },
          order: { order_number: "ASC" },
        });
        return { ...quiz, questions };
      }),
    );

    return quizzesWithQuestions;
  }

  async findOne(id: string) {
    const quiz = await this.quizzes.findOne({
      where: { id },
      relations: ["teacher", "subject", "class_batch_section", "institute"],
    });
    if (!quiz) throw new NotFoundException("Quiz not found");

    // Load questions for this quiz
    const questions = await this.questions.find({
      where: { quiz_id: id },
      order: { order_number: "ASC" },
    });

    return { ...quiz, questions };
  }

  async update(id: string, data: UpdateQuizDto) {
    await this.quizzes.update(id, data);
    const updated = await this.findOne(id);
    if (updated.institute_id) {
      this.gateway.emitToInstitute(updated.institute_id, 'institute:quiz-updated', {
        institute_id: updated.institute_id,
        quiz: updated,
      });
    }
    return updated;
  }

  async delete(id: string) {
    const quiz = await this.quizzes.findOne({ where: { id } });
    await this.quizzes.delete(id);
    if (quiz?.institute_id) {
      this.gateway.emitToInstitute(quiz.institute_id, 'institute:quiz-deleted', {
        institute_id: quiz.institute_id,
        quiz_id: id,
      });
    }
    return { success: true };
  }

  // Questions Management
  async addQuestion(quizId: string, data: CreateQuestionDto) {
    const quiz = await this.findOne(quizId);
    const question = this.questions.create({
      ...data,
      quiz_id: quizId,
    });
    return this.questions.save(question);
  }

  async getQuestions(quizId: string) {
    return this.questions.find({
      where: { quiz_id: quizId },
      order: { order_number: "ASC" },
    });
  }

  async updateQuestion(questionId: string, data: Partial<CreateQuestionDto>) {
    await this.questions.update(questionId, data);
    return this.questions.findOne({ where: { id: questionId } });
  }

  async deleteQuestion(questionId: string) {
    await this.questions.delete(questionId);
    return { success: true };
  }

  // Student: Start Quiz Attempt
  async startAttempt(quizId: string, studentId: string) {
    const quiz = await this.findOne(quizId);

    if (!quiz.is_published) {
      throw new BadRequestException("Quiz is not published yet");
    }

    // Check if student already has an in-progress attempt
    const existingAttempt = await this.attempts.findOne({
      where: { quiz_id: quizId, student_id: studentId, status: "in_progress" },
    });

    if (existingAttempt) {
      return existingAttempt;
    }

    // Create new attempt
    const attempt = this.attempts.create({
      quiz_id: quizId,
      student_id: studentId,
      total_marks: quiz.total_marks,
      status: "in_progress",
    });

    return this.attempts.save(attempt);
  }

  // Student: Submit Quiz
  async submitQuiz(attemptId: string, studentId: string, data: SubmitQuizDto) {
    const attempt = await this.attempts.findOne({
      where: { id: attemptId, student_id: studentId },
      relations: ["quiz"],
    });

    if (!attempt) throw new NotFoundException("Attempt not found");
    if (attempt.status !== "in_progress") {
      throw new BadRequestException("Attempt already submitted");
    }

    // Get all questions for this quiz
    const questions = await this.getQuestions(attempt.quiz_id);
    let totalScore = 0;

    // Process each answer
    for (const answerDto of data.answers) {
      const question = questions.find((q) => q.id === answerDto.question_id);
      if (!question) continue;

      let isCorrect = false;
      let marksObtained = 0;

      // Auto-grade MCQ and True/False
      if (
        question.question_type === "mcq" ||
        question.question_type === "true_false"
      ) {
        isCorrect =
          answerDto.answer.toLowerCase().trim() ===
          question.correct_answer.toLowerCase().trim();
        marksObtained = isCorrect ? question.marks : 0;
        totalScore += marksObtained;
      }

      // Save answer
      const answer = this.answers.create({
        attempt_id: attemptId,
        question_id: answerDto.question_id,
        answer: answerDto.answer,
        is_correct: isCorrect,
        marks_obtained: marksObtained,
      });
      await this.answers.save(answer);
    }

    // Update attempt
    await this.attempts.update(attemptId, {
      submitted_at: new Date(),
      score: totalScore,
      status: "submitted",
    });

    // Save result for teacher grade book
    const result = this.results.create({
      student_id: studentId,
      teacher_id: attempt.quiz.teacher_id,
      subject_id: attempt.quiz.subject_id,
      result_type: "quiz",
      marks_obtained: totalScore,
      total_marks: attempt.total_marks,
    });
    await this.results.save(result);

    // Emit submission and result events
    if (attempt.quiz.institute_id) {
      this.gateway.emitToInstitute(attempt.quiz.institute_id, 'institute:submission-created', {
        institute_id: attempt.quiz.institute_id,
        quiz_id: attempt.quiz_id,
        student_id: studentId,
        score: totalScore,
      });
      this.gateway.emitToInstitute(attempt.quiz.institute_id, 'institute:result-created', {
        institute_id: attempt.quiz.institute_id,
        result,
      });
    }

    return this.attempts.findOne({ where: { id: attemptId } });
  }

  // Get student's attempts
  async getStudentAttempts(studentId: string, quizId?: string) {
    const where: any = { student_id: studentId };
    if (quizId) where.quiz_id = quizId;

    return this.attempts.find({
      where,
      relations: ["quiz"],
      order: { created_at: "DESC" },
    });
  }

  // Get attempt details with answers
  async getAttemptDetails(attemptId: string) {
    const attempt = await this.attempts.findOne({
      where: { id: attemptId },
      relations: ["quiz", "student"],
    });

    if (!attempt) throw new NotFoundException("Attempt not found");

    const answers = await this.answers.find({
      where: { attempt_id: attemptId },
      relations: ["question"],
    });

    return {
      ...attempt,
      answers,
    };
  }

  // Teacher: Get all attempts for a quiz
  async getQuizAttempts(quizId: string) {
    return this.attempts.find({
      where: { quiz_id: quizId },
      relations: ["student"],
      order: { submitted_at: "DESC" },
    });
  }

  // Teacher: Grade short answer questions
  async gradeAnswer(answerId: string, marksObtained: number) {
    const answer = await this.answers.findOne({
      where: { id: answerId },
      relations: ["attempt", "question"],
    });

    if (!answer) throw new NotFoundException("Answer not found");

    await this.answers.update(answerId, {
      marks_obtained: marksObtained,
      is_correct: marksObtained > 0,
    });

    // Recalculate attempt score
    const allAnswers = await this.answers.find({
      where: { attempt_id: answer.attempt_id },
    });

    const totalScore = allAnswers.reduce(
      (sum, a) => sum + (a.marks_obtained || 0),
      0,
    );

    await this.attempts.update(answer.attempt_id, {
      score: totalScore,
      status: "graded",
    });

    return { success: true };
  }
}
