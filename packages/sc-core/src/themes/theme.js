import {createTheme} from '@mui/material/styles';
import {mergeDeep} from '../utils/object';
import validateColor from 'validate-color';
import {COLORS_COLORBACK, COLORS_COLORPRIMARY, COLORS_COLORSECONDARY, FONT_FAMILY} from '../constants/Preferences';
import {isString} from '../utils/string';

/**
 * check if colorProp is a valid color
 * @param preferences
 * @param colorProp
 * @param tFunc: type func validator
 * @return {boolean|(function(*=): boolean)}
 */
const isValidPreference = (preferences, prop, tFunc) => {
  // eslint-disable-next-line no-prototype-builtins
  if (preferences.hasOwnProperty(prop) && preferences[prop].hasOwnProperty('value')) {
    return tFunc(preferences[prop].value);
  }
  return false;
};

/**
 * Overrides theme properties
 * @param options: store.settings.theme
 * @param preferences: community global preferences
 * @return {Theme}
 */
const getTheme = (options, preferences) => {
  const defaultOptions = preferences
    ? {
        palette: {
          ...(isValidPreference(preferences, COLORS_COLORBACK, validateColor) && {background: {default: preferences[COLORS_COLORBACK].value}}),
          ...{text: {primary: '#777'}}, // TODO: add dynamic preferences
          ...(isValidPreference(preferences, COLORS_COLORPRIMARY, validateColor) && {primary: {main: preferences[COLORS_COLORPRIMARY].value}}),
          ...(isValidPreference(preferences, COLORS_COLORSECONDARY, validateColor) && {
            secondary: {main: preferences[COLORS_COLORSECONDARY].value},
          }),
        },
        typography: {
          ...(isValidPreference(preferences, FONT_FAMILY, isString) && {fontFamily: preferences[FONT_FAMILY].value}),
          body1: {
            fontSize: '0.9rem',
          },
          body2: {
            fontSize: '0.8rem',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: 3,
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderWidth: '1px',
              },
            },
          },
          SCFeedObject: {
            styleOverrides: {
              root: {},
            },
          },
          SCTrendingFeed: {
            styleOverrides: {
              root: {
                '& .MuiIcon-root': {
                  marginBottom: '0.5px',
                },
              },
            },
          },
          SCSnippetNotifications: {
            styleOverrides: {
              root: {
                '& .SCSnippetNotifications-notifications-list': {
                  // wrap notifications list (ul)
                  // (ex. background-color: 'red'),
                },
                '& .SCSnippetNotifications-notification-item': {
                  // single notification item (li)
                  // (ex. background-color: 'red'),
                },
                ['& .SCUserFollowNotification-username, .SCUserFollowNotification-username, .SCCommentNotification-username,' +
                'SCContributionFollowNotification-username, .SCContributionFollowNotification-username, .SCUserNotificationMention-username,' +
                '.SCUserNotificationMention-username, .SCUserNotificationPrivateMessage-message-sender, .SCVoteUpNotification-username']: {
                  // username for notification types: user follow, comment/nested comment,
                  // follow contribution, mention, private message, vote up
                  // (ex. color: 'red'),
                },
                ['& .SCUserFollowNotification-list-item-snippet-new, .SCVoteUpNotification-list-item-snippet-new, ' +
                '.SCUserBlockedNotification-list-item-snippet-new, .SCUndeletedForNotification-list-item-snippet-new, ' +
                '.SCUserNotificationPrivateMessage-list-item-snippet-new, .SCUserNotificationMention-list-item-snippet-new,' +
                '.SCKindlyNoticeForNotification-list-item-snippet-new, .SCKindlyNoticeFlagNotification-list-item-snippet-new,' +
                '.SCIncubatorApprovedNotification-list-item-snippet-new, .SCDeletedForNotification-list-item-snippet-new,' +
                '.SCContributionFollowNotification-list-item-snippet-new, .SCCommentNotification-list-item-snippet-new,' +
                '.SCCollapsedForNotification-list-item-snippet-new']: {
                  // border left indicate new notification of various type
                  // (ex. borderLeft: '2px solid grey !important'),
                },
              },
            },
          },
          SCPlatform: {
            styleOverrides: {
              root: {
                '& .MuiIcon-root': {
                  fontSize: '18px',
                  marginLeft: '2px',
                  marginBottom: '-3px',
                },
              },
            },
          },
        },
      }
    : {};
  return createTheme(mergeDeep(defaultOptions, options));
};

export default getTheme;
