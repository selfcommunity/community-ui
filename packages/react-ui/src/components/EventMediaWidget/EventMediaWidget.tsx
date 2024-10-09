import { LoadingButton } from '@mui/lab';
import { Button, CardActions, CardContent, CardHeader, Divider, Icon, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, useThemeProps } from '@mui/system';
import { Endpoints, EventService, http, SCPaginatedResponse } from '@selfcommunity/api-services';
import { SCCache, SCThemeType, SCUserContextType, useSCFetchEvent, useSCUser } from '@selfcommunity/react-core';
import { SCEventType, SCMediaType } from '@selfcommunity/types';
import { CacheStrategies, Logger } from '@selfcommunity/utils';
import { AxiosResponse } from 'axios';
import { Fragment, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { SCOPE_SC_UI } from '../../constants/Errors';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from '../../constants/Pagination';
import BaseDialog, { BaseDialogProps } from '../../shared/BaseDialog';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Lightbox from '../../shared/Media/File/Lightbox';
import { actionWidgetTypes, dataWidgetReducer, stateWidgetInitializer } from '../../utils/widget';
import Widget, { WidgetProps } from '../Widget';
import { PREFIX } from './constants';
import SkeletonComponent from './Skeleton';
import TriggerButton from './TriggerButton';

const messages = defineMessages({
  title: {
    id: 'ui.eventMediaWidget.title',
    defaultMessage: 'ui.eventMediaWidget.title'
  }
});

const NUMBER_OF_MEDIAS = 9;

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  input: `${PREFIX}-input`,
  grid: `${PREFIX}-grid`,
  cover: `${PREFIX}-cover`,
  background: `${PREFIX}-background`,
  countWrapper: `${PREFIX}-count-wrapper`,
  count: `${PREFIX}-count`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  dialogRoot: `${PREFIX}-dialog-root`,
  infiniteScroll: `${PREFIX}-infinite-scroll`,
  mediaWrapper: `${PREFIX}-media-wrapper`,
  buttonWrapper: `${PREFIX}-button-wrapper`,
  loadingButton: `${PREFIX}-loading-button`,
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
    cacheStrategy,
    dialogProps,
    ...rest
  } = props;

  // STATE
  const [state, dispatch] = useReducer(
    dataWidgetReducer,
    {
      isLoadingNext: false,
      next: null,
      cacheKey: SCCache.getWidgetStateCacheKey(SCCache.EVENT_MEDIA_STATE_CACHE_PREFIX_KEY),
      cacheStrategy,
      visibleItems: limit
    },
    stateWidgetInitializer
  );
  const [medias, setMedias] = useState<SCMediaType[]>([]);
  const [mediasCount, setMediasCount] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [preview, setPreview] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const { scEvent } = useSCFetchEvent({ id: eventId, event });
  const intl = useIntl();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // CONSTS
  const hasAllow = useMemo(() => scUserContext.user?.id === scEvent?.managed_by.id, [scUserContext, scEvent]);

  /**
   * Initialize component
   * Fetch data only if the component is not initialized and it is not loading data
   */
  const _initComponent = useCallback(() => {
    if (!state.initialized && !state.isLoadingNext) {
      dispatch({ type: actionWidgetTypes.LOADING_NEXT });
      EventService.getEventPhotoGallery(scEvent.id, { ...endpointQueryParams })
        .then((payload: SCPaginatedResponse<SCMediaType>) => {
          dispatch({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: { ...payload, initialized: true } });
          setMedias(payload.results);
          setMediasCount(payload.count);
        })
        .catch((error) => {
          dispatch({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.isLoadingNext, state.initialized, scEvent]);

  const _fetchNext = useCallback(
    (index: number) => {
      if (mediasCount > medias.length && index >= 6 && !state.isLoadingNext && state.next) {
        setPreview(index);
        dispatch({ type: actionWidgetTypes.LOADING_NEXT });

        http
          .request({
            url: state.next,
            method: Endpoints.GetEventPhotoGallery.method
          })
          .then((res: AxiosResponse<SCPaginatedResponse<SCMediaType>>) => {
            dispatch({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data });
            setMedias((prev) => [...prev, ...res.data.results]);
            setMediasCount(res.data.count);
          })
          .catch((error) => {
            dispatch({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [state.next, state.isLoadingNext, medias.length]
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
    dispatch({ type: actionWidgetTypes.LOADING_NEXT });

    http
      .request({
        url: state.next,
        method: Endpoints.GetEventPhotoGallery.method
      })
      .then((res: AxiosResponse<SCPaginatedResponse<SCMediaType>>) => {
        dispatch({ type: actionWidgetTypes.LOAD_NEXT_SUCCESS, payload: res.data });
        setMedias((prev) => [...prev, ...res.data.results]);
        setMediasCount(res.data.count);
      })
      .catch((error) => {
        dispatch({ type: actionWidgetTypes.LOAD_NEXT_FAILURE, payload: { errorLoadNext: error } });
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [state.next, state.isLoadingNext, state.initialized, dispatch]);

  const handleRemoveMedia = useCallback(
    (id: number) => {
      setMediaId(id);
      setOpenDialogConfirm(true);
    },
    [setMediaId, setOpenDialogConfirm]
  );

  const handleConfirmAction = useCallback(() => {
    setLoading(true);

    http
      .request({
        url: Endpoints.RemoveMediasFromEventPhotoGallery.url({ id: scEvent.id }),
        method: Endpoints.RemoveMediasFromEventPhotoGallery.method,
        data: { medias: [mediaId] }
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
  }, [scEvent, mediaId, setMedias, setLoading, setOpenDialogConfirm, dispatch]);

  const handleCloseAction = useCallback(() => {
    setMediaId(null);
    setOpenDialogConfirm(false);
  }, [setMediaId, setOpenDialogConfirm]);

  const handleAddMedia = useCallback(
    (media: SCMediaType) => {
      http
        .request({
          url: Endpoints.AddMediaToEventPhotoGallery.url({ id: scEvent.id }),
          method: Endpoints.AddMediaToEventPhotoGallery.method,
          data: { media: media.id }
        })
        .then((res: AxiosResponse<SCMediaType>) => {
          setMedias((prev) => [res.data, ...prev]);
          setMediasCount((prev) => prev + 1);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    },
    [scEvent, setMedias]
  );

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

  useEffect(() => {
    if (isMobile && openDialog && state.next) {
      handleNext();
    }
  }, [isMobile, openDialog, state.next]);

  // RENDER
  if (!scEvent || (state.initialized && mediasCount === 0)) {
    return <HiddenPlaceholder />;
  }

  if (!state.initialized || (state.isLoadingNext && mediasCount === 0)) {
    return <SkeletonComponent />;
  }

  return (
    <Root className={classes.root} {...rest} showPadding={hasAllow}>
      <CardHeader
        title={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">
              <FormattedMessage id="ui.eventMediaWidget.title" defaultMessage="ui.eventMediaWidget.title" />
            </Typography>

            {hasAllow && <TriggerButton size="small" onAdd={handleAddMedia} />}
          </Stack>
        }
        className={classes.header}
      />

      <Divider />

      <CardContent className={classes.content}>
        <Box className={classes.grid}>
          {medias.slice(0, NUMBER_OF_MEDIAS).map((media: SCMediaType, i: number, array: SCMediaType[]) => (
            <Box
              key={media.id}
              onClick={() => handleOpenLightbox(i)}
              sx={{
                background: `url(${media.image}) no-repeat center`
              }}
              className={classes.cover}>
              {medias.length > array.length && i === array.length - 1 && (
                <Fragment>
                  <Box className={classes.background} />
                  <Box className={classes.countWrapper}>
                    <Typography className={classes.count}>+{mediasCount - NUMBER_OF_MEDIAS}</Typography>
                  </Box>
                </Fragment>
              )}
            </Box>
          ))}
        </Box>

        {preview !== -1 && <Lightbox onClose={handleCloseLightbox} index={preview} medias={medias} onIndexChange={_fetchNext} />}
      </CardContent>

      <CardActions className={classes.actions}>
        <Button onClick={handleToggleDialogOpen}>
          <Typography variant="caption">
            <FormattedMessage id="ui.eventMediaWidget.showAll" defaultMessage="ui.eventMediaWidget.showAll" />
          </Typography>
        </Button>
      </CardActions>

      {openDialog && (
        <DialogRoot
          className={classes.dialogRoot}
          title={intl.formatMessage(messages.title, { user: scEvent.managed_by.username })}
          onClose={handleToggleDialogOpen}
          open={openDialog}
          {...dialogProps}>
          <InfiniteScroll
            dataLength={medias.length}
            height={isMobile ? '100%' : '515px'}
            next={handleNext}
            hasMoreNext={Boolean(state.next)}
            loaderNext={<>Skeleton</>}
            className={classes.infiniteScroll}
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
                  className={classes.mediaWrapper}>
                  <Stack className={classes.buttonWrapper}>
                    <LoadingButton
                      className={classes.loadingButton}
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
            </Box>
          </InfiniteScroll>
        </DialogRoot>
      )}

      {openDialogConfirm && (
        <ConfirmDialog
          open={openDialogConfirm}
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
