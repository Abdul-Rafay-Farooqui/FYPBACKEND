import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArchivedConversation,
  BlockedUser,
  Conversation,
  ConversationParticipant,
  LockedConversation,
  Message,
  User,
} from '../../entities';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    RealtimeModule,
    TypeOrmModule.forFeature([
      Conversation,
      ConversationParticipant,
      Message,
      User,
      ArchivedConversation,
      LockedConversation,
      BlockedUser,
    ]),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}