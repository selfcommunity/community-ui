import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {SwipeableDrawer, MenuItem, ListItemIcon, IconButtonProps, IconButton, Menu, useTheme, useMediaQuery, List, ListItem} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Link, SCRoutes, SCRoutingContextType, SCThemeType, useSCRouting} from '@selfcommunity/react-core';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {PrivateMessageService} from '@selfcommunity/api-services';
import PubSub from 'pubsub-js';
import {SCGroupType, SCUserType} from '@selfcommunity/types';

const PREFIX = 'SCPrivateMessageSettingsIconButton';

const classes = {
  root: `${PREFIX}-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  menuRoot: `${PREFIX}-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'DrawerRoot'
})(() => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'MenuRoot'
})(() => ({}));

export interface PrivateMessageSettingsIconButtonProps extends IconButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Handles callback on menu item delete click
   */
  onMenuItemDeleteClick?: () => void;
  /**
   * Handles callback on delete confirm
   */
  onItemDeleteConfirm?: () => void;
  /**
   * The deleting thread id
   */
  threadToDelete?: number;
  /**
   * The user receiver context
   */
  user?: SCUserType;
  /**
   * The group
   */
  group?: SCGroupType;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS PrivateMessageSettingsIconButton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSettingsIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSettingsIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSettingsIconButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function PrivateMessageSettingsIconButton(inProps: PrivateMessageSettingsIconButtonProps): JSX.Element {
  // PROPS
  const props: PrivateMessageSettingsIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, onMenuItemDeleteClick, user, group, onItemDeleteConfirm, threadToDelete, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenConfirmDialog(true);
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
    setAnchorEl(null);
    onItemDeleteConfirm && onItemDeleteConfirm();
  };
  /**
   * Handles thread deletion
   */
  function handleDeleteThread() {
    const params = group ? {group: threadToDelete} : {user: threadToDelete};
    PrivateMessageService.deleteAThread(params)
      .then(() => {
        if (group) {
          PubSub.publish('snippetsChannelDeleteGroup', threadToDelete);
        } else {
          PubSub.publish('snippetsChannelDelete', threadToDelete);
        }
        handleCloseDialog();
      })
      .catch((error) => {
        setOpenConfirmDialog(false);
        console.log(error);
      });
  }
  /**
   *
   */
  const renderList = () => {
    if (isMobile) {
      return [
        user && !group && (
          <ListItem className={classes.item} key="profile" component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, user)}>
            <ListItemIcon>
              <Icon>people_alt</Icon>
            </ListItemIcon>
            <FormattedMessage
              id="ui.privateMessageSettingsIconButton.item.profile"
              defaultMessage="ui.privateMessageSettingsIconButton.item.profile"
            />
          </ListItem>
        ),
        group && !user && (
          <ListItem className={classes.item} key="group" component={Link} to={scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, group)}>
            <ListItemIcon>
              <Icon>groups</Icon>
            </ListItemIcon>
            <FormattedMessage id="ui.privateMessageSettingsIconButton.item.group" defaultMessage="ui.privateMessageSettingsIconButton.item.group" />
          </ListItem>
        ),
        <ListItem className={classes.item} key="delete" onClick={threadToDelete ? handleOpenDialog : onMenuItemDeleteClick}>
          <ListItemIcon>
            <Icon>delete</Icon>
          </ListItemIcon>
          <FormattedMessage id="ui.privateMessageSettingsIconButton.item.delete" defaultMessage="ui.privateMessageSettingsIconButton.item.delete" />
        </ListItem>
      ];
    } else {
      return [
        user && !group && (
          <MenuItem
            className={classes.item}
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, user)}
            key="profile"
            onClick={handleCloseDialog}>
            <ListItemIcon>
              <Icon>people_alt</Icon>
            </ListItemIcon>
            <FormattedMessage
              id="ui.privateMessageSettingsIconButton.item.profile"
              defaultMessage="ui.privateMessageSettingsIconButton.item.profile"
            />
          </MenuItem>
        ),
        group && !user && (
          <MenuItem
            className={classes.item}
            component={Link}
            to={scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, group)}
            key="group"
            onClick={handleCloseDialog}>
            <ListItemIcon>
              <Icon>groups</Icon>
            </ListItemIcon>
            <FormattedMessage id="ui.privateMessageSettingsIconButton.item.group" defaultMessage="ui.privateMessageSettingsIconButton.item.group" />
          </MenuItem>
        ),
        <MenuItem className={classes.item} onClick={threadToDelete ? handleOpenDialog : onMenuItemDeleteClick} key="delete">
          <ListItemIcon>
            <Icon>delete</Icon>
          </ListItemIcon>
          <FormattedMessage id="ui.privateMessageSettingsIconButton.item.delete" defaultMessage="ui.privateMessageSettingsIconButton.item.delete" />
        </MenuItem>
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
            <SwipeableDrawerRoot
              className={classes.drawerRoot}
              anchor="bottom"
              open
              onClose={handleClose}
              onOpen={handleOpen}
              PaperProps={{className: classes.paper}}
              disableSwipeToOpen>
              <List>{renderList()}</List>
            </SwipeableDrawerRoot>
          ) : (
            <MenuRoot className={classes.menuRoot} anchorEl={anchorEl} open onClose={handleClose} PaperProps={{className: classes.paper}}>
              {renderList()}
            </MenuRoot>
          )}
        </>
      )}
      {openConfirmDialog && (
        <ConfirmDialog
          open={openConfirmDialog}
          title={
            <FormattedMessage id="ui.privateMessageSettingsIconButton.dialog.msg" defaultMessage="ui.privateMessageSettingsIconButton.dialog.msg" />
          }
          btnConfirm={
            <FormattedMessage
              id="ui.privateMessageSettingsIconButton.dialog.confirm"
              defaultMessage="ui.privateMessageSettingsIconButton.dialog.confirm"
            />
          }
          onConfirm={handleDeleteThread}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
