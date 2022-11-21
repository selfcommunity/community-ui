import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget from '../Widget';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef
} from '@selfcommunity/react-core';
import {actionToolsTypes, dataToolsReducer, stateToolsInitializer} from '../../utils/tools';
import Skeleton from './Skeleton';
import User, {UserProps} from '../User';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';

const messages = defineMessages({
  title: {
    id: 'ui.userFollowers.title',
    defaultMessage: 'ui.userFollowers.title'
  },
  noFollowers: {
    id: 'ui.userFollowers.subtitle.noResults',
    defaultMessage: 'ui.userFollowers.subtitle.noResults'
  }
});

const PREFIX = 'SCUsersFollowed';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  followersItem: `${PREFIX}-followers-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.followersItem}`]: {
    marginBottom: theme.spacing()
  }
}));

export interface UserFollowersProps extends VirtualScrollerItemProps {
  /**
   * The user id
   * @default null
   */
  userId: number;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to single user object
   * @default empty object
   */
  UserProps?: UserProps;
  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;
}

/**
 * > API documentation for the Community-JS User Followers component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFollowers} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserFollowers` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFollowers-root|Styles applied to the root element.|
 |title|.SCUserFollowers-title|Styles applied to the title element.|
 |noResults|.SCUserFollowers-no-results|Styles applied to no results section.|
 |followersItem|.SCUserFollowers-followers-item|Styles applied to follower item element.|
 |showMore|.SCUserFollowers-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function UserFollowers(inProps: UserFollowersProps): JSX.Element {
  // CONST
  const limit = 3;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  // PROPS
  const props: UserFollowersProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {userId, autoHide, className, UserProps = {}, cacheStrategy = CacheStrategies.NETWORK_ONLY, onHeightChange, onStateChange} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, dispatch] = useReducer(
    dataToolsReducer,
    {
      isLoadingNext: true,
      next: `${Endpoints.UserFollowers.url({id: userId})}?limit=10`,
      cacheKey: SCCache.getToolsStateCacheKey(SCCache.USER_FOLLOWERS_TOOLS_STATE_CACHE_PREFIX_KEY, userId),
      cacheStrategy
    },
    stateToolsInitializer
  );
  const [openUserFollowersDialog, setOpenUserFollowersDialog] = useState<boolean>(false);

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Fetches the list of users followers
   */
  const fetchFollowers = useMemo(
    () => (ignore) => {
      return http
        .request({
          url: state.next,
          method: Endpoints.UserFollowers.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status < 300 && isMountedRef.current && !ignore) {
            const data = res.data;
            dispatch({
              type: actionToolsTypes.LOAD_NEXT_SUCCESS,
              payload: {
                results: data.results,
                count: data.count,
                next: data.next
              }
            });
          }
        })
        .catch((error) => {
          dispatch({type: actionToolsTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    },
    [dispatch, state.next, state.isLoadingNext]
  );

  useEffect(() => {
    if (!userId) {
      return;
    } else if (!contentAvailability && !authUserId) {
      return;
    } else if (cacheStrategy === CacheStrategies.NETWORK_ONLY) {
      onStateChange && onStateChange({cacheStrategy: CacheStrategies.CACHE_FIRST});
    }
  }, [authUserId]);
  /**
   * On mount, fetches the list of users followers
   */
  useEffect(() => {
    let ignore = false;
    if (state.isLoadingNext) {
      fetchFollowers(ignore);
      return () => {
        ignore = true;
      };
    }
  }, [state.isLoadingNext]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [state.results.length]);

  /**
   * Handles followers counter update on follow/unfollow action.
   * @param user
   */
  function handleFollowersUpdate(user) {
    const newUsers = [...state.results];
    const index = newUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      if (user.connection_status === 'followed') {
        newUsers[index].followers_counter = user.followers_counter - 1;
        newUsers[index].connection_status = null;
      } else {
        newUsers[index].followers_counter = user.followers_counter + 1;
        newUsers[index].connection_status = 'followed';
      }
      dispatch({
        type: actionToolsTypes.SET_RESULTS,
        payload: {results: newUsers}
      });
    }
  }

  /**
   * Renders the list of users followers
   */
  if (state.isLoadingNext) {
    return <Skeleton />;
  }
  const u = (
    <CardContent>
      <Typography className={classes.title} variant="h5">{`${intl.formatMessage(messages.title, {total: state.count})}`}</Typography>
      {!state.count ? (
        <Typography className={classes.noResults} variant="body2">{`${intl.formatMessage(messages.noFollowers)}`}</Typography>
      ) : (
        <React.Fragment>
          <List>
            {state.results.slice(0, limit).map((user: SCUserType) => (
              <ListItem key={user.id}>
                <User
                  elevation={0}
                  user={user}
                  className={classes.followersItem}
                  {...(followEnabled
                    ? {followConnectUserButtonProps: {onFollow: handleFollowersUpdate}}
                    : {followConnectUserButtonProps: {onChangeConnectionStatus: handleFollowersUpdate}})}
                  {...UserProps}
                />
              </ListItem>
            ))}
          </List>
          {limit < state.count && (
            <Button size="small" className={classes.showMore} onClick={() => setOpenUserFollowersDialog(true)}>
              <FormattedMessage id="ui.userFollowers.button.showAll" defaultMessage="ui.userFollowers.button.showAll" />
            </Button>
          )}
          {openUserFollowersDialog && (
            <BaseDialog
              title={
                isMobile ? (
                  <FormattedMessage id="ui.userFollowers.modal.title" defaultMessage="ui.userFollowers.modal.title" />
                ) : (
                  `${intl.formatMessage(messages.title, {total: state.count})}`
                )
              }
              onClose={() => setOpenUserFollowersDialog(false)}
              open={openUserFollowersDialog}>
              {state.isLoadingNext ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={state.results.length}
                  next={() => fetchFollowers(false)}
                  hasMoreNext={Boolean(state.next)}
                  loaderNext={<CentralProgress size={30} />}
                  height={isMobile ? '100vh' : 400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.userFollowers.noMoreResults" defaultMessage="ui.userFollowers.noMoreResults" />
                      </b>
                    </p>
                  }>
                  <List>
                    {state.results.map((f) => (
                      <ListItem key={f.id}>
                        <User
                          elevation={0}
                          user={f}
                          className={classes.followersItem}
                          {...(followEnabled
                            ? {followConnectUserButtonProps: {onFollow: handleFollowersUpdate}}
                            : {followConnectUserButtonProps: {onChangeConnectionStatus: handleFollowersUpdate}})}
                          {...UserProps}
                        />
                      </ListItem>
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
        </React.Fragment>
      )}
    </CardContent>
  );

  /**
   * if there are no results and autoHide prop is set to true ,component is hidden
   */
  if (autoHide && !state.count) {
    return <HiddenPlaceholder />;
  }
  /**
   * If content availability community option is false and user is anonymous , component is hidden.
   */
  if (!contentAvailability && !authUserId) {
    return <HiddenPlaceholder />;
  }
  /**
   * If there's no userId, component is hidden.
   */
  if (!userId) {
    return <HiddenPlaceholder />;
  }
  /**
   * Renders root object
   */
  return <Root className={classNames(classes.root, className)}>{u}</Root>;
}
