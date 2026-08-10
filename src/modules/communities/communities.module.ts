import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Community,
  CommunityGroup,
  CommunityMember,
  Conversation,
  ConversationParticipant,
  User,
} from '../../entities';
import { RealtimeModule } from '../realtime/realtime.module';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Community,
      CommunityMember,
      CommunityGroup,
      Conversation,
      ConversationParticipant,
      User,
    ]),
    RealtimeModule,
  ],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}