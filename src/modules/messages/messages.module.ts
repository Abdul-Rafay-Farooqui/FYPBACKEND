import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BlockedUser,
  Conversation,
  ConversationParticipant,
  Message,
  MessageReaction,
  MessageRead,
  PinnedMessage,
  StarredMessage,
  UserDeletedMessage,
} from '../../entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { BlocksModule } from '../blocks/blocks.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      MessageRead,
      MessageReaction,
      PinnedMessage,
      StarredMessage,
      UserDeletedMessage,
      ConversationParticipant,
      Conversation,
      BlockedUser,
    ]),
    forwardRef(() => RealtimeModule),
    BlocksModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}