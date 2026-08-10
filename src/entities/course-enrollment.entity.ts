import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Subject } from './cms.entities';
import { Institute } from './institute.entities';

@Entity('course_enrollments')
export class CourseEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  student_id: string;

  @Column({ type: 'uuid' })
  subject_id: string;

  @Column({ type: 'uuid' })
  institute_id: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  enrolled_at: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Institute)
  @JoinColumn({ name: 'institute_id' })
  institute: Institute;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
