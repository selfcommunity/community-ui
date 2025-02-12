/**
 * Preferences section
 */
export enum SCPreferenceSection {
  TEXT = 'text',
  STYLE = 'style',
  LOGO = 'logo',
  COLORS = 'colors',
  COVERS = 'covers',
  IMAGES = 'images',
  STAFF = 'staff',
  LOYALTY = 'loyalty',
  ADDONS = 'addons',
  ADVERTISING = 'advertising',
  CONFIGURATIONS = 'configurations',
  PROVIDERS = 'providers',
  WEBMASTER = 'webmaster'
}

/**
 * Preferences name
 */
export enum SCPreferenceName {
  APPLICATION_NAME = 'application_name',
  APPLICATION_SLOGAN1 = 'application_slogan1',
  APPLICATION_SLOGAN2 = 'application_slogan2',
  APPLICATION_COPYRIGHT = 'application_copyright',
  FONT_FAMILY = 'font_family',
  NAVBAR_LOGO = 'navbar_logo',
  NAVBAR_LOGO_MOBILE = 'navbar_logo_mobile',
  COLORBACK = 'colorback',
  COLORPRIMARY = 'colorprimary',
  COLORSECONDARY = 'colorsecondary',
  NAVBARBACK = 'navbarback',
  COLORFONT = 'font_color',
  COLORFONTSECONDARY = 'font_color_secondary',
  COVER_1_HP_M1920 = 'cover_1_hp_m1920',
  COVER_2_HP_M1920 = 'cover_2_hp_m1920',
  COVER_3_HP_M1920 = 'cover_3_hp_m1920',
  COVER_4_HP_M1920 = 'cover_4_hp_m1920',
  COVERS_VISIBILITY = 'covers_visibility',
  APP_ICON = 'app_icon',
  USER_DEFAULT_COVER = 'user_default_cover',
  ERROR_404 = 'error_404',
  ERROR_503 = 'error_503',
  ERRORPAGES_IMAGE = 'errorpages_image',
  ERRORPAGES_TITLE = 'errorpages_title',
  ERRORPAGES_SUBTITLE = 'errorpages_subtitle',
  STAFF_BADGE_ICON = 'staff_badge_icon',
  STAFF_BADGE_LABEL = 'staff_badge_label',
  PRIZE_A_IMAGE = 'prize_a_image',
  PRIZE_B_IMAGE = 'prize_b_image',
  PRIZE_C_IMAGE = 'prize_c_image',
  POINTS_MAKE_DISCUSSION = 'points_make_discussion',
  POINTS_MAKE_POST = 'points_make_post',
  POINTS_MAKE_COMMENT = 'points_make_comment',
  POINTS_RECEIVE_VOTE = 'points_receive_vote',
  POINTS_CONNECTION_OR_FOLLOWER = 'points_connection_or_follower',
  POINTS_SOCIAL_SHARE = 'points_social_share',
  POINTS_APP_USED = 'points_app_used',
  POINTS_DAILY_VISIT = 'points_daily_visit',
  AFFINITY_ENABLED = 'affinity_enabled',
  CLOSED_COMMUNITY = 'closed_community',
  INCUBATOR_ENABLED = 'incubator_enabled',
  INCUBATOR_SUBSCRIBERS = 'incubator_subscribers',
  LOYALTY_POINTS_COLLECTION = 'loyalty_points_collection',
  POLLS_ENABLED = 'polls_enabled',
  REGISTRATION_WIZARD = 'registration_wizard',
  POST_GEOLOCATION_ENABLED = 'post_geolocation_enabled',
  SHARE_POST_ON_FACEBOOK_ENABLED = 'share_post_on_facebook_enabled',
  SHARE_POST_ON_TWITTER_ENABLED = 'share_post_on_twitter_enabled',
  SHARE_POST_ON_LINKEDIN_ENABLED = 'share_post_on_linkedin_enabled',
  CUSTOM_ADV_ENABLED = 'custom_adv_enabled',
  CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED = 'custom_adv_only_for_anonymous_users_enabled',
  CUSTOM_NAVBAR_ITEM_ENABLED = 'custom_navbar_item_enabled',
  CUSTOM_NAVBAR_ITEM_TEXT = 'custom_navbar_item_text',
  CUSTOM_NAVBAR_ITEM_URL = 'custom_navbar_item_url',
  CUSTOM_NAVBAR_ITEM_IMAGE = 'custom_navbar_item_image',
  FOLLOW_ENABLED = 'follow_enabled',
  EXPLORE_STREAM_ENABLED = 'explore_stream_enabled',
  EXPLORE_STREAM_ORDER_BY = 'explore_stream_order_by',
  HOME_STREAM_ORDER_BY = 'home_stream_order_by',
  MANUAL_CATEGORIES_ORDER_ENABLED = 'manual_categories_order_enabled',
  PEOPLE_SEARCH_ENABLED = 'people_search_enabled',
  POST_ONLY_STAFF_ENABLED = 'post_only_staff_enabled',
  STREAM_QUALITY = 'stream_quality',
  CONTENT_AVAILABILITY = 'content_availability',
  USERS_APPROVAL_ENABLED = 'users_approval_enabled',
  POST_TYPE_ENABLED = 'post_type_enabled',
  DISCUSSION_TYPE_ENABLED = 'discussion_type_enabled',
  STATUS_TYPE_ENABLED = 'status_type_enabled',
  URL_TEMPLATE_EMAIL_SETTINGS = 'url_template_email_settings',
  URL_TEMPLATE_EMAIL_UNSUBSCRIBE = 'url_template_email_unsubscribe',
  URL_TEMPLATE_PASSWORD_RECOVER = 'url_template_password_recover',
  URL_TEMPLATE_VERIFY_EMAIL = 'url_template_verify_email',
  URL_TEMPLATE_POST = 'url_template_post',
  URL_TEMPLATE_DISCUSSION = 'url_template_discussion',
  URL_TEMPLATE_STATUS = 'url_template_status',
  URL_TEMPLATE_COMMENT = 'url_template_comment',
  URL_TEMPLATE_CATEGORY = 'url_template_category',
  URL_TEMPLATE_CATEGORIES_LIST = 'url_template_categories_list',
  URL_TEMPLATE_USER_PROFILE = 'url_template_profile',
  URL_TEMPLATE_USER_PROFILE_SETTINGS = 'url_template_profile_settings',
  URL_TEMPLATE_NOTIFICATIONS = 'url_template_notifications',
  URL_TEMPLATE_USER_PRIVATE_MESSAGES = 'url_template_private_message',
  URL_TEMPLATE_INCUBATOR = 'url_template_incubator',
  URL_TEMPLATE_LIVE_STREAM = 'url_template_live_stream',
  APP_URL = 'app_url',
  USER_METADATA_DEFINITIONS = 'user_metadata_definition',
  TAG_MANAGER_CONTAINER_ID = 'tag_manager_container_id',
  GDPR_COOKIE_CONSENT_EXTERNAL_HTML = 'gdpr_cookie_consent_external_html',
  GDPR_SIGNUP_ACCEPT_HTML = 'gdpr_signup_accept_html',
  APP_URL_ON_APP_STORE = 'app_url_on_app_store',
  APP_URL_ON_GOOGLE_PLAY = 'app_url_on_google_play',
  FACEBOOK_SIGNIN_ENABLED = 'facebook_signin_enabled',
  FACEBOOK_APP_KEY = 'facebook_app_key',
  FACEBOOK_APP_SECRET = 'facebook_app_secret',
  LINKEDIN_SIGNIN_ENABLED = 'linkedin_signin_enabled',
  LINKEDIN_APP_KEY = 'linkedin_app_key',
  LINKEDIN_APP_SECRET = 'linkedin_app_secret',
  TWITTER_SIGNIN_ENABLED = 'twitter_signin_enabled',
  TWITTER_APP_KEY = 'twitter_app_key',
  TWITTER_APP_SECRET = 'twitter_app_secret',
  GOOGLE_GEOCODING_API_KEY = 'google_geocoding_api_key',
  GOOGLE_SIGNIN_ENABLED = 'google_signin_enabled',
  GOOGLE_APP_KEY = 'google_app_key',
  GOOGLE_APP_SECRET = 'google_app_secret',
  WEB_PUSH_PUBLIC_KEY = 'web_push_public_key',
  WEB_PUSH_ENABLED = 'web_push_enabled',
  META_ROBOTS = 'meta_robots',
  META_TITLE_HOME_NOT_LOGGED = 'meta_title_home_not_logged',
  META_DESCRIPTION = 'meta_description',
  GROUPS_ENABLED = 'groups_enabled',
  GROUPS_VISIBILITY_ENABLED = 'groups_visibility_enabled',
  GROUPS_PRIVATE_ENABLED = 'groups_private_enabled',
  GROUPS_ONLY_STAFF_ENABLED = 'groups_only_staff_enabled',
  EVENTS_ENABLED = 'events_enabled',
  EVENTS_VISIBILITY_ENABLED = 'events_visibility_enabled',
  EVENTS_PRIVATE_ENABLED = 'events_private_enabled',
  EVENTS_ONLY_STAFF_ENABLED = 'events_only_staff_enabled',
  LIVE_STREAM_ENABLED = 'live_stream_enabled',
  LIVE_STREAM_ONLY_STAFF_ENABLED = 'live_stream_only_staff_enabled',
  ONBOARDING_ENABLED = 'onboarding_enabled',
  ONBOARDING_HIDDEN = 'onboarding_hidden',
  SUBSCRIPTION_TIER = 'subscription_tier'
}

/**
 * SCPreferenceType interface
 */
export interface SCPreferenceType {
  /**
   * Unique integer value identifying this dynamic preference
   */
  id?: number;
  /**
   * Grouping name
   */
  section?: SCPreferenceSection;
  /**
   * 	Unique name identifying this dynamic preference
   */
  name?: SCPreferenceName;
  /**
   * 	The value of the dynamic preference (can be an integer or a string)
   */
  value: string;
  /**
   * 	The type of the dynamic preference
   */
  type?: string;
  /**
   * 	A description string for the dynamic preference
   */
  help?: string;
}
