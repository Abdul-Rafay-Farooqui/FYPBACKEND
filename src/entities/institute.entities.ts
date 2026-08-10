import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity("institutes")
export class Institute {
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

@Entity("institute_members")
@Unique(["institute_id", "user_id"])
export class InstituteMember {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  institute_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text", default: "student" })
  role: "admin" | "teacher" | "student";

  @Column({ type: "text", nullable: true })
  employee_code: string | null;

  @Column({ type: "text", nullable: true })
  student_code: string | null;

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

@Entity("institute_notifications")
export class InstituteNotification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  institute_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "text" })
  type: 
    | "announcement" 
    | "assignment" 
    | "assignment_submission"
    | "quiz" 
    | "live_class" 
    | "live_class_started"
    | "grade" 
    | "discussion" 
    | "resource"
    | "query"
    | "general";

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @Column({ type: "jsonb", nullable: true })
  metadata: any;

  @Column({ type: "uuid", nullable: true })
  related_id: string | null;

  @Column({ type: "text", nullable: true })
  related_type: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @Column({ type: "timestamptz", nullable: true })
  read_at: Date | null;
}
