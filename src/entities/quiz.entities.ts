import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ClassBatchSection, Subject } from './cms.entities';
import { Institute } from './institute.entities';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  institute_id: string;

  @Column({ type: 'uuid' })
  teacher_id: string;

  @Column({ type: 'uuid', nullable: true })
  class_batch_section_id: string;

  @Column({ type: 'uuid', nullable: true })
  subject_id: string;

  @Column({ type: 'integer', default: 100 })
  total_marks: number;

  @Column({ type: 'integer', nullable: true })
  duration_minutes: number;

  @Column({ type: 'timestamptz', nullable: true })
  due_date: Date;

  @Column({ type: 'boolean', default: false })
  is_published: boolean;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

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

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quiz_id: string;

  @Column({ type: 'text' })
  question_text: string;

  @Column({ type: 'varchar', length: 50 })
  question_type: 'mcq' | 'true_false' | 'short_answer';

  @Column({ type: 'jsonb', nullable: true })
  options: string[];

  @Column({ type: 'text' })
  correct_answer: string;

  @Column({ type: 'integer', default: 1 })
  marks: number;

  @Column({ type: 'integer', default: 0 })
  order_number: number;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quiz_id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  started_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  submitted_at: Date;

  @Column({ type: 'integer', default: 0 })
  score: number;

  @Column({ type: 'integer' })
  total_marks: number;

  @Column({ type: 'varchar', length: 50, default: 'in_progress' })
  status: 'in_progress' | 'submitted' | 'graded';

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

@Entity('quiz_answers')
export class QuizAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  attempt_id: string;

  @Column({ type: 'uuid' })
  question_id: string;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ type: 'boolean', nullable: true })
  is_correct: boolean;

  @Column({ type: 'integer', default: 0 })
  marks_obtained: number;

  @ManyToOne(() => QuizAttempt)
  @JoinColumn({ name: 'attempt_id' })
  attempt: QuizAttempt;

  @ManyToOne(() => QuizQuestion)
  @JoinColumn({ name: 'question_id' })
  question: QuizQuestion;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
