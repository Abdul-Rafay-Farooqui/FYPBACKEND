import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Conversation,
  ConversationParticipant,
  Message,
  MessageReaction,
  OrgActivityLog,
  OrgApproval,
  OrgAttendanceLog,
  OrgCallLog,
  OrgCallLogParticipant,
  OrgCalendarEvent,
  OrgCalendarEventAttendee,
  OrgMeeting,
  OrgMeetingAttendee,
  OrgNotification,
  OrgPraise,
  OrgShift,
  OrgTask,
  Organization,
  OrganizationMember,
  OrganizationTeam,
  TeamConversation,
  TeamMember,
  User,
} from "../../entities";
import { RealtimeModule } from "../realtime/realtime.module";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationMember,
      OrganizationTeam,
      TeamMember,
      TeamConversation,
      Conversation,
      ConversationParticipant,
      Message,
      MessageReaction,
      OrgTask,
      OrgMeeting,
      OrgMeetingAttendee,
      OrgAttendanceLog,
      OrgApproval,
      OrgPraise,
      OrgNotification,
      OrgShift,
      OrgActivityLog,
      OrgCallLog,
      OrgCallLogParticipant,
      OrgCalendarEvent,
      OrgCalendarEventAttendee,
      User,
    ]),
    RealtimeModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
