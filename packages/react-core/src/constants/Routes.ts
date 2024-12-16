export const PORTAL_OPTION = 'portal';
export const ROUTER_OPTION = 'router';

/**
 * Routes name
 */
export const HOME_ROUTE_NAME = 'home';
export const EXPLORE_ROUTE_NAME = 'explore';
export const POST_ROUTE_NAME = 'post';
export const DISCUSSION_ROUTE_NAME = 'discussion';
export const STATUS_ROUTE_NAME = 'status';
export const COMMENT_ROUTE_NAME = 'comment';
export const CATEGORY_ROUTE_NAME = 'category';
export const CATEGORY_TRENDING_FEED_ROUTE_NAME = 'category_trending_feed';
export const CATEGORIES_LIST_ROUTE_NAME = 'categories';
export const USER_PROFILE_ROUTE_NAME = 'user_profile';
export const USER_PROFILE_SETTINGS_ROUTE_NAME = 'user_profile_settings';
export const USER_NOTIFICATIONS_ROUTE_NAME = 'user_notifications';
export const USER_PRIVATE_MESSAGES_ROUTE_NAME = 'user_messages';
export const USER_PROFILE_FOLLOWINGS_ROUTE_NAME = 'user_followings';
export const USER_PROFILE_FOLLOWERS_ROUTE_NAME = 'user_followers';
export const USER_PROFILE_CONNECTIONS_ROUTE_NAME = 'user_connections';
export const USER_PROFILE_CONNECTIONS_REQUESTS_ROUTE_NAME = 'user_connections_requests';
export const USER_PROFILE_CONNECTIONS_REQUESTS_SENT_ROUTE_NAME = 'user_connections_requests_sent';
export const USER_PROFILE_CATEGORIES_ROUTE_NAME = 'user_categories';
export const USER_PROFILE_FOLLOWED_POSTS_ROUTE_NAME = 'user_followed_posts';
export const USER_PROFILE_FOLLOWED_DISCUSSIONS_ROUTE_NAME = 'user_followed_discussions';
export const LOYALTY_ROUTE_NAME = 'loyalty';
export const INCUBATOR_ROUTE_NAME = 'incubator';
export const SIGNIN_ROUTE_NAME = 'signin';
export const SIGNUP_ROUTE_NAME = 'signup';
export const RECOVER_ROUTE_NAME = 'recover';
export const CUSTOM_PAGES_ROUTE_NAME = 'custom_pages';
export const LEGAL_PAGES_ROUTE_NAME = 'legal_pages';
export const GROUP_ROUTE_NAME = 'group';
export const GROUP_MEMBERS_ROUTE_NAME = 'group_members';
export const GROUP_MESSAGES_ROUTE_NAME = 'group_messages';
export const GROUPS_ROUTE_NAME = 'groups';
export const GROUPS_SUBSCRIBED_ROUTE_NAME = 'groups_subscribed';
export const EVENT_ROUTE_NAME = 'event';
export const EVENTS_ROUTE_NAME = 'events';
export const EVENTS_SUGGESTED_ROUTE_NAME = 'events_suggested';
export const EVENTS_SUBSCRIBED_ROUTE_NAME = 'events_subscribed';
export const EVENTS_HIGHLIGHT_ROUTE_NAME = 'events_highlight';
export const LIVESTREAM_ROUTE_NAME = 'live';

/**
 * Default Routes
 * @type {{[p: string]: string, '[POST_ROUTE_NAME]': string, '[INCUBATOR_ROUTE_NAME]': string, '[LOYALTY_ROUTE_NAME]': string, '[USER_NOTIFICATION_ROUTE_NAME]': string, '[USER_PRIVATE_MESSAGES_ROUTE_NAME]': string, '[COMMENT_ROUTE_NAME]': string, '[DISCUSSION_ROUTE_NAME]': string, '[CATEGORIES_ROUTE_NAME]': string, '[USER_PROFILE_ROUTE_NAME]': string, '[CATEGORY_ROUTE_NAME]': string, '[USER_PROFILE_SETTINGS_ROUTE_NAME]': string, '[STATUS_ROUTE_NAME]': string}}
 */
export const defaultRoutes: {[k: string]: string} = {
  [HOME_ROUTE_NAME]: '/',
  [EXPLORE_ROUTE_NAME]: '/explore/',
  [POST_ROUTE_NAME]: '/post/:id/',
  [DISCUSSION_ROUTE_NAME]: '/discussion/:id/',
  [STATUS_ROUTE_NAME]: '/status/:id/',
  [COMMENT_ROUTE_NAME]: '/:contribution_type/:contribution_id/comment/:id/',
  [CATEGORY_ROUTE_NAME]: '/category/:id/:slug/',
  [CATEGORY_TRENDING_FEED_ROUTE_NAME]: '/category/:id/:slug/trending/',
  [CATEGORIES_LIST_ROUTE_NAME]: '/categories/',
  [USER_PROFILE_ROUTE_NAME]: '/user/:id/',
  [USER_PROFILE_SETTINGS_ROUTE_NAME]: '/user/:id/edit/',
  [USER_NOTIFICATIONS_ROUTE_NAME]: '/notification/',
  [USER_PRIVATE_MESSAGES_ROUTE_NAME]: '/messages/:id/',
  [USER_PROFILE_FOLLOWINGS_ROUTE_NAME]: '/user/:id/followed/',
  [USER_PROFILE_FOLLOWERS_ROUTE_NAME]: '/user/:id/followers/',
  [USER_PROFILE_CONNECTIONS_ROUTE_NAME]: '/user/:id/connections/',
  [USER_PROFILE_CONNECTIONS_REQUESTS_ROUTE_NAME]: '/user/:id/connections/requests/',
  [USER_PROFILE_CONNECTIONS_REQUESTS_SENT_ROUTE_NAME]: '/user/:id/connections/requests/sent/',
  [USER_PROFILE_CATEGORIES_ROUTE_NAME]: '/user/:id/categories/',
  [USER_PROFILE_FOLLOWED_POSTS_ROUTE_NAME]: '/user/:id/posts/followed/',
  [USER_PROFILE_FOLLOWED_DISCUSSIONS_ROUTE_NAME]: '/user/:id/discussions/followed/',
  [LOYALTY_ROUTE_NAME]: '/loyalty/',
  [INCUBATOR_ROUTE_NAME]: '/incubator/:id/',
  [SIGNIN_ROUTE_NAME]: '/signin/',
  [SIGNUP_ROUTE_NAME]: '/signup/',
  [RECOVER_ROUTE_NAME]: '/recover/',
  [CUSTOM_PAGES_ROUTE_NAME]: '/:id/:slug/',
  [LEGAL_PAGES_ROUTE_NAME]: '/legal/:policy/',
  [GROUP_ROUTE_NAME]: '/group/:id/:slug/',
  [GROUP_MEMBERS_ROUTE_NAME]: '/group/:id/:slug/members/',
  [GROUP_MESSAGES_ROUTE_NAME]: '/group/:id/:slug/messages/',
  [GROUPS_ROUTE_NAME]: '/groups/',
  [GROUPS_SUBSCRIBED_ROUTE_NAME]: '/groups/subscribed/',
  [EVENTS_ROUTE_NAME]: '/events/',
  [EVENTS_SUGGESTED_ROUTE_NAME]: '/events/suggested',
  [EVENT_ROUTE_NAME]: '/event/:id/:slug/',
  [EVENTS_SUBSCRIBED_ROUTE_NAME]: '/events/subscribed/',
  [EVENTS_HIGHLIGHT_ROUTE_NAME]: '/events/highlight/',
  [LIVESTREAM_ROUTE_NAME]: '/live/:slug/',
};
