/**
 * Interface SCUserType.
 * User Schema.
 */
import {SCTagType} from './tag';
import {SCLanguageType} from './locale';

/**
 * User status
 */
export enum SCUserStatus {
  APPROVED = 'a',
  BLOCKED = 'b',
  DELETED = 'd',
  UNREGISTERED = 'u'
}

export interface SCUserType {
  /**
   * The ID of the user.
   */
  id: number;

  /**
   * The username of the user.
   */
  username: string;

  /**
   * Real name of the user.
   */
  real_name: string;

  /**
   * Email of the user.
   */
  email?: string;

  /**
   * Email is valid. Default: False.
   */
  email_isvalid?: boolean;

  /**
   * The user is approved and can access the community
   */
  reg_approved?: boolean;

  /**
   * Date joined to the community.
   */
  date_joined: Date;

  /**
   * User biography.
   */
  bio: string;

  /**
   * Location
   */
  location: string;

  /**
   * Location in coordinates. Format: lat,lng.
   */
  location_lat_lng?: string;

  /**
   * User current position. Format: lat,lng.
   */
  position_lat_lng?: string;

  /**
   * Date of birth. Format: YYYY-MM-DD (ISO 8601).
   */
  date_of_birth?: Date;

  /**
   * User description.
   */
  description: string;

  /**
   * Gender of the user. Values: Male, Female, Unspecified. Default: Unspecified.
   */
  gender: string;

  /**
   * User language
   */
  language?: SCLanguageType;

  /**
   * User status. Values: a (approved), b (blocked), d (deleted; soft deleted), u (unregistered). Default: a.
   * A blocked user can't:
   *    - create contribution (post/discussion/status)
   *    - create comment
   *    - vote/unvote contribution
   *    - follow/connect user
   *    - edit contribution
   *    - suggest an incubator
   *    - flag a contribution
   *    - send a private message
   *    - edit info profile
   * but he can't:
   *    - follow/unfollow a post/discussion/status
   *    - follow/unfollow a category
   *    - unfollow user
   */
  status?: string;

  /**
   * User website.
   */
  website: string;

  /**
   * Avatar of the user.
   */
  avatar: string;

  /**
   * Image Cover of the user.
   */
  cover?: string;

  /**
   * The external ID of the user. It is assigned only during signup if necessary.
   */
  ext_id?: number;

  /**
   * User's tag list. List of Tag.
   */
  tags: Array<SCTagType>;

  /**
   * User reputation.
   */
  reputation: number;

  /**
   * If the user has the community badge active.
   */
  community_badge?: boolean;

  /**
   * List of user permission. Only for the resource /user/me/.
   */
  permission?: Record<string, any>;

  /**
   * The connection status between the request user and this user.
   */
  connection_status?: string;

  /**
   * Number of connection requests sent by the user.
   */
  connection_requests_sent_counter?: number;

  /**
   * Number of connection requests received by the user.
   */
  connection_requests_received_counter?: number;

  /**
   * Number of connections of the user.
   */
  connections_counter?: number;

  /**
   * Number of followings of the user
   */
  followings_counter?: number;

  /**
   * Number of followers of the user
   */
  followers_counter?: number;

  /**
   * Number of posts created by the user.
   */
  posts_counter?: number;

  /**
   * Number of discussions created by the user.
   */
  discussions_counter?: number;

  /**
   * Number of statuses created by the user.
   */
  statuses_counter?: number;

  /**
   * Number of polls created by the user.
   */
  polls_counter?: number;

  /**
   * Number of categories followed by the user.
   */
  categories_counter?: number;

  /**
   *  User role
   */
  role?: string;

  /**
   * interactions counter
   */
  unseen_interactions_counter?: number;

  /**
   * notification banner counter
   */
  unseen_notification_banners_counter?: number;

  /**
   * If the user account has been deleted
   */
  deleted?: boolean;

  /**
   * Datetime of the account deletion
   */
  deleted_at?: Date;

  /**
   * If the logged user is able to send a private message to the requested user (visible only in the get a specific user api response).
   */
  can_send_pm_to?: boolean;

  /**
   * Custom user metadata fields
   */
  [p: string]: any;
}

/**
 * User Settings
 */
export interface SCUserSettingsType {
  /**
   * Frequency of the email notifications for all interactions (except for private messages notifications)
   */
  qa_frequency: number;

  /**
   * Enable private messages notifications also via mail
   */
  email_notification_not_qa: number;

  /**
   * Enable mobile app/PWA notifications
   */
  mobile_notifications_scmty: number;

  /**
   * Shows a popup when the user receive a notification
   */
  show_toast_notifications: number;

  /**
   * Emit a sound when the notification popup is shown. See 'show_toast_notifications'
   */
  toast_notifications_emit_sound: number;
}

/**
 * User Blocked Settings
 */
export interface SCUserBlockedSettingsType {
  /**
   * N° days of block
   */
  days_blocked: number;

  /**
   * Reputation stolen
   */
  reputation_delta: number;

  /**
   * Start User Block datetime
   */
  blocked_at?: Date;

  /**
   * End User Block datetime
   */
  expire_at?: Date;
}

/**
 * SCUserModerationType interface
 */
export interface SCUserModerationType extends SCUserType {
  /**
   * Block start date
   */
  blocked_at: Date | string;
  /**
   * Number of days of block duration (if none and block date set, it means forever)
   */
  days_blocked?: number;
  /**
   * 	Date on which the auto unblock will take place
   */
  expire_at: Date | string;
  /**
   * 	Date on which the user has been seen in the community
   */
  last_seen?: Date | string;
  /**
   *Number of flags given by the user
   */
  flags_given?: number;
  /**
   * Number of flags received by the user (in its contents)
   */
  flags_received?: number;
  /**
   * 	Full description of the last score variation made by a moderator.
   */
  last_score_variation?: SCUserScoreVariation[];
}
/**
 * SCUserScoreType interface
 */
export interface SCUserScoreType {
  /**
   * The id
   */
  id: number;
  /**
   * The user obj
   */
  user: SCUserType;
  /**
   * Positive or negative integer value
   */
  score: string;
  /**
   * Reputation types
   */
  reputation_type: SCUserReputationType;
  /**
   * Reputation types description
   */
  reputation_type_description: string;
  /**
   * comment
   */
  comment: string;
}

export enum SCUserReputationType {
  GAIN_BY_UPVOTED = 1,
  ASSIGNED_BY_MODERATOR = 10,
  GAIN_BY_CANCELLING_CONTRIBUTE_MODERATION = 11,
  GAIN_BY_MAKE_POST = 12,
  GAIN_BY_MAKE_FIRST_LEVEL_COMMENT = 13,
  GAIN_BY_MAKE_SECOND_LEVEL_COMMENT = 14,
  GAIN_BY_CONNECTION = 15,
  GAIN_BY_APP_USED = 17,
  GAIN_BY_DAILY_VISIT = 18,
  GAIN_BY_FOLLOWER = 19,
  GAIN_BY_UNBLOCK_ACCOUNT = 20,
  LOSE_BY_UPVOTE_CANCELED = -1,
  LOSE_BY_CONTRIBUTE_MODERATION = -11,
  LOSE_BY_DELETE_POST = -12,
  LOSE_BY_DELETE_FIRST_LEVEL_COMMENT = -13,
  LOSE_BY_DELETE_SECOND_LEVEL_COMMENT = -14,
  LOSE_BY_CONNECTION = -15,
  LOSE_BY_FOLLOWER = -19,
  LOSE_BY_BLOCK_ACCOUNT = -20
}

/**
 * SCUserScoreVariation interface
 */
export interface SCUserScoreVariation {
  /**
   * comment
   */
  comment: string;
  /**
   * Reputed date-time
   */
  reputed_at: Date | string;
}

/**
 * SSCUserAutocompleteType Interface
 */

export interface SCUserAutocompleteType {
  /**
   * The ID of the user.
   */
  id: number;
  /**
   * The username of the user.
   */
  username: string;
  /**
   * The real name of the user.
   */
  real_name: string;
  /**
   * The user avatar.
   */
  avatar: string;
  /**
   * The external ID of the user. It is assigned only during signup.
   */
  ext_id: number;
}

/**
 * SCUserCountersType interface
 */
export interface SCUserCounterType {
  /**
   * Number of discussions created by the user.
   * Only if dynamic preference configurations.discussion_type_enabled is true
   */
  discussions: number;
  /**
   * Number of polls created by the user. Only if dynamic preference addons.polls_enabled is true or if the user has a staff role.
   */
  polls: number;
  /**
   * Number of posts created by the user.Only if dynamic preference configurations.post_type_enabled is true.
   */
  posts: number;
  /**
   * Number of statuses created by the user. Only if dynamic preference configurations.status_type_enabled is true.
   */
  statuses: number;
  /**
   * Number of followings of the user. Only if dynamic preference configurations.follow_enabled is true.
   */
  followings: number;
  /**
   * Number of followers of the user. Only if dynamic preference configurations.follow_enabled is true.
   */
  followers: number;
  /**
   * Number of connection requests sent by the user.
   * Only if dynamic preference configurations.follow_enabled is false.
   */
  connection_requests_sent_counter: number;
  /**
   * Number of connection requests received by the user. Only if dynamic preference configurations.follow_enabled is false.
   */
  connection_requests_received_counter: number;
  /**
   * Number of connections of the user. Only if dynamic preference configurations.follow_enabled is false.
   */
  connections_counter: number;
}

/**
 * SCUserChangeEmailType interface
 */
export interface SCUserChangeEmailType {
  /**
   * String returned when user changes its email with confirm.
   */
  validation_code: string;
}
/**
 * SCUserEmailTokenType interface
 */
export interface SCUserEmailTokenType {
  /**
   * String returned when user changes its email with confirm.
   */
  is_valid: boolean;
}

/**
 * SCUserAvatarType interface
 */
export interface SCUserAvatarType {
  /**
   * String returned when user checks its current avatar.
   */
  avatar: string;
}

/**
 * SCUserPermissionType interface
 */

export interface SCUserPermissionType {
  /**
   * If user can create a contribute
   */
  create_contribute: boolean;
  /**
   * If user can add a poll when creating a contribute
   */
  create_poll: boolean;
  /**
   * If user can create a group
   */
  create_group: boolean;
  /**
   * If user can locate a contribute
   */
  locate_post: boolean;
  /**
   * If user can create a post
   */
  create_post: boolean;
  /**
   * If user can add categories when creating a post
   */
  create_post_with_category: boolean;
  /**
   * If user can follow users
   */
  follow_user: boolean;
  /**
   * If user can request a connection
   */
  request_connection: boolean;
  /**
   * If user can accept a connection
   */
  accept_connection: boolean;
}

/**
 * Interface SCUserFollowedStatusType
 */
export interface SCUserFollowedStatusType {
  /**
   * If the user il followed by the user specified by Id.
   */
  is_followed: boolean;
}

/**
 * Interface SCUserFollowerStatusType
 */
export interface SCUserFollowerStatusType {
  /**
   * If the user specified by Id is a follower.
   */
  is_follower: boolean;
}

/**
 * Interface SCUserConnectionStatusType
 */
export interface SCUserConnectionStatusType {
  /**
   * If the user specified by Id is a connection.
   */
  is_connection: boolean;
}

/**
 * Interface SCUserHiddenStatusType
 */
export interface SCUserHiddenStatusType {
  /**
   * If the user specified by Id is hidden.
   */
  is_hidden: boolean;
}

/**
 * Interface SCUserHiddenByStatusType
 */
export interface SCUserHiddenByStatusType {
  /**
   * If the user has been hidden by the user specified by Id.
   */
  is_hidden_by: boolean;
}

/**
 * Interface SCUserConnectionRequestType
 */

export interface SCUserConnectionRequestType {
  /**
   * The request id.
   */
  id: number;
  /**
   * The user who made the request.
   */
  from_user: SCUserType;
  /**
   * The user who received the request.
   */
  to_user: SCUserType;
  /**
   * Date-time of request creation.
   */
  created: Date | string;
  /**
   * Date-time of request rejection.
   */
  rejected: Date | string;
  /**
   * Date-time of request seen.
   */
  viewed: Date | string;
}

/**
 * Interface SCUserSocialAssociation
 */

export interface SCUserProviderAssociationType {
  /**
   * The user id of the association
   */
  user_id: number | string;
  /**
   * The provider of the social association
   */
  provider: string;
  /**
   * The external id of the user in the provider platform
   */
  ext_id: string;
  /**
   * Profile url of the user in the external provider
   */
  profile_url?: string;
  /**
   * An optional flag to indicate if the social association can be showed in the user profile.
   */
  show_in_profile?: boolean;
  /**
   * Optional json metadata
   */
  metadata?: any;
}
