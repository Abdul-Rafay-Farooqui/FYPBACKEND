import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'text', nullable: true })
  phone: string | null;

  @Column({ type: 'text', name: 'password_hash', select: false })
  password_hash: string;

  @Column({ type: 'text', default: '' })
  display_name: string;

  @Column({ type: 'text', nullable: true, unique: true })
  email: string | null;

  @Column({ type: 'text', nullable: true, default: 'student' })
  school_role: string | null;

  @Column({ type: 'uuid', nullable: true })
  school_id: string | null;

  @Column({ type: 'text', nullable: true, unique: true })
  username: string | null;

  @Column({ type: 'text', nullable: true })
  avatar_url: string | null;

  @Column({ type: 'text', default: 'Hey there! I am using WeConnect.' })
  about: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  last_seen: Date;

  @Column({ type: 'boolean', default: false })
  is_online: boolean;

  @Column({ type: 'boolean', default: false })
  onboarding_complete: boolean;

  @Column({ type: 'text', default: 'everyone' })
  privacy_last_seen: 'everyone' | 'contacts' | 'nobody';

  @Column({ type: 'text', default: 'everyone' })
  privacy_profile_pic: 'everyone' | 'contacts' | 'nobody';

  @Column({ type: 'text', default: 'everyone' })
  privacy_about: 'everyone' | 'contacts' | 'nobody';

  @Column({ type: 'text', default: 'contacts' })
  privacy_status: 'everyone' | 'contacts' | 'nobody';

  @Column({ type: 'boolean', default: true })
  notifications_enabled: boolean;

  @Column({ type: 'text', default: 'dark' })
  theme: 'dark' | 'light';

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}