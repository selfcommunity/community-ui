import React, {forwardRef, SyntheticEvent, useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react';
import {
  SCCategoryType,
  SCContributionLocation,
  SCContributionType,
  SCEventType,
  SCFeatureName,
  SCFeedDiscussionType,
  SCFeedPostType,
  SCFeedStatusType,
  SCFeedTypologyType,
  SCGroupType,
  SCMediaType,
  SCPollType,
  SCTagType
} from '@selfcommunity/types';
import {Endpoints, formatHttpErrorCode, http, HttpResponse} from '@selfcommunity/api-services';
import {
  SCPreferences,
  SCPreferencesContextType,
  SCThemeType,
  SCUserContextType,
  UserUtils,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Fade,
  IconButton,
  Slide,
  Theme,
  useMediaQuery
} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {COMPOSER_POLL_MIN_CHOICES, COMPOSER_TITLE_MAX_LENGTH, COMPOSER_TYPE_POLL} from '../../constants/Composer';
import {MEDIA_TYPE_SHARE} from '../../constants/Media';
import LoadingButton from '@mui/lab/LoadingButton';
import AudienceLayer from './Layer/AudienceLayer';
import {iOS, isClientSideRendering, random, stripHtml} from '@selfcommunity/utils';
import classNames from 'classnames';
import {TransitionProps} from '@mui/material/transitions';
import {EditorProps} from '../Editor';
import {SCMediaObjectType} from '../../types/media';
import ContentPoll from './Content/ContentPoll';
import {useSnackbar} from 'notistack';
import {useThemeProps} from '@mui/system';
import {extractHashtags} from '../../utils/editor';
import TypeSwitchButtonGroup from './TypeSwitchButtonGroup';
import ContentPost from './Content/ContentPost';
import CategoryLayer from './Layer/CategoryLayer';
import {ComposerContentType, ComposerLayerType} from '../../types/composer';
import LocationLayer from './Layer/LocationLayer';
import ContentDiscussion from './Content/ContentDiscussion';
import {File, Link, Share} from '../../shared/Media';
import Attributes from './Attributes';
import {PREFIX} from './constants';
import ComposerSkeleton from './Skeleton';
import CloseLayer from './Layer/CloseLayer';
import BackdropScrollDisabled from '../../shared/BackdropScrollDisabled';
import {clearAllBodyScrollLocks} from 'body-scroll-lock';

const DialogTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props}></Fade>;
});

const classes = {
  root: `${PREFIX}-root`,
  ios: `${PREFIX}-ios`,
  title: `${PREFIX}-title`,
  types: `${PREFIX}-types`,
  content: `${PREFIX}-content`,
  attributes: `${PREFIX}-attributes`,
  medias: `${PREFIX}-medias`,
  actions: `${PREFIX}-actions`,
  layerTransitionRoot: `${PREFIX}-layer-transition-root`
};

const Root = styled(Dialog, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const LayerTransitionRoot = styled(Slide, {
  name: PREFIX,
  slot: 'LayerTransitionRoot'
})(({theme}) => ({}));

export interface ComposerProps extends Omit<DialogProps, 'defaultValue' | 'scroll'> {
  /**
   * Id of feed object
   * @default null
   */
  feedObjectId?: number;
  /**
   * Type of feed object
   * @default null
   */
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;
  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedDiscussionType | SCFeedPostType | SCFeedStatusType | null;
  /**
   * Initialization Data for the Composer, this is a hook to generate custom posts
   * @default null
   */
  defaultValue?: {
    title?: string;
    text?: string;
    categories?: SCCategoryType[];
    event?: SCEventType;
    group?: SCGroupType;
    audience?: string;
    addressing?: SCTagType[];
    medias?: SCMediaType[];
    poll?: SCPollType;
    location?: string;
  };
  /**
   * Media objects available
   * @default File, Document, Link
   */
  mediaObjectTypes?: SCMediaObjectType[];
  /**
   * Editor props
   * @default {}
   */
  EditorProps?: Omit<EditorProps, 'onFocus'>;
  /**
   * Callback triggered on success contribution creation
   * @default null
   */
  onSuccess?: (res: any) => void;
  /**
   * Callback triggered on close click
   * @default null
   */
  onClose?: (e: SyntheticEvent) => void;
  /**
   * The feed where the component is rendered
   * @default SCFeedTypologyType.HOME
   */
  feedType?: SCFeedTypologyType;
}

const COMPOSER_INITIAL_STATE = {
  id: null,
  type: null,
  title: '',
  titleError: null,
  html: '',
  htmlError: null,
  categories: [],
  group: null,
  event: null,
  categoriesError: null,
  groupsError: null,
  addressing: null,
  addressingError: null,
  medias: [],
  poll: null,
  location: null,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return {...COMPOSER_INITIAL_STATE, key: random()};
    case 'resetEventFeed':
      return {...COMPOSER_INITIAL_STATE, event: state.event, key: random()};
    case 'resetGroupFeed':
      return {...COMPOSER_INITIAL_STATE, group: state.group, key: random()};
    case 'resetCategoryFeed':
      return {...COMPOSER_INITIAL_STATE, categories: state.categories, key: random()};
    case 'multiple':
      return {...state, ...action.value};
    default:
      return {...state, [action.type]: action.value};
  }
};
/**
 * > API documentation for the Community-JS Composer component. Learn about the available props and the CSS API.
 *
 *
 * The Composer component contains the logic around the creation of [Post](https://developers.selfcommunity.com/docs/apireference/v2/post/create_a_post) and [Discussion](https://developers.selfcommunity.com/docs/apireference/v2/discussion/create_a_discussion) objects.
 *
 *
 :::info
 To prevent the editor toolbar and action botton bar being hidden underneath the Virtual Keyboard you need to set the `interactive-widget=resizes-content` on meta viewport.
 This works on chrome for android.
 For iOS devices there is a lack of support of this meta so we force the blur event when the user start dragging.
 [More information](https://bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/)
 :::

 #### Import
 ```jsx
 import {Composer} from '@selfcommunity/react-ui';
 ```
 #### Component Name
 The name `SCComposer` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCComposer-root|Styles applied to the root element.|
 |ios|.SCComposer-ios|Styles applied to the root element when the device is ios.|
 |title|.SCComposer-title|Styles applied to the title element.|
 |types|.SCComposer-types|Styles applied to the types element.|
 |content|.SCComposer-content|Styles applied to the content.|
 |attributes|.SCComposer-attributes|Styles applied to the attributes.|
 |medias|.SCComposer-medias|Styles applied to the medias.|
 |actions|.SCComposer-actions|Styles applied to the actions section.|
 |layerTransitionRoot|.SCComposer-layer-transition-root|Styles applied to the overlay layers (eg. location).|


 * @param inProps
 */
export default function Composer(inProps: ComposerProps): JSX.Element {
  // PROPS
  const props: ComposerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    feedObjectId = null,
    feedObjectType = null,
    feedObject = null,
    defaultValue = {},
    mediaObjectTypes = [File, Link, Share],
    EditorProps = {},
    onClose = null,
    onSuccess = null,
    feedType,
    ...rest
  } = props;

  // Context
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // HOOKS
  const theme: Theme = useTheme<SCThemeType>();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'), {noSsr: isClientSideRendering()});

  // State variables
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [layer, setLayer] = useState<ComposerLayerType | null>();
  const [state, dispatch] = useReducer(reducer, {...COMPOSER_INITIAL_STATE, ...defaultValue, key: random()});
  const {key, id, type, title, titleError, html, categories, event, group, addressing, audience, medias, poll, pollError, location, error} = state;

  const destructureFeedObject = (_feedObject) => {
    if (_feedObject.type === SCContributionType.POST) {
      _feedObject = _feedObject as SCFeedPostType;
    } else if (_feedObject.type === SCContributionType.DISCUSSION) {
      _feedObject = _feedObject as SCFeedDiscussionType;
    } else {
      _feedObject = _feedObject as SCFeedStatusType;
    }
    if (feedObject.author.id === scUserContext.user.id) {
      dispatch({
        type: 'multiple',
        value: {
          id: _feedObject.id,
          type: _feedObject.poll ? COMPOSER_TYPE_POLL : feedObject.type,
          title: _feedObject.title,
          html: _feedObject.html,
          categories: _feedObject.categories,
          event: _feedObject.event,
          group: _feedObject.group,
          addressing: _feedObject.addressing,
          medias: _feedObject.medias,
          poll: _feedObject.poll,
          location: _feedObject.location
        }
      });
      setIsLoading(false);
    } else {
      setLoadError(true);
    }
  };

  // Edit state variables
  const editMode = useMemo(() => Boolean((feedObjectId && feedObjectType) || feedObject), [feedObjectId, feedObjectType, feedObject]);
  const [isLoading, setIsLoading] = useState<boolean>(editMode);
  const [loadError, setLoadError] = useState<boolean>(false);

  // REFS
  const dialogRef = useRef<any>();
  const unloadRef = useRef<boolean>(false);
  const pointerStartY = useRef(null);

  // Create a ref for medias because of state update error on chunk upload
  const mediasRef = useRef({medias});
  mediasRef.current = {medias};

  // MEMO
  const hasPoll = useMemo(() => {
    return poll && poll.title.length > 0 && poll.title.length < COMPOSER_TITLE_MAX_LENGTH && poll.choices.length >= COMPOSER_POLL_MIN_CHOICES;
  }, [poll]);
  const canSubmit = useMemo(() => {
    return (
      !isLoading &&
      ((type === SCContributionType.DISCUSSION && title.length > 0 && title.length < COMPOSER_TITLE_MAX_LENGTH) ||
        (type === SCContributionType.POST && (stripHtml(html).length > 0 || medias.length > 0 || hasPoll)) ||
        (type === COMPOSER_TYPE_POLL && hasPoll))
    );
  }, [isLoading, type, title, html, medias, hasPoll]);
  const isIOS = useMemo(() => iOS(), []);

  // Load feed object
  useEffect(() => {
    if (!editMode) {
      return;
    } else if (feedObject !== null) {
      destructureFeedObject(feedObject);
      return;
    }
    setIsLoading(true);
    http
      .request({
        url: Endpoints.FeedObject.url({type: feedObjectType, id: feedObjectId}),
        method: Endpoints.FeedObject.method
      })
      .then((res: HttpResponse<any>) => {
        destructureFeedObject(res.data);
      })
      .catch(() => {
        setLoadError(true);
      })
      .then(() => setIsLoading(false));
  }, [editMode]);

  // Prevent unload
  useEffect(() => {
    if (!unloadRef.current && canSubmit) {
      unloadRef.current = true;
      const onUnload = (e) => {
        e.preventDefault();
        return '';
      };
      window.onbeforeunload = onUnload;
    } else if (unloadRef.current && !canSubmit) {
      unloadRef.current = false;
      window.onbeforeunload = null;
    }
  }, [state, canSubmit]);

  /**
   * On iOS, since it is not possible to anchor meadiaObject actions
   * to the bottom of the viewport, detect 'pan' gesture to close the
   * soft keyboard on device and show actions
   */
  useEffect(() => {
    if (!dialogRef.current || !isIOS) {
      return;
    }

    /**
     * On touchStart event save the initial Y
     * @param e
     */
    const handleTouchStart = (e) => {
      pointerStartY.current = e.touches[0].clientY;
    };

    /**
     * Perform blur only if gesture is a pan (bottom direction)
     * @param e
     */
    const handleTouchmove = (e) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - pointerStartY.current;
      pointerStartY.current = currentY;
      if (deltaY > 0) {
        dialogRef.current.focus();
      }
    };

    /**
     * Attach touchstart, touchmove necessary to detect the pan gesture
     */
    dialogRef.current.addEventListener('touchstart', handleTouchStart);
    dialogRef.current.addEventListener('touchmove', handleTouchmove);

    /**
     * To disable scroll on iOS
     */
    // dialogRef.current &&
    //   disableBodyScroll(dialogRef.current, {
    //     allowTouchMove: (el) => {
    //       while (el && el !== document.body) {
    //         if (el.getAttribute('class') !== null && el.getAttribute('class').includes('SCComposer-content')) {
    //           return true;
    //         }
    //         el = el.parentElement;
    //       }
    //     }
    //   });

    return () => {
      dialogRef.current?.removeEventListener('touchstart', handleTouchStart);
      dialogRef.current?.removeEventListener('touchmove', handleTouchmove);
      /**
       * To re-enable scroll on iOS
       */
      // dialogRef.current && enableBodyScroll(dialogRef.current);
    };
  }, [dialogRef.current, isIOS]);

  /* Handlers */
  const handleAddLayer = useCallback((layer: ComposerLayerType) => setLayer(layer), []);
  const handleRemoveLayer = useCallback(() => setLayer(null), []);

  const handleChangeType = useCallback((value: string) => {
    dispatch({type: 'type', value});
  }, []);

  const handleChangePoll = useCallback((content: ComposerContentType): void => {
    dispatch({
      type: 'multiple',
      value: {
        ...content,
        pollError:
          content.poll.title.length > COMPOSER_TITLE_MAX_LENGTH
            ? {titleError: <FormattedMessage id="ui.composer.title.error.maxlength" defaultMessage="ui.composer.title.error.maxlength" />}
            : null
      }
    });
  }, []);

  const handleChangeDiscussion = useCallback((content: ComposerContentType): void => {
    dispatch({
      type: 'multiple',
      value: {
        ...content,
        titleError:
          content.title.length > COMPOSER_TITLE_MAX_LENGTH ? (
            <FormattedMessage id="ui.composer.title.error.maxlength" defaultMessage="ui.composer.title.error.maxlength" />
          ) : null
      }
    });
  }, []);

  const handleChangePost = useCallback((content: ComposerContentType): void => {
    dispatch({
      type: 'multiple',
      value: {
        ...content
      }
    });
  }, []);

  const handleChangeCategories = useCallback((value: SCCategoryType[]) => {
    dispatch({type: 'categories', value});
    setLayer(null);
  }, []);

  const handleAddCategoryLayer = useCallback(
    () =>
      handleAddLayer({
        name: 'category',
        Component: CategoryLayer,
        ComponentProps: {
          onClose: handleRemoveLayer,
          onSave: handleChangeCategories,
          defaultValue: categories
        }
      }),
    [handleAddLayer, handleRemoveLayer, handleChangeCategories, categories]
  );

  const handleChangeAudience = useCallback(
    (value: SCTagType[] | SCGroupType | SCEventType | null) => {
      if (group || (value && Object.prototype.hasOwnProperty.call(value, 'emotional_image_position'))) {
        dispatch({type: 'group', value});
      } else if (event || (value && Object.prototype.hasOwnProperty.call(value, 'recurring'))) {
        dispatch({type: 'event', value});
      } else {
        dispatch({type: 'addressing', value});
      }
      setLayer(null);
    },
    [group]
  );

  const handleAddAudienceLayer = useCallback(
    () =>
      handleAddLayer({
        name: 'audience',
        Component: AudienceLayer,
        ComponentProps: {
          onClose: handleRemoveLayer,
          onSave: handleChangeAudience,
          defaultValue:
            group || (addressing && Object.prototype.hasOwnProperty.call(addressing, 'emotional_image_position'))
              ? group
              : event || (addressing && Object.prototype.hasOwnProperty.call(addressing, 'recurring'))
              ? event
              : addressing
        }
      }),
    [handleAddLayer, handleRemoveLayer, handleChangeAudience, addressing, event, group]
  );

  const handleChangeLocation = useCallback((value: SCContributionLocation | null) => {
    dispatch({type: 'location', value});
    setLayer(null);
  }, []);

  const handleAddLocationLayer = useCallback(
    () =>
      handleAddLayer({
        name: 'location',
        Component: LocationLayer,
        ComponentProps: {
          onClose: handleRemoveLayer,
          onSave: handleChangeLocation,
          defaultValue: location
        }
      }),
    [handleAddLayer, handleRemoveLayer, handleChangeLocation, location]
  );

  const handleChangeMedias = useCallback((value: SCMediaType[] | null) => {
    const _medias = [...value];
    dispatch({
      type: 'medias',
      value: [...value]
    });
    mediasRef.current.medias = _medias;
    setLayer(null);
  }, []);

  const handleAddMedia = useCallback((media: SCMediaType) => {
    const _medias = [...mediasRef.current.medias, media];
    dispatch({
      type: 'medias',
      value: _medias
    });
    mediasRef.current.medias = _medias;
  }, []);

  const handleMediaTriggerClick = useCallback(
    (mediaObjectType: SCMediaObjectType) => (e: React.MouseEvent<HTMLButtonElement>) => {
      if (mediaObjectType.layerComponent) {
        handleAddLayer({
          name: mediaObjectType.name,
          Component: mediaObjectType.layerComponent,
          ComponentProps: {
            onClose: handleRemoveLayer,
            onSave: handleChangeMedias,
            defaultValue: medias
          }
        });
      }
    },
    [handleAddLayer, handleRemoveLayer, handleChangeMedias, medias]
  );

  const handleChangeAttributes = useCallback((content: Omit<ComposerContentType, 'title' | 'html'>): void => {
    dispatch({
      type: 'multiple',
      value: {...content}
    });
  }, []);

  const handleClickAttributes = useCallback(
    (attr: string): void => {
      switch (attr) {
        case 'categories':
          handleAddCategoryLayer();
          break;
        case 'addressing':
          handleAddAudienceLayer();
          break;
        case 'location':
          handleAddLocationLayer();
          break;
      }
    },
    [handleAddCategoryLayer, handleAddAudienceLayer, handleAddLocationLayer]
  );

  const handleSubmit = useCallback(
    (e: SyntheticEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      if (UserUtils.isBlocked(scUserContext.user)) {
        // deny submit action if authenticated user is blocked
        enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
          variant: 'warning',
          autoHideDuration: 3000
        });
        return;
      }
      // Extract hashtags and add to categories
      const _categories: string[] = [...categories.map((c: SCCategoryType) => c.id), ...extractHashtags(html)];
      const data: any = {
        title,
        text: html,
        medias: medias.map((m) => m.id),
        categories: _categories.filter((item, index) => _categories.indexOf(item) === index)
      };
      if ((preferences[SCPreferences.ADDONS_POLLS_ENABLED].value || UserUtils.isStaff(scUserContext.user)) && hasPoll) {
        data.poll = poll;
      }
      if (preferences[SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED].value && location) {
        data.location = location;
      }
      if (features.includes(SCFeatureName.TAGGING) && addressing !== null) {
        data.addressing = addressing.map((t) => t.id);
      }
      if (
        features.includes(SCFeatureName.TAGGING) &&
        features.includes(SCFeatureName.GROUPING) &&
        preferences[SCPreferences.CONFIGURATIONS_GROUPS_ENABLED].value &&
        group !== null
      ) {
        data.group = group.id;
      }
      if (
        features.includes(SCFeatureName.TAGGING) &&
        features.includes(SCFeatureName.EVENT) &&
        preferences[SCPreferences.CONFIGURATIONS_EVENTS_ENABLED].value &&
        event !== null
      ) {
        data.event = event.id;
      }
      setIsSubmitting(true);

      // Finding right url
      const _type = type === COMPOSER_TYPE_POLL ? SCContributionType.POST : type;
      let url = Endpoints.Composer.url({type: _type});
      let method = Endpoints.Composer.method;
      if (editMode) {
        url = Endpoints.ComposerEdit.url({type: feedObjectType ? feedObjectType : _type, id});
        method = Endpoints.ComposerEdit.method;
      }

      // Perform request
      http
        .request({
          url,
          method,
          data
        })
        .then((res: HttpResponse<any>) => {
          onSuccess(res.data);
          if (unloadRef.current) {
            window.onbeforeunload = null;
          }
          feedType && feedType === SCFeedTypologyType.CATEGORY
            ? dispatch({type: 'resetCategoryFeed'})
            : feedType === SCFeedTypologyType.EVENT
            ? dispatch({type: 'resetEventFeed'})
            : feedType === SCFeedTypologyType.GROUP
            ? dispatch({type: 'resetGroupFeed'})
            : dispatch({type: 'reset'});
        })
        .catch((error) => {
          dispatch({type: 'multiple', value: formatHttpErrorCode(error)});
        })
        .then(() => setIsSubmitting(false));
    },
    [scUserContext.user, feedObjectType, id, type, title, html, categories, event, group, addressing, audience, medias, poll, location, hasPoll]
  );

  //edited here
  const handleClose = useCallback(
    (e: SyntheticEvent, reason?: string): void => {
      if (unloadRef.current) {
        window.onbeforeunload = null;
      }
      if (reason && canSubmit) {
        handleAddLayer({
          name: 'close',
          Component: CloseLayer,
          ComponentProps: {
            onClose: handleRemoveLayer,
            onSave: () => {
              onClose && onClose(e);
              setLayer(null);
              feedType && feedType === SCFeedTypologyType.CATEGORY
                ? dispatch({type: 'resetCategoryFeed'})
                : feedType === SCFeedTypologyType.EVENT
                ? dispatch({type: 'resetEventFeed'})
                : feedType === SCFeedTypologyType.GROUP
                ? dispatch({type: 'resetGroupFeed'})
                : dispatch({type: 'reset'});
            }
          }
        });
      } else {
        clearAllBodyScrollLocks();
        onClose && onClose(e);
        setLayer(null);
        dispatch({type: 'reset'});
        /*setLayer(null);
        feedType && feedType === SCFeedTypologyType.CATEGORY
          ? dispatch({type: 'resetCategoryFeed'})
          : feedType === SCFeedTypologyType.GROUP
          ? dispatch({type: 'resetGroupFeed'})
          : dispatch({type: 'reset'}); */
      }
    },
    [onClose, canSubmit, handleRemoveLayer]
  );

  const handleClosePrompt = useCallback(
    (e: SyntheticEvent): void => {
      if (canSubmit) {
        handleAddLayer({
          name: 'close',
          Component: CloseLayer,
          ComponentProps: {
            onClose: handleRemoveLayer,
            onSave: handleClose
          }
        });
      } else {
        handleClose(e);
      }
    },
    [canSubmit, handleAddLayer, handleRemoveLayer, handleClose]
  );

  // RENDER
  const hasMediaShare = useMemo(() => medias.findIndex((m) => m.type === MEDIA_TYPE_SHARE) !== -1, [medias]);
  const content = useMemo(() => {
    if (editMode && isLoading) {
      return <ComposerSkeleton />;
    } else if (editMode && loadError) {
      return (
        <Alert severity="error" onClose={handleClose}>
          <AlertTitle>
            <FormattedMessage id="ui.composer.edit.error.title" defaultMessage="ui.composer.edit.error.title" />
          </AlertTitle>
          <FormattedMessage id="ui.composer.edit.error.content" defaultMessage="ui.composer.edit.error.content" />
        </Alert>
      );
    }
    switch (type) {
      case COMPOSER_TYPE_POLL:
        return (
          <ContentPoll
            key={key}
            onChange={handleChangePoll}
            value={{html, event, group, addressing, medias, poll, location}}
            error={pollError}
            disabled={isSubmitting}
          />
        );
      case SCContributionType.DISCUSSION:
        return (
          <ContentDiscussion
            key={key}
            value={{title, html, categories, event, group, addressing, medias, poll, location}}
            error={{titleError, error}}
            onChange={handleChangeDiscussion}
            disabled={isSubmitting}
            isContentSwitchButtonVisible={!canSubmit && !editMode}
            EditorProps={{
              toolbar: true,
              uploadImage: true,
              ...EditorProps
            }}
          />
        );
      default:
        return (
          <ContentPost
            key={key}
            value={{html, categories, event, group, addressing, medias, poll, location}}
            error={{error}}
            onChange={handleChangePost}
            disabled={isSubmitting}
            EditorProps={{
              toolbar: false,
              uploadImage: false,
              ...EditorProps
            }}
          />
        );
    }
  }, [
    key,
    type,
    title,
    html,
    categories,
    event,
    group,
    addressing,
    medias,
    poll,
    pollError,
    location,
    error,
    handleChangePoll,
    handleChangePost,
    isSubmitting,
    canSubmit,
    editMode
  ]);

  if (!scUserContext.user && !(scUserContext.loading && open)) {
    return null;
  }

  return (
    <Root
      ref={dialogRef}
      TransitionComponent={DialogTransition}
      slots={{backdrop: BackdropScrollDisabled}}
      onClose={handleClose}
      {...rest}
      disableEscapeKeyDown
      className={classNames(classes.root, {[classes.ios]: isIOS})}
      scroll="body"
      fullScreen={fullScreen}
      tabIndex={-1}>
      <form onSubmit={handleSubmit} method="post">
        <DialogTitle className={classes.title}>
          <IconButton onClick={handleClosePrompt}>
            <Icon>close</Icon>
          </IconButton>
          <LoadingButton size="small" type="submit" color="secondary" variant="contained" disabled={!canSubmit} loading={isSubmitting}>
            <FormattedMessage id="ui.composer.submit" defaultMessage="ui.composer.submit" />
          </LoadingButton>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Attributes
            value={{categories, event, group, addressing, location}}
            className={classes.attributes}
            onChange={handleChangeAttributes}
            onClick={handleClickAttributes}
          />
          {content}
          {medias && medias.length > 0 && (
            <Box className={classes.medias}>
              {mediaObjectTypes.map((mediaObjectType: SCMediaObjectType) => {
                if (mediaObjectType.previewComponent) {
                  return <mediaObjectType.previewComponent key={mediaObjectType.name} value={medias} onChange={handleChangeMedias} />;
                } else if (mediaObjectType.displayComponent) {
                  return <mediaObjectType.displayComponent key={mediaObjectType.name} medias={medias} />;
                }
              })}
            </Box>
          )}
        </DialogContent>
        {!canSubmit && !editMode && <TypeSwitchButtonGroup className={classes.types} onChange={handleChangeType} size="small" value={type} />}
        <DialogActions className={classes.actions}>
          {mediaObjectTypes
            .filter((mediaObjectType: SCMediaObjectType) => mediaObjectType.triggerButton !== null)
            .map((mediaObjectType: SCMediaObjectType) => {
              const props = mediaObjectType.layerComponent ? {onClick: handleMediaTriggerClick(mediaObjectType)} : {onAdd: handleAddMedia};
              return (
                <mediaObjectType.triggerButton
                  key={mediaObjectType.name}
                  disabled={isSubmitting || hasMediaShare}
                  color={medias.filter(mediaObjectType.filter).length > 0 ? 'primary' : 'default'}
                  {...props}
                />
              );
            })}
          <IconButton disabled={isSubmitting} onClick={handleAddCategoryLayer}>
            <Icon>category</Icon>
          </IconButton>
          <IconButton
            disabled={isSubmitting || !features.includes(SCFeatureName.TAGGING) || Boolean(feedObject?.group) || Boolean(feedObject?.event)}
            onClick={handleAddAudienceLayer}>
            {(!group && addressing === null) || (!event && addressing === null) || addressing?.length === 0 ? (
              <Icon>public</Icon>
            ) : group ? (
              <Icon>groups</Icon>
            ) : event ? (
              <Icon>CalendarIcon</Icon>
            ) : (
              <Icon>label</Icon>
            )}
          </IconButton>
          {preferences[SCPreferences.ADDONS_POST_GEOLOCATION_ENABLED].value && (
            <IconButton disabled={isSubmitting} onClick={handleAddLocationLayer} color={location !== null ? 'primary' : 'default'}>
              <Icon>add_location_alt</Icon>
            </IconButton>
          )}
        </DialogActions>
      </form>
      {layer && (
        <LayerTransitionRoot className={classes.layerTransitionRoot} in container={dialogRef.current} direction="left">
          <layer.Component {...layer.ComponentProps} />
        </LayerTransitionRoot>
      )}
    </Root>
  );
}
