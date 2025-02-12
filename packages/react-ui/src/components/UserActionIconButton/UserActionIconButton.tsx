import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Divider,
  Icon,
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  SwipeableDrawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {SCUserType} from '@selfcommunity/types';
import {Link, SCContextType, SCThemeType, SCUserContextType, UserUtils, useSCContext, useSCFetchUser, useSCUser} from '@selfcommunity/react-core';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {FormattedMessage} from 'react-intl';
import UserInfoDialog from '../UserInfoDialog';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {TransitionProps} from '@mui/material/transitions';
import {useSnackbar} from 'notistack';

const PREFIX = 'SCUserActionIconButton';

const classes = {
  root: `${PREFIX}-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  menuRoot: `${PREFIX}-menu-root`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.drawerRoot
})(({theme}) => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.menuRoot
})(({theme}) => ({}));

export interface UserActionIconButtonProps extends IconButtonProps {
  /**
   * Id of user object
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  items?: any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * > API documentation for the Community-JS User Action Menu component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserActionIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SUserActionIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SUserActionIconButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function UserActionIconButton(inProps: UserActionIconButtonProps): JSX.Element {
  // PROPS
  const props: UserActionIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, userId = null, user = null, items = [], ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scContext: SCContextType = useSCContext();

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [isHiddenLoading, setHiddenLoading] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean | null>(null);
  const [openHideDialog, setOpenHideDialog] = useState<boolean>(false);

  // HOOKS
  const {scUser} = useSCFetchUser({id: userId, user});
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleInfoOpen = () => {
    setInfoOpen(true);
    setAnchorEl(null);
  };
  const handleInfoClose = () => {
    setInfoOpen(false);
  };
  const handleHideToggle = () => {
    setHiddenLoading(true);
    scUserContext.managers.blockedUsers
      .block(scUser)
      .then((blocked) => {
        setHidden(blocked);
      })
      .then(() => setHiddenLoading(false))
      .catch(() => {
        enqueueSnackbar(<FormattedMessage id="ui.common.action.notPermitted" defaultMessage="ui.common.action.notPermitted" />, {
          variant: 'warning',
          autoHideDuration: 7000
        });
        setHiddenLoading(false);
        handleHide();
      });
  };
  const handleHide = useMemo(
    () => () => {
      setOpenHideDialog((prev) => !prev);
      handleClose();
    },
    [setOpenHideDialog, handleClose]
  );

  // MEMO
  const isMe = scUserContext.user && scUser.id === scUserContext.user.id;
  const roles = useMemo(() => scUserContext.user && scUserContext?.user.role, [scUserContext.user]);
  const canModerate = useMemo(() => roles && (roles.includes('admin') || roles.includes('moderator')) && !isMe, [roles, isMe]);

  /**
   * Fetches platform url
   */
  function fetchPlatform(query: string) {
    http
      .request({
        url: Endpoints.Platform.url(),
        method: Endpoints.Platform.method,
        params: {
          next: query
        }
      })
      .then((res: HttpResponse<any>) => {
        handleClose();
        const platformUrl = res.data.platform_url;
        window.open(platformUrl, '_blank').focus();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // EFFECTS
  useEffect(() => {
    if (anchorEl && hidden === null && scUser) {
      setHidden(scUserContext.managers.blockedUsers.isBlocked(scUser));
    }
  }, [anchorEl, scUser]);

  // RENDER
  if (!scUserContext.user) {
    return null;
  }

  const renderList = () => {
    if (isMobile) {
      return [
        ...items.map((item, index) => (
          <ListItem key={index}>
            <ListItemButton component={Link} to={item.to}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        )),
        <ListItem key="info">
          <ListItemButton onClick={handleInfoOpen}>
            <ListItemText
              primary={<FormattedMessage defaultMessage="ui.userActionIconButton.information" id="ui.userActionIconButton.information" />}
            />
          </ListItemButton>
        </ListItem>,
        ...(isMe
          ? []
          : [
              <Divider key="divider" />,
              <ListItem key="hide">
                <ListItemButton
                  onClick={handleHideToggle}
                  disabled={isHiddenLoading || scUser.community_badge || (!hidden && UserUtils.isStaff(scUser))}>
                  <ListItemText
                    primary={
                      hidden ? (
                        <FormattedMessage defaultMessage="ui.userActionIconButton.show" id="ui.userActionIconButton.show" />
                      ) : (
                        <FormattedMessage defaultMessage="ui.userActionIconButton.hide" id="ui.userActionIconButton.hide" />
                      )
                    }
                  />
                </ListItemButton>
              </ListItem>,
              ...(canModerate
                ? [
                    <Divider key="divider_moderate" />,
                    <ListItem key="moderate">
                      <ListItemButton component={Link} onClick={() => fetchPlatform(`/moderation/user/?username=${scUser.username}`)}>
                        <ListItemText
                          primary={<FormattedMessage defaultMessage="ui.userActionIconButton.moderate" id="ui.userActionIconButton.moderate" />}
                        />
                      </ListItemButton>
                    </ListItem>
                  ]
                : [])
            ])
      ];
    } else {
      return [
        ...items.map((item, index) => (
          <MenuItem key={index} component={Link} to={item.to} onClick={handleClose}>
            {item.label}
          </MenuItem>
        )),
        <MenuItem key="info" onClick={handleInfoOpen}>
          <FormattedMessage defaultMessage="ui.userActionIconButton.information" id="ui.userActionIconButton.information" />
        </MenuItem>,
        ...(isMe
          ? []
          : [
              <Divider key="divider" />,
              <MenuItem key="hide" onClick={handleHide} disabled={isHiddenLoading || scUser.community_badge}>
                {hidden ? (
                  <FormattedMessage defaultMessage="ui.userActionIconButton.show" id="ui.userActionIconButton.show" />
                ) : (
                  <FormattedMessage defaultMessage="ui.userActionIconButton.hide" id="ui.userActionIconButton.hide" />
                )}
              </MenuItem>,
              ...(canModerate
                ? [
                    <Divider key="divider_moderate" />,
                    <MenuItem key="moderate" component={Link} onClick={() => fetchPlatform(`/moderation/user/?username=${scUser.username}`)}>
                      <FormattedMessage defaultMessage="ui.userActionIconButton.moderate" id="ui.userActionIconButton.moderate" />
                    </MenuItem>
                  ]
                : [])
            ])
      ];
    }
  };

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={handleOpen}>
        <Icon>more_vert</Icon>
      </Root>
      {Boolean(anchorEl) && (
        <>
          {isMobile ? (
            <SwipeableDrawerRoot className={classes.drawerRoot} anchor="bottom" open onClose={handleClose} onOpen={handleOpen} disableSwipeToOpen>
              <List>{renderList()}</List>
            </SwipeableDrawerRoot>
          ) : (
            <MenuRoot className={classes.menuRoot} anchorEl={anchorEl} open onClose={handleClose}>
              {renderList()}
            </MenuRoot>
          )}
        </>
      )}
      <UserInfoDialog userId={userId} user={scUser} open={infoOpen} onClose={handleInfoClose} />
      {openHideDialog && (
        <ConfirmDialog
          open={openHideDialog}
          isUpdating={isHiddenLoading}
          TransitionComponent={Transition}
          keepMounted
          title={
            hidden ? (
              <FormattedMessage defaultMessage="ui.userActionIconButton.show" id="ui.userActionIconButton.show" />
            ) : (
              <FormattedMessage defaultMessage="ui.userActionIconButton.hide" id="ui.userActionIconButton.hide" />
            )
          }
          content={
            hidden ? (
              <FormattedMessage defaultMessage="ui.userActionIconButton.dialogShowAction" id="ui.userActionIconButton.dialogShowAction" />
            ) : (
              <FormattedMessage defaultMessage="ui.userActionIconButton.dialogHideAction" id="ui.userActionIconButton.dialogHideAction" />
            )
          }
          onConfirm={handleHideToggle}
          onClose={() => setOpenHideDialog(false)}
        />
      )}
    </>
  );
}
