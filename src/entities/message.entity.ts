import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from './user.entity';

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'sticker'
  | 'location'
  | 'ai'
  | 'system';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  conversation_id: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  sender_id: string | null;

  @Column({ type: 'text', default: 'text' })
  type: MessageType;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true })
  media_url: string | null;

  @Column({ type: 'text', nullable: true })
  media_mime_type: string | null;

  @Column({ type: 'bigint', nullable: true })
  media_size: number | null;

  @Column({ type: 'integer', nullable: true })
  media_duration: number | null;

  @Column({ type: 'text', nullable: true })
  media_thumbnail: string | null;

  @Column({ type: 'text', nullable: true })
  media_filename: string | null;

  @Column({ type: 'integer', nullable: true })
  media_width: number | null;

  @Column({ type: 'integer', nullable: true })
  media_height: number | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  location_lat: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  location_lng: number | null;

  @Column({ type: 'text', nullable: true })
  location_name: string | null;

  @Column({ type: 'uuid', nullable: true })
  reply_to_id: string | null;

  @Column({ type: 'boolean', default: false })
  is_forwarded: boolean;

  @Column({ type: 'integer', default: 0 })
  forward_count: number;

  @Column({ type: 'boolean', default: false })
  is_edited: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted_for_sender: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted_for_everyone: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  expires_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User | null;
}