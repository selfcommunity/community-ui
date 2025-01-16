import {Badge, BottomNavigationAction, Button, IconButton, styled, Toolbar, ToolbarProps} from '@mui/material';
import React, {useCallback, useMemo, useState} from 'react';
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
import Icon from '@mui/material/Icon';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import NavigationToolbarMobileSkeleton from './Skeleton';
import {FormattedMessage} from 'react-intl';
import {SearchAutocompleteProps} from '../SearchAutocomplete';
import SearchDialog from '../SearchDialog';
import NavigationSettingsIconButton, {NavigationSettingsIconButtonProps} from '../NavigationSettingsIconButton';
import NavigationMenuIconButton, {NavigationMenuIconButtonProps} from '../NavigationMenuIconButton';
import {PREFIX} from './constants';
import {SCFeatureName} from '@selfcommunity/types';
import ComposerIconButton, {ComposerIconButtonProps} from '../ComposerIconButton';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  logoFlex: `${PREFIX}-logo-flex`,
  customItem: `${PREFIX}-custom-item`,
  search: `${PREFIX}-search`,
  searchDialog: `${PREFIX}-search-dialog`,
  notifications: `${PREFIX}-notifications`,
  settings: `${PREFIX}-settings`,
  settingsDialog: `${PREFIX}-settings-dialog`,
  login: `${PREFIX}-login`
};

const Root = styled(Toolbar, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface NavigationToolbarMobileProps extends ToolbarProps {
  /**
   * Disable search action if possible
   */
  disableSearch?: boolean;
  /**
   * Preserve the same as the desktop version
   */
  preserveDesktopLogo?: boolean;
  /**
   * Props spread to SearchAutocomplete component
   */
  SearchAutocompleteProps?: SearchAutocompleteProps;
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
   * Component for Navigation Settings
   */
  NavigationSettingsIconButtonComponent?: (inProps: NavigationSettingsIconButtonProps) => JSX.Element;
  /**
   * Props to spread to the ComposerIconButton
   * @default {}
   */
  ComposerIconButtonProps?: ComposerIconButtonProps;
}

/**
 * > API documentation for the Community-JS Navigation Toolbar Mobile component. Learn about the available props and the CSS API.
 *
 *
 * This component renders the mobile application header.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/NavigationToolbarMobile)

 #### Import

 ```jsx
 import {NavigationToolbarMobile} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationToolbarMobile` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationToolbarMobile-root|Styles applied to the root element.|
 |logo|.SCNavigationToolbarMobile-logo|Styles applied to the logo element.|
 |search|.SCNavigationToolbarMobile-search|Styles applied to the search button element|
 |searchDialog|.SCNavigationToolbarMobile-search-dialog|Styles applied to the search dialog element|
 |notifications|.SCNavigationToolbarMobile-notifications|Styles applied to the notifications button element|
 |settings|.SCNavigationToolbarMobile-settings|Styles applied to the settings button element|
 |settingsDialog|.SCNavigationToolbarMobile-settingsDialog|Styles applied to the settings dialog elements|
 |login|.SCNavigationToolbarMobile-login|Styles applied to the login element.|
 *
 * @param inProps
 */
export default function NavigationToolbarMobile(inProps: NavigationToolbarMobileProps) {
  // PROPS
  const props: NavigationToolbarMobileProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = '',
    disableSearch = false,
    preserveDesktopLogo = false,
    SearchAutocompleteProps = {},
    children = null,
    startActions = null,
    endActions = null,
    NavigationMenuIconButtonComponent = NavigationMenuIconButton,
    NavigationSettingsIconButtonComponent = NavigationSettingsIconButton,
    ComposerIconButtonProps = {},
    ...rest
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  // STATE
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // MEMO
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

  // HANDLERS
  const handleOpenSearch = useCallback(() => {
    setSearchOpen(true);
  }, []);
  const handleCloseSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  // RENDER
  if (scUserContext.loading) {
    return <NavigationToolbarMobileSkeleton />;
  }

  const _children = children || (
    <>
      <NavigationMenuIconButtonComponent />
      <Link
        to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})}
        className={classNames(className, classes.logo, {
          [classes.logoFlex]: preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_URL].value
        })}>
        {!preserveDesktopLogo ? (
          <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO_MOBILE].value} alt="logo" />
        ) : (
          <img src={preferences[SCPreferences.LOGO_NAVBAR_LOGO].value} alt="logo" />
        )}
      </Link>
      {preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_ENABLED].value && (
        <Link target="blank" to={preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_URL].value} className={classes.customItem}>
          <img src={preferences[SCPreferences.CONFIGURATIONS_CUSTOM_NAVBAR_ITEM_IMAGE].value} alt="custom_item"></img>
        </Link>
      )}
    </>
  );

  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {_children}
      {startActions}
      {(contentAvailable || scUserContext.user) && !disableSearch && (
        <>
          <IconButton className={classes.search} onClick={handleOpenSearch}>
            <Icon>search</Icon>
          </IconButton>
          <SearchDialog
            className={classes.searchDialog}
            fullScreen
            open={searchOpen}
            SearchAutocompleteProps={{...SearchAutocompleteProps, onClear: handleCloseSearch}}></SearchDialog>
        </>
      )}
      {endActions}
      {(!postOnlyStaffEnabled || (UserUtils.isStaff(scUserContext.user) && postOnlyStaffEnabled)) &&
        (scUserContext.user || contentAvailable) &&
        exploreStreamEnabled && <ComposerIconButton {...ComposerIconButtonProps} />}
      {scUserContext.user && (groupsEnabled || eventsEnabled) && (
        <IconButton className={classes.notifications} component={Link} to={scRoutingContext.url(SCRoutes.USER_NOTIFICATIONS_ROUTE_NAME, {})}>
          <Badge
            badgeContent={scUserContext.user.unseen_notification_banners_counter + scUserContext.user.unseen_interactions_counter}
            color="secondary">
            <Icon>notifications_active</Icon>
          </Badge>
        </IconButton>
      )}
      {scUserContext.user ? (
        <NavigationSettingsIconButtonComponent className={classes.settings}></NavigationSettingsIconButtonComponent>
      ) : (
        <Button className={classes.login} color="inherit" component={Link} to={scRoutingContext.url(SCRoutes.SIGNIN_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.appBar.navigation.login" defaultMessage="ui.appBar.navigation.login" />
        </Button>
      )}
    </Root>
  );
}
