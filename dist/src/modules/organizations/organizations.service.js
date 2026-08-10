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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
let OrganizationsService = class OrganizationsService {
    orgs;
    orgMembers;
    teams;
    teamMembers;
    teamConvs;
    conversations;
    participants;
    messages;
    messageReactions;
    tasks;
    meetings;
    meetingAttendees;
    attendanceLogs;
    approvals;
    praises;
    notifications;
    shifts;
    activities;
    orgCallLogs;
    orgCallParticipants;
    users;
    calendarEvents;
    calendarAttendees;
    gateway;
    constructor(orgs, orgMembers, teams, teamMembers, teamConvs, conversations, participants, messages, messageReactions, tasks, meetings, meetingAttendees, attendanceLogs, approvals, praises, notifications, shifts, activities, orgCallLogs, orgCallParticipants, users, calendarEvents, calendarAttendees, gateway) {
        this.orgs = orgs;
        this.orgMembers = orgMembers;
        this.teams = teams;
        this.teamMembers = teamMembers;
        this.teamConvs = teamConvs;
        this.conversations = conversations;
        this.participants = participants;
        this.messages = messages;
        this.messageReactions = messageReactions;
        this.tasks = tasks;
        this.meetings = meetings;
        this.meetingAttendees = meetingAttendees;
        this.attendanceLogs = attendanceLogs;
        this.approvals = approvals;
        this.praises = praises;
        this.notifications = notifications;
        this.shifts = shifts;
        this.activities = activities;
        this.orgCallLogs = orgCallLogs;
        this.orgCallParticipants = orgCallParticipants;
        this.users = users;
        this.calendarEvents = calendarEvents;
        this.calendarAttendees = calendarAttendees;
        this.gateway = gateway;
    }
    isManagerRole(role) {
        return role === "owner" || role === "admin" || role === "manager";
    }
    async getOrgMembership(userId, organizationId) {
        const membership = await this.orgMembers.findOne({
            where: { organization_id: organizationId, user_id: userId },
        });
        if (!membership || membership.status !== "active") {
            throw new common_1.ForbiddenException("Not an active organization member");
        }
        return membership;
    }
    async assertOrgManager(userId, organizationId) {
        const membership = await this.getOrgMembership(userId, organizationId);
        if (!this.isManagerRole(membership.role)) {
            throw new common_1.ForbiddenException("Only owner/admin/manager can do this action");
        }
        return membership;
    }
    async getTeamOrThrow(organizationId, teamId) {
        const team = await this.teams.findOne({
            where: { id: teamId, organization_id: organizationId },
        });
        if (!team)
            throw new common_1.NotFoundException("Team not found");
        return team;
    }
    async canManageTeam(userId, organizationId, teamId) {
        const orgMember = await this.getOrgMembership(userId, organizationId);
        if (this.isManagerRole(orgMember.role))
            return true;
        const teamMember = await this.teamMembers.findOne({
            where: { team_id: teamId, user_id: userId },
        });
        return teamMember?.role === "lead";
    }
    async assertCanViewTeam(userId, organizationId, teamId) {
        await this.getOrgMembership(userId, organizationId);
        const team = await this.getTeamOrThrow(organizationId, teamId);
        if (team.visibility === "private") {
            const isManager = this.isManagerRole((await this.orgMembers.findOne({
                where: { organization_id: organizationId, user_id: userId },
            }))?.role || "member");
            if (!isManager) {
                const teamMember = await this.teamMembers.findOne({
                    where: { team_id: teamId, user_id: userId },
                });
                if (!teamMember)
                    throw new common_1.ForbiddenException("Private team access denied");
            }
        }
        return team;
    }
    async getMainConversationId(teamId) {
        const link = await this.teamConvs.findOne({
            where: { team_id: teamId, type: "main" },
        });
        return link?.conversation_id || null;
    }
    async getTeamUserIds(teamId) {
        const rows = await this.teamMembers.find({ where: { team_id: teamId } });
        return rows.map((row) => row.user_id);
    }
    async createMeetingCallLog(organizationId, teamId, meetingId, initiatedBy, callType, teamUserIds) {
        const conversationId = await this.getMainConversationId(teamId);
        const callLog = await this.orgCallLogs.save(this.orgCallLogs.create({
            organization_id: organizationId,
            team_id: teamId,
            call_id: null,
            conversation_id: conversationId,
            initiated_by: initiatedBy,
            call_type: callType,
            direction: "outgoing",
            status: "answered",
            started_at: new Date(),
            notes: `meeting:${meetingId}`,
        }));
        if (teamUserIds.length) {
            await this.orgCallParticipants.save(teamUserIds.map((uid) => this.orgCallParticipants.create({
                call_log_id: callLog.id,
                user_id: uid,
                participant_role: uid === initiatedBy ? "host" : "participant",
                joined_at: uid === initiatedBy ? new Date() : null,
            })));
        }
        return callLog;
    }
    async getActiveMeetingCallLog(meetingId) {
        return this.orgCallLogs.findOne({
            where: {
                notes: `meeting:${meetingId}`,
                status: "answered",
            },
            order: { started_at: "DESC" },
        });
    }
    toClock(date) {
        if (!date)
            return "-";
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    }
    toShortDate(date) {
        if (!date)
            return null;
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }
    async mapTeamSummary(team) {
        const memberCount = await this.teamMembers.count({
            where: { team_id: team.id },
        });
        const conversationId = await this.getMainConversationId(team.id);
        let lastMessagePreview = null;
        let lastMessageAt = null;
        if (conversationId) {
            const conversation = await this.conversations.findOne({
                where: { id: conversationId },
            });
            lastMessagePreview = conversation?.last_message_preview || null;
            lastMessageAt = conversation?.last_message_at || null;
        }
        return {
            id: team.id,
            name: team.name,
            description: team.description,
            lead_user_id: team.lead_user_id,
            visibility: team.visibility,
            is_active: team.is_active,
            member_count: memberCount,
            chat_conversation_id: conversationId,
            last_message_preview: lastMessagePreview,
            last_message_at: lastMessageAt,
            created_at: team.created_at,
            updated_at: team.updated_at,
        };
    }
    async list(userId) {
        const rows = await this.orgMembers
            .createQueryBuilder("m")
            .innerJoin("organizations", "o", "o.id = m.organization_id")
            .where("m.user_id = :uid", { uid: userId })
            .andWhere("m.status = 'active'")
            .orderBy("o.updated_at", "DESC")
            .select([
            "m.role AS role",
            "o.id AS id",
            "o.name AS name",
            "o.slug AS slug",
            "o.description AS description",
            "o.logo_url AS logo_url",
            "o.website_url AS website_url",
            "o.created_by AS created_by",
            "o.is_active AS is_active",
            "o.created_at AS created_at",
            "o.updated_at AS updated_at",
        ])
            .getRawMany();
        const result = [];
        for (const row of rows) {
            const memberCount = await this.orgMembers.count({
                where: { organization_id: row.id, status: "active" },
            });
            const teamCount = await this.teams.count({
                where: { organization_id: row.id, is_active: true },
            });
            result.push({ ...row, member_count: memberCount, team_count: teamCount });
        }
        return result;
    }
    async get(userId, id) {
        const membership = await this.getOrgMembership(userId, id);
        const organization = await this.orgs.findOne({ where: { id } });
        if (!organization)
            throw new common_1.NotFoundException("Organization not found");
        const members = await this.orgMembers
            .createQueryBuilder("m")
            .leftJoin("users", "u", "u.id = m.user_id")
            .where("m.organization_id = :id", { id })
            .andWhere("m.status = 'active'")
            .orderBy("m.joined_at", "ASC")
            .select([
            "m.id AS id",
            "m.user_id AS user_id",
            "m.role AS role",
            "m.title AS title",
            "m.department AS department",
            "m.employee_code AS employee_code",
            "m.joined_at AS joined_at",
            "u.display_name AS display_name",
            "u.avatar_url AS avatar_url",
            "u.phone AS phone",
            "u.is_online AS is_online",
        ])
            .getRawMany();
        const rawTeams = await this.teams.find({
            where: { organization_id: id, is_active: true },
            order: { updated_at: "DESC" },
        });
        const teams = [];
        for (const team of rawTeams) {
            const teamSummary = await this.mapTeamSummary(team);
            const teamMembership = await this.teamMembers.findOne({
                where: { team_id: team.id, user_id: userId },
            });
            teams.push({
                ...teamSummary,
                current_user_role: teamMembership?.role || null,
            });
        }
        return {
            ...organization,
            current_user_role: membership.role,
            members,
            teams,
        };
    }
    async create(userId, dto) {
        if (!dto.name?.trim())
            throw new common_1.BadRequestException("Organization name required");
        if (dto.slug) {
            const existing = await this.orgs.findOne({
                where: { slug: dto.slug.trim() },
            });
            if (existing)
                throw new common_1.BadRequestException("Slug already in use");
        }
        const organization = await this.orgs.save(this.orgs.create({
            name: dto.name.trim(),
            slug: dto.slug?.trim() || null,
            description: dto.description?.trim() || null,
            logo_url: dto.logo_url || null,
            website_url: dto.website_url || null,
            created_by: userId,
        }));
        await this.orgMembers.save(this.orgMembers.create({
            organization_id: organization.id,
            user_id: userId,
            role: "owner",
            status: "active",
        }));
        const inviteIds = (dto.member_ids || []).filter((id) => id !== userId);
        if (inviteIds.length) {
            const uniqueIds = Array.from(new Set(inviteIds));
            const users = await this.users.find({ where: { id: (0, typeorm_2.In)(uniqueIds) } });
            if (users.length !== uniqueIds.length) {
                throw new common_1.BadRequestException("Some users not found for member invite");
            }
            await this.orgMembers.save(uniqueIds.map((uid) => this.orgMembers.create({
                organization_id: organization.id,
                user_id: uid,
                role: "member",
                invited_by: userId,
                status: "active",
            })));
        }
        return this.get(userId, organization.id);
    }
    async update(userId, id, dto) {
        await this.assertOrgManager(userId, id);
        const patch = {};
        if (dto.name !== undefined)
            patch.name = dto.name.trim();
        if (dto.slug !== undefined)
            patch.slug = dto.slug?.trim() || null;
        if (dto.description !== undefined)
            patch.description = dto.description;
        if (dto.logo_url !== undefined)
            patch.logo_url = dto.logo_url;
        if (dto.website_url !== undefined)
            patch.website_url = dto.website_url;
        if (dto.is_active !== undefined)
            patch.is_active = dto.is_active;
        if (dto.slug) {
            const exists = await this.orgs.findOne({
                where: { slug: dto.slug.trim() },
            });
            if (exists && exists.id !== id) {
                throw new common_1.BadRequestException("Slug already in use");
            }
        }
        await this.orgs.update({ id }, patch);
        return this.get(userId, id);
    }
    async delete(userId, id) {
        const membership = await this.getOrgMembership(userId, id);
        const organization = await this.orgs.findOne({ where: { id } });
        if (!organization)
            throw new common_1.NotFoundException("Organization not found");
        if (membership.role !== "owner" && organization.created_by !== userId) {
            throw new common_1.ForbiddenException("Only owner/creator can delete organization");
        }
        await this.orgs.delete({ id });
        return { ok: true };
    }
    async addMembers(userId, organizationId, memberIds) {
        await this.assertOrgManager(userId, organizationId);
        const ids = Array.from(new Set((memberIds || []).filter(Boolean)));
        if (!ids.length)
            return { ok: true, added: 0 };
        const users = await this.users.find({ where: { id: (0, typeorm_2.In)(ids) } });
        if (users.length !== ids.length) {
            throw new common_1.BadRequestException("Some users not found");
        }
        const existing = await this.orgMembers.find({
            where: { organization_id: organizationId, user_id: (0, typeorm_2.In)(ids) },
        });
        const existingSet = new Set(existing.map((m) => m.user_id));
        const toAdd = ids.filter((id) => !existingSet.has(id));
        if (!toAdd.length)
            return { ok: true, added: 0 };
        await this.orgMembers.save(toAdd.map((uid) => this.orgMembers.create({
            organization_id: organizationId,
            user_id: uid,
            role: "member",
            invited_by: userId,
            status: "active",
        })));
        return { ok: true, added: toAdd.length };
    }
    async updateMemberRole(userId, organizationId, memberId, role) {
        const myMembership = await this.assertOrgManager(userId, organizationId);
        if (myMembership.role !== "owner" && role === "owner") {
            throw new common_1.ForbiddenException("Only owner can promote another owner");
        }
        await this.orgMembers.update({ organization_id: organizationId, user_id: memberId }, { role });
        return { ok: true };
    }
    async removeMember(userId, organizationId, memberId) {
        await this.assertOrgManager(userId, organizationId);
        if (memberId === userId) {
            throw new common_1.BadRequestException("Use leave endpoint to remove yourself");
        }
        const teams = await this.teams.find({
            where: { organization_id: organizationId },
        });
        const teamIds = teams.map((t) => t.id);
        if (teamIds.length) {
            await this.teamMembers.delete({
                team_id: (0, typeorm_2.In)(teamIds),
                user_id: memberId,
            });
            const convLinks = await this.teamConvs.find({
                where: { team_id: (0, typeorm_2.In)(teamIds) },
            });
            if (convLinks.length) {
                await this.participants.delete({
                    conversation_id: (0, typeorm_2.In)(convLinks.map((c) => c.conversation_id)),
                    user_id: memberId,
                });
            }
        }
        await this.orgMembers.delete({
            organization_id: organizationId,
            user_id: memberId,
        });
        return { ok: true };
    }
    async leave(userId, organizationId) {
        const membership = await this.getOrgMembership(userId, organizationId);
        if (membership.role === "owner") {
            const owners = await this.orgMembers.find({
                where: {
                    organization_id: organizationId,
                    role: "owner",
                    status: "active",
                },
            });
            const otherOwners = owners.filter((owner) => owner.user_id !== userId);
            if (!otherOwners.length) {
                throw new common_1.BadRequestException("Transfer ownership before leaving organization");
            }
        }
        const teams = await this.teams.find({
            where: { organization_id: organizationId },
        });
        const teamIds = teams.map((t) => t.id);
        if (teamIds.length) {
            await this.teamMembers.delete({ team_id: (0, typeorm_2.In)(teamIds), user_id: userId });
            const links = await this.teamConvs.find({
                where: { team_id: (0, typeorm_2.In)(teamIds) },
            });
            if (links.length) {
                await this.participants.delete({
                    conversation_id: (0, typeorm_2.In)(links.map((l) => l.conversation_id)),
                    user_id: userId,
                });
            }
        }
        await this.orgMembers.delete({
            organization_id: organizationId,
            user_id: userId,
        });
        return { ok: true };
    }
    async listTeams(userId, organizationId) {
        await this.getOrgMembership(userId, organizationId);
        const allTeams = await this.teams.find({
            where: { organization_id: organizationId, is_active: true },
            order: { updated_at: "DESC" },
        });
        const userTeamMemberships = await this.teamMembers.find({
            where: { user_id: userId },
        });
        const userTeamIds = new Set(userTeamMemberships.map(m => m.team_id));
        const userTeams = allTeams.filter(team => userTeamIds.has(team.id));
        const result = [];
        for (const team of userTeams) {
            result.push(await this.mapTeamSummary(team));
        }
        return result;
    }
    async getTeam(userId, organizationId, teamId) {
        const team = await this.assertCanViewTeam(userId, organizationId, teamId);
        const summary = await this.mapTeamSummary(team);
        const members = await this.teamMembers
            .createQueryBuilder("tm")
            .leftJoin("users", "u", "u.id = tm.user_id")
            .where("tm.team_id = :teamId", { teamId })
            .select([
            "tm.id AS id",
            "tm.user_id AS user_id",
            "tm.role AS role",
            "tm.joined_at AS joined_at",
            "u.display_name AS display_name",
            "u.avatar_url AS avatar_url",
            "u.phone AS phone",
            "u.is_online AS is_online",
        ])
            .getRawMany();
        return { ...summary, members };
    }
    async createTeam(userId, organizationId, dto) {
        await this.assertOrgManager(userId, organizationId);
        if (!dto.name?.trim())
            throw new common_1.BadRequestException("Team name required");
        const leadId = dto.lead_user_id || userId;
        const leadMembership = await this.orgMembers.findOne({
            where: {
                organization_id: organizationId,
                user_id: leadId,
                status: "active",
            },
        });
        if (!leadMembership)
            throw new common_1.BadRequestException("Lead user must be an active org member");
        const team = await this.teams.save(this.teams.create({
            organization_id: organizationId,
            name: dto.name.trim(),
            description: dto.description?.trim() || null,
            lead_user_id: leadId,
            visibility: dto.visibility || "organization",
            created_by: userId,
        }));
        const requestedMemberIds = Array.from(new Set([leadId, ...(dto.member_ids || [])]));
        const orgMembers = await this.orgMembers.find({
            where: {
                organization_id: organizationId,
                user_id: (0, typeorm_2.In)(requestedMemberIds),
                status: "active",
            },
        });
        const allowedIds = new Set(orgMembers.map((m) => m.user_id));
        const toAdd = requestedMemberIds.filter((id) => allowedIds.has(id));
        await this.teamMembers.save(toAdd.map((uid) => this.teamMembers.create({
            team_id: team.id,
            user_id: uid,
            role: uid === leadId ? "lead" : "member",
            added_by: userId,
        })));
        const conversation = await this.conversations.save(this.conversations.create({
            type: "group",
            name: `${team.name} Team`,
            description: `Main chat for ${team.name}`,
            created_by: userId,
        }));
        await this.participants.save(toAdd.map((uid) => this.participants.create({
            conversation_id: conversation.id,
            user_id: uid,
            role: uid === leadId ? "admin" : "member",
        })));
        await this.teamConvs.save(this.teamConvs.create({
            team_id: team.id,
            conversation_id: conversation.id,
            type: "main",
        }));
        toAdd.forEach((uid) => this.gateway.addUserToConversationRoom(uid, conversation.id));
        return this.getTeam(userId, organizationId, team.id);
    }
    async updateTeam(userId, organizationId, teamId, dto) {
        await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage)
            throw new common_1.ForbiddenException("Only org managers or team lead can update team");
        const patch = {};
        if (dto.name !== undefined)
            patch.name = dto.name.trim();
        if (dto.description !== undefined)
            patch.description = dto.description;
        if (dto.visibility !== undefined)
            patch.visibility = dto.visibility;
        if (dto.is_active !== undefined)
            patch.is_active = dto.is_active;
        if (dto.lead_user_id !== undefined) {
            const leadMembership = await this.orgMembers.findOne({
                where: {
                    organization_id: organizationId,
                    user_id: dto.lead_user_id,
                    status: "active",
                },
            });
            if (!leadMembership)
                throw new common_1.BadRequestException("Lead must be active org member");
            patch.lead_user_id = dto.lead_user_id;
            const existingLead = await this.teamMembers.findOne({
                where: { team_id: teamId, role: "lead" },
            });
            if (existingLead && existingLead.user_id !== dto.lead_user_id) {
                await this.teamMembers.update({ id: existingLead.id }, { role: "member" });
            }
            await this.teamMembers.upsert({
                team_id: teamId,
                user_id: dto.lead_user_id,
                role: "lead",
                added_by: userId,
            }, ["team_id", "user_id"]);
        }
        await this.teams.update({ id: teamId }, patch);
        return this.getTeam(userId, organizationId, teamId);
    }
    async deleteTeam(userId, organizationId, teamId) {
        await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage)
            throw new common_1.ForbiddenException("Only org managers or team lead can delete team");
        await this.teams.delete({ id: teamId });
        return { ok: true };
    }
    async addTeamMembers(userId, organizationId, teamId, memberIds) {
        await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage)
            throw new common_1.ForbiddenException("Only org managers or team lead can add members");
        const ids = Array.from(new Set((memberIds || []).filter(Boolean)));
        if (!ids.length)
            return { ok: true, added: 0 };
        const activeOrgMembers = await this.orgMembers.find({
            where: {
                organization_id: organizationId,
                user_id: (0, typeorm_2.In)(ids),
                status: "active",
            },
        });
        const allowedIds = new Set(activeOrgMembers.map((m) => m.user_id));
        const filtered = ids.filter((id) => allowedIds.has(id));
        if (!filtered.length)
            return { ok: true, added: 0 };
        const existing = await this.teamMembers.find({
            where: { team_id: teamId, user_id: (0, typeorm_2.In)(filtered) },
        });
        const existingSet = new Set(existing.map((m) => m.user_id));
        const toAdd = filtered.filter((id) => !existingSet.has(id));
        if (!toAdd.length)
            return { ok: true, added: 0 };
        await this.teamMembers.save(toAdd.map((uid) => this.teamMembers.create({
            team_id: teamId,
            user_id: uid,
            role: "member",
            added_by: userId,
        })));
        const conversationId = await this.getMainConversationId(teamId);
        if (conversationId) {
            await this.participants.save(toAdd.map((uid) => this.participants.create({
                conversation_id: conversationId,
                user_id: uid,
                role: "member",
            })));
            toAdd.forEach((uid) => this.gateway.addUserToConversationRoom(uid, conversationId));
        }
        return { ok: true, added: toAdd.length };
    }
    async setTeamMemberRole(userId, organizationId, teamId, memberId, role) {
        await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage)
            throw new common_1.ForbiddenException("Only org managers or team lead can change roles");
        if (role === "lead") {
            const previousLead = await this.teamMembers.findOne({
                where: { team_id: teamId, role: "lead" },
            });
            if (previousLead && previousLead.user_id !== memberId) {
                await this.teamMembers.update({ id: previousLead.id }, { role: "member" });
            }
            await this.teams.update({ id: teamId }, { lead_user_id: memberId });
        }
        await this.teamMembers.update({ team_id: teamId, user_id: memberId }, { role });
        const conversationId = await this.getMainConversationId(teamId);
        if (conversationId) {
            await this.participants.update({ conversation_id: conversationId, user_id: memberId }, { role: role === "lead" ? "admin" : "member" });
        }
        return { ok: true };
    }
    async removeTeamMember(userId, organizationId, teamId, memberId) {
        const team = await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage)
            throw new common_1.ForbiddenException("Only org managers or team lead can remove members");
        await this.teamMembers.delete({ team_id: teamId, user_id: memberId });
        const conversationId = await this.getMainConversationId(teamId);
        if (conversationId) {
            await this.participants.delete({
                conversation_id: conversationId,
                user_id: memberId,
            });
        }
        if (team.lead_user_id === memberId) {
            const nextLead = await this.teamMembers.findOne({
                where: { team_id: teamId },
            });
            await this.teams.update({ id: teamId }, { lead_user_id: nextLead?.user_id || null });
            if (nextLead) {
                await this.teamMembers.update({ id: nextLead.id }, { role: "lead" });
            }
        }
        return { ok: true };
    }
    async createTask(userId, organizationId, teamId, dto) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        if (!dto.title?.trim())
            throw new common_1.BadRequestException("Title is required");
        const task = await this.tasks.save(this.tasks.create({
            organization_id: organizationId,
            team_id: teamId,
            created_by: userId,
            title: dto.title.trim(),
            description: dto.description?.trim() || null,
            assignee_id: dto.assignee_id || null,
            priority: dto.priority || "medium",
            due_date: dto.due_date || null,
            status: "todo",
        }));
        if (dto.assignee_id && dto.assignee_id !== userId) {
            const creator = await this.users.findOne({ where: { id: userId } });
            const creatorName = creator?.display_name || "Someone";
            await this.createNotification(organizationId, dto.assignee_id, "task", "Task Assigned", `${creatorName} assigned you to "${dto.title.trim()}"`, {
                task_id: task.id,
                creator: creatorName,
                creator_id: userId,
                priority: task.priority,
                due_date: task.due_date,
            }).catch(() => { });
        }
        if (this.gateway) {
            const teamMemberRows = await this.teamMembers.find({
                where: { team_id: teamId },
            });
            const teamUserIds = teamMemberRows.map((m) => m.user_id);
            teamUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "task:created", {
                    organization_id: organizationId,
                    team_id: teamId,
                    task_id: task.id,
                    title: task.title,
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:task:created", {
                team_id: teamId,
                task: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    assignee_id: task.assignee_id,
                    priority: task.priority,
                    due_date: task.due_date,
                    status: task.status,
                    created_by: task.created_by,
                },
            });
        }
        return task;
    }
    async deleteTask(userId, organizationId, teamId, taskId) {
        const task = await this.tasks.findOne({
            where: { id: taskId, team_id: teamId },
        });
        if (!task)
            throw new common_1.NotFoundException("Task not found");
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage && task.created_by !== userId)
            throw new common_1.ForbiddenException("Only the task creator or team admin can delete this task");
        await this.tasks.delete({ id: taskId });
        if (this.gateway) {
            const teamMemberRows = await this.teamMembers.find({
                where: { team_id: teamId },
            });
            const teamUserIds = teamMemberRows.map((m) => m.user_id);
            teamUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "task:deleted", {
                    organization_id: organizationId,
                    team_id: teamId,
                    task_id: taskId,
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:task:deleted", {
                team_id: teamId,
                task_id: taskId,
            });
        }
        return { ok: true };
    }
    async updateTask(userId, organizationId, teamId, taskId, dto) {
        const task = await this.tasks.findOne({
            where: { id: taskId, team_id: teamId },
        });
        if (!task)
            throw new common_1.NotFoundException("Task not found");
        await this.assertCanViewTeam(userId, organizationId, teamId);
        if (dto.status)
            await this.tasks.update({ id: taskId }, { status: dto.status });
        const updatedTask = await this.tasks.findOne({ where: { id: taskId } });
        if (this.gateway) {
            const teamMemberRows = await this.teamMembers.find({
                where: { team_id: teamId },
            });
            const teamUserIds = teamMemberRows.map((m) => m.user_id);
            teamUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "task:updated", {
                    organization_id: organizationId,
                    team_id: teamId,
                    task_id: taskId,
                    status: dto.status,
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:task:updated", {
                team_id: teamId,
                task: updatedTask,
            });
        }
        return updatedTask;
    }
    async scheduleMeeting(userId, organizationId, teamId, dto) {
        await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage) {
            throw new common_1.ForbiddenException("Only org managers or team lead can schedule meetings");
        }
        if (!dto.title?.trim())
            throw new common_1.BadRequestException("Meeting title is required");
        const startsAt = new Date(dto.starts_at);
        const endsAt = new Date(dto.ends_at);
        if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
            throw new common_1.BadRequestException("Invalid meeting date/time");
        }
        if (endsAt <= startsAt) {
            throw new common_1.BadRequestException("Meeting end time must be after start time");
        }
        const meeting = await this.meetings.save(this.meetings.create({
            organization_id: organizationId,
            team_id: teamId,
            title: dto.title.trim(),
            description: dto.description?.trim() || null,
            starts_at: startsAt,
            ends_at: endsAt,
            created_by: userId,
            location_type: dto.location_type || "online",
            meeting_link: dto.meeting_link || null,
            status: "scheduled",
        }));
        const teamUserIds = await this.getTeamUserIds(teamId);
        const allowedIds = new Set(teamUserIds);
        const attendeeIds = Array.from(new Set(dto.attendee_ids || [])).filter((id) => allowedIds.has(id));
        const finalAttendees = attendeeIds.length ? attendeeIds : teamUserIds;
        if (finalAttendees.length) {
            await this.meetingAttendees.save(finalAttendees.map((uid) => this.meetingAttendees.create({
                meeting_id: meeting.id,
                user_id: uid,
                response_status: uid === userId ? "accepted" : "pending",
                attendance_status: "not_marked",
            })));
        }
        await this.createActivity(userId, organizationId, teamId, {
            activity_type: "meeting_scheduled",
            preview_text: `${dto.title.trim()} on ${startsAt.toLocaleString("en-US")}`,
        }).catch(() => { });
        const organizer = await this.users.findOne({ where: { id: userId } });
        const organizerName = organizer?.display_name || "Someone";
        for (const attendeeId of finalAttendees) {
            if (attendeeId !== userId) {
                await this.createNotification(organizationId, attendeeId, "meeting", "Meeting Scheduled", `${organizerName} scheduled "${dto.title.trim()}" for ${startsAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`, {
                    meeting_id: meeting.id,
                    organizer: organizerName,
                    organizer_id: userId,
                    starts_at: startsAt.toISOString(),
                    ends_at: endsAt.toISOString(),
                }).catch(() => { });
            }
        }
        teamUserIds.forEach((uid) => {
            this.gateway.emitToUser(uid, "meeting:scheduled", {
                organization_id: organizationId,
                team_id: teamId,
                meeting: {
                    id: meeting.id,
                    title: meeting.title,
                    starts_at: meeting.starts_at,
                    ends_at: meeting.ends_at,
                    status: meeting.status,
                },
            });
        });
        return {
            id: meeting.id,
            status: meeting.status,
            message: "Meeting scheduled",
        };
    }
    async startMeetingNow(userId, organizationId, teamId, dto) {
        await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage) {
            throw new common_1.ForbiddenException("Only org managers or team lead can start meetings");
        }
        if (!dto.title?.trim())
            throw new common_1.BadRequestException("Meeting title is required");
        const now = new Date();
        const duration = Math.max(15, Math.min(480, dto.duration_minutes || 60));
        const endsAt = new Date(now.getTime() + duration * 60 * 1000);
        const meeting = await this.meetings.save(this.meetings.create({
            organization_id: organizationId,
            team_id: teamId,
            title: dto.title.trim(),
            description: dto.description?.trim() || null,
            starts_at: now,
            ends_at: endsAt,
            created_by: userId,
            location_type: "online",
            status: "ongoing",
        }));
        const teamUserIds = await this.getTeamUserIds(teamId);
        const allowedIds = new Set(teamUserIds);
        const attendeeIds = Array.from(new Set(dto.attendee_ids || [])).filter((id) => allowedIds.has(id));
        const finalAttendees = attendeeIds.length ? attendeeIds : teamUserIds;
        if (finalAttendees.length) {
            await this.meetingAttendees.save(finalAttendees.map((uid) => this.meetingAttendees.create({
                meeting_id: meeting.id,
                user_id: uid,
                response_status: uid === userId ? "accepted" : "pending",
                attendance_status: uid === userId ? "attended" : "not_marked",
                joined_at: uid === userId ? new Date() : null,
            })));
        }
        const callLog = await this.createMeetingCallLog(organizationId, teamId, meeting.id, userId, dto.call_type || "video", teamUserIds);
        teamUserIds.forEach((uid) => {
            this.gateway.emitToUser(uid, "meeting:started", {
                organization_id: organizationId,
                team_id: teamId,
                meeting_id: meeting.id,
                room_id: callLog.id,
                call_type: callLog.call_type,
                started_by: userId,
                title: meeting.title,
            });
        });
        return {
            meeting_id: meeting.id,
            room_id: callLog.id,
            call_type: callLog.call_type,
            status: meeting.status,
        };
    }
    async startMeeting(userId, organizationId, teamId, meetingId, callType) {
        await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage) {
            throw new common_1.ForbiddenException("Only org managers or team lead can start meetings");
        }
        const meeting = await this.meetings.findOne({
            where: {
                id: meetingId,
                organization_id: organizationId,
                team_id: teamId,
            },
        });
        if (!meeting)
            throw new common_1.NotFoundException("Meeting not found");
        if (meeting.status === "cancelled") {
            throw new common_1.BadRequestException("Cannot start a cancelled meeting");
        }
        if (meeting.status !== "ongoing") {
            await this.meetings.update({ id: meetingId }, {
                status: "ongoing",
                starts_at: new Date(),
            });
        }
        const teamUserIds = await this.getTeamUserIds(teamId);
        const existing = await this.getActiveMeetingCallLog(meetingId);
        const callLog = existing ||
            (await this.createMeetingCallLog(organizationId, teamId, meetingId, userId, callType || "video", teamUserIds));
        await this.meetingAttendees.upsert({
            meeting_id: meetingId,
            user_id: userId,
            response_status: "accepted",
            attendance_status: "attended",
            joined_at: new Date(),
        }, ["meeting_id", "user_id"]);
        teamUserIds.forEach((uid) => {
            this.gateway.emitToUser(uid, "meeting:started", {
                organization_id: organizationId,
                team_id: teamId,
                meeting_id: meetingId,
                room_id: callLog.id,
                call_type: callLog.call_type,
                started_by: userId,
                title: meeting.title,
            });
        });
        const starter = await this.users.findOne({ where: { id: userId } });
        const starterName = starter?.display_name || "Someone";
        for (const uid of teamUserIds) {
            if (uid !== userId) {
                await this.createNotification(organizationId, uid, "meeting", "Meeting Started", `${starterName} started "${meeting.title}"`, {
                    meeting_id: meetingId,
                    room_id: callLog.id,
                    started_by: userId,
                    starter: starterName,
                }).catch(() => { });
            }
        }
        return {
            meeting_id: meetingId,
            room_id: callLog.id,
            call_type: callLog.call_type,
            status: "ongoing",
        };
    }
    async endMeeting(userId, organizationId, teamId, meetingId) {
        await this.getTeamOrThrow(organizationId, teamId);
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage) {
            throw new common_1.ForbiddenException("Only org managers or team lead can end meetings");
        }
        const meeting = await this.meetings.findOne({
            where: {
                id: meetingId,
                organization_id: organizationId,
                team_id: teamId,
            },
        });
        if (!meeting)
            throw new common_1.NotFoundException("Meeting not found");
        await this.meetings.update({ id: meetingId }, {
            status: "completed",
            ends_at: new Date(),
        });
        const activeLog = await this.getActiveMeetingCallLog(meetingId);
        if (activeLog) {
            const endedAt = new Date();
            const duration = Math.max(0, Math.floor((endedAt.getTime() - new Date(activeLog.started_at).getTime()) / 1000));
            await this.orgCallLogs.update({ id: activeLog.id }, {
                status: "ended",
                ended_at: endedAt,
                duration_seconds: duration,
            });
            await this.orgCallParticipants
                .createQueryBuilder()
                .update()
                .set({ left_at: endedAt })
                .where("call_log_id = :id", { id: activeLog.id })
                .andWhere("joined_at IS NOT NULL")
                .andWhere("left_at IS NULL")
                .execute();
        }
        const teamUserIds = await this.getTeamUserIds(teamId);
        teamUserIds.forEach((uid) => {
            this.gateway.emitToUser(uid, "meeting:ended", {
                organization_id: organizationId,
                team_id: teamId,
                meeting_id: meetingId,
                ended_by: userId,
            });
        });
        const endedByUser = await this.users.findOne({ where: { id: userId } });
        const endedByName = endedByUser?.display_name || "Someone";
        for (const uid of teamUserIds) {
            if (uid !== userId) {
                await this.createNotification(organizationId, uid, "meeting", "Meeting Ended", `${endedByName} ended the meeting "${meeting.title}"`, {
                    meeting_id: meetingId,
                    team_id: teamId,
                    ended_by: userId,
                    ended_by_name: endedByName,
                }).catch(() => { });
            }
        }
        return { meeting_id: meetingId, status: "completed" };
    }
    async joinMeeting(userId, organizationId, teamId, meetingId) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        const meeting = await this.meetings.findOne({
            where: {
                id: meetingId,
                organization_id: organizationId,
                team_id: teamId,
            },
        });
        if (!meeting)
            throw new common_1.NotFoundException("Meeting not found");
        if (meeting.status !== "ongoing") {
            throw new common_1.BadRequestException("Meeting is not active");
        }
        const now = new Date();
        await this.meetingAttendees.upsert({
            meeting_id: meetingId,
            user_id: userId,
            response_status: "accepted",
            attendance_status: "attended",
            joined_at: now,
        }, ["meeting_id", "user_id"]);
        const activeLog = await this.getActiveMeetingCallLog(meetingId);
        if (activeLog) {
            await this.orgCallParticipants.upsert({
                call_log_id: activeLog.id,
                user_id: userId,
                participant_role: "participant",
                joined_at: now,
                left_at: null,
                was_missed: false,
            }, ["call_log_id", "user_id"]);
        }
        return {
            meeting_id: meetingId,
            room_id: activeLog?.id || null,
            status: meeting.status,
        };
    }
    async leaveMeeting(userId, organizationId, teamId, meetingId) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        const meeting = await this.meetings.findOne({
            where: {
                id: meetingId,
                organization_id: organizationId,
                team_id: teamId,
            },
        });
        if (!meeting)
            throw new common_1.NotFoundException("Meeting not found");
        const now = new Date();
        await this.meetingAttendees
            .createQueryBuilder()
            .update()
            .set({ left_at: now })
            .where("meeting_id = :meetingId", { meetingId })
            .andWhere("user_id = :userId", { userId })
            .execute();
        const activeLog = await this.getActiveMeetingCallLog(meetingId);
        if (activeLog) {
            await this.orgCallParticipants
                .createQueryBuilder()
                .update()
                .set({ left_at: now })
                .where("call_log_id = :logId", { logId: activeLog.id })
                .andWhere("user_id = :userId", { userId })
                .execute();
        }
        return {
            meeting_id: meetingId,
            room_id: activeLog?.id || null,
            status: meeting.status,
        };
    }
    async createActivity(userId, organizationId, teamId, dto) {
        const isFileShared = dto.activity_type === "file_shared";
        const isAutoLog = ["file_shared", "task_created", "task_updated"].includes(dto.activity_type);
        if (!isAutoLog) {
            const canManage = await this.canManageTeam(userId, organizationId, teamId);
            if (!canManage)
                throw new common_1.ForbiddenException("Only org managers or team lead can add activities");
        }
        else {
            await this.getOrgMembership(userId, organizationId);
        }
        const validTypes = [
            "mention",
            "reply",
            "reaction",
            "file_shared",
            "task_created",
            "task_updated",
            "meeting_scheduled",
            "approval_request",
            "praise_sent",
        ];
        if (!validTypes.includes(dto.activity_type))
            throw new common_1.BadRequestException("Invalid activity type");
        const activity = await this.activities.save(this.activities.create({
            organization_id: organizationId,
            team_id: teamId,
            actor_id: userId,
            activity_type: dto.activity_type,
            preview_text: dto.preview_text?.trim() || null,
            is_unread: true,
        }));
        return activity;
    }
    async deleteActivity(userId, organizationId, teamId, activityId) {
        const canManage = await this.canManageTeam(userId, organizationId, teamId);
        if (!canManage)
            throw new common_1.ForbiddenException("Only org managers or team lead can delete activities");
        const activity = await this.activities.findOne({
            where: { id: activityId, team_id: teamId },
        });
        if (!activity)
            throw new common_1.NotFoundException("Activity not found");
        await this.activities.delete({ id: activityId });
        return { ok: true };
    }
    async getTeamWorkspace(userId, organizationId, teamId) {
        const team = await this.assertCanViewTeam(userId, organizationId, teamId);
        const conversationId = await this.getMainConversationId(teamId);
        const teamMemberRows = await this.teamMembers.find({
            where: { team_id: teamId },
        });
        const teamUserIds = teamMemberRows.map((m) => m.user_id);
        const teamUsers = teamUserIds.length
            ? await this.users.find({ where: { id: (0, typeorm_2.In)(teamUserIds) } })
            : [];
        const userMap = new Map(teamUsers.map((u) => [u.id, u]));
        let chat = [];
        let files = [];
        if (conversationId) {
            const recentMessages = await this.messages.find({
                where: { conversation_id: conversationId },
                order: { created_at: "DESC" },
                take: 100,
            });
            const messageIds = recentMessages.map((m) => m.id);
            const reactions = messageIds.length
                ? await this.messageReactions.find({
                    where: { message_id: (0, typeorm_2.In)(messageIds) },
                })
                : [];
            const reactionMap = new Map();
            for (const reaction of reactions) {
                const list = reactionMap.get(reaction.message_id) || [];
                if (!list.includes(reaction.emoji))
                    list.push(reaction.emoji);
                reactionMap.set(reaction.message_id, list);
            }
            chat = recentMessages
                .slice()
                .reverse()
                .map((message) => {
                const sender = message.sender_id
                    ? userMap.get(message.sender_id)
                    : null;
                const content = message.content || "";
                const mentions = content.match(/@[A-Za-z0-9_]+/g) || [];
                return {
                    id: message.id,
                    sender: sender?.display_name || "System",
                    message: content,
                    time: this.toClock(message.created_at),
                    avatar: sender?.avatar_url || null,
                    reactions: reactionMap.get(message.id) || [],
                    mentions: mentions.map((m) => m.replace("@", "")),
                };
            });
            files = recentMessages
                .filter((m) => ["document", "image", "video", "audio"].includes(m.type))
                .map((message) => {
                const sender = message.sender_id
                    ? userMap.get(message.sender_id)
                    : null;
                return {
                    id: message.id,
                    name: message.media_filename || `file-${message.id.slice(0, 8)}`,
                    size: message.media_size
                        ? `${(message.media_size / 1024).toFixed(1)} KB`
                        : "-",
                    uploadedBy: sender?.display_name || "Unknown",
                    sender_id: message.sender_id || null,
                    media_url: message.media_url || null,
                    time: this.toShortDate(message.created_at) || "-",
                    type: message.type,
                    icon: message.type === "document"
                        ? "📄"
                        : message.type === "image"
                            ? "🖼️"
                            : "🎬",
                };
            });
        }
        const taskRows = await this.tasks.find({
            where: { organization_id: organizationId, team_id: teamId },
            order: { created_at: "DESC" },
            take: 200,
        });
        const taskAssigneeIds = Array.from(new Set(taskRows.map((t) => t.assignee_id).filter((id) => !!id)));
        const taskAssignees = taskAssigneeIds.length
            ? await this.users.find({ where: { id: (0, typeorm_2.In)(taskAssigneeIds) } })
            : [];
        const assigneeMap = new Map(taskAssignees.map((u) => [u.id, u]));
        const tasks = taskRows.map((task) => ({
            id: task.id,
            title: task.title,
            assignee: task.assignee_id
                ? assigneeMap.get(task.assignee_id)?.display_name || "Unassigned"
                : "Unassigned",
            assignee_id: task.assignee_id || null,
            created_by: task.created_by || null,
            dueDate: task.due_date
                ? new Date(task.due_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })
                : "-",
            priority: task.priority,
            status: task.status.replace("_", "-"),
            description: task.description || "",
        }));
        const meetingRows = await this.meetings.find({
            where: { organization_id: organizationId, team_id: teamId },
            order: { starts_at: "ASC" },
            take: 100,
        });
        const meetings = await Promise.all(meetingRows.map(async (meeting) => {
            const attendeeCount = await this.meetingAttendees.count({
                where: { meeting_id: meeting.id },
            });
            const joinedCount = await this.meetingAttendees.count({
                where: { meeting_id: meeting.id, attendance_status: "attended" },
            });
            const activeCall = await this.getActiveMeetingCallLog(meeting.id);
            return {
                id: meeting.id,
                title: meeting.title,
                description: meeting.description || "",
                time: `${this.toClock(meeting.starts_at)} - ${this.toClock(meeting.ends_at)}`,
                date: this.toShortDate(meeting.starts_at) || "-",
                starts_at: meeting.starts_at.toISOString(),
                ends_at: meeting.ends_at.toISOString(),
                attendees: attendeeCount,
                joined_count: joinedCount,
                status: meeting.status,
                location_type: meeting.location_type,
                meeting_link: meeting.meeting_link,
                room_id: activeCall?.id || null,
                call_type: activeCall?.call_type || "video",
            };
        }));
        let calendar = [];
        try {
            const calendarEventRows = await this.calendarEvents.find({
                where: { organization_id: organizationId, team_id: (0, typeorm_2.IsNull)() },
                order: { date: "ASC", start_time: "ASC" },
                take: 200,
            });
            const eventIds = calendarEventRows.map((e) => e.id);
            const eventAttendees = eventIds.length
                ? await this.calendarAttendees.find({
                    where: { event_id: (0, typeorm_2.In)(eventIds) },
                })
                : [];
            const attendeesByEvent = new Map();
            for (const attendee of eventAttendees) {
                const list = attendeesByEvent.get(attendee.event_id) || [];
                const user = userMap.get(attendee.user_id);
                if (user)
                    list.push(user.display_name);
                attendeesByEvent.set(attendee.event_id, list);
            }
            calendar = calendarEventRows.map((event) => ({
                id: event.id,
                title: event.title,
                description: event.description || undefined,
                date: event.date,
                start_time: event.start_time,
                end_time: event.end_time || undefined,
                location: event.location || undefined,
                type: event.type,
                created_by: event.created_by || undefined,
                attendees: attendeesByEvent.get(event.id) || [],
            }));
        }
        catch (error) {
            console.error("Error fetching calendar events:", error);
            calendar = [];
        }
        const attendanceRows = teamUserIds.length
            ? await this.attendanceLogs.find({
                where: {
                    organization_id: organizationId,
                    user_id: (0, typeorm_2.In)(teamUserIds),
                },
                order: { attendance_date: "DESC" },
                take: 500,
            })
            : [];
        const latestByUser = new Map();
        for (const log of attendanceRows) {
            if (!latestByUser.has(log.user_id))
                latestByUser.set(log.user_id, log);
        }
        const attendance = attendanceRows.map((log) => {
            const user = userMap.get(log.user_id);
            return {
                id: log.id,
                user_id: log.user_id,
                name: user?.display_name || "Unknown",
                avatar: user?.avatar_url || null,
                date: log.attendance_date,
                sign_in_at: log.sign_in_at ? log.sign_in_at.toISOString() : null,
                sign_out_at: log.sign_out_at ? log.sign_out_at.toISOString() : null,
                status: log.status,
                work_minutes: log.work_minutes,
                hours: (log.work_minutes / 60).toFixed(1),
            };
        });
        const approvalRows = await this.approvals.find({
            where: { organization_id: organizationId, team_id: teamId },
            order: { created_at: "DESC" },
            take: 200,
        });
        const approvals = approvalRows.map((approval) => ({
            id: approval.id,
            requested_by: approval.requested_by,
            requester_name: userMap.get(approval.requested_by)?.display_name || "Unknown",
            requester_avatar: userMap.get(approval.requested_by)?.avatar_url || null,
            approver_id: approval.approver_id || null,
            approver_name: approval.approver_id
                ? userMap.get(approval.approver_id)?.display_name || null
                : null,
            approval_type: approval.approval_type,
            title: approval.title,
            description: approval.description || null,
            amount: approval.amount || null,
            status: approval.status,
            created_at: approval.created_at.toISOString(),
            decided_at: approval.decided_at
                ? approval.decided_at.toISOString()
                : null,
            decision_note: approval.decision_note || null,
        }));
        const praise = [];
        const shiftRows = await this.shifts.find({
            where: { organization_id: organizationId, team_id: teamId },
            order: { shift_date: "ASC" },
            take: 200,
        });
        const shifts = shiftRows.map((shift) => ({
            id: shift.id,
            user: userMap.get(shift.user_id)?.display_name || "Unknown",
            role: teamMemberRows.find((tm) => tm.user_id === shift.user_id)?.role ===
                "lead"
                ? "Lead"
                : "Member",
            date: this.toShortDate(new Date(shift.shift_date)) || "-",
            shift: `${this.toClock(shift.starts_at)} - ${this.toClock(shift.ends_at)}`,
            status: shift.status,
        }));
        const activityRows = await this.activities.find({
            where: { organization_id: organizationId, team_id: teamId },
            order: { created_at: "DESC" },
            take: 200,
        });
        const activity = activityRows.map((item) => ({
            id: item.id,
            type: item.activity_type,
            user: item.actor_id
                ? userMap.get(item.actor_id)?.display_name || "Unknown"
                : "System",
            text: item.activity_type.replace("_", " "),
            preview: item.preview_text || "",
            time: this.toShortDate(item.created_at) || "-",
            unread: item.is_unread,
        }));
        const members = teamMemberRows.map((tm) => {
            const user = userMap.get(tm.user_id);
            return {
                id: tm.user_id,
                name: user?.display_name || "Unknown",
                avatar: user?.avatar_url || null,
                phone: user?.phone || null,
                role: tm.role,
                is_online: user?.is_online ?? false,
            };
        });
        return {
            team: await this.mapTeamSummary(team),
            chat_conversation_id: conversationId,
            tabs: {
                chat,
                files,
                meetings,
                tasks,
                calendar,
                attendance,
                approvals,
                praise,
                shifts,
                activity,
                members,
            },
        };
    }
    async createCalendarEvent(userId, organizationId, payload) {
        await this.getOrgMembership(userId, organizationId);
        const event = this.calendarEvents.create({
            organization_id: organizationId,
            team_id: null,
            title: payload.title,
            description: payload.description || null,
            date: payload.date,
            start_time: payload.start_time,
            end_time: payload.end_time || null,
            location: payload.location || null,
            type: payload.type || "meeting",
            created_by: userId,
        });
        await this.calendarEvents.save(event);
        if (payload.attendee_ids && payload.attendee_ids.length > 0) {
            const attendees = payload.attendee_ids.map((attendeeId) => this.calendarAttendees.create({
                event_id: event.id,
                user_id: attendeeId,
                response_status: "pending",
            }));
            await this.calendarAttendees.save(attendees);
        }
        if (this.gateway) {
            const orgMemberRows = await this.orgMembers.find({
                where: { organization_id: organizationId },
            });
            const orgUserIds = orgMemberRows.map((m) => m.user_id);
            orgUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "calendar:event:created", {
                    organization_id: organizationId,
                    event: {
                        id: event.id,
                        title: event.title,
                        date: event.date,
                        start_time: event.start_time,
                    },
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:calendar:created", {
                event: {
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    date: event.date,
                    start_time: event.start_time,
                    end_time: event.end_time,
                    location: event.location,
                    type: event.type,
                    created_by: event.created_by,
                },
            });
        }
        const creator = await this.users.findOne({ where: { id: userId } });
        const creatorName = creator?.display_name || "Someone";
        const orgMemberRows = await this.orgMembers.find({
            where: { organization_id: organizationId },
        });
        const orgUserIds = orgMemberRows.map((m) => m.user_id);
        for (const uid of orgUserIds) {
            if (uid !== userId) {
                await this.createNotification(organizationId, uid, "activity", "New Calendar Event", `${creatorName} added "${payload.title}" on ${payload.date}`, {
                    event_id: event.id,
                    creator: creatorName,
                    creator_id: userId,
                    date: payload.date,
                    start_time: payload.start_time,
                }).catch(() => { });
            }
        }
        return { id: event.id, message: "Calendar event created" };
    }
    async deleteCalendarEvent(userId, organizationId, eventId) {
        await this.getOrgMembership(userId, organizationId);
        const event = await this.calendarEvents.findOne({
            where: {
                id: eventId,
                organization_id: organizationId,
                team_id: (0, typeorm_2.IsNull)(),
            },
        });
        if (!event) {
            throw new common_1.NotFoundException("Calendar event not found");
        }
        const member = await this.orgMembers.findOne({
            where: { organization_id: organizationId, user_id: userId },
        });
        const isAdmin = member && ["owner", "admin"].includes(member.role);
        const isCreator = event.created_by === userId;
        if (!isAdmin && !isCreator) {
            throw new common_1.ForbiddenException("Only admins or event creators can delete events");
        }
        await this.calendarAttendees.delete({ event_id: eventId });
        await this.calendarEvents.delete(eventId);
        if (this.gateway) {
            const orgMemberRows = await this.orgMembers.find({
                where: { organization_id: organizationId },
            });
            const orgUserIds = orgMemberRows.map((m) => m.user_id);
            orgUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "calendar:event:deleted", {
                    organization_id: organizationId,
                    event_id: eventId,
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:calendar:deleted", {
                event_id: eventId,
            });
        }
        return { message: "Calendar event deleted" };
    }
    async clockIn(userId, organizationId, teamId) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const existing = await this.attendanceLogs.findOne({
            where: {
                organization_id: organizationId,
                user_id: userId,
                attendance_date: dateStr,
            },
        });
        if (existing && existing.status === "active") {
            throw new common_1.BadRequestException("Already clocked in");
        }
        if (existing) {
            await this.attendanceLogs.update({ id: existing.id }, {
                sign_in_at: new Date(),
                status: "active",
                work_minutes: 0,
            });
        }
        else {
            const log = this.attendanceLogs.create({
                organization_id: organizationId,
                user_id: userId,
                attendance_date: dateStr,
                sign_in_at: new Date(),
                sign_out_at: null,
                status: "active",
                work_minutes: 0,
                source: "manual",
            });
            await this.attendanceLogs.save(log);
        }
        if (this.gateway) {
            const teamMemberRows = await this.teamMembers.find({
                where: { team_id: teamId },
            });
            const teamUserIds = teamMemberRows.map((m) => m.user_id);
            const user = await this.users.findOne({ where: { id: userId } });
            teamUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "attendance:clock-in", {
                    team_id: teamId,
                    user_id: userId,
                    user_name: user?.display_name || "Someone",
                    timestamp: new Date().toISOString(),
                });
            });
        }
        return { message: "Clocked in successfully", timestamp: new Date() };
    }
    async clockOut(userId, organizationId, teamId) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const log = await this.attendanceLogs.findOne({
            where: {
                organization_id: organizationId,
                user_id: userId,
                attendance_date: dateStr,
            },
        });
        if (!log) {
            throw new common_1.NotFoundException("No clock-in record found for today");
        }
        if (log.status !== "active") {
            throw new common_1.BadRequestException("Not currently clocked in");
        }
        if (!log.sign_in_at) {
            throw new common_1.BadRequestException("Invalid clock-in record");
        }
        const signOutTime = new Date();
        const workMinutes = Math.floor((signOutTime.getTime() - new Date(log.sign_in_at).getTime()) /
            (1000 * 60));
        await this.attendanceLogs.update({ id: log.id }, {
            sign_out_at: signOutTime,
            status: "present",
            work_minutes: workMinutes,
        });
        if (this.gateway) {
            const teamMemberRows = await this.teamMembers.find({
                where: { team_id: teamId },
            });
            const teamUserIds = teamMemberRows.map((m) => m.user_id);
            const user = await this.users.findOne({ where: { id: userId } });
            teamUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "attendance:clock-out", {
                    team_id: teamId,
                    user_id: userId,
                    user_name: user?.display_name || "Someone",
                    work_minutes: workMinutes,
                    timestamp: signOutTime.toISOString(),
                });
            });
        }
        return {
            message: "Clocked out successfully",
            timestamp: signOutTime,
            work_minutes: workMinutes,
            hours: (workMinutes / 60).toFixed(2),
        };
    }
    async orgClockIn(userId, organizationId) {
        await this.getOrgMembership(userId, organizationId);
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        let log = await this.attendanceLogs.findOne({
            where: {
                organization_id: organizationId,
                user_id: userId,
                attendance_date: dateStr,
            },
        });
        if (log && log.status === "active") {
            throw new common_1.BadRequestException("Already clocked in");
        }
        if (!log) {
            log = this.attendanceLogs.create({
                organization_id: organizationId,
                user_id: userId,
                attendance_date: dateStr,
                sign_in_at: new Date(),
                sign_out_at: null,
                status: "active",
                work_minutes: 0,
                source: "manual",
            });
            await this.attendanceLogs.save(log);
        }
        else {
            log.sign_in_at = new Date();
            log.sign_out_at = null;
            log.status = "active";
            log.work_minutes = 0;
            await this.attendanceLogs.save(log);
        }
        if (this.gateway) {
            const orgMemberRows = await this.orgMembers.find({
                where: { organization_id: organizationId },
            });
            const orgUserIds = orgMemberRows.map((m) => m.user_id);
            const user = await this.users.findOne({ where: { id: userId } });
            orgUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "attendance:clock-in", {
                    organization_id: organizationId,
                    user_id: userId,
                    user_name: user?.display_name || "Someone",
                    timestamp: new Date().toISOString(),
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:attendance:updated", {
                user_id: userId,
                user_name: user?.display_name || "Someone",
                action: "clock-in",
                timestamp: new Date().toISOString(),
            });
        }
        return { message: "Clocked in successfully", timestamp: new Date() };
    }
    async orgClockOut(userId, organizationId) {
        await this.getOrgMembership(userId, organizationId);
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const log = await this.attendanceLogs.findOne({
            where: {
                organization_id: organizationId,
                user_id: userId,
                attendance_date: dateStr,
            },
        });
        if (!log) {
            throw new common_1.NotFoundException("No clock-in record found for today");
        }
        if (log.status !== "active") {
            throw new common_1.BadRequestException("Not currently clocked in");
        }
        if (!log.sign_in_at) {
            throw new common_1.BadRequestException("Invalid clock-in record");
        }
        const signOutTime = new Date();
        const workMinutes = Math.floor((signOutTime.getTime() - new Date(log.sign_in_at).getTime()) /
            (1000 * 60));
        await this.attendanceLogs.update({ id: log.id }, {
            sign_out_at: signOutTime,
            status: "present",
            work_minutes: workMinutes,
        });
        if (this.gateway) {
            const orgMemberRows = await this.orgMembers.find({
                where: { organization_id: organizationId },
            });
            const orgUserIds = orgMemberRows.map((m) => m.user_id);
            const user = await this.users.findOne({ where: { id: userId } });
            orgUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "attendance:clock-out", {
                    organization_id: organizationId,
                    user_id: userId,
                    user_name: user?.display_name || "Someone",
                    work_minutes: workMinutes,
                    timestamp: signOutTime.toISOString(),
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:attendance:updated", {
                user_id: userId,
                user_name: user?.display_name || "Someone",
                action: "clock-out",
                work_minutes: workMinutes,
                timestamp: signOutTime.toISOString(),
            });
        }
        return {
            message: "Clocked out successfully",
            timestamp: signOutTime,
            work_minutes: workMinutes,
            hours: (workMinutes / 60).toFixed(2),
        };
    }
    async getOrgAttendance(userId, organizationId) {
        await this.getOrgMembership(userId, organizationId);
        const logs = await this.attendanceLogs.find({
            where: { organization_id: organizationId },
            order: { attendance_date: "DESC", sign_in_at: "DESC" },
        });
        const userIds = [...new Set(logs.map((l) => l.user_id))];
        const users = await this.users.find({
            where: { id: (0, typeorm_2.In)(userIds) },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));
        const attendance = logs.map((log) => {
            const user = userMap.get(log.user_id);
            const hours = log.work_minutes > 0
                ? `${Math.floor(log.work_minutes / 60)}h ${log.work_minutes % 60}m`
                : "0h 0m";
            return {
                id: log.id,
                user_id: log.user_id,
                name: user?.display_name || "Unknown",
                avatar: user?.avatar_url || null,
                date: log.attendance_date,
                sign_in_at: log.sign_in_at?.toISOString() || null,
                sign_out_at: log.sign_out_at?.toISOString() || null,
                status: log.status,
                work_minutes: log.work_minutes,
                hours,
            };
        });
        return { attendance };
    }
    async createApproval(userId, organizationId, teamId, payload) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        const approval = this.approvals.create({
            organization_id: organizationId,
            team_id: teamId,
            requested_by: userId,
            approval_type: payload.approval_type,
            title: payload.title,
            description: payload.description || null,
            amount: payload.amount || null,
            status: "pending",
        });
        await this.approvals.save(approval);
        await this.createActivity(userId, organizationId, teamId, {
            activity_type: "approval_request",
            preview_text: `New ${payload.approval_type} request: ${payload.title}`,
        }).catch(() => { });
        if (this.gateway) {
            const teamMemberRows = await this.teamMembers.find({
                where: { team_id: teamId },
            });
            const teamUserIds = teamMemberRows.map((m) => m.user_id);
            const user = await this.users.findOne({ where: { id: userId } });
            teamUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "approval:created", {
                    team_id: teamId,
                    approval_id: approval.id,
                    requester: user?.display_name || "Someone",
                    title: approval.title,
                    type: approval.approval_type,
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:approval:created", {
                team_id: teamId,
                approval: {
                    id: approval.id,
                    requested_by: approval.requested_by,
                    approval_type: approval.approval_type,
                    title: approval.title,
                    description: approval.description,
                    amount: approval.amount,
                    status: approval.status,
                },
            });
        }
        const requester = await this.users.findOne({ where: { id: userId } });
        const requesterName = requester?.display_name || "Someone";
        const teamMemberRows = await this.teamMembers.find({
            where: { team_id: teamId },
        });
        const orgMemberRows = await this.orgMembers.find({
            where: { organization_id: organizationId },
        });
        for (const tm of teamMemberRows) {
            if (tm.role === "lead" && tm.user_id !== userId) {
                await this.createNotification(organizationId, tm.user_id, "approval", "Approval Request", `${requesterName} requested ${payload.approval_type}: "${payload.title}"`, {
                    approval_id: approval.id,
                    requester: requesterName,
                    requester_id: userId,
                    approval_type: payload.approval_type,
                    amount: payload.amount,
                }).catch(() => { });
            }
        }
        for (const om of orgMemberRows) {
            if ((om.role === "admin" || om.role === "manager" || om.role === "owner") && om.user_id !== userId) {
                await this.createNotification(organizationId, om.user_id, "approval", "Approval Request", `${requesterName} requested ${payload.approval_type}: "${payload.title}"`, {
                    approval_id: approval.id,
                    requester: requesterName,
                    requester_id: userId,
                    approval_type: payload.approval_type,
                    amount: payload.amount,
                }).catch(() => { });
            }
        }
        return { id: approval.id, message: "Approval request submitted" };
    }
    async approveApproval(userId, organizationId, teamId, approvalId, note) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        const member = await this.orgMembers.findOne({
            where: { organization_id: organizationId, user_id: userId },
        });
        if (!member || !["owner", "admin"].includes(member.role)) {
            throw new common_1.ForbiddenException("Only admins can approve requests");
        }
        const approval = await this.approvals.findOne({
            where: {
                id: approvalId,
                organization_id: organizationId,
                team_id: teamId,
            },
        });
        if (!approval) {
            throw new common_1.NotFoundException("Approval request not found");
        }
        if (approval.status !== "pending") {
            throw new common_1.BadRequestException("This request has already been processed");
        }
        await this.approvals.update({ id: approvalId }, {
            status: "approved",
            approver_id: userId,
            decided_at: new Date(),
            decision_note: note || null,
        });
        if (this.gateway) {
            const approver = await this.users.findOne({ where: { id: userId } });
            this.gateway.emitToUser(approval.requested_by, "approval:approved", {
                team_id: teamId,
                approval_id: approvalId,
                approver: approver?.display_name || "Admin",
                title: approval.title,
            });
            this.gateway.emitToOrganization(organizationId, "org:approval:updated", {
                team_id: teamId,
                approval_id: approvalId,
                status: "approved",
                approver_id: userId,
                approver_name: approver?.display_name || "Admin",
            });
        }
        const approver = await this.users.findOne({ where: { id: userId } });
        const approverName = approver?.display_name || "Admin";
        await this.createNotification(organizationId, approval.requested_by, "approval", "Request Approved", `${approverName} approved your ${approval.approval_type} request: "${approval.title}"`, {
            approval_id: approvalId,
            approver: approverName,
            approver_id: userId,
            approval_type: approval.approval_type,
            decision_note: note,
        }).catch(() => { });
        return { message: "Approval request approved" };
    }
    async rejectApproval(userId, organizationId, teamId, approvalId, note) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        const member = await this.orgMembers.findOne({
            where: { organization_id: organizationId, user_id: userId },
        });
        if (!member || !["owner", "admin"].includes(member.role)) {
            throw new common_1.ForbiddenException("Only admins can reject requests");
        }
        const approval = await this.approvals.findOne({
            where: {
                id: approvalId,
                organization_id: organizationId,
                team_id: teamId,
            },
        });
        if (!approval) {
            throw new common_1.NotFoundException("Approval request not found");
        }
        if (approval.status !== "pending") {
            throw new common_1.BadRequestException("This request has already been processed");
        }
        await this.approvals.update({ id: approvalId }, {
            status: "rejected",
            approver_id: userId,
            decided_at: new Date(),
            decision_note: note,
        });
        if (this.gateway) {
            const approver = await this.users.findOne({ where: { id: userId } });
            this.gateway.emitToUser(approval.requested_by, "approval:rejected", {
                team_id: teamId,
                approval_id: approvalId,
                approver: approver?.display_name || "Admin",
                title: approval.title,
                note: note,
            });
            this.gateway.emitToOrganization(organizationId, "org:approval:updated", {
                team_id: teamId,
                approval_id: approvalId,
                status: "rejected",
                approver_id: userId,
                approver_name: approver?.display_name || "Admin",
            });
        }
        const approver = await this.users.findOne({ where: { id: userId } });
        const approverName = approver?.display_name || "Admin";
        await this.createNotification(organizationId, approval.requested_by, "approval", "Request Rejected", `${approverName} rejected your ${approval.approval_type} request: "${approval.title}"`, {
            approval_id: approvalId,
            approver: approverName,
            approver_id: userId,
            approval_type: approval.approval_type,
            decision_note: note,
        }).catch(() => { });
        return { message: "Approval request rejected" };
    }
    async cancelApproval(userId, organizationId, teamId, approvalId) {
        await this.assertCanViewTeam(userId, organizationId, teamId);
        const approval = await this.approvals.findOne({
            where: {
                id: approvalId,
                organization_id: organizationId,
                team_id: teamId,
            },
        });
        if (!approval) {
            throw new common_1.NotFoundException("Approval request not found");
        }
        if (approval.requested_by !== userId) {
            throw new common_1.ForbiddenException("You can only cancel your own requests");
        }
        if (approval.status !== "pending") {
            throw new common_1.BadRequestException("Only pending requests can be cancelled");
        }
        await this.approvals.update({ id: approvalId }, { status: "cancelled" });
        return { message: "Approval request cancelled" };
    }
    async sendOrgPraise(userId, organizationId, payload) {
        await this.getOrgMembership(userId, organizationId);
        const recipientMember = await this.orgMembers.findOne({
            where: { organization_id: organizationId, user_id: payload.to_user_id },
        });
        if (!recipientMember) {
            throw new common_1.BadRequestException("Recipient is not an organization member");
        }
        if (payload.to_user_id === userId) {
            throw new common_1.BadRequestException("You cannot praise yourself");
        }
        const praise = this.praises.create({
            organization_id: organizationId,
            team_id: null,
            from_user_id: userId,
            to_user_id: payload.to_user_id,
            badge: payload.badge,
            message: payload.message || null,
        });
        await this.praises.save(praise);
        const fromUser = await this.users.findOne({ where: { id: userId } });
        const toUser = await this.users.findOne({
            where: { id: payload.to_user_id },
        });
        await this.createNotification(organizationId, payload.to_user_id, "praise", "New Praise Received", `${fromUser?.display_name || "Someone"} praised you with ${payload.badge} badge`, {
            from_user: fromUser?.display_name || "Someone",
            from_user_id: userId,
            badge: payload.badge,
            praise_id: praise.id,
        });
        if (this.gateway) {
            const orgMemberRows = await this.orgMembers.find({
                where: { organization_id: organizationId },
            });
            const orgUserIds = orgMemberRows.map((m) => m.user_id);
            orgUserIds.forEach((uid) => {
                this.gateway.emitToUser(uid, "praise:sent", {
                    organization_id: organizationId,
                    praise_id: praise.id,
                    from: fromUser?.display_name || "Someone",
                    to: toUser?.display_name || "Someone",
                    badge: payload.badge,
                });
            });
            this.gateway.emitToOrganization(organizationId, "org:praise:created", {
                praise_id: praise.id,
                from_user_id: userId,
                from_user_name: fromUser?.display_name || "Someone",
                to_user_id: payload.to_user_id,
                to_user_name: toUser?.display_name || "Someone",
                badge: payload.badge,
                message: payload.message,
            });
        }
        return { id: praise.id, message: "Praise sent successfully" };
    }
    async getOrgPraise(userId, organizationId) {
        await this.getOrgMembership(userId, organizationId);
        const praiseRows = await this.praises.find({
            where: { organization_id: organizationId, team_id: null },
            order: { created_at: "DESC" },
            take: 200,
        });
        const userIds = new Set();
        praiseRows.forEach((p) => {
            userIds.add(p.from_user_id);
            userIds.add(p.to_user_id);
        });
        const users = await this.users.find({
            where: { id: (0, typeorm_2.In)(Array.from(userIds)) },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));
        const praise = praiseRows.map((p) => ({
            id: p.id,
            from_user_id: p.from_user_id,
            from_user_name: userMap.get(p.from_user_id)?.display_name || "Unknown",
            from_user_avatar: userMap.get(p.from_user_id)?.avatar_url || null,
            to_user_id: p.to_user_id,
            to_user_name: userMap.get(p.to_user_id)?.display_name || "Unknown",
            to_user_avatar: userMap.get(p.to_user_id)?.avatar_url || null,
            badge: p.badge,
            message: p.message || null,
            created_at: p.created_at.toISOString(),
        }));
        return { praise };
    }
    async getOrgCalendar(userId, organizationId) {
        await this.getOrgMembership(userId, organizationId);
        const calendarEventRows = await this.calendarEvents.find({
            where: { organization_id: organizationId, team_id: (0, typeorm_2.IsNull)() },
            order: { date: "ASC", start_time: "ASC" },
            take: 200,
        });
        const eventIds = calendarEventRows.map((e) => e.id);
        const eventAttendees = eventIds.length
            ? await this.calendarAttendees.find({
                where: { event_id: (0, typeorm_2.In)(eventIds) },
            })
            : [];
        const attendeeUserIds = [...new Set(eventAttendees.map((a) => a.user_id))];
        const users = await this.users.find({
            where: { id: (0, typeorm_2.In)(attendeeUserIds) },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));
        const attendeesByEvent = new Map();
        for (const attendee of eventAttendees) {
            const list = attendeesByEvent.get(attendee.event_id) || [];
            const user = userMap.get(attendee.user_id);
            if (user)
                list.push(user.display_name);
            attendeesByEvent.set(attendee.event_id, list);
        }
        const calendar = calendarEventRows.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description || undefined,
            date: event.date,
            start_time: event.start_time,
            end_time: event.end_time || undefined,
            location: event.location || undefined,
            type: event.type,
            created_by: event.created_by || undefined,
            attendees: attendeesByEvent.get(event.id) || [],
        }));
        const userMeetingAttendees = await this.meetingAttendees.find({
            where: { user_id: userId },
        });
        const meetingIds = userMeetingAttendees.map((a) => a.meeting_id);
        let meetings = [];
        if (meetingIds.length > 0) {
            const meetingRows = await this.meetings.find({
                where: {
                    id: (0, typeorm_2.In)(meetingIds),
                    organization_id: organizationId,
                },
                order: { starts_at: "ASC" },
                take: 200,
            });
            const allMeetingAttendees = await this.meetingAttendees.find({
                where: { meeting_id: (0, typeorm_2.In)(meetingIds) },
            });
            const meetingAttendeeUserIds = [
                ...new Set(allMeetingAttendees.map((a) => a.user_id)),
            ];
            const meetingUsers = await this.users.find({
                where: { id: (0, typeorm_2.In)(meetingAttendeeUserIds) },
            });
            const meetingUserMap = new Map(meetingUsers.map((u) => [u.id, u]));
            const attendeesByMeeting = new Map();
            for (const attendee of allMeetingAttendees) {
                const list = attendeesByMeeting.get(attendee.meeting_id) || [];
                const user = meetingUserMap.get(attendee.user_id);
                if (user)
                    list.push(user.display_name);
                attendeesByMeeting.set(attendee.meeting_id, list);
            }
            meetings = meetingRows.map((meeting) => ({
                id: meeting.id,
                title: meeting.title,
                description: meeting.description || undefined,
                starts_at: meeting.starts_at.toISOString(),
                ends_at: meeting.ends_at.toISOString(),
                location_type: meeting.location_type,
                meeting_link: meeting.meeting_link || undefined,
                status: meeting.status,
                created_by: meeting.created_by || undefined,
                attendees: attendeesByMeeting.get(meeting.id) || [],
            }));
        }
        return { calendar, meetings };
    }
    async createNotification(organizationId, userId, type, title, message, metadata) {
        console.log('[Notification] Creating notification:', {
            organizationId,
            userId,
            type,
            title,
            message,
        });
        const notification = this.notifications.create({
            organization_id: organizationId,
            user_id: userId,
            type,
            title,
            message,
            metadata: metadata || null,
        });
        await this.notifications.save(notification);
        console.log('[Notification] Saved notification:', notification.id);
        if (this.gateway) {
            this.gateway.emitToUser(userId, "notification:new", {
                id: notification.id,
                type,
                title,
                message,
                timestamp: notification.created_at.toISOString(),
            });
            console.log('[Notification] Emitted real-time event to user:', userId);
        }
        return notification;
    }
    async getNotifications(userId, organizationId) {
        console.log('[Notification] Getting notifications for user:', userId, 'org:', organizationId);
        await this.getOrgMembership(userId, organizationId);
        const notifications = await this.notifications.find({
            where: { organization_id: organizationId, user_id: userId },
            order: { created_at: "DESC" },
            take: 100,
        });
        console.log('[Notification] Found', notifications.length, 'notifications');
        return {
            notifications: notifications.map((n) => ({
                id: n.id,
                type: n.type,
                title: n.title,
                message: n.message,
                read: n.read,
                metadata: n.metadata,
                timestamp: n.created_at.toISOString(),
                read_at: n.read_at ? n.read_at.toISOString() : null,
            })),
            unread_count: notifications.filter((n) => !n.read).length,
        };
    }
    async markNotificationAsRead(userId, organizationId, notificationId) {
        await this.getOrgMembership(userId, organizationId);
        const notification = await this.notifications.findOne({
            where: { id: notificationId, user_id: userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException("Notification not found");
        }
        await this.notifications.update({ id: notificationId }, { read: true, read_at: new Date() });
        if (this.gateway) {
            this.gateway.emitToUser(userId, "notification:read", {
                notification_id: notificationId,
                organization_id: organizationId,
            });
        }
        return { message: "Notification marked as read" };
    }
    async markAllNotificationsAsRead(userId, organizationId) {
        await this.getOrgMembership(userId, organizationId);
        await this.notifications.update({ organization_id: organizationId, user_id: userId, read: false }, { read: true, read_at: new Date() });
        if (this.gateway) {
            this.gateway.emitToUser(userId, "notification:all-read", {
                organization_id: organizationId,
            });
        }
        return { message: "All notifications marked as read" };
    }
    async deleteNotification(userId, organizationId, notificationId) {
        await this.getOrgMembership(userId, organizationId);
        const notification = await this.notifications.findOne({
            where: { id: notificationId, user_id: userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException("Notification not found");
        }
        await this.notifications.delete({ id: notificationId });
        return { message: "Notification deleted" };
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Organization)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.OrganizationMember)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.OrganizationTeam)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.TeamMember)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.TeamConversation)),
    __param(5, (0, typeorm_1.InjectRepository)(entities_1.Conversation)),
    __param(6, (0, typeorm_1.InjectRepository)(entities_1.ConversationParticipant)),
    __param(7, (0, typeorm_1.InjectRepository)(entities_1.Message)),
    __param(8, (0, typeorm_1.InjectRepository)(entities_1.MessageReaction)),
    __param(9, (0, typeorm_1.InjectRepository)(entities_1.OrgTask)),
    __param(10, (0, typeorm_1.InjectRepository)(entities_1.OrgMeeting)),
    __param(11, (0, typeorm_1.InjectRepository)(entities_1.OrgMeetingAttendee)),
    __param(12, (0, typeorm_1.InjectRepository)(entities_1.OrgAttendanceLog)),
    __param(13, (0, typeorm_1.InjectRepository)(entities_1.OrgApproval)),
    __param(14, (0, typeorm_1.InjectRepository)(entities_1.OrgPraise)),
    __param(15, (0, typeorm_1.InjectRepository)(entities_1.OrgNotification)),
    __param(16, (0, typeorm_1.InjectRepository)(entities_1.OrgShift)),
    __param(17, (0, typeorm_1.InjectRepository)(entities_1.OrgActivityLog)),
    __param(18, (0, typeorm_1.InjectRepository)(entities_1.OrgCallLog)),
    __param(19, (0, typeorm_1.InjectRepository)(entities_1.OrgCallLogParticipant)),
    __param(20, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(21, (0, typeorm_1.InjectRepository)(entities_1.OrgCalendarEvent)),
    __param(22, (0, typeorm_1.InjectRepository)(entities_1.OrgCalendarEventAttendee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        realtime_gateway_1.RealtimeGateway])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map