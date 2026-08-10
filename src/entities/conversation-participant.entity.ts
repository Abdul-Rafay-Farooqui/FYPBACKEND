import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';

@Entity('conversation_participants')
@Unique(['conversation_id', 'user_id'])
export class ConversationParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  conversation_id: string;

  @Index()
  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text', default: 'member' })
  role: 'admin' | 'member';

  @Column({ type: 'boolean', default: false })
  is_muted: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  mute_until: Date | null;

  @Column({ type: 'boolean', default: false })
  is_pinned: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  pinned_at: Date | null;

  @Column({ type: 'boolean', default: false })
  is_hidden: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  cleared_at: Date | null;

  @Column({ type: 'text', nullable: true })
  lock_pin: string | null;

  @Column({ type: 'integer', default: 0 })
  unread_count: number;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  last_read_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  joined_at: Date;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}