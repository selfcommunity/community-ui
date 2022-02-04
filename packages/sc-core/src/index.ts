/**
 * Types
 */
import {
  SCContextType,
  SCAuthTokenType,
  SCUserContextType,
  SCFollowedManagerType,
  SCConnectionsManagerType,
  SCCategoriesManagerType,
  SCContextProviderType,
  SCCustomAdvPosition,
  SCCustomAdvType,
  SCSettingsType,
  SCSessionType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCPreferencesContextType,
  SCUserType,
  SCTagType,
  SCCategoryType,
  SCEmbedType,
  SCMediaType,
  SCContributionLocation,
  SCLocalityType,
  SCPollChoiceType,
  SCPollType,
  SCFeedUnitType,
  SCFeedUnitActivityType,
  SCFeedObjectType,
  SCFeedPostType,
  SCFeedDiscussionType,
  SCFeedStatusType,
  SCFeedObjectTypologyType,
  SCFeedUnitActivityTypologyType,
  SCFeedTypologyType,
  SCCommentTypologyType,
  SCCommentType,
  SCPrivateMessageType,
  SCPrivateMessageStatusType,
  SCNotificationContextType,
  SCNotificationTypologyType,
  SCNotificationAggregatedType,
  SCNotificationCommentType,
  SCNotificationConnectionAcceptType,
  SCNotificationConnectionRequestType,
  SCNotificationPrivateMessageType,
  SCNotificationMentionType,
  SCNotificationType,
  SCNotificationBlockedUserType,
  SCNotificationCollapsedForType,
  SCNotificationCustomNotificationType,
  SCNotificationDeletedForType,
  SCNotificationFollowType,
  SCNotificationKindlyNoticeType,
  SCNotificationUnBlockedUserType,
  SCNotificationUnDeletedForType,
  SCNotificationUserFollowType,
  SCNotificationVoteUpType,
  SCCustomNotificationType,
  SCIncubatorType,
  SCNotificationIncubatorType,
  SCNotificationTopicType,
  SCAlertMessagesContextType,
  SCPrizeType,
} from './types';

/**
 * ContextProvider component
 */
import SCContextProvider, {SCContext, useSCContext} from './components/provider/SCContextProvider';

/**
 * AuthProvider component
 */
import SCUserProvider, {SCUserContext, useSCUser} from './components/provider/SCUserProvider';

/**
 * ThemeProvider component
 */
import SCThemeProvider, {SCThemeContext, useSCTheme, withSCTheme} from './components/provider/SCThemeProvider';

/**
 * RoutingProvider component
 */
import SCRoutingProvider, {SCRoutingContext, useSCRouting} from './components/provider/SCRoutingProvider';

/**
 * LocaleProvider component
 */
import SCLocaleProvider, {SCLocaleContext, useSCLocale, withSCLocale} from './components/provider/SCLocaleProvider';

/**
 * NotificationProvider component
 */
import SCNotificationProvider, {SCNotificationContext, useSCNotification} from './components/provider/SCNotificationProvider';

/**
 * AlertMessagesProvider component
 */
import SCAlertMessagesProvider, {SCAlertMessagesContext, useSCAlertMessages} from './components/provider/SCAlertMessagesProvider';

/**
 * PreferencesProvider component
 */
import SCPreferencesProvider, {SCPreferencesContext, useSCPreferences} from './components/provider/SCPreferencesProvider';
import * as SCPreferences from './constants/Preferences';
import * as SCFeatures from './constants/Features';
import * as SCNotification from './constants/Notification';

/**
 * Custom Hooks
 */
import useSCFetchUser from './hooks/useSCFetchUser';
import useSCFetchFeedObject from './hooks/useSCFetchFeedObject';
import useSCFetchCommentObject from './hooks/useSCFetchCommentObject';
import useSCFetchCustomAdv from './hooks/useSCFetchCustomAdv';
import useSCFetchTag from './hooks/useSCFetchTag';
import useSCFetchCategory from './hooks/useSCFetchCategory';

/**
 * Routing component
 */
import Link from './components/router';
import * as SCRoutes from './constants/Routes';

/**
 * Http component
 */
import http, {formatHttpError} from './utils/http';

/**
 * Endpoint component
 */
import Endpoints, {EndpointType} from './constants/Endpoints';

/**
 * Utilities:
 * logger, string, url, object
 */
import {Logger} from './utils/logger';
import * as StringUtils from './utils/string';
import * as ObjectUtils from './utils/object';
import * as UrlUtils from './utils/url';
import WSClient, {WSClientType, WSClientPropTypes} from './utils/websocket';

/**
 * Constants:
 * Locale
 */
import * as Locale from './constants/Locale';

/**
 * List all exports
 */
export {
  SCContextProviderType,
  SCCustomAdvPosition,
  SCCustomAdvType,
  SCSettingsType,
  SCAuthTokenType,
  SCSessionType,
  SCContextType,
  SCUserContextType,
  SCFollowedManagerType,
  SCConnectionsManagerType,
  SCCategoriesManagerType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCPreferencesContextType,
  SCNotificationContextType,
  SCAlertMessagesContextType,
  SCUserType,
  SCTagType,
  SCCategoryType,
  SCEmbedType,
  SCMediaType,
  SCContributionLocation,
  SCLocalityType,
  SCPollChoiceType,
  SCPollType,
  SCFeedUnitType,
  SCFeedUnitActivityType,
  SCFeedObjectType,
  SCFeedPostType,
  SCFeedDiscussionType,
  SCFeedStatusType,
  SCFeedObjectTypologyType,
  SCFeedUnitActivityTypologyType,
  SCFeedTypologyType,
  SCCommentTypologyType,
  SCCommentType,
  SCPrivateMessageType,
  SCPrivateMessageStatusType,
  SCNotificationTypologyType,
  SCNotificationAggregatedType,
  SCNotificationCommentType,
  SCNotificationConnectionAcceptType,
  SCNotificationConnectionRequestType,
  SCNotificationPrivateMessageType,
  SCNotificationMentionType,
  SCNotificationType,
  SCNotificationBlockedUserType,
  SCNotificationCollapsedForType,
  SCNotificationCustomNotificationType,
  SCNotificationDeletedForType,
  SCNotificationFollowType,
  SCNotificationKindlyNoticeType,
  SCNotificationUnBlockedUserType,
  SCNotificationUnDeletedForType,
  SCNotificationUserFollowType,
  SCNotificationVoteUpType,
  SCCustomNotificationType,
  SCNotificationTopicType,
  SCIncubatorType,
  SCNotificationIncubatorType,
  SCPrizeType,
  SCContext,
  SCUserContext,
  SCThemeContext,
  SCRoutingContext,
  SCLocaleContext,
  SCPreferencesContext,
  useSCContext,
  SCContextProvider,
  SCUserProvider,
  useSCUser,
  useSCPreferences,
  SCThemeProvider,
  useSCTheme,
  withSCTheme,
  SCRoutingProvider,
  useSCRouting,
  SCLocaleProvider,
  useSCLocale,
  withSCLocale,
  SCPreferencesProvider,
  SCPreferences,
  SCFeatures,
  SCNotification,
  SCNotificationProvider,
  SCNotificationContext,
  useSCNotification,
  SCAlertMessagesProvider,
  SCAlertMessagesContext,
  useSCAlertMessages,
  http,
  formatHttpError,
  Link,
  SCRoutes,
  Endpoints,
  EndpointType,
  Logger,
  StringUtils,
  ObjectUtils,
  WSClient,
  WSClientType,
  WSClientPropTypes,
  UrlUtils,
  Locale,
  useSCFetchUser,
  useSCFetchFeedObject,
  useSCFetchCommentObject,
  useSCFetchCustomAdv,
  useSCFetchTag,
  useSCFetchCategory,
};
