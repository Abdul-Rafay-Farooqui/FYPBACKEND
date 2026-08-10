"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityGroup = exports.CommunityMember = exports.Community = exports.StatusHiddenFrom = exports.StatusView = exports.StatusUpdate = exports.Call = exports.UserDeletedMessage = exports.ReportedUser = exports.BlockedUser = exports.LockedConversation = exports.ArchivedConversation = exports.StarredMessage = exports.PinnedMessage = exports.MessageReaction = exports.MessageRead = void 0;
const typeorm_1 = require("typeorm");
let MessageRead = class MessageRead {
    id;
    message_id;
    user_id;
    read_at;
};
exports.MessageRead = MessageRead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MessageRead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MessageRead.prototype, "message_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MessageRead.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'read_at' }),
    __metadata("design:type", Date)
], MessageRead.prototype, "read_at", void 0);
exports.MessageRead = MessageRead = __decorate([
    (0, typeorm_1.Entity)('message_reads'),
    (0, typeorm_1.Unique)(['message_id', 'user_id'])
], MessageRead);
let MessageReaction = class MessageReaction {
    id;
    message_id;
    user_id;
    emoji;
    created_at;
};
exports.MessageReaction = MessageReaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MessageReaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MessageReaction.prototype, "message_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], MessageReaction.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MessageReaction.prototype, "emoji", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], MessageReaction.prototype, "created_at", void 0);
exports.MessageReaction = MessageReaction = __decorate([
    (0, typeorm_1.Entity)('message_reactions'),
    (0, typeorm_1.Unique)(['message_id', 'user_id'])
], MessageReaction);
let PinnedMessage = class PinnedMessage {
    id;
    conversation_id;
    message_id;
    pinned_by;
    pinned_at;
};
exports.PinnedMessage = PinnedMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PinnedMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', unique: true }),
    __metadata("design:type", String)
], PinnedMessage.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PinnedMessage.prototype, "message_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PinnedMessage.prototype, "pinned_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], PinnedMessage.prototype, "pinned_at", void 0);
exports.PinnedMessage = PinnedMessage = __decorate([
    (0, typeorm_1.Entity)('pinned_messages')
], PinnedMessage);
let StarredMessage = class StarredMessage {
    user_id;
    message_id;
    starred_at;
};
exports.StarredMessage = StarredMessage;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], StarredMessage.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], StarredMessage.prototype, "message_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], StarredMessage.prototype, "starred_at", void 0);
exports.StarredMessage = StarredMessage = __decorate([
    (0, typeorm_1.Entity)('starred_messages')
], StarredMessage);
let ArchivedConversation = class ArchivedConversation {
    user_id;
    conversation_id;
    archived_at;
};
exports.ArchivedConversation = ArchivedConversation;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], ArchivedConversation.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], ArchivedConversation.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ArchivedConversation.prototype, "archived_at", void 0);
exports.ArchivedConversation = ArchivedConversation = __decorate([
    (0, typeorm_1.Entity)('archived_conversations')
], ArchivedConversation);
let LockedConversation = class LockedConversation {
    id;
    user_id;
    conversation_id;
    pin_hash;
    locked_at;
};
exports.LockedConversation = LockedConversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LockedConversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], LockedConversation.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], LockedConversation.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], LockedConversation.prototype, "pin_hash", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], LockedConversation.prototype, "locked_at", void 0);
exports.LockedConversation = LockedConversation = __decorate([
    (0, typeorm_1.Entity)('locked_conversations'),
    (0, typeorm_1.Unique)(['user_id', 'conversation_id'])
], LockedConversation);
let BlockedUser = class BlockedUser {
    blocker_id;
    blocked_id;
    blocked_at;
};
exports.BlockedUser = BlockedUser;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], BlockedUser.prototype, "blocker_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], BlockedUser.prototype, "blocked_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], BlockedUser.prototype, "blocked_at", void 0);
exports.BlockedUser = BlockedUser = __decorate([
    (0, typeorm_1.Entity)('blocked_users')
], BlockedUser);
let ReportedUser = class ReportedUser {
    id;
    reporter_id;
    reported_id;
    message_id;
    reason;
    created_at;
};
exports.ReportedUser = ReportedUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReportedUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ReportedUser.prototype, "reporter_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ReportedUser.prototype, "reported_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ReportedUser.prototype, "message_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ReportedUser.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ReportedUser.prototype, "created_at", void 0);
exports.ReportedUser = ReportedUser = __decorate([
    (0, typeorm_1.Entity)('reported_users')
], ReportedUser);
let UserDeletedMessage = class UserDeletedMessage {
    user_id;
    message_id;
    deleted_at;
};
exports.UserDeletedMessage = UserDeletedMessage;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserDeletedMessage.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserDeletedMessage.prototype, "message_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], UserDeletedMessage.prototype, "deleted_at", void 0);
exports.UserDeletedMessage = UserDeletedMessage = __decorate([
    (0, typeorm_1.Entity)('user_deleted_messages')
], UserDeletedMessage);
let Call = class Call {
    id;
    caller_id;
    callee_id;
    conversation_id;
    type;
    status;
    channel_name;
    started_at;
    answered_at;
    ended_at;
    duration_seconds;
    created_at;
};
exports.Call = Call;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Call.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Call.prototype, "caller_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Call.prototype, "callee_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Call.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Call.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'ringing' }),
    __metadata("design:type", String)
], Call.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], Call.prototype, "channel_name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Call.prototype, "started_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Call.prototype, "answered_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Call.prototype, "ended_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Call.prototype, "duration_seconds", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Call.prototype, "created_at", void 0);
exports.Call = Call = __decorate([
    (0, typeorm_1.Entity)('calls')
], Call);
let StatusUpdate = class StatusUpdate {
    id;
    user_id;
    type;
    content;
    caption;
    bg_color;
    media_url;
    media_thumbnail;
    media_duration;
    created_at;
    expires_at;
};
exports.StatusUpdate = StatusUpdate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StatusUpdate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StatusUpdate.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], StatusUpdate.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StatusUpdate.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StatusUpdate.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StatusUpdate.prototype, "bg_color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StatusUpdate.prototype, "media_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StatusUpdate.prototype, "media_thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], StatusUpdate.prototype, "media_duration", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], StatusUpdate.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], StatusUpdate.prototype, "expires_at", void 0);
exports.StatusUpdate = StatusUpdate = __decorate([
    (0, typeorm_1.Entity)('status_updates')
], StatusUpdate);
let StatusView = class StatusView {
    id;
    status_id;
    viewer_id;
    viewed_at;
};
exports.StatusView = StatusView;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StatusView.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StatusView.prototype, "status_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StatusView.prototype, "viewer_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], StatusView.prototype, "viewed_at", void 0);
exports.StatusView = StatusView = __decorate([
    (0, typeorm_1.Entity)('status_views'),
    (0, typeorm_1.Unique)(['status_id', 'viewer_id'])
], StatusView);
let StatusHiddenFrom = class StatusHiddenFrom {
    id;
    status_id;
    user_id;
    created_at;
};
exports.StatusHiddenFrom = StatusHiddenFrom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StatusHiddenFrom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StatusHiddenFrom.prototype, "status_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], StatusHiddenFrom.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], StatusHiddenFrom.prototype, "created_at", void 0);
exports.StatusHiddenFrom = StatusHiddenFrom = __decorate([
    (0, typeorm_1.Entity)('status_hidden_from'),
    (0, typeorm_1.Unique)(['status_id', 'user_id'])
], StatusHiddenFrom);
let Community = class Community {
    id;
    name;
    description;
    avatar_url;
    created_by;
    created_at;
    updated_at;
};
exports.Community = Community;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Community.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Community.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Community.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Community.prototype, "avatar_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Community.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Community.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Community.prototype, "updated_at", void 0);
exports.Community = Community = __decorate([
    (0, typeorm_1.Entity)('communities')
], Community);
let CommunityMember = class CommunityMember {
    id;
    community_id;
    user_id;
    role;
    joined_at;
};
exports.CommunityMember = CommunityMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CommunityMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CommunityMember.prototype, "community_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CommunityMember.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'member' }),
    __metadata("design:type", String)
], CommunityMember.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CommunityMember.prototype, "joined_at", void 0);
exports.CommunityMember = CommunityMember = __decorate([
    (0, typeorm_1.Entity)('community_members'),
    (0, typeorm_1.Unique)(['community_id', 'user_id'])
], CommunityMember);
let CommunityGroup = class CommunityGroup {
    id;
    community_id;
    conversation_id;
    is_announcement;
    added_at;
};
exports.CommunityGroup = CommunityGroup;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CommunityGroup.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CommunityGroup.prototype, "community_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CommunityGroup.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CommunityGroup.prototype, "is_announcement", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], CommunityGroup.prototype, "added_at", void 0);
exports.CommunityGroup = CommunityGroup = __decorate([
    (0, typeorm_1.Entity)('community_groups'),
    (0, typeorm_1.Unique)(['community_id', 'conversation_id'])
], CommunityGroup);
//# sourceMappingURL=misc.entities.js.map