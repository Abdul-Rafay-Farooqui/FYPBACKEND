import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import {
  Institute,
  InstituteMember,
  User,
  ClassEntity,
  Batch,
  Section,
  Subject,
} from "../../entities";
import { RealtimeGateway } from "../realtime/realtime.gateway";

export interface CreateInstituteDto {
  name: string;
  slug?: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  member_ids?: string[];
}

export interface UpdateInstituteDto {
  name?: string;
  slug?: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  is_active?: boolean;
}

export interface AddMembersDto {
  user_ids: string[];
  role?: "admin" | "teacher" | "student";
}

@Injectable()
export class InstitutesService {
  constructor(
    @InjectRepository(Institute)
    private readonly institutes: Repository<Institute>,
    @InjectRepository(InstituteMember)
    private readonly members: Repository<InstituteMember>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(ClassEntity)
    private readonly classes: Repository<ClassEntity>,
    @InjectRepository(Batch)
    private readonly batches: Repository<Batch>,
    @InjectRepository(Section)
    private readonly sections: Repository<Section>,
    @InjectRepository(Subject)
    private readonly subjects: Repository<Subject>,
    private readonly gateway: RealtimeGateway,
  ) {}

  async list(userId: string) {
    const memberships = await this.members.find({
      where: { user_id: userId, status: "active" },
    });

    const instituteIds = memberships.map((m) => m.institute_id);
    if (!instituteIds.length) return [];

    const institutes = await this.institutes.find({
      where: { id: In(instituteIds), is_active: true },
    });

    return institutes.map((inst) => {
      const membership = memberships.find((m) => m.institute_id === inst.id);
      return {
        ...inst,
        current_user_role: membership?.role,
      };
    });
  }

  async create(userId: string, dto: CreateInstituteDto) {
    const institute = this.institutes.create({
      ...dto,
      created_by: userId,
    });
    await this.institutes.save(institute);

    const member = this.members.create({
      institute_id: institute.id,
      user_id: userId,
      role: "admin",
      status: "active",
    });
    await this.members.save(member);

    if (dto.member_ids?.length) {
      await this.addMembers(userId, institute.id, {
        user_ids: dto.member_ids,
        role: "student",
      });
    }

    return institute;
  }

  async get(userId: string, instituteId: string) {
    await this.checkMembership(userId, instituteId);
    const institute = await this.institutes.findOne({
      where: { id: instituteId },
    });
    if (!institute) throw new NotFoundException("Institute not found");
    return institute;
  }

  async update(userId: string, instituteId: string, dto: UpdateInstituteDto) {
    await this.checkAdminRole(userId, instituteId);
    await this.institutes.update(instituteId, dto);
    return this.institutes.findOne({ where: { id: instituteId } });
  }

  async delete(userId: string, instituteId: string) {
    await this.checkAdminRole(userId, instituteId);
    await this.institutes.update(instituteId, { is_active: false });
    return { success: true };
  }

  async addMembers(userId: string, instituteId: string, dto: AddMembersDto) {
    await this.checkAdminRole(userId, instituteId);

    const members = dto.user_ids.map((uid) =>
      this.members.create({
        institute_id: instituteId,
        user_id: uid,
        role: dto.role || "student",
        invited_by: userId,
        status: "active",
      })
    );

    await this.members.save(members);

    // Get institute details for the notification
    const institute = await this.institutes.findOne({ where: { id: instituteId } });

    // Add each user to the institute room and emit socket event
    for (const uid of dto.user_ids) {
      // Add user to institute room so they receive future updates
      this.gateway.addUserToInstituteRoom(uid, instituteId);
      
      // Emit event to the user's personal room
      this.gateway.emitToUser(uid, "institute:member-added", {
        institute_id: instituteId,
        institute_name: institute?.name,
        role: dto.role || "student",
        added_by: userId,
      });
    }

    // Also emit to the institute room
    this.gateway.emitToInstitute(instituteId, "institute:members-added", {
      institute_id: instituteId,
      user_ids: dto.user_ids,
      role: dto.role || "student",
      added_by: userId,
    });

    return { success: true, count: members.length };
  }

  async getMembers(userId: string, instituteId: string, role?: string) {
    await this.checkMembership(userId, instituteId);

    const where: any = { institute_id: instituteId, status: "active" };
    if (role) where.role = role;

    const memberships = await this.members.find({ where });
    const userIds = memberships.map((m) => m.user_id);

    if (!userIds.length) return [];

    const users = await this.users.find({ where: { id: In(userIds) } });

    return memberships.map((m) => {
      const user = users.find((u) => u.id === m.user_id);
      return {
        ...m,
        user,
      };
    });
  }

  async updateMember(
    userId: string,
    instituteId: string,
    memberId: string,
    dto: { role?: "admin" | "teacher" | "student"; status?: "active" | "invited" | "suspended" | "left" }
  ) {
    await this.checkAdminRole(userId, instituteId);
    await this.members.update(memberId, dto);
    return { success: true };
  }

  async removeMember(userId: string, instituteId: string, memberId: string) {
    await this.checkAdminRole(userId, instituteId);
    
    // Get member info before removing
    const member = await this.members.findOne({ where: { id: memberId } });
    
    await this.members.update(memberId, { status: "left" });

    // Remove user from institute room and emit socket events
    if (member) {
      // Remove user from the institute room
      this.gateway.removeUserFromInstituteRoom(member.user_id, instituteId);
      
      // Emit event to the removed user's personal room
      this.gateway.emitToUser(member.user_id, "institute:member-removed", {
        institute_id: instituteId,
        removed_by: userId,
      });

      // Also emit to the institute room
      this.gateway.emitToInstitute(instituteId, "institute:member-removed", {
        institute_id: instituteId,
        user_id: member.user_id,
        removed_by: userId,
      });
    }

    return { success: true };
  }

  // Helper methods
  private async checkMembership(userId: string, instituteId: string) {
    const member = await this.members.findOne({
      where: { user_id: userId, institute_id: instituteId, status: "active" },
    });
    if (!member) throw new ForbiddenException("Not a member of this institute");
    return member;
  }

  private async checkAdminRole(userId: string, instituteId: string) {
    const member = await this.checkMembership(userId, instituteId);
    if (member.role !== "admin") {
      throw new ForbiddenException("Admin role required");
    }
    return member;
  }
}
