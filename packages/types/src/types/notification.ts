import {
  SCCommentType,
  SCEventType,
  SCFeedDiscussionType,
  SCFeedPostType,
  SCFeedStatusType,
  SCGroupType,
  SCLiveStreamType,
  SCUserType
} from '../index';
import {SCPrivateMessageThreadType} from './privateMessage';
import {SCUserBlockedSettingsType} from './user';
import {SCCustomNotificationType} from './customNotification';
import {SCIncubatorType} from './incubator';

/**
 * Notification types
 */
export enum SCNotificationTypologyType {
  COMMENT = 'comment',
  NESTED_COMMENT = 'nested_comment',
  CONNECTION_REQUEST = 'connection_request',
  CONNECTION_ACCEPT = 'connection_accept',
  CONNECTION_REMOVE = 'connection_remove',
  CONNECTION_REJECT = 'connection_reject',
  CONNECTION_CANCEL_REJECT = 'connection_cancel_reject',
  CONNECTION_CANCEL_REQUEST = 'connection_cancel_request',
  MENTION = 'mention',
  VOTE_UP = 'vote_up',
  FOLLOW = 'follow',
  PRIVATE_MESSAGE = 'private_message',
  DELETE_PRIVATE_MESSAGE = 'delete_private_message',
  DELETED_FOR_ADVERTISING = 'deleted_for_advertising',
  DELETED_FOR_AGGRESSIVE = 'deleted_for_aggressive',
  DELETED_FOR_VULGAR = 'deleted_for_vulgar',
  DELETED_FOR_POOR = 'deleted_for_poor',
  DELETED_FOR_OFFTOPIC = 'deleted_for_offtopic',
  UNDELETED_FOR = 'undeleted_for',
  COLLAPSED_FOR_ADVERTISING = 'collapsed_for_advertising',
  COLLAPSED_FOR_AGGRESSIVE = 'collapsed_for_aggressive',
  COLLAPSED_FOR_VULGAR = 'collapsed_for_vulgar',
  COLLAPSED_FOR_POOR = 'collapsed_for_poor',
  COLLAPSED_FOR_OFFTOPIC = 'collapsed_for_offtopic',
  USER_FOLLOW = 'user_follow',
  USER_UNFOLLOW = 'user_unfollow',
  KINDLY_NOTICE_ADVERTISING = 'kindly_notice_advertising',
  KINDLY_NOTICE_AGGRESSIVE = 'kindly_notice_aggressive',
  KINDLY_NOTICE_VULGAR = 'kindly_notice_vulgar',
  KINDLY_NOTICE_POOR = 'kindly_notice_poor',
  KINDLY_NOTICE_OFFTOPIC = 'kindly_notice_offtopic',
  KINDLY_NOTICE_FLAG = 'kindly_notice_flag',
  BLOCKED_USER = 'blocked_user',
  UNBLOCKED_USER = 'unblocked_user',
  INCUBATOR_APPROVED = 'incubator_approved',
  CUSTOM_NOTIFICATION = 'custom_notification',
  NOTIFICATION_BANNER = 'notification_banner',
  CONTRIBUTION = 'contribution',
  USER_INVITED_TO_JOIN_GROUP = 'user_invited_to_join_group',
  USER_REQUESTED_TO_JOIN_GROUP = 'user_requested_to_join_group',
  USER_ACCEPTED_TO_JOIN_GROUP = 'user_accepted_to_join_group',
  USER_ADDED_TO_GROUP = 'user_added_to_group',
  USER_INVITED_TO_JOIN_EVENT = 'user_invited_to_join_event',
  USER_REQUESTED_TO_JOIN_EVENT = 'user_requested_to_join_event',
  USER_ACCEPTED_TO_JOIN_EVENT = 'user_accepted_to_join_event',
  USER_ADDED_TO_EVENT = 'user_added_to_event',
  LIVE_STREAM_STARTED = 'live_stream_started'
}

/**
 * Define topic for notifications
 * Usefull for websocket
 */
export enum SCNotificationTopicType {
  INTERACTION = 'interaction',
  NEWS = 'news'
}

/**
 * Interface SCNotificationAggregatedType.
 * Notification aggregated Schema.
 */
export interface SCNotificationAggregatedType {
  /**
   * Serialization id of the macro notification aggregate block
   */
  sid: string;

  /**
   * It's true if in the aggregated group there is at least one
   * notification not yet seen by the user making the request
   */
  is_new: boolean;

  /**
   * Primary object involved (object that is common to notifications group)
   * if it is a discusssion. For some types of notifications it will not be present.
   */
  discussion?: SCFeedDiscussionType;

  /**
   * Primary object involved (object that is common to notifications group)
   * if it is a post. For some types of notifications it will not be present.
   */
  post?: SCFeedPostType;

  /**
   * Primary object involved (object that is common to notifications group)
   * if it is a status. For some types of notifications it will not be present.
   */
  status?: SCFeedStatusType;

  /**
   * Primary object involved (object that is common to notifications group)
   * if it is a group. For some types of notifications it will not be present.
   */
  group?: SCGroupType;

  /**
   * Primary object involved (object that is common to notifications group)
   * if it is an event. For some types of notifications it will not be present.
   */
  event?: SCEventType;

  /**
   * List of aggregated notifications by type.
   * Types Object: NotificationTypeComment, NotificationTypeMention,
   * NotificationTypeConnectionAccept, NotificationTypeConnectionRequest,
   * NotificationTypePrivateMessage, NotificationTypeFollow, NotificationTypeVoteUp,
   * NotificationTypeBlockedUser, NotificationTypeUnBlockedUser,
   * NotificationTypeKindlyNotice, NotificationTypeCollapsedFor,
   * NotificationTypeDeletedFor, NotificationTypeCustomNotification
   */
  aggregated: SCNotificationType[];
}

/**
 * Interface SCNotificationType.
 * Notification Schema.
 */
export interface SCNotificationType {
  /**
   * True if the notification has been read, otherwise false
   */
  is_new: boolean;

  /**
   * Serialization id of the single notification
   */
  sid: string;

  /**
   * Type of the notification
   */
  type: SCNotificationTypologyType;

  /**
   * Time when the notification was generated
   */
  active_at: Date;
}

/**
 * Interface SCNotificationCommentType.
 * Comment Notification Schema.
 */
export interface SCNotificationCommentType extends SCNotificationType {
  /**
   * Comment of first/second level
   */
  comment: SCCommentType;

  /**
   * Type Comment or Nested_comment
   */
  type: SCNotificationTypologyType.COMMENT | SCNotificationTypologyType.NESTED_COMMENT;
}

/**
 * Interface SCNotificationMentionType.
 * Mention Notification Schema.
 */
export interface SCNotificationMentionType extends SCNotificationType {
  /**
   * Type Mention
   */
  type: SCNotificationTypologyType.MENTION;

  /**
   * If user is mentioned in a discussion
   */
  discussion?: SCFeedDiscussionType;

  /**
   * If the user is mentioned in a post
   */
  post?: SCFeedPostType;

  /**
   * If user is mentioned in a status
   */
  status?: SCFeedStatusType;

  /**
   * If user is mentioned in a comment
   */
  comment?: SCCommentType;
}

/**
 * Interface SCNotificationConnectionRequestType.
 * Connection Request Notification Schema.
 */
export interface SCNotificationConnectionRequestType extends SCNotificationType {
  /**
   * Type Connection request
   */
  type: SCNotificationTypologyType.CONNECTION_REQUEST;

  /**
   * User request the connection
   */
  request_user: SCUserType;
}

/**
 * Interface SCNotificationConnectionAcceptType.
 * Connection Accept Notification Schema.
 */
export interface SCNotificationConnectionAcceptType extends SCNotificationType {
  /**
   * Type Connection accept
   */
  type: SCNotificationTypologyType.CONNECTION_ACCEPT;

  /**
   * User accepted the connection request
   */
  accept_user: SCUserType;
}

/**
 * Interface SCNotificationPrivateMessageType.
 * Private Message Notification Schema.
 */
export interface SCNotificationPrivateMessageType extends SCNotificationType {
  /**
   * Type Private message
   */
  type: SCNotificationTypologyType.PRIVATE_MESSAGE;

  /**
   * Private message
   */
  message: SCPrivateMessageThreadType;
}

/**
 * Interface SCNotificationFollowType.
 * Follow Notification Schema.
 * (discussion, post, status)
 */
export interface SCNotificationFollowType extends SCNotificationType {
  /**
   * Type Follow
   */
  type: SCNotificationTypologyType.FOLLOW;

  /**
   * If user is mentioned in a discussion
   */
  discussion?: SCFeedDiscussionType;

  /**
   * If the user is mentioned in a post
   */
  post?: SCFeedPostType;

  /**
   * If user is mentioned in a status
   */
  status?: SCFeedStatusType;
}

/**
 * Interface SCNotificationVoteUpType.
 * VoteUp Notification Schema.
 */
export interface SCNotificationVoteUpType extends SCNotificationType {
  /**
   * Type VoteUp
   */
  type: SCNotificationTypologyType.VOTE_UP;

  /**
   * If user is mentioned in a discussion
   */
  discussion?: SCFeedDiscussionType;

  /**
   * If the user is mentioned in a post
   */
  post?: SCFeedPostType;

  /**
   * If user is mentioned in a status
   */
  status?: SCFeedStatusType;

  /**
   * If user is mentioned in a comment
   */
  comment?: SCCommentType;

  /**
   * User voted up
   */
  user?: SCUserType;
}

/**
 * Interface SCNotificationBlockedUserType.
 * Blocked User Notification Schema.
 */
export interface SCNotificationBlockedUserType extends SCNotificationType {
  /**
   * Type Blocked User
   */
  type: SCNotificationTypologyType.BLOCKED_USER;

  /**
   * Data of user block
   */
  blocked_settings: SCUserBlockedSettingsType;
}

/**
 * Interface SCNotificationUnBlockedUserType.
 * UnBlocked User Notification Schema.
 */
export interface SCNotificationUnBlockedUserType extends SCNotificationType {
  /**
   * Type UnBlocked User
   */
  type: SCNotificationTypologyType.UNBLOCKED_USER;
}

/**
 * Interface SCNotificationKindlyNoticeType.
 * Kindly notice User Notification Schema.
 */
export interface SCNotificationKindlyNoticeType extends SCNotificationType {
  /**
   * Type Kindly Notice User
   */
  type:
    | SCNotificationTypologyType.KINDLY_NOTICE_ADVERTISING
    | SCNotificationTypologyType.KINDLY_NOTICE_FLAG
    | SCNotificationTypologyType.KINDLY_NOTICE_VULGAR
    | SCNotificationTypologyType.KINDLY_NOTICE_AGGRESSIVE
    | SCNotificationTypologyType.KINDLY_NOTICE_POOR
    | SCNotificationTypologyType.KINDLY_NOTICE_OFFTOPIC;

  /**
   * If the contribute is a discussion
   */
  discussion?: SCFeedDiscussionType;

  /**
   * If the contribute is a post
   */
  post?: SCFeedPostType;

  /**
   * If the contribute is a status
   */
  status?: SCFeedStatusType;

  /**
   * If the contribute is a comment
   */
  comment?: SCCommentType;
}

/**
 * Interface SCNotificationCollapsedForType.
 * Collapsed for Notification Schema.
 * Only for comments.
 */
export interface SCNotificationCollapsedForType extends SCNotificationType {
  /**
   * Type Kindly Notice User
   */
  type:
    | SCNotificationTypologyType.COLLAPSED_FOR_ADVERTISING
    | SCNotificationTypologyType.COLLAPSED_FOR_AGGRESSIVE
    | SCNotificationTypologyType.COLLAPSED_FOR_POOR
    | SCNotificationTypologyType.COLLAPSED_FOR_OFFTOPIC
    | SCNotificationTypologyType.COLLAPSED_FOR_VULGAR;

  /**
   * comment collapsed
   */
  comment: SCCommentType;
}

/**
 * Interface SCNotificationDeletedForType.
 * Deleted for Notification Schema.
 */
export interface SCNotificationDeletedForType extends SCNotificationType {
  /**
   * Type Deleted for
   */
  type:
    | SCNotificationTypologyType.DELETED_FOR_ADVERTISING
    | SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE
    | SCNotificationTypologyType.DELETED_FOR_VULGAR
    | SCNotificationTypologyType.DELETED_FOR_POOR
    | SCNotificationTypologyType.DELETED_FOR_OFFTOPIC;

  /**
   * If a discussion is deleted
   */
  discussion?: SCFeedDiscussionType;

  /**
   * If a post is deleted
   */
  post?: SCFeedPostType;

  /**
   * If a comment is deleted
   */
  status?: SCFeedStatusType;

  /**
   * If a status is deleted
   */
  comment?: SCCommentType;
}

/**
 * Interface SCNotificationUnDeletedForType.
 * Undeleted for Notification Schema.
 */
export interface SCNotificationUnDeletedForType extends SCNotificationType {
  /**
   * Type Undeleted for
   */
  type: SCNotificationTypologyType.UNDELETED_FOR;

  /**
   * If a discussion is undeleted
   */
  discussion?: SCFeedDiscussionType;

  /**
   * If a post is undeleted
   */
  post?: SCFeedPostType;

  /**
   * If a comment is undeleted
   */
  status?: SCFeedStatusType;

  /**
   * If a status is undeleted
   */
  comment?: SCCommentType;
}

/**
 * Interface SCNotificationUserFollowType.
 * User Follow Notification Schema.
 */
export interface SCNotificationUserFollowType extends SCNotificationType {
  /**
   * Type User Follow
   */
  type: SCNotificationTypologyType.USER_FOLLOW;

  /**
   * Follower
   */
  follower: SCUserType;
}

/**
 * Interface SCNotificationIncubatorType.
 * The incubator proposed by the user has been approved
 */
export interface SCNotificationIncubatorType extends SCNotificationType {
  /**
   * Type Incubator Approved
   */
  type: SCNotificationTypologyType.INCUBATOR_APPROVED;

  /**
   * Incubator
   */
  incubator: SCIncubatorType;
}

/**
 * Interface SCNotificationCustomNotificationType.
 * CustomNotification Notification Schema.
 */
export interface SCNotificationCustomNotificationType extends SCNotificationType {
  /**
   * Type User Follow
   */
  type: SCNotificationTypologyType.CUSTOM_NOTIFICATION;

  /**
   * User generate the custom notification
   */
  user: SCUserType;

  /**
   * Custom notification data
   */
  custom_notification: SCCustomNotificationType;
}

/**
 * Interface SCNotificationUnseenCountType
 */
export interface SCNotificationUnseenCountType {
  count: number;
}

/**
 * Interface SCNotificationContributionType.
 * Contribution Notification Schema.
 */
export interface SCNotificationContributionType extends SCNotificationType {
  /**
   * If the contribution type is discussion
   */
  discussion?: SCFeedDiscussionType;

  /**
   * If the contribution type is post
   */
  post?: SCFeedPostType;

  /**
   * If the contribution type is status
   */
  status?: SCFeedStatusType;
}

/**
 * Interface SCNotificationGroupActivityType.
 */
export interface SCNotificationGroupActivityType extends SCNotificationType {
  /**
   * The user who performed the action
   */
  user: SCUserType;
  /**
   * The Group obj
   */
  group: Partial<SCGroupType>;
}

/**
 * Interface SCNotificationGroupActivityType.
 */
export interface SCNotificationEventActivityType extends SCNotificationType {
  /**
   * The user who performed the action
   */
  user: SCUserType;
  /**
   * The event obj
   */
  event: Partial<SCEventType>;
}

/**
 * Interface SCNotificationGroupActivityType.
 */
export interface SCNotificationLiveStreamActivityType extends SCNotificationType {
  /**
   * The LiveStream obj
   */
  live_stream: Partial<SCLiveStreamType>;
}
