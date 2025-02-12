import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {SwipeableDrawer, MenuItem, IconButtonProps, IconButton, Menu, useTheme, useMediaQuery, List, ListItem} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Link, SCRoutes, SCRoutingContextType, SCThemeType, SCUserContextType, useSCRouting, useSCUser} from '@selfcommunity/react-core';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {SCGroupType, SCUserType} from '@selfcommunity/types';
import {GroupService} from '@selfcommunity/api-services';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import PubSub from 'pubsub-js';

const PREFIX = 'SCGroupSettingsIconButton';

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

export interface GroupSettingsIconButtonProps extends IconButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Handles callback on delete success
   */
  onRemoveSuccess?: () => void;
  /**
   * The user
   */
  user: SCUserType;
  /**
   * The group obj
   */
  group: SCGroupType;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS GroupSettingsIconButton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupSettingsIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupSettingsIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupSettingsIconButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function GroupSettingsIconButton(inProps: GroupSettingsIconButtonProps): JSX.Element {
  // PROPS
  const props: GroupSettingsIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, group, user, onRemoveSuccess, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

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
  };

  /**
   * Notify UI when a user is removed from a group
   * @param group
   * @param user
   */
  function notifyChanges(group: SCGroupType, user: SCUserType) {
    if (group && user) {
      PubSub.publish(`${SCTopicType.GROUP}.${SCGroupEventType.REMOVE_MEMBER}`, {group, user});
    }
  }

  /**
   * Handles thread deletion
   */
  function handleRemoveUser() {
    GroupService.removeUserFromGroup(group.id, user.id)
      .then(() => {
        notifyChanges(group, user);
        onRemoveSuccess && onRemoveSuccess();
        handleCloseDialog();
      })
      .catch((error) => {
        setOpenConfirmDialog(false);
        console.log(error);
      });
  }

  if (scUserContext?.user?.id === user?.id) {
    return null;
  }
  /**
   *
   */
  const renderList = () => {
    if (isMobile) {
      return [
        <ListItem className={classes.item} key="message" component={Link} to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, user)}>
          <FormattedMessage id="ui.groupSettingsIconButton.item.message" defaultMessage="ui.groupSettingsIconButton.item.message" />
        </ListItem>,
        <ListItem className={classes.item} key="delete" onClick={handleOpenDialog}>
          <FormattedMessage id="ui.groupSettingsIconButton.item.remove" defaultMessage="ui.groupSettingsIconButton.item.remove" />
        </ListItem>
      ];
    } else {
      return [
        <MenuItem className={classes.item} component={Link} to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, user)} key="message">
          <FormattedMessage id="ui.groupSettingsIconButton.item.message" defaultMessage="ui.groupSettingsIconButton.item.message" />
        </MenuItem>,
        <MenuItem className={classes.item} onClick={handleOpenDialog} key="delete">
          <FormattedMessage id="ui.groupSettingsIconButton.item.remove" defaultMessage="ui.groupSettingsIconButton.item.remove" />
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
            <FormattedMessage
              id="ui.groupSettingsIconButton.dialog.msg"
              defaultMessage="ui.groupSettingsIconButton.dialog.msg"
              values={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                b: (...chunks) => <strong>{chunks}</strong>,
                user: user.username,
                group: group.name
              }}
            />
          }
          btnConfirm={<FormattedMessage id="ui.groupSettingsIconButton.dialog.confirm" defaultMessage="ui.groupSettingsIconButton.dialog.confirm" />}
          onConfirm={handleRemoveUser}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
