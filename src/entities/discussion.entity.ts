import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ClassBatchSection, Subject } from './cms.entities';
import { Institute } from './institute.entities';

@Entity('discussions')
export class Discussion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid' })
  teacher_id: string;

  @Column({ type: 'uuid' })
  institute_id: string;

  @Column({ type: 'uuid', nullable: true })
  class_batch_section_id: string;

  @Column({ type: 'uuid', nullable: true })
  subject_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @ManyToOne(() => ClassBatchSection, { nullable: true })
  @JoinColumn({ name: 'class_batch_section_id' })
  class_batch_section: ClassBatchSection;

  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Discussion, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Discussion;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
