import React, {MouseEvent, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Icon,
  IconButton,
  IconButtonProps,
  useMediaQuery,
  styled,
  useTheme,
  SwipeableDrawer,
  PopperProps,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useThemeProps,
  Menu
} from '@mui/material';
import {
  Link,
  SCContextType,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import Composer, {ComposerProps} from '../Composer';
import {useSnackbar} from 'notistack';
import {getRouteData} from '../../utils/contribution';
import {FeedObjectProps} from '../FeedObject';
import EventFormDialog, {EventFormDialogProps} from '../EventFormDialog';
import classNames from 'classnames';
import GroupForm, {GroupFormProps} from '../GroupForm';
import CreateLiveStreamDialog, {CreateLiveStreamDialogProps} from '../CreateLiveStreamDialog';
import {SCCommunitySubscriptionTier} from '@selfcommunity/types';

const PREFIX = 'SCComposerIconButton';

const classes = {
  root: `${PREFIX}-root`,
  menuRoot: `${PREFIX}-menu-root`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.popperRoot
})(() => ({}));

type ItemProps = {
  icon: string;
  text: string;
  onClick: () => void;
};

export interface ComposerIconButtonProps extends IconButtonProps {
  /**
   * Composer Props
   * @default null
   */
  ComposerProps?: ComposerProps;
  /**
   * Callback onClose Composer dialog
   * @default null
   */
  onClose?: () => void;

  /**
   * Props to spread to popper
   * @default empty object
   */
  PopperProps?: PopperProps;

  /**
   * Props to spread to CreateGroup component
   * @default empty object
   */
  GroupFormProps?: GroupFormProps;

  /**
   * Props to spread to CreateGroup component
   * @default empty object
   */
  EventFormDialogComponentProps?: EventFormDialogProps;

  /**
   * Props to spread to CreateGroup component
   * @default empty object
   */
  CreateLiveStreamDialogComponentProps?: CreateLiveStreamDialogProps;
}

/**
 * > API documentation for the Community-JS Composer Icon Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ComposerIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SComposerIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SComposerIconButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default React.forwardRef(function ComposerIconButton(inProps: ComposerIconButtonProps, ref: React.Ref<HTMLButtonElement>): ReactElement {
  // PROPS
  const props: ComposerIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    ComposerProps = {},
    onClick,
    onClose,
    PopperProps = {},
    GroupFormProps = {},
    EventFormDialogComponentProps = {},
    CreateLiveStreamDialogComponentProps = {},
    ...rest
  } = props;

  // STATE
  const [openComposer, setOpenComposer] = useState<boolean>(false);
  const [openPopper, setOpenPopper] = useState<boolean>(false);
  const [openCreateGroup, setOpenCreateGroup] = useState<boolean>(false);
  const [openCreateEvent, setOpenCreateEvent] = useState<boolean>(false);
  const [openCreateLiveStream, setOpenCreateLiveStream] = useState<boolean>(false);
  const [listItem, setListItem] = useState<ItemProps[]>([
    {
      icon: 'edit',
      text: 'ui.composerIconButton.list.content',
      onClick: () => {
        setOpenComposer(true);
        setOpenPopper(false);
      }
    }
  ]);

  // REFS
  const popperRef = useRef(null);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {enqueueSnackbar} = useSnackbar();

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  // MEMOS
  const canCreateGroup = useMemo(() => scUserContext?.user?.permission?.create_group, [scUserContext?.user?.permission]);
  const canCreateEvent = useMemo(() => scUserContext?.user?.permission?.create_event, [scUserContext?.user?.permission]);
  const canCreateLive = useMemo(() => scUserContext?.user?.permission?.create_live_stream, [scUserContext?.user?.permission]);
  const isCommunityOwner = useMemo(() => scUserContext?.user?.id === 1, [scUserContext.user]);
  const isFreeTrialTier = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value &&
      preferences[SCPreferences.CONFIGURATIONS_SUBSCRIPTION_TIER].value === SCCommunitySubscriptionTier.FREE_TRIAL,
    [preferences]
  );
  const canCreateLiveStream = useMemo(
    () => (isFreeTrialTier && isCommunityOwner && canCreateLive) || (!isFreeTrialTier && canCreateLive),
    [isFreeTrialTier, isCommunityOwner, canCreateLive]
  );

  const renderContent = useMemo(() => {
    return (
      <MenuList>
        {listItem.map((item, i) => (
          <MenuItem key={i} onClick={item.onClick}>
            <ListItemIcon>
              <Icon fontSize="small">{item.icon}</Icon>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="h6">
                  <FormattedMessage id={item.text} defaultMessage={item.text} />
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </MenuList>
    );
  }, [listItem]);

  // EFFECTS
  useEffect(() => {
    if (canCreateGroup) {
      setListItem((prev) => [
        ...prev,
        {
          icon: 'groups',
          text: 'ui.composerIconButton.list.group',
          onClick: () => {
            setOpenCreateGroup(true);
            setOpenPopper(false);
          }
        }
      ]);
    }

    if (canCreateEvent) {
      setListItem((prev) => [
        ...prev,
        {
          icon: 'CalendarIcon',
          text: 'ui.composerIconButton.list.event',
          onClick: () => {
            setOpenCreateEvent(true);
            setOpenPopper(false);
          }
        }
      ]);
    }

    if (canCreateLiveStream) {
      setListItem((prev) => [
        ...prev,
        {
          icon: 'movie',
          text: 'ui.composerIconButton.list.liveStream',
          onClick: () => {
            setOpenCreateLiveStream(true);
            setOpenPopper(false);
          }
        }
      ]);
    }
  }, [canCreateGroup, setListItem]);

  // HANDLERS
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (scUserContext.user) {
        if (UserUtils.isBlocked(scUserContext.user)) {
          enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
            variant: 'warning',
            autoHideDuration: 3000
          });
        } else {
          if (canCreateGroup || canCreateEvent || canCreateLiveStream) {
            setOpenPopper(true);
          } else {
            setOpenComposer(true);
          }
        }
      } else {
        scContext.settings.handleAnonymousAction();
      }
      onClick?.(event);
    },
    [onClick, scContext.settings, scUserContext.user]
  );

  const handleCloseComposer = useCallback(() => {
    setOpenComposer(false);
    onClose?.();
  }, [setOpenComposer, onClose]);

  const handleCloseMenu = useCallback(() => {
    setOpenPopper(false);
  }, [setOpenPopper]);

  const handleCloseCreateGroup = useCallback(() => {
    setOpenCreateGroup(false);
  }, [setOpenCreateGroup]);

  const handleCloseCreateEvent = useCallback(() => {
    setOpenCreateEvent(false);
  }, [setOpenCreateEvent]);

  const handleCloseCreateLiveStream = useCallback(() => {
    setOpenCreateLiveStream(false);
  }, [setOpenCreateLiveStream]);

  const handleSuccess = useCallback(
    (feedObject: FeedObjectProps) => {
      setOpenComposer(false);
      enqueueSnackbar(<FormattedMessage id="ui.composerIconButton.composer.success" defaultMessage="ui.composerIconButton.composer.success" />, {
        action: () => (
          <Link to={scRoutingContext.url(SCRoutes[`${feedObject.type.toUpperCase()}_ROUTE_NAME`], getRouteData(feedObject))}>
            <FormattedMessage id="ui.composerIconButton.composer.viewContribute" defaultMessage="ui.composerIconButton.composer.viewContribute" />
          </Link>
        ),
        variant: 'success',
        autoHideDuration: 7000
      });
    },
    [setOpenComposer]
  );

  return (
    <>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleClick}
        ref={(innerRef) => {
          popperRef.current = innerRef;
          return ref;
        }}
        {...rest}>
        <Icon>add_circle_outline</Icon>
      </Root>
      {openComposer && <Composer open fullWidth onClose={handleCloseComposer} onSuccess={handleSuccess} {...ComposerProps} />}
      {openPopper && (
        <>
          {isMobile ? (
            <SwipeableDrawer open onClose={handleCloseMenu} onOpen={() => null} anchor="bottom" disableSwipeToOpen>
              {renderContent}
            </SwipeableDrawer>
          ) : (
            <MenuRoot open anchorEl={popperRef.current} role={undefined} className={classes.menuRoot} onClose={handleCloseMenu} {...PopperProps}>
              {renderContent}
            </MenuRoot>
          )}
        </>
      )}
      {openCreateGroup && <GroupForm open onClose={handleCloseCreateGroup} {...GroupFormProps} />}
      {openCreateEvent && <EventFormDialog open onClose={handleCloseCreateEvent} {...EventFormDialogComponentProps} />}
      {openCreateLiveStream && <CreateLiveStreamDialog open onClose={handleCloseCreateLiveStream} {...CreateLiveStreamDialogComponentProps} />}
    </>
  );
});
