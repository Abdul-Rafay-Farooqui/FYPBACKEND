"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const contacts_module_1 = require("./modules/contacts/contacts.module");
const conversations_module_1 = require("./modules/conversations/conversations.module");
const messages_module_1 = require("./modules/messages/messages.module");
const media_module_1 = require("./modules/media/media.module");
const calls_module_1 = require("./modules/calls/calls.module");
const status_module_1 = require("./modules/status/status.module");
const blocks_module_1 = require("./modules/blocks/blocks.module");
const realtime_module_1 = require("./modules/realtime/realtime.module");
const ai_module_1 = require("./modules/ai/ai.module");
const groups_module_1 = require("./modules/groups/groups.module");
const communities_module_1 = require("./modules/communities/communities.module");
const organizations_module_1 = require("./modules/organizations/organizations.module");
const users_module_2 = require("./modules/cms/cms-users/users.module");
const classes_module_1 = require("./modules/cms/classes/classes.module");
const batches_module_1 = require("./modules/cms/batches/batches.module");
const sections_module_1 = require("./modules/cms/sections/sections.module");
const subjects_module_1 = require("./modules/cms/subjects/subjects.module");
const cbs_module_1 = require("./modules/cms/class-batch-sections/cbs.module");
const ta_module_1 = require("./modules/cms/teacher-assignments/ta.module");
const se_module_1 = require("./modules/cms/student-enrollments/se.module");
const results_module_1 = require("./modules/cms/results/results.module");
const homework_module_1 = require("./modules/cms/homework/homework.module");
const hs_module_1 = require("./modules/cms/homework-submissions/hs.module");
const announcements_module_1 = require("./modules/cms/announcements/announcements.module");
const attendance_module_1 = require("./modules/cms/attendance/attendance.module");
const schedules_module_1 = require("./modules/cms/schedules/schedules.module");
const institutes_module_1 = require("./modules/institutes/institutes.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const quizzes_module_1 = require("./modules/quizzes/quizzes.module");
const resources_module_1 = require("./modules/resources/resources.module");
const discussions_module_1 = require("./modules/discussions/discussions.module");
const live_classes_module_1 = require("./modules/live-classes/live-classes.module");
const subject_assignments_module_1 = require("./modules/subject-assignments/subject-assignments.module");
const course_enrollments_module_1 = require("./modules/course-enrollments/course-enrollments.module");
const teacher_module_1 = require("./modules/teacher/teacher.module");
const institute_notifications_module_1 = require("./modules/institute-notifications/institute-notifications.module");
const getRequiredEnv = (config, key) => {
    const value = config.get(key);
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [".env"],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: "postgres",
                    host: getRequiredEnv(config, "DB_HOST"),
                    port: Number(config.get("DB_PORT") ?? 5432),
                    username: getRequiredEnv(config, "DB_USERNAME"),
                    password: getRequiredEnv(config, "DB_PASSWORD"),
                    database: getRequiredEnv(config, "DB_NAME"),
                    ssl: config.get("DB_SSL") === "true" ? { rejectUnauthorized: false } : false,
                    schema: "public",
                    entities: [
                        entities_1.User,
                        entities_1.Contact,
                        entities_1.Conversation,
                        entities_1.ConversationParticipant,
                        entities_1.Message,
                        entities_1.MessageRead,
                        entities_1.MessageReaction,
                        entities_1.PinnedMessage,
                        entities_1.StarredMessage,
                        entities_1.ArchivedConversation,
                        entities_1.LockedConversation,
                        entities_1.BlockedUser,
                        entities_1.ReportedUser,
                        entities_1.UserDeletedMessage,
                        entities_1.Call,
                        entities_1.StatusUpdate,
                        entities_1.StatusView,
                        entities_1.StatusHiddenFrom,
                        entities_1.Community,
                        entities_1.CommunityMember,
                        entities_1.CommunityGroup,
                        entities_1.Organization,
                        entities_1.OrganizationMember,
                        entities_1.OrganizationTeam,
                        entities_1.TeamMember,
                        entities_1.TeamConversation,
                        entities_1.OrgMeeting,
                        entities_1.OrgMeetingAttendee,
                        entities_1.OrgTask,
                        entities_1.OrgAttendanceLog,
                        entities_1.OrgShift,
                        entities_1.OrgApproval,
                        entities_1.OrgPraise,
                        entities_1.OrgNotification,
                        entities_1.OrgActivityLog,
                        entities_1.OrgCallLog,
                        entities_1.OrgCallLogParticipant,
                        entities_1.OrgCalendarEvent,
                        entities_1.OrgCalendarEventAttendee,
                        entities_1.ClassEntity,
                        entities_1.Batch,
                        entities_1.Section,
                        entities_1.Subject,
                        entities_1.ClassBatchSection,
                        entities_1.TeacherAssignment,
                        entities_1.StudentEnrollment,
                        entities_1.Result,
                        entities_1.Homework,
                        entities_1.HomeworkSubmission,
                        entities_1.Announcement,
                        entities_1.Attendance,
                        entities_1.Schedule,
                        entities_1.School,
                        entities_1.Institute,
                        entities_1.InstituteMember,
                        entities_1.InstituteNotification,
                        entities_1.Quiz,
                        entities_1.QuizQuestion,
                        entities_1.QuizAttempt,
                        entities_1.QuizAnswer,
                        entities_1.Resource,
                        entities_1.Discussion,
                        entities_1.LiveClass,
                        entities_1.LiveClassParticipant,
                        entities_1.SubjectAssignment,
                        entities_1.CourseEnrollment,
                    ],
                    synchronize: false,
                    logging: false,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            contacts_module_1.ContactsModule,
            conversations_module_1.ConversationsModule,
            groups_module_1.GroupsModule,
            communities_module_1.CommunitiesModule,
            organizations_module_1.OrganizationsModule,
            institutes_module_1.InstitutesModule,
            users_module_2.CmsUsersModule,
            classes_module_1.ClassesModule,
            batches_module_1.BatchesModule,
            sections_module_1.SectionsModule,
            subjects_module_1.SubjectsModule,
            cbs_module_1.CbsModule,
            ta_module_1.TaModule,
            se_module_1.SeModule,
            results_module_1.ResultsModule,
            homework_module_1.HomeworkModule,
            hs_module_1.HsModule,
            announcements_module_1.AnnouncementsModule,
            attendance_module_1.AttendanceModule,
            schedules_module_1.SchedulesModule,
            dashboard_module_1.DashboardModule,
            quizzes_module_1.QuizzesModule,
            resources_module_1.ResourcesModule,
            discussions_module_1.DiscussionsModule,
            live_classes_module_1.LiveClassesModule,
            subject_assignments_module_1.SubjectAssignmentsModule,
            course_enrollments_module_1.CourseEnrollmentsModule,
            teacher_module_1.TeacherModule,
            institute_notifications_module_1.InstituteNotificationsModule,
            messages_module_1.MessagesModule,
            media_module_1.MediaModule,
            calls_module_1.CallsModule,
            status_module_1.StatusModule,
            blocks_module_1.BlocksModule,
            realtime_module_1.RealtimeModule,
            ai_module_1.AiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map