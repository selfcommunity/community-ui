import React, {useContext, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {FormattedMessage, useIntl} from 'react-intl';
import Popper from '@mui/material/Popper';
import Icon from '@mui/material/Icon';
import {useSnackbar} from 'notistack';
import classNames from 'classnames';
import {
  Box,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  SwipeableDrawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {Endpoints, http, HttpResponse, LiveStreamApiClient} from '@selfcommunity/api-services';
import {SCContext, SCContextType, SCThemeType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {BAN_ROOM_USER, REMOVE_ROOM_USER} from './constants';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';
import {useEnsureParticipant} from '@livekit/components-react';
import {useLiveStream} from './LiveStreamProvider';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../../constants/Errors';

const PREFIX = 'SCParticipantTileActionsMenu';

const classes = {
  root: `${PREFIX}-root`,
  button: `${PREFIX}-button`,
  popperRoot: `${PREFIX}-popper-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`,
  itemText: `${PREFIX}-item-text`,
  subItem: `${PREFIX}-sub-item`,
  subItemText: `${PREFIX}-sub-item-text`,
  footerSubItems: `${PREFIX}-footer-sub-items`,
  selectedIcon: `${PREFIX}-selected-icon`,
  sectionBadge: `${PREFIX}-section-badge`,
  sectionWithSelectionIcon: `${PREFIX}-section-with-selection-icon`,
  visibilityIcons: `${PREFIX}-visibility-icons`
};

const PopperRoot = styled(Popper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.popperRoot
})(() => ({
  '& .SCParticipantTileActionsMenu-paper': {
    borderRadius: 5
  }
}));

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'inline-block',
  '& button': {
    color: theme.palette.common.white
  }
}));

export interface ParticipantTileActionsMenuProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * User Object
   * @default null
   */
  participant?: any;

  /**
   * Handle remove user
   */
  onRemoveParticipant?: (p) => void;

  /**
   * Handle ban user
   */
  onBanParticipant?: (p) => void;

  /**
   * Props to spread to popper
   * @default empty object
   */
  PopperProps?: any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function ContributionActionsMenu(props: ParticipantTileActionsMenuProps): JSX.Element {
  // PROPS
  const {className, participant, onRemoveParticipant, onBanParticipant, PopperProps = {}, ...rest} = props;

  // CONTEXT
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scContext: SCContextType = useContext(SCContext);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const {enqueueSnackbar} = useSnackbar();
  const p = useEnsureParticipant(participant);
  const {liveStream} = useLiveStream();

  // GENERAL POPPER STATE
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // CONFIRM ACTION DIALOG STATE
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<string>(null);
  const [currentActionLoading, setCurrentActionLoading] = useState<string>(null);

  // CONST
  let popperRef = useRef(null);

  /**
   * Handles open popup
   */
  function handleOpen() {
    if (scUserContext.user) {
      setOpen(true);
    } else {
      scContext.settings.handleAnonymousAction();
    }
  }

  /**
   * Closes popup
   */
  function handleClose() {
    if (popperRef.current && popperRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    if (rest.onClose) {
      rest.onClose();
    }
  }

  /**
   * Perform ban participant
   */
  const performRemoveOrBanParticipant = useMemo(
    () =>
      async (ban = false) => {
        const res = await LiveStreamApiClient.removeParticipant(liveStream.id, {participant_id: p.identity, ban});
        if (res.status >= 300) {
          return Promise.reject(res);
        }
        return await Promise.resolve(res.data);
      },
    [p]
  );

  /**
   * Handle action
   */
  function handleAction(action) {
    if ([REMOVE_ROOM_USER, BAN_ROOM_USER].indexOf(action) > -1) {
      setCurrentAction(action);
      setOpenConfirmDialog(true);
      handleClose();
    }
  }

  /**
   * Perform additional operations at the end of single action
   */
  function performPostConfirmAction(success) {
    if (success) {
      setCurrentActionLoading(null);
      setCurrentAction(null);
      setOpenConfirmDialog(false);
      enqueueSnackbar(<FormattedMessage id="ui.contributionActionMenu.actionSuccess" defaultMessage="ui.contributionActionMenu.actionSuccess" />, {
        variant: 'success',
        autoHideDuration: 3000
      });
    } else {
      setCurrentActionLoading(null);
      enqueueSnackbar(<FormattedMessage id="ui.contributionActionMenu.actionError" defaultMessage="ui.contributionActionMenu.actionError" />, {
        variant: 'error',
        autoHideDuration: 3000
      });
    }
  }

  /**
   * Delete a contribution
   */
  function handleConfirmedAction() {
    if (p && !isLoading && !currentActionLoading) {
      if (currentAction === REMOVE_ROOM_USER) {
        setCurrentActionLoading(REMOVE_ROOM_USER);
        performRemoveOrBanParticipant()
          .then(() => {
            onRemoveParticipant && onRemoveParticipant(p);
            performPostConfirmAction(true);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            performPostConfirmAction(false);
          });
      } else if (currentAction === BAN_ROOM_USER) {
        setCurrentActionLoading(BAN_ROOM_USER);
        performRemoveOrBanParticipant(true)
          .then(() => {
            onBanParticipant && onBanParticipant(p);
            performPostConfirmAction(true);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            performPostConfirmAction(false);
          });
      }
    }
  }

  /**
   * Can authenticated ban a user in a room
   */
  const canRemoveOrBanUser = useMemo(
    () => () => {
      return (
        scUserContext.user &&
        liveStream &&
        p &&
        p.identity &&
        liveStream.host.id === scUserContext.user.id &&
        scUserContext.user.id.toString() !== p.identity
      );
    },
    [scUserContext, liveStream, p]
  );

  /**
   * Renders section general
   */
  function renderGeneralSection() {
    return (
      <Box>
        {canRemoveOrBanUser() && (
          <>
            <MenuItem className={classes.subItem} disabled={currentActionLoading === REMOVE_ROOM_USER}>
              <ListItemIcon>
                <Icon>person</Icon>
              </ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage
                    id="ui.liveStreamRoom.participantTileActions.removeRoomUser"
                    defaultMessage="ui.liveStreamRoom.participantTileActions.removeRoomUser"
                  />
                }
                onClick={() => handleAction(REMOVE_ROOM_USER)}
                classes={{root: classes.itemText}}
              />
            </MenuItem>
            <MenuItem className={classes.subItem} disabled={currentActionLoading === BAN_ROOM_USER}>
              <ListItemIcon>
                <Icon>error</Icon>
              </ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage
                    id="ui.liveStreamRoom.participantTileActions.banRoomUser"
                    defaultMessage="ui.liveStreamRoom.participantTileActions.banRoomUser"
                  />
                }
                onClick={() => handleAction(BAN_ROOM_USER)}
                classes={{root: classes.itemText}}
              />
            </MenuItem>
          </>
        )}
      </Box>
    );
  }

  /**
   * Renders contribution menu content
   */
  function renderContent() {
    return (
      <Box>
        <MenuList>{renderGeneralSection()}</MenuList>
      </Box>
    );
  }

  /**
   * Renders component only if the logged user has actions available
   */
  if (!canRemoveOrBanUser()) {
    return null;
  }

  /**
   * Renders component
   */
  return (
    <Root className={classNames(classes.root, className)}>
      <IconButton
        ref={(ref) => {
          popperRef.current = ref;
        }}
        aria-haspopup="true"
        onClick={handleOpen}
        className={classes.button}
        size="small">
        <Icon>expand_more</Icon>
      </IconButton>
      {isMobile ? (
        <SwipeableDrawer open={open} onClose={handleClose} onOpen={handleOpen} anchor="bottom" disableSwipeToOpen>
          {renderContent()}
        </SwipeableDrawer>
      ) : (
        <PopperRoot
          open={open}
          anchorEl={popperRef.current}
          role={undefined}
          transition
          className={classes.popperRoot}
          {...PopperProps}
          placement="right">
          {({TransitionProps, placement}) => (
            <Grow {...TransitionProps} style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
              <Paper variant={'outlined'} className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>{renderContent()}</ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </PopperRoot>
      )}
      {openConfirmDialog && (
        <ConfirmDialog
          open={openConfirmDialog}
          {...(currentAction === REMOVE_ROOM_USER
            ? {
                content: (
                  <FormattedMessage
                    id="ui.liveStreamRoom.participantTileActions.removeRoomUser"
                    defaultMessage="ui.liveStreamRoom.participantTileActions.removeRoomUser"
                  />
                )
              }
            : currentAction === BAN_ROOM_USER
            ? {
                content: (
                  <FormattedMessage
                    id="ui.liveStreamRoom.participantTileActions.banRoomUser"
                    defaultMessage="ui.liveStreamRoom.participantTileActions.banRoomUser"
                  />
                )
              }
            : {})}
          onConfirm={handleConfirmedAction}
          isUpdating={Boolean(currentActionLoading)}
          onClose={() => setOpenConfirmDialog(false)}
        />
      )}
    </Root>
  );
}
