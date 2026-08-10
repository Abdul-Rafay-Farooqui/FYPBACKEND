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
exports.LiveClassesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let LiveClassesService = class LiveClassesService {
    liveClasses;
    participants;
    subjects;
    gateway;
    constructor(liveClasses, participants, subjects, gateway) {
        this.liveClasses = liveClasses;
        this.participants = participants;
        this.subjects = subjects;
        this.gateway = gateway;
    }
    async create(data) {
        const meetingId = `meeting-${Date.now()}`;
        const meetingUrl = `${process.env.FRONTEND_URL}/meeting/${meetingId}`;
        const liveClass = this.liveClasses.create({
            ...data,
            meeting_id: meetingId,
            meeting_url: meetingUrl,
            status: "scheduled",
        });
        const saved = await this.liveClasses.save(liveClass);
        if (saved.institute_id) {
            this.gateway.emitToInstitute(saved.institute_id, 'institute:live-class-created', {
                institute_id: saved.institute_id,
                live_class: saved,
            });
        }
        return saved;
    }
    async scheduleClass(data, teacherId) {
        console.log("[scheduleClass] Received data:", data);
        console.log("[scheduleClass] Teacher ID:", teacherId);
        const { title, description, institute_id, class_batch_section_id, subject_id, scheduled_at, duration_minutes = 60, location_type = "online", call_type = "video", } = data;
        const errors = [];
        if (!title?.trim())
            errors.push("title is required");
        if (!institute_id?.trim())
            errors.push("institute_id is required");
        if (!teacherId?.trim())
            errors.push("teacher_id (authentication) is required");
        if (!scheduled_at)
            errors.push("scheduled_at is required");
        if (errors.length > 0) {
            console.error("[scheduleClass] Validation failed:", errors);
            throw new Error(`Missing required fields: ${errors.join(", ")}`);
        }
        const meetingId = `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const meetingUrl = `https://meet.jit.si/${meetingId}`;
        const scheduledDate = new Date(scheduled_at);
        const ends_at = new Date(scheduledDate.getTime() + duration_minutes * 60000);
        console.log("[scheduleClass] Date parsing:");
        console.log("  Input scheduled_at:", scheduled_at);
        console.log("  Parsed scheduledDate:", scheduledDate);
        console.log("  scheduledDate.getTime():", scheduledDate.getTime());
        console.log("  ends_at:", ends_at);
        console.log("  ends_at.getTime():", ends_at.getTime());
        if (isNaN(scheduledDate.getTime()) || isNaN(ends_at.getTime())) {
            console.error("[scheduleClass] Invalid date:", {
                scheduled_at,
                scheduledDate: scheduledDate.toString(),
                ends_at: ends_at.toString(),
            });
            throw new Error("Invalid date provided");
        }
        let validatedSubjectId = null;
        if (subject_id) {
            const subject = await this.subjects.findOne({
                where: { id: subject_id },
            });
            if (!subject) {
                console.warn(`[scheduleClass] Subject ${subject_id} not found. Saving live class without subject.`);
            }
            else {
                validatedSubjectId = subject_id;
                console.log(`[scheduleClass] Subject ${subject_id} found and will be saved.`);
            }
        }
        else {
            console.warn("[scheduleClass] No subject_id provided. Students won't receive subject-specific invitations.");
        }
        const liveClass = this.liveClasses.create({
            title,
            description: description || "",
            institute_id,
            teacher_id: teacherId,
            class_batch_section_id: class_batch_section_id || null,
            subject_id: validatedSubjectId,
            meeting_id: meetingId,
            meeting_url: meetingUrl,
            scheduled_at: scheduledDate,
            ends_at,
            duration_minutes,
            location_type,
            call_type,
            status: "scheduled",
        });
        const scheduled = await this.liveClasses.save(liveClass);
        if (scheduled.institute_id) {
            this.gateway.emitToInstitute(scheduled.institute_id, 'institute:live-class-created', {
                institute_id: scheduled.institute_id,
                live_class: scheduled,
            });
        }
        return scheduled;
    }
    async startClassNow(data, teacherId) {
        const { title, description, institute_id, class_batch_section_id, subject_id, duration_minutes = 60, location_type = "online", call_type = "video", } = data;
        if (!title || !institute_id || !teacherId) {
            throw new Error("Missing required fields: title, institute_id, or teacher_id");
        }
        let validatedSubjectId = null;
        if (subject_id) {
            const subject = await this.subjects.findOne({
                where: { id: subject_id },
            });
            if (!subject) {
                const availableSubjects = await this.subjects.find({
                    where: { institute_id },
                });
                console.warn(`[startClassNow] Subject ${subject_id} not found.`);
                console.warn(`[startClassNow] Available subjects for institute ${institute_id}:`, availableSubjects.map((s) => ({ id: s.id, name: s.name })));
                console.warn("[startClassNow] Saving live class without subject.");
            }
            else {
                validatedSubjectId = subject_id;
                console.log(`[startClassNow] Subject ${subject_id} (${subject.name}) found and will be saved.`);
            }
        }
        else {
            console.warn("[startClassNow] No subject_id provided. Students won't receive subject-specific invitations.");
        }
        const meetingId = `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const meetingUrl = `https://meet.jit.si/${meetingId}`;
        const now = new Date();
        const ends_at = new Date(now.getTime() + duration_minutes * 60000);
        if (isNaN(now.getTime()) || isNaN(ends_at.getTime())) {
            throw new Error("Invalid date calculation");
        }
        const liveClass = this.liveClasses.create({
            title,
            description: description || "",
            institute_id,
            teacher_id: teacherId,
            class_batch_section_id: class_batch_section_id || null,
            subject_id: validatedSubjectId,
            meeting_id: meetingId,
            meeting_url: meetingUrl,
            scheduled_at: now,
            ends_at,
            duration_minutes,
            location_type,
            call_type,
            status: "live",
        });
        const savedClass = await this.liveClasses.save(liveClass);
        await this.joinClass(savedClass.id, teacherId);
        if (savedClass.institute_id) {
            this.gateway.emitToInstitute(savedClass.institute_id, 'institute:live-class-created', {
                institute_id: savedClass.institute_id,
                live_class: savedClass,
            });
        }
        return savedClass;
    }
    async findAll(filters) {
        const where = {};
        if (filters?.institute_id)
            where.institute_id = filters.institute_id;
        if (filters?.teacher_id)
            where.teacher_id = filters.teacher_id;
        if (filters?.class_batch_section_id)
            where.class_batch_section_id = filters.class_batch_section_id;
        if (filters?.status)
            where.status = filters.status;
        return this.liveClasses.find({
            where,
            relations: ["teacher", "subject", "class_batch_section"],
            order: { scheduled_at: "DESC" },
        });
    }
    async findUpcoming(filters) {
        const where = {
            scheduled_at: (0, typeorm_2.MoreThan)(new Date()),
            status: "scheduled",
        };
        if (filters?.institute_id)
            where.institute_id = filters.institute_id;
        if (filters?.teacher_id)
            where.teacher_id = filters.teacher_id;
        if (filters?.class_batch_section_id)
            where.class_batch_section_id = filters.class_batch_section_id;
        return this.liveClasses.find({
            where,
            relations: ["teacher", "subject", "class_batch_section"],
            order: { scheduled_at: "ASC" },
        });
    }
    async findOne(id) {
        const liveClass = await this.liveClasses.findOne({
            where: { id },
            relations: ["teacher", "subject", "class_batch_section"],
        });
        if (!liveClass)
            throw new common_1.NotFoundException("Live class not found");
        return liveClass;
    }
    async update(id, data) {
        await this.liveClasses.update(id, data);
        const updated = await this.findOne(id);
        if (updated.institute_id) {
            this.gateway.emitToInstitute(updated.institute_id, 'institute:live-class-updated', {
                institute_id: updated.institute_id,
                live_class: updated,
            });
        }
        return updated;
    }
    async updateStatus(id, status) {
        await this.liveClasses.update(id, { status });
        const updated = await this.findOne(id);
        if (updated.institute_id) {
            this.gateway.emitToInstitute(updated.institute_id, 'institute:live-class-updated', {
                institute_id: updated.institute_id,
                live_class: updated,
            });
        }
        return updated;
    }
    async delete(id) {
        const liveClass = await this.liveClasses.findOne({ where: { id } });
        await this.liveClasses.delete(id);
        if (liveClass?.institute_id) {
            this.gateway.emitToInstitute(liveClass.institute_id, 'institute:live-class-deleted', {
                institute_id: liveClass.institute_id,
                live_class_id: id,
            });
        }
        return { success: true };
    }
    async joinClass(liveClassId, userId) {
        const participant = this.participants.create({
            live_class_id: liveClassId,
            user_id: userId,
            joined_at: new Date(),
        });
        return this.participants.save(participant);
    }
    async leaveClass(participantId) {
        const participant = await this.participants.findOne({
            where: { id: participantId },
        });
        if (!participant)
            throw new common_1.NotFoundException("Participant not found");
        const leftAt = new Date();
        const durationMinutes = Math.floor((leftAt.getTime() - participant.joined_at.getTime()) / 60000);
        await this.participants.update(participantId, {
            left_at: leftAt,
            duration_minutes: durationMinutes,
        });
        return { success: true };
    }
    async getParticipants(liveClassId) {
        return this.participants.find({
            where: { live_class_id: liveClassId },
            relations: ["user"],
            order: { joined_at: "DESC" },
        });
    }
    async getActiveParticipants(liveClassId) {
        return this.participants.find({
            where: {
                live_class_id: liveClassId,
                left_at: null,
            },
            relations: ["user"],
        });
    }
};
exports.LiveClassesService = LiveClassesService;
exports.LiveClassesService = LiveClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.LiveClass)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.LiveClassParticipant)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], LiveClassesService);
//# sourceMappingURL=live-classes.service.js.map