/**
 * Cache prefixes
 */

/** FEED OBJECT **/
export const FEED_OBJECT_CACHE_PREFIX_KEY = '_fo_';
export const getFeedObjectCacheKey = (id, type) => `${FEED_OBJECT_CACHE_PREFIX_KEY}${type}_${id}`;

/** COMMMENT OBJECT **/
export const COMMENT_OBJECT_CACHE_PREFIX_KEY = '_co_';
export const getCommentObjectCacheKey = (id) => `${COMMENT_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** COMMMENT OBJECTS **/
export const COMMENT_OBJECTS_CACHE_PREFIX_KEY = '_cos_';
export const getCommentObjectsCacheKey = (id, type, next) => `${COMMENT_OBJECTS_CACHE_PREFIX_KEY}${type}_${id}_${next}`;
export const getCommentObjectsCachePrefixKeys = (id, type) => `${COMMENT_OBJECTS_CACHE_PREFIX_KEY}${type}_${id}`;

/** CATEGORIES OBJECT **/
export const CATEGORIES_OBJECT_CACHE_PREFIX_KEY = '_cas_';
export const getCategoriesObjectCacheKey = () => `${CATEGORIES_OBJECT_CACHE_PREFIX_KEY}`;

/** CATEGORY OBJECT **/
export const CATEGORY_OBJECT_CACHE_PREFIX_KEY = '_ca_';
export const getCategoryObjectCacheKey = (id) => `${CATEGORY_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** EVENT OBJECT **/
export const EVENT_OBJECT_CACHE_PREFIX_KEY = '_evt_';
export const getEventObjectCacheKey = (id) => `${EVENT_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** EVENTS OBJECT **/
export const EVENTS_OBJECT_CACHE_PREFIX_KEY = '_evts_';
export const getEventsObjectCacheKey = () => `${EVENTS_OBJECT_CACHE_PREFIX_KEY}`;

/** EVENT OBJECT **/
export const LIVESTREAM_OBJECT_CACHE_PREFIX_KEY = '_liveStream_';
export const getLiveStreamObjectCacheKey = (id) => `${LIVESTREAM_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** GROUP OBJECT **/
export const GROUP_OBJECT_CACHE_PREFIX_KEY = '_grp_';
export const getGroupObjectCacheKey = (id) => `${GROUP_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** GROUPS OBJECT **/
export const GROUPS_OBJECT_CACHE_PREFIX_KEY = '_grps_';
export const getGroupsObjectCacheKey = () => `${GROUPS_OBJECT_CACHE_PREFIX_KEY}`;

/** INCUBATOR OBJECT **/
export const INCUBATOR_OBJECT_CACHE_PREFIX_KEY = '_inc_';
export const getIncubatorObjectCacheKey = (id) => `${INCUBATOR_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** CONTRIBUTORS **/
export const CONTRIBUTORS_CACHE_PREFIX_KEY = '_contr_';
export const getContributorsCacheKey = (id, type, next) => `${CONTRIBUTORS_CACHE_PREFIX_KEY}${type}_${id}_${next}`;
export const getContributorsCachePrefixKeys = (id, type) => `${CONTRIBUTORS_CACHE_PREFIX_KEY}${type}_${id}`;

/** BROADCAST MESSAGES OBJECT **/
export const BROADCAST_MESSAGES_OBJECT_CACHE_PREFIX_KEY = '_bcms_';
export const getBroadcastMessagesObjectCacheKey = () => `${BROADCAST_MESSAGES_OBJECT_CACHE_PREFIX_KEY}`;

/** FEED **/

// Cache single response body
export const FEED_CACHE_PREFIX_KEY = '_feed_';
export const getFeedCacheKey = (id, next) => `${FEED_CACHE_PREFIX_KEY}${id}_${next}`;

// Cache state of the feed (ex. useSCFetchFeed)
export const FEED_STATE_CACHE_PREFIX_KEY = '_feed_st_';
export const getStateFeedCacheKey = (id) => `${FEED_STATE_CACHE_PREFIX_KEY}${id}`;

// Cache the state of the virtualized feed
export const VIRTUALIZED_SCROLL_STATE_CACHE_PREFIX_KEY = '_virtualized_scroll_st_';
export const getVirtualizedScrollStateCacheKey = (id) => `${VIRTUALIZED_SCROLL_STATE_CACHE_PREFIX_KEY}${id}`;

// Cache feed position
export const FEED_CACHE_SP_KEY = '_feed_spos_';
export const getFeedSPCacheKey = (id) => `${FEED_CACHE_SP_KEY}${id}`;

/** CUSTOM ADVERTISING **/
export const ADV_OBJECT_CACHE_PREFIX_KEY = '_adv_';
export const getAdvObjectCacheKey = (id) => `${ADV_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** PRIVATE MESSAGE SNIPPETS  OBJECT **/
export const PM_SNIPPETS_OBJECT_CACHE_PREFIX_KEY = '_pmss_';
export const getPmSnippetsObjectCacheKey = () => `${PM_SNIPPETS_OBJECT_CACHE_PREFIX_KEY}`;

/** PRIVATE MESSAGE SNIPPET  OBJECT **/
export const PM_SNIPPET_OBJECT_CACHE_PREFIX_KEY = '_pms_';
export const getPmSnippetObjectCacheKey = (id) => `${PM_SNIPPET_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** TOOLS */
export const CATEGORIES_LIST_TOOLS_STATE_CACHE_PREFIX_KEY = '_cListWidget_';
export const CATEGORIES_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY = '_cFolWidget_';
export const CATEGORIES_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY = '_cSugWidget_';
export const CATEGORIES_POPULAR_TOOLS_STATE_CACHE_PREFIX_KEY = '_cPopWidget_';
export const USER_FOLLOWERS_TOOLS_STATE_CACHE_PREFIX_KEY = '_uFolWidget_';
export const USER_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY = '_uFoldWidget_';
export const USER_EVENTS_STATE_CACHE_PREFIX_KEY = '_uEvents_';
export const USER_OTHER_EVENTS_STATE_CACHE_PREFIX_KEY = '_uOtherEvents_';
export const USER_PARTECIPANTS_EVENTS_STATE_CACHE_PREFIX_KEY = '_uPartecipantsEvents_';
export const USER_INVITED_EVENTS_STATE_CACHE_PREFIX_KEY = '_uInvitedEvents_';
export const USER_REQUESTS_EVENTS_STATE_CACHE_PREFIX_KEY = '_uRequestsEvents_';
export const USER_LIVE_STREAM_CACHE_PREFIX_KEY = '_uUserLives_';
export const EVENT_MEDIA_STATE_CACHE_PREFIX_KEY = '_eMedia_';
export const USER_CONNECTIONS_TOOLS_STATE_CACHE_PREFIX_KEY = '_uConWidget_';
export const USER_CONNECTIONS_REQUESTS_TOOLS_STATE_CACHE_PREFIX_KEY = '_uConReqWidget_';
export const USER_CONNECTIONS_REQUESTS_SENT_TOOLS_STATE_CACHE_PREFIX_KEY = '_uConReqSentWidget_';
export const TRENDING_FEED_TOOLS_STATE_CACHE_PREFIX_KEY = '_fTrendWidget_';
export const RELATED_FEED_TOOLS_STATE_CACHE_PREFIX_KEY = '_rFeedWidget_';
export const TRENDING_PEOPLE_TOOLS_STATE_CACHE_PREFIX_KEY = '_pTrendWidget_';
export const PEOPLE_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY = '_pSugWidget_';
export const INCUBATOR_LIST_TOOLS_STATE_CACHE_PREFIX_KEY = '_iListWidget_';
export const INCUBATOR_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY = '_iSugWidget_';
export const POLL_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY = '_pSugWidget_';
export const GROUP_MEMBERS_TOOLS_STATE_CACHE_PREFIX_KEY = '_gMemWidget_';
export const GROUP_REQUESTS_TOOLS_STATE_CACHE_PREFIX_KEY = '_gReqWidget_';
export const GROUPS_LIST_TOOLS_STATE_CACHE_PREFIX_KEY = '_glIST_';
export const GROUPS_SUBSCRIBED_TOOLS_STATE_CACHE_PREFIX_KEY = '_gSubWidget_';
export const getWidgetStateCacheKey = (p, id = undefined) => `${p}${id !== undefined ? id : ''}`;
