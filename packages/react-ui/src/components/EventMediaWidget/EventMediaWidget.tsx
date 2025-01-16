import {LoadingButton} from '@mui/lab';
import {Button, CardActions, CardContent, CardHeader, Divider, Icon, Stack, Tooltip, Typography, useMediaQuery, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Box, useThemeProps} from '@mui/system';
import {Endpoints, EventService, http, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCCache, SCThemeType, SCUserContextType, useSCFetchEvent, useSCUser} from '@selfcommunity/react-core';
import {SCEventType, SCMediaType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {AxiosResponse} from 'axios';
import {Fragment, useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET} from '../../constants/Pagination';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {Lightbox} from '../../shared/Lightbox';
import {actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer} from '../../utils/widget';
import Widget, {WidgetProps} from '../Widget';
import {PREFIX} from './constants';
import SkeletonComponent, {EventMediaSkeleton} from './Skeleton';
import TriggerButton from './TriggerButton';

const messages = defineMessages({
  title: {
    id: 'ui.eventMediaWidget.title',
    defaultMessage: 'ui.eventMediaWidget.title'
  }
});

const MEDIAS_TO_SHOW = 9;

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  grid: `${PREFIX}-grid`,
  media: `${PREFIX}-media`,
  mediaLayer: `${PREFIX}-media-layer`,
  countHiddenMediaWrapper: `${PREFIX}-count-hidden-media-wrapper`,
  countHiddenMedia: `${PREFIX}-count-hidden-media`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  dialogRoot: `${PREFIX}-dialog-root`,
  dialogInfiniteScroll: `${PREFIX}-dialog-infinite-scroll`,
  dialogMediaWrapper: `${PREFIX}-dialog-media-wrapper`,
  dialogButtonWrapper: `${PREFIX}-dialog-button-wrapper`,
  dialogLoadingButton: `${PREFIX}-dialog-loading-button`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root,
  shouldForwardProp: (prop) => prop !== 'showPadding'
})(() => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'DialogRoot',
  overridesResolver: (_props, styles) => styles.dialogRoot,
  shouldForwardProp: (prop) => prop !== 'loading'
})(() => ({}));

export interface EventMediaWidgetProps extends WidgetProps {
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

  /**
   * Limit results
   * @default 10
   */
  limit?: number;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function EventMediaWidget(inProps: EventMediaWidgetProps) {
  // PROPS
  const props: EventMediaWidgetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // CONST
  const {
    event,
    eventId,
    limit = DEFAULT_PAGINATION_LIMIT,
    endpointQueryParams = {
      limit,
      offset: DEFAULT_PAGINATION_OFFSET
    },
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    dialogProps,
    ...rest
  } = props;

  // HOOKS
  const {scEvent} = useSCFetchEvent({id: eventId, event});
  const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.EVENT_MEDIA_STATE_CACHE_PREFIX_KEY, event ? event.id : eventId),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [medias, setMedias] = useState<SCMediaType[]>(state.results);
  const [mediasCount, setMediasCount] = useState<number>(state.count);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [preview, setPreview] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<'widget' | 'dialog' | null>(null);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // CONSTS
  const hasAllow = useMemo(() => scUserContext.user?.id === scEvent?.managed_by.id, [scUserContext, scEvent]);
  const countHiddenMedia = useMemo(() => mediasCount - MEDIAS_TO_SHOW, [mediasCount]);

  const _fetchNext = useCallback(
    (index: number) => {
      if (mediasCount > medias.length && index >= 6 && !state.isLoadingNext && state.next) {
        setPreview(index);
        dispatch({type: actionWidgetTypes.LOADING_NEXT});

        http
          .request({
            url: state.next,
            method: Endpoints.GetEventPhotoGallery.method
          })
          .then((res: AxiosResponse<SCPaginatedResponse<SCMediaType>>) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
            setMedias((prev) => [...prev, ...res.data.results]);
            setMediasCount(res.data.count);
          })
          .catch((error) => {
            dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.next, state.isLoadingNext, medias, mediasCount, dispatch, setPreview]
  );

  const handleOpenLightbox = useCallback(
    (index: number) => {
      setPreview(index);
    },
    [setPreview]
  );

  const handleCloseLightbox = useCallback(() => {
    setPreview(-1);
  }, [setPreview]);

  const handleToggleDialogOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, [setOpenDialog]);

  const handleNext = useCallback(() => {
    setShowSkeleton('dialog');
    dispatch({type: actionWidgetTypes.LOADING_NEXT});

    http
      .request({
        url: state.next,
        method: Endpoints.GetEventPhotoGallery.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCMediaType>>) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data});
        setMedias((prev) => [...prev, ...res.data.results]);
        setMediasCount(res.data.count);
        setShowSkeleton(null);
      })
      .catch((error) => {
        dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [state.next, state.isLoadingNext, state.initialized, dispatch, setMedias, setMediasCount, setShowSkeleton]);

  const handleRemoveMedia = useCallback(
    (id: number) => {
      if (hasAllow) {
        setMediaId(id);
        setOpenDialogConfirm(true);
      }
    },
    [setMediaId, setOpenDialogConfirm]
  );

  const handleConfirmAction = useCallback(() => {
    setLoading(true);

    http
      .request({
        url: Endpoints.RemoveMediasFromEventPhotoGallery.url({id: scEvent.id}),
        method: Endpoints.RemoveMediasFromEventPhotoGallery.method,
        data: {medias: [mediaId]}
      })
      .then(() => {
        setMedias((prev) => prev.filter((media) => media.id !== mediaId));
        setMediasCount((prev) => prev - 1);
        setMediaId(null);
        setLoading(false);
        setOpenDialogConfirm(false);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [scEvent, mediaId, setMedias, setLoading, setOpenDialogConfirm, dispatch, setMediasCount]);

  const handleCloseAction = useCallback(() => {
    setMediaId(null);
    setOpenDialogConfirm(false);
  }, [setMediaId, setOpenDialogConfirm]);

  const handleAddMedia = useCallback(
    (media: SCMediaType) => {
      setShowSkeleton('widget');

      http
        .request({
          url: Endpoints.AddMediaToEventPhotoGallery.url({id: scEvent.id}),
          method: Endpoints.AddMediaToEventPhotoGallery.method,
          data: {media: media.id}
        })
        .then((res: AxiosResponse<SCMediaType>) => {
          setMedias((prev) => [res.data, ...prev]);
          setMediasCount((prev) => prev + 1);
          setShowSkeleton(null);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    },
    [scEvent, setMedias, setMediasCount, setShowSkeleton]
  );

  // EFFECTS
  useEffect(() => {
    let _t: NodeJS.Timeout;
    if (
      scUserContext.user &&
      scEvent &&
      !state.initialized &&
      Boolean((eventId !== undefined && scEvent.id === eventId) || (event && scEvent.id === event.id))
    ) {
      _t = setTimeout(_initComponent);
      return () => {
        clearTimeout(_t);
      };
    }
  }, [scUserContext.user, scEvent, state.initialized]);

  useEffect(() => {
    if (state.initialized && scEvent && Boolean((eventId !== undefined && scEvent.id !== eventId) || (event && scEvent.id !== event.id))) {
      dispatch({type: actionWidgetTypes.RESET, payload: {}});
    }
  }, [state.initialized, scEvent, eventId, event]);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useCallback(() => {
    if (!state.isLoadingNext) {
      dispatch({type: actionWidgetTypes.LOADING_NEXT});
      EventService.getEventPhotoGallery(scEvent.id, {...endpointQueryParams})
        .then((payload: SCPaginatedResponse<SCMediaType>) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: {...payload, initialized: true}});
          setMedias(payload.results);
          setMediasCount(payload.count);
        })
        .catch((error) => {
          dispatch({type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: {errorLoadNext: error}});
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.isLoadingNext, scEvent, eventId, dispatch, setMedias, setMediasCount]);

  useEffect(() => {
    if (isMobile && openDialog && state.next) {
      handleNext();
    }
  }, [isMobile, openDialog, state.next]);

  if (!scUserContext.user) {
    return <HiddenPlaceholder />;
  }

  // RENDER
  if (
    !scEvent ||
    !state.initialized ||
    (scEvent && ((eventId !== undefined && scEvent.id !== eventId) || (event && scEvent.id !== event.id))) ||
    (state.isLoadingNext && !state.initialized)
  ) {
    return <SkeletonComponent />;
  }

  if (state.initialized && state.count === 0 && !hasAllow) {
    return <HiddenPlaceholder />;
  }

  return (
    <Root className={classes.root} {...rest} showPadding={hasAllow}>
      <CardHeader
        title={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              <FormattedMessage id="ui.eventMediaWidget.title" defaultMessage="ui.eventMediaWidget.title" />
            </Typography>

            {hasAllow && mediasCount > 0 && <TriggerButton size="small" onAdd={handleAddMedia} />}
          </Stack>
        }
        className={classes.header}
      />

      <Divider />

      <CardContent className={classes.content}>
        <Box className={classes.grid}>
          {showSkeleton === 'widget' && <EventMediaSkeleton />}
          {medias.slice(0, MEDIAS_TO_SHOW).map((media: SCMediaType, i: number, array: SCMediaType[]) => (
            <Box
              key={media.id}
              onClick={() => handleOpenLightbox(i)}
              sx={{
                background: `url(${media.image}) no-repeat center`
              }}
              className={classes.media}>
              {medias.length > array.length && i === array.length - 1 && (
                <Fragment>
                  <Box className={classes.mediaLayer} />
                  <Box className={classes.countHiddenMediaWrapper}>
                    <Typography className={classes.countHiddenMedia}>+{countHiddenMedia}</Typography>
                  </Box>
                </Fragment>
              )}
            </Box>
          ))}

          {hasAllow && mediasCount === 0 && (
            <Tooltip title={<FormattedMessage id="ui.eventMediaWidget.add" defaultMessage="ui.eventMediaWidget.add" />}>
              <TriggerButton size="large" onAdd={handleAddMedia} isSquare />
            </Tooltip>
          )}
        </Box>

        {preview !== -1 && <Lightbox onClose={handleCloseLightbox} index={preview} medias={medias} onIndexChange={_fetchNext} />}
      </CardContent>

      {hasAllow && mediasCount > 0 && (
        <CardActions className={classes.actions}>
          <Button onClick={handleToggleDialogOpen}>
            <Typography variant="caption">
              <FormattedMessage id="ui.eventMediaWidget.showAll" defaultMessage="ui.eventMediaWidget.showAll" />
            </Typography>
          </Button>
        </CardActions>
      )}

      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={intl.formatMessage(messages.title, {user: scEvent.managed_by.username})}
          onClose={handleToggleDialogOpen}
          open
          {...dialogProps}>
          <InfiniteScroll
            dataLength={medias.length}
            height={isMobile ? '100%' : '515px'}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            className={classes.dialogInfiniteScroll}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.eventMediaWidget.noMoreResults" defaultMessage="ui.eventMediaWidget.noMoreResults" />
              </Typography>
            }>
            <Box className={classes.grid}>
              {medias.map((media: SCMediaType) => (
                <Box
                  key={media.id}
                  sx={{
                    background: `url(${media.image}) no-repeat center`
                  }}
                  className={classes.dialogMediaWrapper}>
                  <Stack className={classes.dialogButtonWrapper}>
                    <LoadingButton
                      className={classes.dialogLoadingButton}
                      loading={mediaId === media.id}
                      size="large"
                      onClick={() => handleRemoveMedia(media.id)}
                      sx={{
                        color: (theme) => (mediaId === media.id ? 'transparent' : theme.palette.common.white)
                      }}>
                      <Icon fontSize="inherit">delete</Icon>
                    </LoadingButton>
                  </Stack>
                </Box>
              ))}
              {showSkeleton === 'dialog' && Array.from(Array(countHiddenMedia)).map((_, i) => <EventMediaSkeleton key={i} />)}
            </Box>
          </InfiniteScroll>
        </DialogRoot>
      )}

      {openDialogConfirm && (
        <ConfirmDialog
          open
          title={<FormattedMessage id="ui.eventMediaWidget.dialog.title" defaultMessage="ui.eventMediaWidget.dialog.title" />}
          content={<FormattedMessage id="ui.eventMediaWidget.dialog.msg" defaultMessage="ui.eventMediaWidget.dialog.msg" />}
          btnConfirm={<FormattedMessage id="ui.eventMediaWidget.dialog.confirm" defaultMessage="ui.eventMediaWidget.dialog.confirm" />}
          isUpdating={loading}
          onConfirm={handleConfirmAction}
          onClose={handleCloseAction}
        />
      )}
    </Root>
  );
}
