import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ArchivedConversation,
  BlockedUser,
  Call,
  Community,
  CommunityGroup,
  CommunityMember,
  Contact,
  Conversation,
  ConversationParticipant,
  LockedConversation,
  Message,
  MessageReaction,
  MessageRead,
  OrgActivityLog,
  OrgApproval,
  OrgAttendanceLog,
  OrgCalendarEvent,
  OrgCalendarEventAttendee,
  OrgCallLog,
  OrgCallLogParticipant,
  OrgMeeting,
  OrgMeetingAttendee,
  OrgNotification,
  OrgPraise,
  OrgShift,
  OrgTask,
  Organization,
  OrganizationMember,
  OrganizationTeam,
  PinnedMessage,
  ReportedUser,
  StarredMessage,
  StatusHiddenFrom,
  StatusUpdate,
  StatusView,
  TeamConversation,
  TeamMember,
  User,
  UserDeletedMessage,
  ClassEntity,
  Batch,
  Section,
  Subject,
  ClassBatchSection,
  TeacherAssignment,
  StudentEnrollment,
  Result,
  Homework,
  HomeworkSubmission,
  Announcement,
  Attendance,
  Schedule,
  School,
  Institute,
  InstituteMember,
  InstituteNotification,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  QuizAnswer,
  Resource,
  Discussion,
  LiveClass,
  LiveClassParticipant,
  SubjectAssignment,
  CourseEnrollment,
} from "./entities";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { ConversationsModule } from "./modules/conversations/conversations.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { MediaModule } from "./modules/media/media.module";
import { CallsModule } from "./modules/calls/calls.module";
import { StatusModule } from "./modules/status/status.module";
import { BlocksModule } from "./modules/blocks/blocks.module";
import { RealtimeModule } from "./modules/realtime/realtime.module";
import { AiModule } from "./modules/ai/ai.module";
import { GroupsModule } from "./modules/groups/groups.module";
import { CommunitiesModule } from "./modules/communities/communities.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { CmsUsersModule } from "./modules/cms/cms-users/users.module";
import { ClassesModule } from "./modules/cms/classes/classes.module";
import { BatchesModule } from "./modules/cms/batches/batches.module";
import { SectionsModule } from "./modules/cms/sections/sections.module";
import { SubjectsModule } from "./modules/cms/subjects/subjects.module";
import { CbsModule } from "./modules/cms/class-batch-sections/cbs.module";
import { TaModule } from "./modules/cms/teacher-assignments/ta.module";
import { SeModule } from "./modules/cms/student-enrollments/se.module";
import { ResultsModule } from "./modules/cms/results/results.module";
import { HomeworkModule } from "./modules/cms/homework/homework.module";
import { HsModule } from "./modules/cms/homework-submissions/hs.module";
import { AnnouncementsModule } from "./modules/cms/announcements/announcements.module";
import { AttendanceModule } from "./modules/cms/attendance/attendance.module";
import { SchedulesModule } from "./modules/cms/schedules/schedules.module";
import { InstitutesModule } from "./modules/institutes/institutes.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { QuizzesModule } from "./modules/quizzes/quizzes.module";
import { ResourcesModule } from "./modules/resources/resources.module";
import { DiscussionsModule } from "./modules/discussions/discussions.module";
import { LiveClassesModule } from "./modules/live-classes/live-classes.module";
import { SubjectAssignmentsModule } from "./modules/subject-assignments/subject-assignments.module";
import { CourseEnrollmentsModule } from "./modules/course-enrollments/course-enrollments.module";
import { TeacherModule } from "./modules/teacher/teacher.module";
import { InstituteNotificationsModule } from "./modules/institute-notifications/institute-notifications.module";

const getRequiredEnv = (config: ConfigService, key: string): string => {
  const value = config.get<string>(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: getRequiredEnv(config, "DB_HOST"),
        port: Number(config.get<string>("DB_PORT") ?? 5432),
        username: getRequiredEnv(config, "DB_USERNAME"),
        password: getRequiredEnv(config, "DB_PASSWORD"),
        database: getRequiredEnv(config, "DB_NAME"),
        entities: [
          User,
          Contact,
          Conversation,
          ConversationParticipant,
          Message,
          MessageRead,
          MessageReaction,
          PinnedMessage,
          StarredMessage,
          ArchivedConversation,
          LockedConversation,
          BlockedUser,
          ReportedUser,
          UserDeletedMessage,
          Call,
          StatusUpdate,
          StatusView,
          StatusHiddenFrom,
          Community,
          CommunityMember,
          CommunityGroup,
          Organization,
          OrganizationMember,
          OrganizationTeam,
          TeamMember,
          TeamConversation,
          OrgMeeting,
          OrgMeetingAttendee,
          OrgTask,
          OrgAttendanceLog,
          OrgShift,
          OrgApproval,
          OrgPraise,
          OrgNotification,
          OrgActivityLog,
          OrgCallLog,
          OrgCallLogParticipant,
          OrgCalendarEvent,
          OrgCalendarEventAttendee,

          ClassEntity,
          Batch,
          Section,
          Subject,
          ClassBatchSection,
          TeacherAssignment,
          StudentEnrollment,
          Result,
          Homework,
          HomeworkSubmission,
          Announcement,
          Attendance,
          Schedule,
          School,
          Institute,
          InstituteMember,
          InstituteNotification,
          Quiz,
          QuizQuestion,
          QuizAttempt,
          QuizAnswer,
          Resource,
          Discussion,
          LiveClass,
          LiveClassParticipant,
          SubjectAssignment,
          CourseEnrollment,
        ],
        // Schema is managed by final.schema.sql + schema.additions.sql
        synchronize: false,
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    ContactsModule,
    ConversationsModule,
    GroupsModule,
    CommunitiesModule,
    OrganizationsModule,
    InstitutesModule,

    CmsUsersModule,
    ClassesModule,
    BatchesModule,
    SectionsModule,
    SubjectsModule,
    CbsModule,
    TaModule,
    SeModule,
    ResultsModule,
    HomeworkModule,
    HsModule,
    AnnouncementsModule,
    AttendanceModule,
    SchedulesModule,
    DashboardModule,
    QuizzesModule,
    ResourcesModule,
    DiscussionsModule,
    LiveClassesModule,
    SubjectAssignmentsModule,
    CourseEnrollmentsModule,
    TeacherModule,
    InstituteNotificationsModule,
    MessagesModule,
    MediaModule,
    CallsModule,
    StatusModule,
    BlocksModule,
    RealtimeModule,
    AiModule,
  ],
})
export class AppModule {}
