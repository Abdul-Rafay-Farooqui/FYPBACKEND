"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let QuizzesService = class QuizzesService {
    quizzes;
    questions;
    attempts;
    answers;
    results;
    gateway;
    constructor(quizzes, questions, attempts, answers, results, gateway) {
        this.quizzes = quizzes;
        this.questions = questions;
        this.attempts = attempts;
        this.answers = answers;
        this.results = results;
        this.gateway = gateway;
    }
    async create(data) {
        const { questions, ...quizData } = data;
        console.log("[QuizzesService] Creating quiz with data:", quizData);
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
            const quiz = this.quizzes.create(quizData);
            const result = await this.quizzes.save(quiz);
            const savedQuiz = Array.isArray(result) ? result[0] : result;
            console.log("[QuizzesService] Quiz saved successfully:", savedQuiz.id);
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
            try {
                const fullQuiz = await this.findOne(savedQuiz.id);
                if (fullQuiz.institute_id) {
                    this.gateway.emitToInstitute(fullQuiz.institute_id, 'institute:quiz-created', {
                        institute_id: fullQuiz.institute_id,
                        quiz: fullQuiz,
                    });
                }
                return fullQuiz;
            }
            catch (error) {
                return savedQuiz;
            }
        }
        catch (error) {
            console.error("[QuizzesService] Error creating quiz:", error);
            throw error;
        }
    }
    async findAll(filters) {
        const where = {};
        if (filters?.institute_id)
            where.institute_id = filters.institute_id;
        if (filters?.teacher_id)
            where.teacher_id = filters.teacher_id;
        if (filters?.class_batch_section_id)
            where.class_batch_section_id = filters.class_batch_section_id;
        if (filters?.subject_id)
            where.subject_id = filters.subject_id;
        if (typeof filters?.is_published === "boolean")
            where.is_published = filters.is_published;
        let quizzesQuery;
        if (filters?.subject_ids && filters.subject_ids.length > 0) {
            quizzesQuery = this.quizzes.find({
                where: { subject_id: (0, typeorm_2.In)(filters.subject_ids) },
                relations: ["teacher", "subject"],
                order: { created_at: "DESC" },
            });
        }
        else {
            quizzesQuery = this.quizzes.find({
                where,
                relations: ["teacher", "subject"],
                order: { created_at: "DESC" },
            });
        }
        const quizzes = await quizzesQuery;
        const quizzesWithQuestions = await Promise.all(quizzes.map(async (quiz) => {
            const questions = await this.questions.find({
                where: { quiz_id: quiz.id },
                order: { order_number: "ASC" },
            });
            return { ...quiz, questions };
        }));
        return quizzesWithQuestions;
    }
    async findOne(id) {
        const quiz = await this.quizzes.findOne({
            where: { id },
            relations: ["teacher", "subject", "class_batch_section", "institute"],
        });
        if (!quiz)
            throw new common_1.NotFoundException("Quiz not found");
        const questions = await this.questions.find({
            where: { quiz_id: id },
            order: { order_number: "ASC" },
        });
        return { ...quiz, questions };
    }
    async update(id, data) {
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
    async delete(id) {
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
    async addQuestion(quizId, data) {
        const quiz = await this.findOne(quizId);
        const question = this.questions.create({
            ...data,
            quiz_id: quizId,
        });
        return this.questions.save(question);
    }
    async getQuestions(quizId) {
        return this.questions.find({
            where: { quiz_id: quizId },
            order: { order_number: "ASC" },
        });
    }
    async updateQuestion(questionId, data) {
        await this.questions.update(questionId, data);
        return this.questions.findOne({ where: { id: questionId } });
    }
    async deleteQuestion(questionId) {
        await this.questions.delete(questionId);
        return { success: true };
    }
    async startAttempt(quizId, studentId) {
        const quiz = await this.findOne(quizId);
        if (!quiz.is_published) {
            throw new common_1.BadRequestException("Quiz is not published yet");
        }
        const existingAttempt = await this.attempts.findOne({
            where: { quiz_id: quizId, student_id: studentId, status: "in_progress" },
        });
        if (existingAttempt) {
            return existingAttempt;
        }
        const attempt = this.attempts.create({
            quiz_id: quizId,
            student_id: studentId,
            total_marks: quiz.total_marks,
            status: "in_progress",
        });
        return this.attempts.save(attempt);
    }
    async submitQuiz(attemptId, studentId, data) {
        const attempt = await this.attempts.findOne({
            where: { id: attemptId, student_id: studentId },
            relations: ["quiz"],
        });
        if (!attempt)
            throw new common_1.NotFoundException("Attempt not found");
        if (attempt.status !== "in_progress") {
            throw new common_1.BadRequestException("Attempt already submitted");
        }
        const questions = await this.getQuestions(attempt.quiz_id);
        let totalScore = 0;
        for (const answerDto of data.answers) {
            const question = questions.find((q) => q.id === answerDto.question_id);
            if (!question)
                continue;
            let isCorrect = false;
            let marksObtained = 0;
            if (question.question_type === "mcq" ||
                question.question_type === "true_false") {
                isCorrect =
                    answerDto.answer.toLowerCase().trim() ===
                        question.correct_answer.toLowerCase().trim();
                marksObtained = isCorrect ? question.marks : 0;
                totalScore += marksObtained;
            }
            const answer = this.answers.create({
                attempt_id: attemptId,
                question_id: answerDto.question_id,
                answer: answerDto.answer,
                is_correct: isCorrect,
                marks_obtained: marksObtained,
            });
            await this.answers.save(answer);
        }
        await this.attempts.update(attemptId, {
            submitted_at: new Date(),
            score: totalScore,
            status: "submitted",
        });
        const result = this.results.create({
            student_id: studentId,
            teacher_id: attempt.quiz.teacher_id,
            subject_id: attempt.quiz.subject_id,
            result_type: "quiz",
            marks_obtained: totalScore,
            total_marks: attempt.total_marks,
        });
        await this.results.save(result);
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
    async getStudentAttempts(studentId, quizId) {
        const where = { student_id: studentId };
        if (quizId)
            where.quiz_id = quizId;
        return this.attempts.find({
            where,
            relations: ["quiz"],
            order: { created_at: "DESC" },
        });
    }
    async getAttemptDetails(attemptId) {
        const attempt = await this.attempts.findOne({
            where: { id: attemptId },
            relations: ["quiz", "student"],
        });
        if (!attempt)
            throw new common_1.NotFoundException("Attempt not found");
        const answers = await this.answers.find({
            where: { attempt_id: attemptId },
            relations: ["question"],
        });
        return {
            ...attempt,
            answers,
        };
    }
    async getQuizAttempts(quizId) {
        return this.attempts.find({
            where: { quiz_id: quizId },
            relations: ["student"],
            order: { submitted_at: "DESC" },
        });
    }
    async gradeAnswer(answerId, marksObtained) {
        const answer = await this.answers.findOne({
            where: { id: answerId },
            relations: ["attempt", "question"],
        });
        if (!answer)
            throw new common_1.NotFoundException("Answer not found");
        await this.answers.update(answerId, {
            marks_obtained: marksObtained,
            is_correct: marksObtained > 0,
        });
        const allAnswers = await this.answers.find({
            where: { attempt_id: answer.attempt_id },
        });
        const totalScore = allAnswers.reduce((sum, a) => sum + (a.marks_obtained || 0), 0);
        await this.attempts.update(answer.attempt_id, {
            score: totalScore,
            status: "graded",
        });
        return { success: true };
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.QuizQuestion)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.QuizAttempt)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.QuizAnswer)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.Result)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map