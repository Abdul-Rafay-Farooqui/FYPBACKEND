import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true, unique: true })
  slug: string | null;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "text", nullable: true })
  logo_url: string | null;

  @Column({ type: "text", nullable: true })
  website_url: string | null;

  @Column({ type: "uuid", nullable: true })
  created_by: string | null;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("organization_members")
@Unique(["organization_id", "user_id"])
export class OrganizationMember {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text", default: "member" })
  role: "owner" | "admin" | "manager" | "member" | "guest";

  @Column({ type: "text", nullable: true })
  title: string | null;

  @Column({ type: "text", nullable: true })
  department: string | null;

  @Column({ type: "text", nullable: true })
  employee_code: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  joined_at: Date;

  @Column({ type: "uuid", nullable: true })
  invited_by: string | null;

  @Column({ type: "text", default: "active" })
  status: "active" | "invited" | "suspended" | "left";

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("organization_teams")
@Unique(["organization_id", "name"])
export class OrganizationTeam {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "uuid", nullable: true })
  lead_user_id: string | null;

  @Column({ type: "text", default: "organization" })
  visibility: "organization" | "private";

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "uuid", nullable: true })
  created_by: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("team_members")
@Unique(["team_id", "user_id"])
export class TeamMember {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  team_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text", default: "member" })
  role: "lead" | "member" | "guest";

  @CreateDateColumn({ type: "timestamptz" })
  joined_at: Date;

  @Column({ type: "uuid", nullable: true })
  added_by: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}

@Entity("team_conversations")
@Unique(["team_id", "conversation_id"])
@Unique(["team_id", "type"])
export class TeamConversation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  team_id: string;

  @Column({ type: "uuid" })
  conversation_id: string;

  @Column({ type: "text", default: "main" })
  type: "main" | "announcement" | "support" | "project";

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}

@Entity("org_meetings")
export class OrgMeeting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid", nullable: true })
  team_id: string | null;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "timestamptz" })
  starts_at: Date;

  @Column({ type: "timestamptz" })
  ends_at: Date;

  @Column({ type: "uuid", nullable: true })
  created_by: string | null;

  @Column({ type: "text", default: "online" })
  location_type: "online" | "onsite" | "hybrid";

  @Column({ type: "text", nullable: true })
  meeting_link: string | null;

  @Column({ type: "text", default: "scheduled" })
  status: "scheduled" | "ongoing" | "completed" | "cancelled";

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("org_meeting_attendees")
@Unique(["meeting_id", "user_id"])
export class OrgMeetingAttendee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  meeting_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text", default: "pending" })
  response_status: "pending" | "accepted" | "declined" | "maybe";

  @Column({ type: "text", default: "not_marked" })
  attendance_status: "not_marked" | "attended" | "absent" | "late";

  @Column({ type: "timestamptz", nullable: true })
  joined_at: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  left_at: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}

@Entity("org_tasks")
export class OrgTask {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid", nullable: true })
  team_id: string | null;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "uuid", nullable: true })
  created_by: string | null;

  @Column({ type: "uuid", nullable: true })
  assignee_id: string | null;

  @Column({ type: "text", default: "medium" })
  priority: "low" | "medium" | "high" | "critical";

  @Column({ type: "text", default: "todo" })
  status: "todo" | "in_progress" | "blocked" | "completed" | "cancelled";

  @Column({ type: "date", nullable: true })
  due_date: string | null;

  @Column({ type: "timestamptz", nullable: true })
  completed_at: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("org_attendance_logs")
@Unique(["organization_id", "user_id", "attendance_date"])
export class OrgAttendanceLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "date" })
  attendance_date: string;

  @Column({ type: "timestamptz", nullable: true })
  sign_in_at: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  sign_out_at: Date | null;

  @Column({ type: "text", default: "present" })
  status: "present" | "absent" | "leave" | "late" | "active";

  @Column({ type: "integer", default: 0 })
  work_minutes: number;

  @Column({ type: "text", default: "manual" })
  source: "manual" | "auto" | "biometric";

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("org_shifts")
export class OrgShift {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid", nullable: true })
  team_id: string | null;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "date" })
  shift_date: string;

  @Column({ type: "timestamptz" })
  starts_at: Date;

  @Column({ type: "timestamptz" })
  ends_at: Date;

  @Column({ type: "text", default: "scheduled" })
  status: "scheduled" | "completed" | "missed" | "cancelled";

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("org_approvals")
export class OrgApproval {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid", nullable: true })
  team_id: string | null;

  @Column({ type: "uuid" })
  requested_by: string;

  @Column({ type: "uuid", nullable: true })
  approver_id: string | null;

  @Column({ type: "text" })
  approval_type: "leave" | "attendance" | "purchase" | "timesheet" | "expense" | "other";

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  amount: string | null;

  @Column({ type: "text", default: "pending" })
  status: "pending" | "approved" | "rejected" | "cancelled";

  @Column({ type: "timestamptz", nullable: true })
  decided_at: Date | null;

  @Column({ type: "text", nullable: true })
  decision_note: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("org_praise")
export class OrgPraise {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid", nullable: true })
  team_id: string | null;

  @Column({ type: "uuid" })
  from_user_id: string;

  @Column({ type: "uuid" })
  to_user_id: string;

  @Column({ type: "text" })
  badge: string;

  @Column({ type: "text", nullable: true })
  message: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}

@Entity("org_notifications")
export class OrgNotification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text" })
  type: "praise" | "meeting" | "task" | "approval" | "attendance" | "activity" | "general";

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @Column({ type: "jsonb", nullable: true })
  metadata: any;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @Column({ type: "timestamptz", nullable: true })
  read_at: Date | null;
}

@Entity("org_activity_logs")
export class OrgActivityLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid", nullable: true })
  team_id: string | null;

  @Column({ type: "uuid", nullable: true })
  actor_id: string | null;

  @Column({ type: "uuid", nullable: true })
  target_user_id: string | null;

  @Column({ type: "text" })
  activity_type:
    | "mention"
    | "reply"
    | "reaction"
    | "file_shared"
    | "task_created"
    | "task_updated"
    | "meeting_scheduled"
    | "approval_request"
    | "praise_sent";

  @Column({ type: "text", nullable: true })
  reference_table: string | null;

  @Column({ type: "uuid", nullable: true })
  reference_id: string | null;

  @Column({ type: "text", nullable: true })
  preview_text: string | null;

  @Column({ type: "boolean", default: true })
  is_unread: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}

@Entity("org_call_logs")
export class OrgCallLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid", nullable: true })
  team_id: string | null;

  @Column({ type: "uuid", nullable: true })
  call_id: string | null;

  @Column({ type: "uuid", nullable: true })
  conversation_id: string | null;

  @Column({ type: "uuid", nullable: true })
  initiated_by: string | null;

  @Column({ type: "text" })
  call_type: "voice" | "video";

  @Column({ type: "text", default: "outgoing" })
  direction: "incoming" | "outgoing";

  @Column({ type: "text" })
  status: "ringing" | "answered" | "missed" | "declined" | "failed" | "ended";

  @Column({ type: "timestamptz", default: () => "NOW()" })
  started_at: Date;

  @Column({ type: "timestamptz", nullable: true })
  ended_at: Date | null;

  @Column({ type: "integer", default: 0 })
  duration_seconds: number;

  @Column({ type: "text", nullable: true })
  recording_url: string | null;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}

@Entity("org_call_log_participants")
@Unique(["call_log_id", "user_id"])
export class OrgCallLogParticipant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  call_log_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text", default: "participant" })
  participant_role: "host" | "cohost" | "participant";

  @Column({ type: "timestamptz", nullable: true })
  joined_at: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  left_at: Date | null;

  @Column({ type: "boolean", default: false })
  was_missed: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}

@Entity("org_calendar_events")
export class OrgCalendarEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  organization_id: string;

  @Column({ type: "uuid", nullable: true })
  team_id: string | null;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "time" })
  start_time: string;

  @Column({ type: "time", nullable: true })
  end_time: string | null;

  @Column({ type: "text", nullable: true })
  location: string | null;

  @Column({ type: "text", default: "meeting" })
  type: "meeting" | "event" | "reminder" | "deadline";

  @Column({ type: "uuid", nullable: true })
  created_by: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("org_calendar_event_attendees")
@Unique(["event_id", "user_id"])
export class OrgCalendarEventAttendee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  event_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text", default: "pending" })
  response_status: "pending" | "accepted" | "declined" | "maybe";

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
