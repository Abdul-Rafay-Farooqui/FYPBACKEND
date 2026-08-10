import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Subject } from './cms.entities';

@Entity('subject_assignments')
export class SubjectAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  subject_id: string;

  @Column({ type: 'uuid' })
  teacher_id: string;

  @Column({ type: 'uuid' })
  institute_id: string;

  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
