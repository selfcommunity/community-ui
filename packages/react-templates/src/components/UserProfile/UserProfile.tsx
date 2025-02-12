import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Icon, Stack, Typography} from '@mui/material';
import {
  ConnectionUserButton,
  FeedObjectProps,
  FeedSidebarProps,
  LoyaltyProgramWidget,
  SCFeedWidgetType,
  TagChip,
  UserActionIconButton,
  UserConnectionsRequestsSentWidget,
  UserConnectionsRequestsWidget,
  UserConnectionsWidget,
  UserCounters,
  UserFollowedCategoriesWidget,
  UserFollowedUsersWidget,
  UserFollowersWidget,
  UserLiveStreamWidget,
  UserProfileBlocked,
  UserProfileHeader,
  UserProfileHeaderProps,
  UserSubscribedGroupsWidget
} from '@selfcommunity/react-ui';
import UserFeed, {UserFeedProps} from '../UserFeed';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCFetchUser,
  useSCPreferences,
  useSCRouting,
  useSCUser,
  useSCFetchUserBlockedBy
} from '@selfcommunity/react-core';
import {SCFeatureName, SCUserType} from '@selfcommunity/types';
import UserProfileSkeleton from './Skeleton';
import classNames from 'classnames';
import {FormattedMessage, useIntl} from 'react-intl';
import {useThemeProps} from '@mui/system';
import UserFeedSkeleton from '../UserFeed/Skeleton';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  counters: `${PREFIX}-counters`,
  tags: `${PREFIX}-tags`,
  info: `${PREFIX}-info`,
  feed: `${PREFIX}-feed`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface UserProfileProps {
  /**
   * Id of the user profile
   * @default 'user'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * Id of the user for filter the feed
   * @default null
   */
  userId?: number | string;

  /**
   * Actions to be inserted before default user profile actions
   */
  startActions?: React.ReactNode | null;

  /**
   * Actions to be inserted after default user profile actions
   */
  endActions?: React.ReactNode | null;

  /**
   * Actions to be inserted before default user profile actions if is not my profile (view mode)
   */
  viewStartActions?: React.ReactNode | null;

  /**
   * Actions to be inserted after default user profile actions if is not  my profile (view mode)
   */
  viewEndActions?: React.ReactNode | null;

  /**
   * Actions to be inserted before default user profile actions if it is my profile (edit mode)
   */
  editStartActions?: React.ReactNode | null;

  /**
   * Actions to be inserted after default user profile actions if it is my profile (edit mode)
   */
  editEndActions?: React.ReactNode | null;

  /**
   * Widgets to be rendered into the feed
   * @default [UserFollowedCategoriesWidget, UserFollowedUsersWidget]
   */
  widgets?: SCFeedWidgetType[] | null;

  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;

  /**
   * Props to spread to single feed object
   * @default {top: 0, bottomBoundary: `#${id}`}
   */
  FeedSidebarProps?: FeedSidebarProps;

  /**
   * Props to spread to UserTagStack component
   * @default {}
   */
  UserProfileHeaderProps?: UserProfileHeaderProps;

  /**
   * Click handler for edit button
   * @default null
   */
  onEditClick?: (user: SCUserType) => void;

  /**
   * Props to spread to feed component
   * @default {}
   */
  UserFeedProps?: UserFeedProps;
}

const WIDGETS_FOLLOWERS = [
  {
    type: 'widget',
    component: UserLiveStreamWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UserFollowedCategoriesWidget,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: UserFollowedUsersWidget,
    componentProps: {},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: UserFollowersWidget,
    componentProps: {},
    column: 'right',
    position: 3
  },
  {
    type: 'widget',
    component: UserSubscribedGroupsWidget,
    componentProps: {},
    column: 'right',
    position: 4
  }
];

const WIDGETS_FOLLOWERS_MY_PROFILE = [
  {
    type: 'widget',
    component: LoyaltyProgramWidget,
    componentProps: {},
    column: 'right',
    position: -1
  }
];

const WIDGETS_CONNECTIONS = [
  {
    type: 'widget',
    component: UserLiveStreamWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UserFollowedCategoriesWidget,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: UserConnectionsWidget,
    componentProps: {},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: UserSubscribedGroupsWidget,
    componentProps: {},
    column: 'right',
    position: 3
  }
];

const WIDGETS_CONNECTIONS_MY_PROFILE = [
  {
    type: 'widget',
    component: LoyaltyProgramWidget,
    componentProps: {},
    column: 'right',
    position: -1
  },
  {
    type: 'widget',
    component: UserConnectionsRequestsWidget,
    componentProps: {autoHide: true},
    column: 'right',
    position: 2
  },
  {
    type: 'widget',
    component: UserConnectionsRequestsSentWidget,
    componentProps: {autoHide: true},
    column: 'right',
    position: 3
  }
];

/**
 * > API documentation for the Community-JS User Profile Template. Learn about the available props and the CSS API.
 *
 *
 * This component renders a specific user's profile template.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-templates/Components/UserProfile)

 #### Import

 ```jsx
 import {UserProfile} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUserProfileTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileTemplate-root|Styles applied to the root element.|
 |counters|.SCUserProfileTemplate-counters|Styles applied to the counters section.|
 |tags|.SCUserProfileTemplate-tags|Styles applied to the tags section.|
 |info|.SCUserProfileTemplate-info|Styles applied to the info section.|
 |feed|.SCUserProfileTemplate-feed|Styles applied to the feed section.|
 |actions|.SCUserProfileTemplate-actions|Styles applied to the actions section.|
 *
 * @param inProps
 */
export default function UserProfile(inProps: UserProfileProps): JSX.Element {
  // PROPS
  const props: UserProfileProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = 'user_profile',
    className,
    user,
    userId,
    startActions = null,
    endActions = null,
    viewStartActions = null,
    viewEndActions = null,
    editStartActions = null,
    editEndActions = null,
    widgets = null,
    FeedObjectProps,
    FeedSidebarProps,
    UserProfileHeaderProps = {},
    onEditClick = null,
    UserFeedProps = {}
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {features}: SCPreferencesContextType = useSCPreferences();

  // STATE
  const [isConnection, setIsConnection] = useState(undefined);

  // HOOKS
  const {scUser} = useSCFetchUser({id: userId, user});
  const {blockedBy, loading: loadingBlockedBy} = useSCFetchUserBlockedBy({user: scUser});
  const intl = useIntl();

  // MEMO
  const taggingEnabled = useMemo(() => features.includes(SCFeatureName.TAGGING), [features]);
  const isMe = useMemo(() => scUserContext.user && scUser?.id === scUserContext.user.id, [scUserContext.user, scUser]);
  const followEnabled = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value,
    [scPreferencesContext.preferences]
  );
  const privateMessagingEnabled = useMemo(() => features.includes(SCFeatureName.PRIVATE_MESSAGING), [features]);

  const _widgets = useMemo(() => {
    if (widgets !== null) {
      return widgets;
    }
    if (!scUser) {
      return [];
    }
    let _widgets = [];
    if (followEnabled && scUserContext?.user?.id === scUser.id) {
      _widgets = [...WIDGETS_FOLLOWERS, ...WIDGETS_FOLLOWERS_MY_PROFILE];
    } else if (followEnabled) {
      _widgets = [...WIDGETS_FOLLOWERS];
    } else if (!followEnabled && scUserContext?.user?.id === scUser.id) {
      _widgets = [...WIDGETS_CONNECTIONS, ...WIDGETS_CONNECTIONS_MY_PROFILE];
    } else {
      _widgets = [...WIDGETS_CONNECTIONS];
    }
    return _widgets.map((w) => ({...w, componentProps: {...w.componentProps, userId: scUser.id}}));
  }, [widgets, followEnabled, scUserContext?.user, scUser]);

  /**
   * Check if the authenticated user is connected (follow/friend) to the profile user
   */
  useEffect(() => {
    if (user && Object.is(isConnection ?? null, null)) {
      if (isMe) {
        setIsConnection(false);
      } else if (followEnabled && scUserContext.managers.followers.isFollower) {
        setIsConnection(scUserContext.managers.followers.isFollower(user));
      } else if (!followEnabled && scUserContext.managers.connections.status) {
        setIsConnection(scUserContext.managers.connections.status(user) === 'connected');
      }
    }
  }, [isConnection, scUserContext.managers.followers, scUserContext.managers.connections, followEnabled, isMe, user, scUserContext.user]);

  if (!scUser) {
    return <UserProfileSkeleton />;
  }

  // HANDLERS
  const handleEdit = (): void => {
    onEditClick && onEditClick(scUser);
  };

  // RENDER
  if (!isMe) {
    UserFeedProps.FeedProps = {HeaderComponent: null, ...UserFeedProps.FeedProps};
  }

  let actionItems = [];
  if (privateMessagingEnabled && !isMe && user && user.can_send_pm_to) {
    actionItems = [
      {
        label: <FormattedMessage defaultMessage="templates.userProfile.send.pm" id="templates.userProfile.send.pm" />,
        to: scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, scUser)
      }
    ];
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <UserProfileHeader
        user={scUser}
        {...UserProfileHeaderProps}
        actions={
          !isMe && scUser && Boolean((scUserContext.user && scUserContext.managers.blockedUsers.isBlocked(scUser)) || blockedBy) ? null : (
            <Stack key={`actions_${scUser.id}`} direction="row" spacing={2} className={classes.actions}>
              {startActions}
              {isMe ? editStartActions : viewStartActions}
              {isMe ? (
                <Button variant="contained" color="secondary" onClick={handleEdit}>
                  <FormattedMessage defaultMessage="templates.userProfile.edit" id="templates.userProfile.edit" />
                </Button>
              ) : (
                <ConnectionUserButton user={scUser} />
              )}
              {isMe ? editEndActions : viewEndActions}
              {endActions}
              <UserActionIconButton user={scUser} items={actionItems} />
            </Stack>
          )
        }
      />
      {scUserContext.user === undefined ||
      (scUserContext.user && ((loadingBlockedBy && blockedBy === null) || scUserContext.managers.blockedUsers.isLoading())) ? (
        <UserFeedSkeleton />
      ) : (
        <>
          {loadingBlockedBy || (scUserContext.user && scUserContext.managers.blockedUsers.loading) ? null : (
            <>
              {!isMe && scUser && Boolean((scUserContext.user && scUserContext.managers.blockedUsers.isBlocked(scUser)) || blockedBy) ? (
                <UserProfileBlocked user={scUser} blockedByUser={blockedBy} />
              ) : (
                <>
                  <UserCounters className={classes.counters} userId={userId as number} user={scUser} />
                  {scUser.date_joined && (
                    <Typography className={classes.info}>
                      <FormattedMessage
                        id="templates.userProfile.dateJoined"
                        defaultMessage="templates.userProfile.dateJoined"
                        values={{
                          date: intl.formatDate(scUser.date_joined, {
                            year: 'numeric',
                            month: 'long'
                          })
                        }}
                      />
                    </Typography>
                  )}
                  {scUser.location && (
                    <Typography className={classes.info}>
                      <Icon>add_location_alt</Icon> {scUser.location}
                    </Typography>
                  )}
                  {taggingEnabled && (
                    <Stack key={`tags_${scUser.id}`} direction="row" spacing={2} className={classes.tags}>
                      {scUser.tags
                        .filter((t) => t.visible)
                        .map((tag) => (
                          <TagChip key={tag.id} tag={tag} clickable={false} disposable={false} />
                        ))}
                    </Stack>
                  )}
                  <UserFeed
                    key={`feed_${scUser.id}`}
                    className={classes.feed}
                    user={scUser}
                    widgets={_widgets}
                    FeedObjectProps={FeedObjectProps}
                    FeedSidebarProps={FeedSidebarProps}
                    {...UserFeedProps}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </Root>
  );
}
