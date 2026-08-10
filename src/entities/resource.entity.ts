import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ClassBatchSection, Subject } from './cms.entities';
import { Institute } from './institute.entities';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  file_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  file_type: string;

  @Column({ type: 'bigint', nullable: true })
  file_size: number;

  @Column({ type: 'uuid' })
  institute_id: string;

  @Column({ type: 'uuid' })
  teacher_id: string;

  @Column({ type: 'uuid', nullable: true })
  class_batch_section_id: string;

  @Column({ type: 'uuid', nullable: true })
  subject_id: string;

  @Column({ type: 'varchar', length: 50, default: 'document' })
  resource_type: 'document' | 'video' | 'audio' | 'image' | 'other';

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  uploaded_at: Date;

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
}
