import {Avatar, Badge, Box, Button, IconButton, styled, Toolbar, ToolbarProps, Tooltip} from '@mui/material';
import React, {useMemo} from 'react';
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import NavigationToolbarSkeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import NotificationMenu, {NotificationsMenuProps} from './NotificationMenu';
import SearchAutocomplete, {SearchAutocompleteProps} from '../SearchAutocomplete';
import NavigationSettingsIconButton, {NavigationSettingsIconButtonProps} from '../NavigationSettingsIconButton';
import ComposerIconButton, {ComposerIconButtonProps} from '../ComposerIconButton';
import {SCFeatureName} from '@selfcommunity/types';
import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  UserUtils,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import NavigationMenuIconButton, {NavigationMenuIconButtonProps} from '../NavigationMenuIconButton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  customItem: `${PREFIX}-custom-item`,
  register: `${PREFIX}-register`,
  navigation: `${PREFIX}-navigation`,
  home: `${PREFIX}-home`,
  explore: `${PREFIX}-explore`,
  events: `${PREFIX}-events`,
  groups: `${PREFIX}-groups`,
  search: `${PREFIX}-search`,
  composer: `${PREFIX}-composer`,
  profile: `${PREFIX}-profile`,
  notification: `${PREFIX}-notification`,
  notificationsMenu: `${PREFIX}-notifications-menu`,
  messages: `${PREFIX}-messages`,
  settings: `${PREFIX}-settings`,
  active: `${PREFIX}-active`
};

const Root = styled(Toolbar, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface NavigationToolbarProps extends ToolbarProps {
  /**
   * Disable search action if possible
   */
  disableSearch?: boolean;
  /**
   * Disable composer action if possible
   */
  disableComposer?: boolean;
  /**
   * Searchbar props
   */
  SearchAutocompleteProps?: SearchAutocompleteProps;
  /**
   * The navigation path
   */
  value: string;
  /**
   * Actions to be inserted before composer IconButton
   */
  startActions?: React.ReactNode | null;
  /**
   * Actions to be inserted after Private Messages IconButton
   */
  endActions?: React.ReactNode | null;
  /**
   * Component for Navigation Menu Icon Button
   */
  NavigationMenuIconButtonComponent?: (inProps: NavigationMenuIconButtonProps) => JSX.Element;
  /**
   * Props to spread to the NavigationMenuIconButtonComponent
   * @default {}
   */
  NavigationMenuIconButtonComponentProps?: NavigationMenuIconButtonProps;
  /**
   * Component for Navigation Settings
   */
  NavigationSettingsIconButtonComponent?: (inProps: NavigationSettingsIconButtonProps) => JSX.Element;
  /**
   * Callback on open notification menu
   */
  onOpenNotificationMenu?: () => void;
  /**
   * Callback on close notification menu
   */
  onCloseNotificationMenu?: () => void;
  /**
   * Props to spread to the NotificationsMenu
   * @default {}
   */
  NotificationMenuProps?: Omit<NotificationsMenuProps, 'anchorEl' | 'open' | 'onClose' | 'onClick' | 'transformOrigin' | 'anchorOrigin'>;
  /**
   * Props to spread to the ComposerIconButton
   * @default {}
   */
  ComposerIconButtonProps?: ComposerIconButtonProps;
}

const PREFERENCES = [
  SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED,
  SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY,
  SCPreferences.LOGO_NAVBAR_LOGO,
  SCPreferences.ADDONS_CLOSED_COMMUNITY,
  SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_ENABLED,
  SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_URL,
  SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_IMAGE,
  SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_TEXT
];

/**
 * > API documentation for the Community-JS NavigationToolbar component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the application header.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/NavigationToolbar)

 #### Import

 ```jsx
 import {NavigationToolbar} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationToolbar` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationToolbar-root|Styles applied to the root element.|
 |logo|.SCNavigationToolbar-logo|Styles applied to the logo element.|
 |register|.SCNavigationToolbar-register|Styles applied to the register button elements.|
 |navigation|.SCNavigationToolbar-navigation|Styles applied to the navigation container element|
 |home|.SCNavigationToolbar-home|Styles applied to the home button|
 |explore|.SCNavigationToolbar-explore|Styles applied to the explore button|
 |groups|.SCNavigationToolbar-groups|Styles applied to the group button|
 |events|.SCNavigationToolbar-events|Styles applied to the event button|
 |search|.SCNavigationToolbar-search|Styles applied to the search component|
 |composer|.SCNavigationToolbar-composer|Styles applied to the composer component|
 |profile|.SCNavigationToolbar-profile|Styles applied to the profile button|
 |notification|.SCNavigationToolbar-notification|Styles applied to the notification button|
 |notificationsMenu|.SCNavigationToolbar-notifications-menu|Styles applied to the notifications menu|
 |messages|.SCNavigationToolbar-messages|Styles applied to the messages button|
 |settings|.SCNavigationToolbar-settings|Styles applied to the settings button|
 |active|.SCNavigationToolbar-active|Styles applied to the active button on navigation|

 *
 * @param inProps
 */
export default function NavigationToolbar(inProps: NavigationToolbarProps) {
  // PROPS
  const props: NavigationToolbarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    value = '',
    className = '',
    disableSearch = false,
    disableComposer = false,
    SearchAutocompleteProps = {},
    startActions = null,
    endActions = null,
    NavigationSettingsIconButtonComponent = NavigationSettingsIconButton,
    NavigationMenuIconButtonComponentProps = {},
    NavigationMenuIconButtonComponent = NavigationMenuIconButton,
    children = null,
    NotificationMenuProps = {},
    ComposerIconButtonProps = {},
    onOpenNotificationMenu,
    onCloseNotificationMenu,
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);
  const privateMessagingEnabled = useMemo(() => scPreferences.features.includes(SCFeatureName.PRIVATE_MESSAGING), [scPreferences.features]);
  const groupsEnabled = useMemo(
    () =>
      scPreferences.preferences &&
      scPreferences.features &&
      scPreferences.features.includes(SCFeatureName.TAGGING) &&
      scPreferences.features.includes(SCFeatureName.GROUPING) &&
      SCPreferences.CONFIGURATIONS_GROUPS_ENABLED in scPreferences.preferences &&
      scPreferences.preferences[SCPreferences.CONFIGURATIONS_GROUPS_ENABLED].value,
    [scPreferences.preferences, scPreferences.features]
  );
  const eventsEnabled = useMemo(
    () =>
      scPreferences.preferences &&
      scPreferences.features &&
      scPreferences.features.includes(SCFeatureName.TAGGING) &&
			scPreferences.features.includes(SCFeatureName.EVENT) &&
      SCPreferences.CONFIGURATIONS_EVENTS_ENABLED in scPreferences.preferences &&
      scPreferences.preferences[SCPreferences.CONFIGURATIONS_EVENTS_ENABLED].value,
    [scPreferences.preferences, scPreferences.features]
  );

  const showComposer = useMemo(() => {
    return (
      !disableComposer &&
      (!scPreferences.preferences[SCPreferences.CONFIGURATIONS_POST_ONLY_STAFF_ENABLED].value || UserUtils.isStaff(scUserContext.user))
    );
  }, [preferences, disableComposer, scUserContext.user]);

  // STATE
  const [anchorNotification, setAnchorNotification] = React.useState(null);

  // HANDLERS
  const handleOpenNotificationMenu = (event) => {
    setAnchorNotification(event.currentTarget);
    onOpenNotificationMenu && onOpenNotificationMenu();
  };

  const handleCloseNotificationMenu = () => {
    setAnchorNotification(null);
    onCloseNotificationMenu && onCloseNotificationMenu();
  };

  // RENDER
  if (scUserContext.loading) {
    return <NavigationToolbarSkeleton />;
  }

  const _children = children || (
    <Box className={classes.navigation}>
      {scUserContext.user && (
        <IconButton
          className={classNames(classes.home, {[classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {}))})}
          aria-label="Home"
          to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})}
          component={Link}>
          <Icon>home</Icon>
        </IconButton>
      )}
      {preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED] &&
        (preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] || scUserContext.user) && (
          <IconButton
            className={classNames(classes.explore, {[classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.EXPLORE_ROUTE_NAME, {}))})}
            aria-label="Explore"
            to={scRoutingContext.url(SCRoutes.EXPLORE_ROUTE_NAME, {})}
            component={Link}>
            <Icon>explore</Icon>
          </IconButton>
        )}
      {groupsEnabled && scUserContext.user && (
        <IconButton
          className={classNames(classes.groups, {
            [classes.active]:
              value.startsWith(scRoutingContext.url(SCRoutes.GROUPS_SUBSCRIBED_ROUTE_NAME, {})) ||
              value.startsWith(scRoutingContext.url(SCRoutes.GROUPS_ROUTE_NAME, {}))
          })}
          aria-label="Groups"
          to={scRoutingContext.url(SCRoutes.GROUPS_SUBSCRIBED_ROUTE_NAME, {})}
          component={Link}>
          <Icon>groups</Icon>
        </IconButton>
      )}
      {eventsEnabled && (scUserContext.user || preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY]) && (
        <IconButton
          className={classNames(classes.events, {
            [classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.EVENTS_ROUTE_NAME, {}))
          })}
          aria-label="Events"
          to={scRoutingContext.url(SCRoutes.EVENTS_ROUTE_NAME, {})}
          component={Link}>
          <Icon>CalendarIcon</Icon>
        </IconButton>
      )}
    </Box>
  );

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      <NavigationMenuIconButtonComponent {...NavigationMenuIconButtonComponentProps} />
      <Link to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})} className={classes.logo}>
        <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO]} alt="logo"></img>
      </Link>
      {!scUserContext.user && !preferences[SCPreferences.ADDONS_CLOSED_COMMUNITY] && (
        <Button color="inherit" component={Link} to={scRoutingContext.url(SCRoutes.SIGNUP_ROUTE_NAME, {})} className={classes.register}>
          <FormattedMessage id="ui.appBar.navigation.register" defaultMessage="ui.appBar.navigation.register" />
        </Button>
      )}
      {preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_ENABLED] && (
        <>
          {preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_TEXT] ? (
            <Tooltip title={preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_TEXT]}>
              <Link target="blank" to={preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_URL]} className={classes.customItem}>
                <img src={preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_IMAGE]} alt="custom_item"></img>
              </Link>
            </Tooltip>
          ) : (
            <Link target="blank" to={preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_URL]} className={classes.customItem}>
              <img src={preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_IMAGE]} alt="custom_item"></img>
            </Link>
          )}
        </>
      )}
      {_children}
      {(preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY] || scUserContext.user) && !disableSearch ? (
        <SearchAutocomplete className={classes.search} blurOnSelect {...SearchAutocompleteProps} />
      ) : (
        <Box className={classes.search} />
      )}
      {startActions}
      {scUserContext.user ? (
        <>
          {showComposer && <ComposerIconButton className={classes.composer} {...ComposerIconButtonProps}></ComposerIconButton>}
          <Tooltip title={scUserContext.user.username}>
            <IconButton
              component={Link}
              to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUserContext.user)}
              aria-label="Profile"
              className={classes.profile}>
              <Avatar alt={scUserContext.user.username} src={scUserContext.user.avatar} />
            </IconButton>
          </Tooltip>
          <>
            <IconButton
              className={classNames(classes.notification, {
                [classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {}))
              })}
              aria-label="Notification"
              onClick={handleOpenNotificationMenu}>
              <Badge
                badgeContent={scUserContext.user.unseen_notification_banners_counter + scUserContext.user.unseen_interactions_counter}
                color="secondary">
                <Icon>notifications_active</Icon>
              </Badge>
            </IconButton>
            {Boolean(anchorNotification) && (
              <NotificationMenu
                className={classes.notificationsMenu}
                id="notification-menu"
                anchorEl={anchorNotification}
                open
                onClose={handleCloseNotificationMenu}
                onClick={handleCloseNotificationMenu}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                {...NotificationMenuProps}
              />
            )}
          </>
          {privateMessagingEnabled && (
            <IconButton
              className={classNames(classes.messages, {
                [classes.active]: value.startsWith(scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {}))
              })}
              aria-label="Messages"
              to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}
              component={Link}>
              <Badge badgeContent={0} color="secondary">
                <Icon>email</Icon>
              </Badge>
            </IconButton>
          )}
          {endActions}
          <NavigationSettingsIconButtonComponent className={classes.settings} />
        </>
      ) : (
        <>
          {endActions}
          <Button color="inherit" component={Link} to={scRoutingContext.url(SCRoutes.SIGNIN_ROUTE_NAME, {})}>
            <FormattedMessage id="ui.appBar.navigation.login" defaultMessage="ui.appBar.navigation.login" />
          </Button>
        </>
      )}
    </Root>
  );
}
