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
exports.QuizzesController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const quizzes_service_1 = require("./quizzes.service");
const quiz_dto_1 = require("./dto/quiz.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let QuizzesController = class QuizzesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(data) {
        try {
            console.log("[QuizzesController] POST /quizzes - Creating quiz:", data);
            return await this.service.create(data);
        }
        catch (error) {
            console.error("[QuizzesController] Error creating quiz:", error);
            throw error;
        }
    }
    findAll(institute_id, teacher_id, class_batch_section_id, subject_id, subject_ids, is_published) {
        const filters = {
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
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, data) {
        return this.service.update(id, data);
    }
    delete(id) {
        return this.service.delete(id);
    }
    addQuestion(quizId, data) {
        return this.service.addQuestion(quizId, data);
    }
    getQuestions(quizId) {
        return this.service.getQuestions(quizId);
    }
    updateQuestion(questionId, data) {
        return this.service.updateQuestion(questionId, data);
    }
    deleteQuestion(questionId) {
        return this.service.deleteQuestion(questionId);
    }
    startAttempt(quizId, user) {
        return this.service.startAttempt(quizId, user.id);
    }
    submitQuiz(attemptId, user, data) {
        return this.service.submitQuiz(attemptId, user.id, data);
    }
    getMyAttempts(user, quizId) {
        return this.service.getStudentAttempts(user.id, quizId);
    }
    getAttemptDetails(attemptId) {
        return this.service.getAttemptDetails(attemptId);
    }
    getQuizAttempts(quizId) {
        return this.service.getQuizAttempts(quizId);
    }
    gradeAnswer(answerId, marksObtained) {
        return this.service.gradeAnswer(answerId, marksObtained);
    }
};
exports.QuizzesController = QuizzesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [quiz_dto_1.CreateQuizDto]),
    __metadata("design:returntype", Promise)
], QuizzesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("institute_id")),
    __param(1, (0, common_1.Query)("teacher_id")),
    __param(2, (0, common_1.Query)("class_batch_section_id")),
    __param(3, (0, common_1.Query)("subject_id")),
    __param(4, (0, common_1.Query)("subject_ids")),
    __param(5, (0, common_1.Query)("is_published")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quiz_dto_1.UpdateQuizDto]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "delete", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(":id/questions"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quiz_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "addQuestion", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(":id/questions"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "getQuestions", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)("questions/:questionId"),
    __param(0, (0, common_1.Param)("questionId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "updateQuestion", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)("questions/:questionId"),
    __param(0, (0, common_1.Param)("questionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)(":id/start"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "startAttempt", null);
__decorate([
    (0, common_1.Post)("attempts/:attemptId/submit"),
    __param(0, (0, common_1.Param)("attemptId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, quiz_dto_1.SubmitQuizDto]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "submitQuiz", null);
__decorate([
    (0, common_1.Get)("attempts/my"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("quiz_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "getMyAttempts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("attempts/:attemptId"),
    __param(0, (0, common_1.Param)("attemptId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "getAttemptDetails", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(":id/attempts"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "getQuizAttempts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)("answers/:answerId/grade"),
    __param(0, (0, common_1.Param)("answerId")),
    __param(1, (0, common_1.Body)("marks_obtained")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], QuizzesController.prototype, "gradeAnswer", null);
exports.QuizzesController = QuizzesController = __decorate([
    (0, common_1.Controller)("quizzes"),
    __metadata("design:paramtypes", [quizzes_service_1.QuizzesService])
], QuizzesController);
//# sourceMappingURL=quizzes.controller.js.map