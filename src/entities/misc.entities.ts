import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('message_reads')
@Unique(['message_id', 'user_id'])
export class MessageRead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  message_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'read_at' })
  read_at: Date;
}

@Entity('message_reactions')
@Unique(['message_id', 'user_id'])
export class MessageReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  message_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text' })
  emoji: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

@Entity('pinned_messages')
export class PinnedMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  conversation_id: string;

  @Column({ type: 'uuid' })
  message_id: string;

  @Column({ type: 'uuid' })
  pinned_by: string;

  @CreateDateColumn({ type: 'timestamptz' })
  pinned_at: Date;
}

@Entity('starred_messages')
export class StarredMessage {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  message_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  starred_at: Date;
}

@Entity('archived_conversations')
export class ArchivedConversation {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  conversation_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  archived_at: Date;
}

@Entity('locked_conversations')
@Unique(['user_id', 'conversation_id'])
export class LockedConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  conversation_id: string;

  @Column({ type: 'text' })
  pin_hash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  locked_at: Date;
}

@Entity('blocked_users')
export class BlockedUser {
  @PrimaryColumn({ type: 'uuid' })
  blocker_id: string;

  @PrimaryColumn({ type: 'uuid' })
  blocked_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  blocked_at: Date;
}

@Entity('reported_users')
export class ReportedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  reporter_id: string | null;

  @Column({ type: 'uuid' })
  reported_id: string;

  @Column({ type: 'uuid', nullable: true })
  message_id: string | null;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

@Entity('user_deleted_messages')
export class UserDeletedMessage {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @PrimaryColumn({ type: 'uuid' })
  message_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  deleted_at: Date;
}

@Entity('calls')
export class Call {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  caller_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  callee_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  conversation_id: string | null;

  @Column({ type: 'text' })
  type: 'voice' | 'video';

  @Column({ type: 'text', default: 'ringing' })
  status: 'ringing' | 'active' | 'ended' | 'missed' | 'declined' | 'failed';

  @Column({ type: 'text', unique: true })
  channel_name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  started_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  answered_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  ended_at: Date | null;

  @Column({ type: 'integer', nullable: true })
  duration_seconds: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

@Entity('status_updates')
export class StatusUpdate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text' })
  type: 'text' | 'image' | 'video';

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true })
  caption: string | null;

  @Column({ type: 'text', nullable: true })
  bg_color: string | null;

  @Column({ type: 'text', nullable: true })
  media_url: string | null;

  @Column({ type: 'text', nullable: true })
  media_thumbnail: string | null;

  @Column({ type: 'integer', nullable: true })
  media_duration: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  expires_at: Date;
}

@Entity('status_views')
@Unique(['status_id', 'viewer_id'])
export class StatusView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  status_id: string;

  @Column({ type: 'uuid' })
  viewer_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  viewed_at: Date;
}

/** Per-status privacy: hide this specific status from these user_ids. */
@Entity('status_hidden_from')
@Unique(['status_id', 'user_id'])
export class StatusHiddenFrom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  status_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

// ---------- Community --------------------------------------------------------
@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  avatar_url: string | null;

  @Column({ type: 'uuid', nullable: true })
  created_by: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

@Entity('community_members')
@Unique(['community_id', 'user_id'])
export class CommunityMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  community_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text', default: 'member' })
  role: 'admin' | 'member';

  @CreateDateColumn({ type: 'timestamptz' })
  joined_at: Date;
}

@Entity('community_groups')
@Unique(['community_id', 'conversation_id'])
export class CommunityGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  community_id: string;

  @Column({ type: 'uuid' })
  conversation_id: string;

  @Column({ type: 'boolean', default: false })
  is_announcement: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  added_at: Date;
}