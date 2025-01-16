/**
 * Types
 */
import {
  SCUserContextType,
  SCFollowedCategoriesManagerType,
  SCContextProviderType,
  SCContextType,
  SCSettingsType,
  SCSessionType,
  SCFollowedManagerType,
  SCFollowersManagerType,
  SCSettingsManagerType,
  SCConnectionsManagerType,
  SCSubscribedIncubatorsManagerType,
  SCLocaleType,
  SCNotificationContextType,
  SCPreferencesContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCAlertMessagesContextType,
  SCThemeAvatarVariableType,
  SCThemeCategoryIconVariableType,
  SCThemeCategoryVariableType,
  SCThemeVariablesType,
  SCThemeType,
  SCSubscribedGroupsManagerType,
  SCSubscribedEventsManagerType,
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
import * as SCCache from './constants/Cache';

/**
 * Custom Hooks
 */
import useSCFetchUser from './hooks/useSCFetchUser';
import useSCFetchUserProviders from './hooks/useSCFetchUserProviders';
import useSCFetchVote from './hooks/useSCFetchVote';
import useSCFetchFeedObject from './hooks/useSCFetchFeedObject';
import useSCFetchCommentObject from './hooks/useSCFetchCommentObject';
import useSCFetchCommentObjects from './hooks/useSCFetchCommentObjects';
import useSCFetchCustomAdv from './hooks/useSCFetchCustomAdv';
import useSCFetchTag from './hooks/useSCFetchTag';
import useSCFetchAddressingTagList from './hooks/useSCFetchAddressingTagList';
import useSCFetchCategory from './hooks/useSCFetchCategory';
import useSCFetchCategories from './hooks/useSCFetchCategories';
import useSCFetchIncubator from './hooks/useSCFetchIncubator';
import useSCMediaClick from './hooks/useSCMediaClick';
import useSCFetchContributors from './hooks/useSCFetchContributors';
import useSCFetchFeed from './hooks/useSCFetchFeed';
import useSCFetchPrivateMessageSnippets from './hooks/useSCFetchPrivateMessageSnippets';
import useSCFetchBroadcastMessages from './hooks/useSCFetchBroadcastMessages';
import useSCFetchUserBlockedBy from './hooks/useSCFetchUserBlockedBy';
import useSCUserIsBlocked from './hooks/useSCUserIsBlocked';
import useSCFetchGroup from './hooks/useSCFetchGroup';
import useSCFetchGroups from './hooks/useSCFetchGroups';
import useSCFetchEvent from './hooks/useSCFetchEvent';
import useSCFetchEvents from './hooks/useSCFetchEvents';
import useSCFetchLiveStream from './hooks/useSCFetchLiveStream';
import useSCGoogleApiLoader from './hooks/useSCGoogleApiLoader';

/**
 * Routing component
 */
import Link from './components/router';
import * as SCRoutes from './constants/Routes';

/**
 * Utilities:
 * User, hooks (useIsComponentMountedRef)
 */
import * as UserUtils from './utils/user';
import getTheme from './themes/theme';
import {
  useIsComponentMountedRef,
  usePreviousValue,
  useIsomorphicLayoutEffect,
  useEffectOnce,
  useNoInitialEffect,
  usePageVisibility,
} from './utils/hooks';
import {getEventStatus} from './utils/event';
/**
 * Constants:
 * Locale, Preferences
 */
import * as Locale from './constants/Locale';
import * as Preferences from './constants/Preferences';

/**
 * List all exports
 */
export {
  SCUserContextType,
  SCFollowedCategoriesManagerType,
  SCContextProviderType,
  SCContextType,
  SCSettingsType,
  SCSessionType,
  SCSettingsManagerType,
  SCFollowedManagerType,
  SCFollowersManagerType,
  SCConnectionsManagerType,
  SCSubscribedIncubatorsManagerType,
  SCLocaleType,
  SCNotificationContextType,
  SCPreferencesContextType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCAlertMessagesContextType,
  SCThemeAvatarVariableType,
  SCThemeCategoryIconVariableType,
  SCThemeCategoryVariableType,
  SCThemeVariablesType,
  SCThemeType,
  SCSubscribedGroupsManagerType,
  SCSubscribedEventsManagerType,
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
  getTheme,
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
  Link,
  SCRoutes,
  SCCache,
  UserUtils,
  getEventStatus,
  Locale,
  Preferences,
  useSCFetchUser,
  useSCFetchUserProviders,
  useSCFetchVote,
  useSCFetchFeedObject,
  useSCFetchCommentObject,
  useSCFetchCommentObjects,
  useSCFetchCustomAdv,
  useSCFetchTag,
  useSCFetchAddressingTagList,
  useSCFetchCategory,
  useSCFetchCategories,
  useSCFetchIncubator,
  useSCMediaClick,
  useSCFetchContributors,
  useSCFetchFeed,
  useIsComponentMountedRef,
  usePreviousValue,
  useIsomorphicLayoutEffect,
  useEffectOnce,
  useNoInitialEffect,
  usePageVisibility,
  useSCFetchPrivateMessageSnippets,
  useSCFetchBroadcastMessages,
  useSCFetchUserBlockedBy,
  useSCUserIsBlocked,
  useSCFetchGroup,
  useSCFetchGroups,
  useSCFetchEvent,
  useSCFetchEvents,
  useSCFetchLiveStream,
  useSCGoogleApiLoader,
};
