export enum SCFeatureName {
  INTERESTS = 'interests',
  CUSTOMIZE = 'customize',
  ADDONS = 'addons',
  DOMAIN = 'domain',
  SOCIAL_PROVIDERS = 'social_providers',
  COMMUNITY_SUBSCRIPTION = 'community_subscription',
  SEO = 'seo',
  ADVERTISING = 'advertising',
  GOOGLE_CLOUD_API = 'google_cloud_api',
  HOTJAR = 'hotjar',
  SQREEN = 'sqreen',
  INCUBATORS = 'incubators',
  CMS = 'cms',
  LEGAL_PAGES = 'legal_pages',
  SCORING = 'scoring',
  USER_ROLES = 'user_roles',
  EMAIL_MANAGER = 'email_manager',
  LOYALTY = 'loyalty',
  BROADCAST = 'broadcast',
  INVITATION = 'invitation',
  APP_SETTINGS = 'app_settings',
  MODERATION_FLAGS = 'moderation_flags',
  MODERATION_CONTENTS = 'moderation_contents',
  MODERATION_USERS_BLOCKED = 'moderation_users_blocked',
  MODERATION_USERS = 'moderation_users',
  DATA_PROVISIONING_DASHBOARD = 'data_provisioning_dashboard',
  DATA_PROVISIONING_USERS = 'data_provisioning_users',
  DATA_PROVISIONING_CONTENTS = 'data_provisioning_contents',
  DATA_PROVISIONING_INTERESTS = 'data_provisioning_interests',
  DATA_PROVISIONING_POLLS = 'data_provisioning_polls',
  DATA_PROVISIONING_REPORTS = 'data_provisioning_reports',
  REGISTRATION_ALERTS = 'registration_alerts',
  SOCIAL_SHARE = 'social_share',
  FEED_SETTINGS = 'stream_settings',
  TAGGING = 'tagging',
  API_V2 = 'api_v2',
  WEBHOOK = 'webhook',
  HEADLESS = 'headless',
  CUSTOMIZE_HEADLESS = 'customize_headless',
  SYSTEM_PAGES = 'system_pages',
  REACTION = 'reaction',
  PRIVATE_MESSAGING = 'private_messaging',
  GROUPING = 'grouping',
  EVENT = 'event',
	LIVE_STREAM = 'live_stream'
}

/**
 * SCFeatureType interface
 */

export interface SCFeatureType {
  /**
   * The feature ID.
   */
  id?: number;
  /**
   * The name of the feature.
   */
  name?: SCFeatureName;
  /**
   * Is this feature enabled?
   */
  enabled?: boolean;
}
