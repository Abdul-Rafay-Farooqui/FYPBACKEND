import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', default: '1on1' })
  type: '1on1' | 'group';

  @Column({ type: 'text', nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  avatar_url: string | null;

  @Column({ type: 'uuid', nullable: true })
  created_by: string | null;

  @Column({ type: 'uuid', nullable: true })
  last_message_id: string | null;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  last_message_at: Date;

  @Column({ type: 'text', nullable: true })
  last_message_preview: string | null;

  @Column({ type: 'integer', nullable: true })
  disappearing_timer: number | null;

  @Column({ type: 'text', default: 'all' })
  send_permission: 'all' | 'admins';

  @Column({ type: 'text', default: 'all' })
  edit_permission: 'all' | 'admins';

  @Column({ type: 'uuid', nullable: true })
  community_id: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}