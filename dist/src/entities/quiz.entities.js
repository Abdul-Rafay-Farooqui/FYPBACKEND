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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAnswer = exports.QuizAttempt = exports.QuizQuestion = exports.Quiz = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const cms_entities_1 = require("./cms.entities");
const institute_entities_1 = require("./institute.entities");
let Quiz = class Quiz {
    id;
    title;
    description;
    institute_id;
    teacher_id;
    class_batch_section_id;
    subject_id;
    total_marks;
    duration_minutes;
    due_date;
    is_published;
    institute;
    teacher;
    class_batch_section;
    subject;
    created_at;
    updated_at;
};
exports.Quiz = Quiz;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Quiz.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quiz.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Quiz.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Quiz.prototype, "institute_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Quiz.prototype, "teacher_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Quiz.prototype, "class_batch_section_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Quiz.prototype, "subject_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 100 }),
    __metadata("design:type", Number)
], Quiz.prototype, "total_marks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Quiz.prototype, "duration_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Quiz.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Quiz.prototype, "is_published", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => institute_entities_1.Institute),
    (0, typeorm_1.JoinColumn)({ name: 'institute_id' }),
    __metadata("design:type", institute_entities_1.Institute)
], Quiz.prototype, "institute", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Quiz.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.ClassBatchSection, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'class_batch_section_id' }),
    __metadata("design:type", cms_entities_1.ClassBatchSection)
], Quiz.prototype, "class_batch_section", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cms_entities_1.Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subject_id' }),
    __metadata("design:type", cms_entities_1.Subject)
], Quiz.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Quiz.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Quiz.prototype, "updated_at", void 0);
exports.Quiz = Quiz = __decorate([
    (0, typeorm_1.Entity)('quizzes')
], Quiz);
let QuizQuestion = class QuizQuestion {
    id;
    quiz_id;
    question_text;
    question_type;
    options;
    correct_answer;
    marks;
    order_number;
    quiz;
    created_at;
};
exports.QuizQuestion = QuizQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuizQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], QuizQuestion.prototype, "quiz_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], QuizQuestion.prototype, "question_text", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], QuizQuestion.prototype, "question_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], QuizQuestion.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], QuizQuestion.prototype, "correct_answer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], QuizQuestion.prototype, "marks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], QuizQuestion.prototype, "order_number", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Quiz),
    (0, typeorm_1.JoinColumn)({ name: 'quiz_id' }),
    __metadata("design:type", Quiz)
], QuizQuestion.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], QuizQuestion.prototype, "created_at", void 0);
exports.QuizQuestion = QuizQuestion = __decorate([
    (0, typeorm_1.Entity)('quiz_questions')
], QuizQuestion);
let QuizAttempt = class QuizAttempt {
    id;
    quiz_id;
    student_id;
    started_at;
    submitted_at;
    score;
    total_marks;
    status;
    quiz;
    student;
    created_at;
};
exports.QuizAttempt = QuizAttempt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuizAttempt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], QuizAttempt.prototype, "quiz_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], QuizAttempt.prototype, "student_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], QuizAttempt.prototype, "started_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], QuizAttempt.prototype, "submitted_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], QuizAttempt.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], QuizAttempt.prototype, "total_marks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'in_progress' }),
    __metadata("design:type", String)
], QuizAttempt.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Quiz),
    (0, typeorm_1.JoinColumn)({ name: 'quiz_id' }),
    __metadata("design:type", Quiz)
], QuizAttempt.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], QuizAttempt.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], QuizAttempt.prototype, "created_at", void 0);
exports.QuizAttempt = QuizAttempt = __decorate([
    (0, typeorm_1.Entity)('quiz_attempts')
], QuizAttempt);
let QuizAnswer = class QuizAnswer {
    id;
    attempt_id;
    question_id;
    answer;
    is_correct;
    marks_obtained;
    attempt;
    question;
    created_at;
};
exports.QuizAnswer = QuizAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuizAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], QuizAnswer.prototype, "attempt_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], QuizAnswer.prototype, "question_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuizAnswer.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], QuizAnswer.prototype, "is_correct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], QuizAnswer.prototype, "marks_obtained", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => QuizAttempt),
    (0, typeorm_1.JoinColumn)({ name: 'attempt_id' }),
    __metadata("design:type", QuizAttempt)
], QuizAnswer.prototype, "attempt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => QuizQuestion),
    (0, typeorm_1.JoinColumn)({ name: 'question_id' }),
    __metadata("design:type", QuizQuestion)
], QuizAnswer.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], QuizAnswer.prototype, "created_at", void 0);
exports.QuizAnswer = QuizAnswer = __decorate([
    (0, typeorm_1.Entity)('quiz_answers')
], QuizAnswer);
//# sourceMappingURL=quiz.entities.js.map