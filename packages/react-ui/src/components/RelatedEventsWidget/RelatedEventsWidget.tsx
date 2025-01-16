import {Avatar, Button, CardActions, CardContent, Divider, List, ListItem, Stack, Typography, useThemeProps} from '@mui/material';
import {styled} from '@mui/system';
import {Endpoints, EventService, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {Link, SCCache, SCRoutes, SCRoutingContextType, SCUserContextType, useSCFetchEvent, useSCRouting, useSCUser} from '@selfcommunity/react-core';
import {SCEventType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {AxiosResponse} from 'axios';
import {Fragment, useCallback, useEffect, useReducer, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import 'swiper/css';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import Event, {EventProps, EventSkeleton} from '../Event';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import Skeleton from './Skeleton';

const messages = defineMessages({
  title: {
    id: 'ui.relatedEventsWidget.title',
    defaultMessage: 'ui.relatedEventsWidget.title'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  avatarWrapper: `${PREFIX}-avatar-wrapper`,
  avatar: `${PREFIX}-avatar`,
  eventWrapper: `${PREFIX}-event-wrapper`,
  event: `${PREFIX}-event`,
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

export interface RelatedEventsWidgetProps extends WidgetProps {
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of event object
   * @default null
   */
  eventId?: number;

  /**
   * Props to spread to single event object
   * @default {}
   */
  eventComponentProps?: EventProps;

  /**
   * Feed API Query Params
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

  limit?: number;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function RelatedEventsWidget(inProps: RelatedEventsWidgetProps) {
  // PROPS
  const props: RelatedEventsWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {
    event,
    eventId,
    eventComponentProps = {elevation: 0, square: true},
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
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.USER_OTHER_EVENTS_STATE_CACHE_PREFIX_KEY, eventId || event.id),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();
  const {scEvent} = useSCFetchEvent({id: eventId, event});

  const _initComponent = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      EventService.getEventRelated(scEvent.id, {created_by: scEvent.managed_by.id, ...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCEventType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.isLoadingNext, state.initialized, dispatch, scEvent]);

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;

    if (scUserContext.user && scEvent) {
      _t = setTimeout(_initComponent);

      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, scEvent]);

  // HANDLERS
  /**
   * Handles pagination
   */
  const handleNext = useCallback(() => {
    dispatch({type: actionWidgetTypes.LOADING_NEXT});
    http
      .request({
        url: state.next,
        method: Endpoints.GetEventRelated.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCEventType>>) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
      });
  }, [dispatch, state.next, state.isLoadingNext, state.initialized]);

  const handleToggleDialogOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  if (!scEvent && !state.initialized) {
    return <Skeleton />;
  }

  // RENDER
  if (!scEvent || state?.count === 0) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classes.root} {...rest}>
      <CardContent className={classes.content}>
        <Stack className={classes.header}>
          <Button
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: scUserContext.user?.id})}
            className={classes.avatarWrapper}>
            <Avatar variant="rounded" src={scEvent.managed_by.avatar} alt={scEvent.managed_by.username} className={classes.avatar} />
          </Button>
          <Typography variant="h4">
            <b>{intl.formatMessage(messages.title, {user: scEvent.managed_by.username})}</b>
          </Typography>
        </Stack>
        <Stack className={classes.eventWrapper}>
          {state?.results.map((_event, i: number, array) => (
            <Fragment key={i}>
              <Event event={_event} eventId={_event.id} {...eventComponentProps} className={classes.event} />
              {i < array.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Stack>
      </CardContent>

      {state.count > state.visibleItems && (
        <CardActions className={classes.actions}>
          <Button onClick={handleToggleDialogOpen} className={classes.actionButton}>
            <Typography variant="caption">
              <FormattedMessage id="ui.relatedEventsWidget.showAll" defaultMessage="ui.relatedEventsWidget.showAll" />
            </Typography>
          </Button>
        </CardActions>
      )}

      <DialogRoot
        className={classes.dialogRoot}
        title={intl.formatMessage(messages.title, {user: scEvent.managed_by.username})}
        onClose={handleToggleDialogOpen}
        open={openDialog}
        {...dialogProps}>
        <InfiniteScroll
          dataLength={state.results.length}
          next={handleNext}
          hasMoreNext={Boolean(state.next)}
          loaderNext={<EventSkeleton elevation={0} {...eventComponentProps} />}
          className={classes.infiniteScroll}
          endMessage={
            <Typography className={classes.endMessage}>
              <FormattedMessage id="ui.relatedEventsWidget.noMoreResults" defaultMessage="ui.eventMembersWidget.noMoreResults" />
            </Typography>
          }>
          <List>
            {state.results.map((event: SCEventType) => (
              <ListItem key={event.id}>
                <Event elevation={0} event={event} {...eventComponentProps} />
              </ListItem>
            ))}
          </List>
        </InfiniteScroll>
      </DialogRoot>
    </Root>
  );
}
