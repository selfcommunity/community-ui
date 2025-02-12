import {
  Badge,
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  BottomNavigationProps as MuiBottomNavigationProps,
  Icon,
  styled
} from '@mui/material';
import React, {useMemo} from 'react';
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
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {SCFeatureName} from '@selfcommunity/types';
import {iOS} from '@selfcommunity/utils';
import ComposerIconButton from '../ComposerIconButton';

const PREFIX = 'SCBottomNavigation';

const classes = {
  root: `${PREFIX}-root`,
  ios: `${PREFIX}-ios`,
  action: `${PREFIX}-action`,
  composer: `${PREFIX}-composer`
};

const Root = styled(MuiBottomNavigation, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export type BottomNavigationProps = MuiBottomNavigationProps;

/**
 * > API documentation for the Community-JS Bottom Navigation component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the bottom navigation bar when browsing from mobile.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/BottomNavigation)

 #### Import

 ```jsx
 import {BottomNavigation} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCBottomNavigation` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBottomNavigation-root|Styles applied to the root element.|
 |action|.SCBottomNavigation-action|Styles applied to the action.|
 *
 * @param inProps
 */
export default function BottomNavigation(inProps: BottomNavigationProps) {
  // PROPS
  const props: BottomNavigationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, children = null, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  // MEMO
  const privateMessagingEnabled = useMemo(() => features.includes(SCFeatureName.PRIVATE_MESSAGING), [features]);
  const groupsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      features.includes(SCFeatureName.GROUPING) &&
      SCPreferences.CONFIGURATIONS_GROUPS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_GROUPS_ENABLED].value,
    [preferences, features]
  );
  const eventsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.TAGGING) &&
      features.includes(SCFeatureName.EVENT) &&
      SCPreferences.CONFIGURATIONS_EVENTS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_EVENTS_ENABLED].value,
    [preferences, features]
  );
  const exploreStreamEnabled = preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED].value;
  const postOnlyStaffEnabled = preferences[SCPreferences.CONFIGURATIONS_POST_ONLY_STAFF_ENABLED].value;
  const contentAvailable = preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;
  const isIOS = useMemo(() => iOS(), []);

  // RENDER
  return (
    <Root className={classNames(className, classes.root, {[classes.ios]: isIOS})} {...rest}>
      {children
        ? children
        : [
            <BottomNavigationAction
              key="home"
              className={classes.action}
              component={Link}
              to={scUserContext.user ? scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {}) : '/'}
              value={scUserContext.user ? scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {}) : '/'}
              icon={<Icon>home</Icon>}
            />,
            (scUserContext.user || contentAvailable) && exploreStreamEnabled ? (
              <BottomNavigationAction
                key="explore"
                className={classes.action}
                component={Link}
                to={scRoutingContext.url(SCRoutes.EXPLORE_ROUTE_NAME, {})}
                value={scRoutingContext.url(SCRoutes.EXPLORE_ROUTE_NAME, {})}
                icon={<Icon>explore</Icon>}
              />
            ) : null,
            (!postOnlyStaffEnabled || (UserUtils.isStaff(scUserContext.user) && postOnlyStaffEnabled)) &&
            ((groupsEnabled && !eventsEnabled) || (!groupsEnabled && eventsEnabled)) &&
            !exploreStreamEnabled ? (
              <BottomNavigationAction
                key="composer"
                className={classNames(classes.composer, classes.action)}
                component={ComposerIconButton}
                disableRipple
              />
            ) : null,
            groupsEnabled && scUserContext.user ? (
              <BottomNavigationAction
                key="groups"
                className={classes.action}
                component={Link}
                to={scRoutingContext.url(SCRoutes.GROUPS_SUBSCRIBED_ROUTE_NAME, {})}
                value={scRoutingContext.url(SCRoutes.GROUPS_SUBSCRIBED_ROUTE_NAME, {})}
                icon={<Icon>groups</Icon>}
              />
            ) : null,
            (!postOnlyStaffEnabled || (UserUtils.isStaff(scUserContext.user) && postOnlyStaffEnabled)) &&
            groupsEnabled &&
            eventsEnabled &&
            !exploreStreamEnabled ? (
              <BottomNavigationAction
                key="composer"
                className={classNames(classes.composer, classes.action)}
                component={ComposerIconButton}
                disableRipple
              />
            ) : null,
            eventsEnabled ? (
              <BottomNavigationAction
                key="events"
                className={classes.action}
                component={Link}
                to={scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, {})}
                value={scRoutingContext.url(SCRoutes.EVENTS_ROUTE_NAME, {})}
                icon={<Icon>CalendarIcon</Icon>}
              />
            ) : null,
            scUserContext.user && !groupsEnabled && !eventsEnabled ? (
              <BottomNavigationAction
                key="notifications"
                className={classes.action}
                component={Link}
                to={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})}
                value={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})}
                icon={
                  <Badge
                    badgeContent={scUserContext.user.unseen_notification_banners_counter + scUserContext.user.unseen_interactions_counter}
                    color="secondary">
                    <Icon>notifications_active</Icon>
                  </Badge>
                }
              />
            ) : null,
            privateMessagingEnabled && scUserContext.user ? (
              <BottomNavigationAction
                key="messages"
                className={classes.action}
                component={Link}
                to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}
                value={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, {})}
                icon={
                  <Badge badgeContent={0} color="secondary">
                    <Icon>email</Icon>
                  </Badge>
                }
              />
            ) : null
          ]}
    </Root>
  );
}
