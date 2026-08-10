import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { ClassBatchSection, Subject } from "./cms.entities";
import { Institute } from "./institute.entities";

@Entity("live_classes")
export class LiveClass {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "uuid" })
  institute_id: string;

  @Column({ type: "uuid" })
  teacher_id: string;

  @Column({ type: "uuid", nullable: true })
  class_batch_section_id: string;

  @Column({ type: "uuid", nullable: true })
  subject_id: string;

  @Column({ type: "text", nullable: true })
  meeting_url: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  meeting_id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  meeting_password: string;

  @Column({ type: "timestamptz" })
  scheduled_at: Date;

  @Column({ type: "timestamptz", nullable: true })
  ends_at: Date;

  @Column({ type: "integer", default: 60 })
  duration_minutes: number;

  @Column({ type: "varchar", length: 50, default: "scheduled" })
  status: "scheduled" | "live" | "ended" | "cancelled";

  @Column({ type: "varchar", length: 50, default: "online" })
  location_type: "online" | "onsite" | "hybrid";

  @Column({ type: "varchar", length: 50, default: "video" })
  call_type: "voice" | "video";

  @Column({ type: "text", nullable: true })
  recording_url: string;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: "institute_id" })
  institute: Institute;

  @ManyToOne(() => User)
  @JoinColumn({ name: "teacher_id" })
  teacher: User;

  @ManyToOne(() => ClassBatchSection, { nullable: true })
  @JoinColumn({ name: "class_batch_section_id" })
  class_batch_section: ClassBatchSection;

  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: "subject_id" })
  subject: Subject;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}

@Entity("live_class_participants")
export class LiveClassParticipant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  live_class_id: string;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: "timestamptz", nullable: true })
  joined_at: Date;

  @Column({ type: "timestamptz", nullable: true })
  left_at: Date;

  @Column({ type: "integer", nullable: true })
  duration_minutes: number;

  @ManyToOne(() => LiveClass)
  @JoinColumn({ name: "live_class_id" })
  live_class: LiveClass;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
