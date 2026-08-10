import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';


@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  school_password: string;

  @Column({ nullable: true })
  personal_code: string;

  @Column({ nullable: true })
  admin_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  institute_id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('classes')
export class ClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  institute_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  institute_id: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  institute_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  course_code: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('class_batch_sections')
export class ClassBatchSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  class_id: string;

  @Column()
  batch_id: string;

  @Column()
  section_id: string;

  @ManyToOne(() => ClassEntity, { eager: true })
  @JoinColumn({ name: 'class_id' })
  class: ClassEntity;

  @ManyToOne(() => Batch, { eager: true })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => Section, { eager: true })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('homework')
export class Homework {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  institute_id: string;

  @Column({ type: 'uuid' })
  teacher_id: string;

  @Column({ type: 'uuid', nullable: true })
  class_batch_section_id: string;

  @Column({ nullable: true })
  subject_id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  published_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => ClassBatchSection, { nullable: true })
  @JoinColumn({ name: 'class_batch_section_id' })
  class_batch_section: ClassBatchSection;

  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('homework_submissions')
export class HomeworkSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  homework_id: string;

  @Column()
  student_id: string;

  @Column({ nullable: true })
  submission_text: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: 0 })
  stars: number;

  @Column({ nullable: true })
  teacher_feedback: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  submitted_date: Date;

  @ManyToOne(() => Homework)
  @JoinColumn({ name: 'homework_id' })
  homework: Homework;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  institute_id: string;

  @Column({ type: 'uuid' })
  teacher_id: string;

  @Column({ type: 'uuid', nullable: true })
  class_batch_section_id: string;

  @Column({ type: 'uuid', nullable: true })
  subject_id: string;

  @Column()
  announcement_type: string;

  @Column({ type: 'uuid', nullable: true })
  student_id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  published_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => ClassBatchSection, { nullable: true })
  @JoinColumn({ name: 'class_batch_section_id' })
  class_batch_section: ClassBatchSection;

  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  class_batch_section_id: string;

  @Column()
  student_id: string;

  @Column()
  teacher_id: string;

  @Column({ type: 'uuid', nullable: true })
  subject_id: string;

  @Column({ type: 'uuid', nullable: true })
  institute_id: string;

  @Column({ type: 'date' })
  attendance_date: string;

  @Column()
  status: string;

  @ManyToOne(() => ClassBatchSection, { nullable: true })
  @JoinColumn({ name: 'class_batch_section_id' })
  class_batch_section: ClassBatchSection;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  updated_at: Date;
}



@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  student_id: string;

  @Column()
  teacher_id: string;

  @Column({ nullable: true })
  class_batch_section_id: string;

  @Column({ nullable: true })
  subject_id: string;

  @Column()
  result_type: string;

  @Column({ type: 'numeric' })
  marks_obtained: number;

  @Column({ type: 'numeric' })
  total_marks: number;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  published_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => ClassBatchSection, { nullable: true })
  @JoinColumn({ name: 'class_batch_section_id' })
  class_batch_section: ClassBatchSection;

  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teacher_id: string;

  @Column()
  class_batch_section_id: string;

  @Column({ nullable: true })
  subject_id: string;

  @Column()
  day_of_week: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => ClassBatchSection)
  @JoinColumn({ name: 'class_batch_section_id' })
  class_batch_section: ClassBatchSection;

  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('student_enrollments')
export class StudentEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  student_id: string;

  @Column()
  class_batch_section_id: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  enrollment_date: Date;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => ClassBatchSection, { eager: true })
  @JoinColumn({ name: 'class_batch_section_id' })
  class_batch_section: ClassBatchSection;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}



@Entity('teacher_assignments')
export class TeacherAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teacher_id: string;

  @Column()
  class_batch_section_id: string;

  @Column({ nullable: true })
  subject_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => ClassBatchSection, { eager: true })
  @JoinColumn({ name: 'class_batch_section_id' })
  class_batch_section: ClassBatchSection;

  @ManyToOne(() => Subject, { eager: true, nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

