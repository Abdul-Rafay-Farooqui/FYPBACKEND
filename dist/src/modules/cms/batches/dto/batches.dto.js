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
exports.SortOrder = exports.SortField = exports.RemoveStudentFromBatchDto = exports.AddStudentsToBatchDto = exports.UpdateBatchDto = exports.CreateBatchDto = void 0;
const class_validator_1 = require("class-validator");
class CreateBatchDto {
    name;
    year;
    institute_id;
}
exports.CreateBatchDto = CreateBatchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBatchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateBatchDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBatchDto.prototype, "institute_id", void 0);
class UpdateBatchDto {
    name;
    year;
}
exports.UpdateBatchDto = UpdateBatchDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateBatchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateBatchDto.prototype, "year", void 0);
class AddStudentsToBatchDto {
    student_ids;
    class_batch_section_id;
}
exports.AddStudentsToBatchDto = AddStudentsToBatchDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], AddStudentsToBatchDto.prototype, "student_ids", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddStudentsToBatchDto.prototype, "class_batch_section_id", void 0);
class RemoveStudentFromBatchDto {
    student_id;
    class_batch_section_id;
}
exports.RemoveStudentFromBatchDto = RemoveStudentFromBatchDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RemoveStudentFromBatchDto.prototype, "student_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RemoveStudentFromBatchDto.prototype, "class_batch_section_id", void 0);
var SortField;
(function (SortField) {
    SortField["NAME"] = "name";
    SortField["YEAR"] = "year";
    SortField["CREATED_AT"] = "created_at";
    SortField["STUDENT_COUNT"] = "student_count";
})(SortField || (exports.SortField = SortField = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "ASC";
    SortOrder["DESC"] = "DESC";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
//# sourceMappingURL=batches.dto.js.map