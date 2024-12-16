import {Button, CardActions, CardContent, Divider, List, ListItem, Stack, Typography, useThemeProps} from '@mui/material';
import {styled} from '@mui/system';
import {Endpoints, http, SCPaginatedResponse, UserApiClient} from '@selfcommunity/api-services';
import {
  SCCache,
  SCPreferences,
  SCPreferencesContextType,
  SCUserContextType,
  useSCFetchUser,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {SCCommunitySubscriptionTier, SCEventType, SCLiveStreamType, SCUserType} from '@selfcommunity/types';
import {CacheStrategies, isInteger, Logger} from '@selfcommunity/utils';
import {AxiosResponse} from 'axios';
import {Fragment, useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import 'swiper/css';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import Skeleton from './Skeleton';
import LiveStream, {LiveStreamProps, LiveStreamSkeleton} from '../LiveStream';

const messages = defineMessages({
  title: {
    id: 'ui.userLiveStreamWidget.title',
    defaultMessage: 'ui.userLiveStreamWidget.title'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  avatarWrapper: `${PREFIX}-avatar-wrapper`,
  avatar: `${PREFIX}-avatar`,
  liveWrapper: `${PREFIX}-live-wrapper`,
  live: `${PREFIX}-live`,
  actions: `${PREFIX}-actions`,
  actionButton: `${PREFIX}-action-button`,
  dialogRoot: `${PREFIX}-dialog-root`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot
})(() => ({}));

export interface UserLiveStreamWidgetProps extends WidgetProps {
  /**
   * The user id
   * @default null
   */
  userId: number;
  /**
   * User Object
   * @default null
   */
  user?: SCUserType;
  /**
   * Props to spread to single live stream object
   * @default {}
   */
  liveStreamComponentProps?: LiveStreamProps;

  /**
   * API Query Params
   * @default [{'limit': 20, 'offset': 0}]
   */
  endpointQueryParams?: Record<string, string | number>;

  /**
   * Caching strategies
   * @default CacheStrategies.CACHE_FIRST
   */
  cacheStrategy?: CacheStrategies;

  /**
   * Props to spread to users suggestion dialog
   * @default {}
   */
  dialogProps?: BaseDialogProps;

  /**
   * Limit param
   */
  limit?: number;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function UserLiveStreamWidget(inProps: UserLiveStreamWidgetProps) {
  // PROPS
  const props: UserLiveStreamWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    userId,
    user,
    liveStreamComponentProps = {elevation: 0, square: true},
    endpointQueryParams = {limit: 5, offset: DEFAULT_PAGINATION_OFFSET},
    cacheStrategy,
    dialogProps,
    limit = 5,
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_LIVE_STREAM_CACHE_PREFIX_KEY, isInteger(userId) ? userId : user.id),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const {scUser} = useSCFetchUser({id: userId, user});

  // HOOKS
  const intl = useIntl();

  // MEMO
  const liveStreamEnabled = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_LIVE_STREAM_ENABLED].value,
    [scPreferencesContext.preferences]
  );
  const isFreeTrialTier = useMemo(
    () =>
      scPreferencesContext.preferences &&
      SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value === SCCommunitySubscriptionTier.FREE_TRIAL,
    [scPreferencesContext.preferences]
  );

  const _initComponent = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      UserApiClient.getUserLiveStream(scUser.id, endpointQueryParams)
        .then((payload: SCPaginatedResponse<SCLiveStreamType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [scUser, state.isLoadingNext, state.initialized, dispatch]);

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;

    if (scUserContext.user && scUser && liveStreamEnabled) {
      _t = setTimeout(_initComponent);

      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, scUser, liveStreamEnabled]);

  // HANDLERS
  /**
   * Handles pagination
   */
  const handleNext = useCallback(() => {
    dispatch({type: actionWidgetTypes.LOADING_NEXT});
    http
      .request({
        url: state.next,
        method: Endpoints.GetLiveStream.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCEventType>>) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
      });
  }, [dispatch, state.next, state.isLoadingNext, state.initialized]);

  const handleToggleDialogOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  if (!scUser && !state.initialized) {
    return <Skeleton />;
  }

  if (!scUser || state?.count === 0 || !liveStreamEnabled || isFreeTrialTier) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classes.root} {...rest}>
      <CardContent className={classes.content}>
        <Typography className={classes.title} variant="h5">
          {intl.formatMessage(messages.title, {user: scUser.username})}
        </Typography>
        <Stack className={classes.liveWrapper}>
          {state?.results.map((_live, i: number, array) => (
            <Fragment key={i}>
              <LiveStream liveStream={_live} {...liveStreamComponentProps} className={classes.live} />
              {i < array.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Stack>
      </CardContent>

      {state.count > state.visibleItems && (
        <CardActions className={classes.actions}>
          <Button onClick={handleToggleDialogOpen} className={classes.actionButton}>
            <Typography variant="caption">
              <FormattedMessage id="ui.userLiveStreamWidget.showAll" defaultMessage="ui.userLiveStreamWidget.showAll" />
            </Typography>
          </Button>
        </CardActions>
      )}

      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={intl.formatMessage(messages.title, {user: scUser.username})}
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...dialogProps}>
          <InfiniteScroll
            dataLength={state.results.length}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<LiveStreamSkeleton elevation={0} {...liveStreamComponentProps} />}
            className={classes.infiniteScroll}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.userLiveStreamWidget.noMoreResults" defaultMessage="ui.userLiveStreamWidget.noMoreResults" />
              </Typography>
            }>
            <List>
              {state.results.map((live: SCLiveStreamType) => (
                <ListItem key={live.id}>
                  <LiveStream elevation={0} liveStream={live} {...liveStreamComponentProps} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </Root>
  );
}
