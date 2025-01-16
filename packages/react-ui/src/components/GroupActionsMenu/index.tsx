import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Divider, IconButton, IconButtonProps, List, ListItemIcon, Menu, MenuItem, SwipeableDrawer, useMediaQuery, useTheme} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCRoutes, SCRoutingContextType, SCThemeType, SCUserContextType, useSCFetchGroup, useSCRouting, useSCUser} from '@selfcommunity/react-core';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {GroupService} from '@selfcommunity/api-services';
import {SCGroupType} from '@selfcommunity/types';
import {copyTextToClipboard} from '@selfcommunity/utils';
import {enqueueSnackbar} from 'notistack';
import PubSub from 'pubsub-js';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import GroupForm from '../../components/GroupForm';
import {DELETE_GROUP, GET_GROUP_LINK} from '../../constants/GroupActionsMenu';

const PREFIX = 'SCGroupActionsMenu';

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

export interface GroupActionsMenuProps extends IconButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The group
   */
  group: SCGroupType;
  /**
   * The group id
   */
  groupId?: number;
  /**
   * Handles callback on delete confirm
   */
  onDeleteConfirm?: () => void;

  /**
   * Handles on edit success
   */
  onEditSuccess?: (data: SCGroupType) => any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS GroupActionsMenu component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupActionsMenu} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupActionsMenu` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupActionsMenu-root|Styles applied to the root element.|
 |drawerRoot|.SCGroupActionsMenu-drawer-root|Styles applied to the drawer root element.|
 |menuRoot|.SCGroupActionsMenu-menu-root|Styles applied to the menu root element.|
 |paper|.SCGroupActionsMenu-paper|Styles applied to the paper element.|
 |item|.SCGroupActionsMenu-item|Styles applied to the item element.|


 * @param inProps
 */
export default function GroupActionsMenu(inProps: GroupActionsMenuProps): JSX.Element {
  // PROPS
  const props: GroupActionsMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, group, groupId, onDeleteConfirm, onEditSuccess, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();
  const {scGroup, setSCGroup} = useSCFetchGroup({id: groupId, group});

  const isGroupAdmin = useMemo(
    () => scUserContext.user && scGroup?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scGroup?.managed_by?.id]
  );

  // HANDLERS
  const handleOpen = (group: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(group.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditClick = () => {
    setOpenEdit((o) => !o);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
    setAnchorEl(null);
  };

  const handleEditSuccess = (data: SCGroupType) => {
    setSCGroup(data);
    onEditSuccess && onEditSuccess(data);
  };

  /**
   * Handles thread deletion
   */
  function handleDeleteThread() {
    GroupService.deleteGroup(scGroup.id)
      .then(() => {
        onDeleteConfirm();
        handleCloseDialog();
        PubSub.publish(`${SCTopicType.GROUP}.${SCGroupEventType.DELETE}`, scGroup.id);
      })
      .catch((error) => {
        setOpenConfirmDialog(false);
        console.log(error);
      });
  }

  /**
   * Handles actions
   */
  function handleAction(action) {
    if (action === GET_GROUP_LINK) {
      copyTextToClipboard(`${location.protocol}//${location.host}${scRoutingContext.url(SCRoutes.GROUP_ROUTE_NAME, scGroup)}`).then(() => {
        enqueueSnackbar(<FormattedMessage id="ui.common.permanentLinkCopied" defaultMessage="ui.common.permanentLinkCopied" />, {
          variant: 'success',
          autoHideDuration: 3000
        });
      });
      handleClose();
    } else if (action === DELETE_GROUP) {
      setOpenConfirmDialog(true);
      handleClose();
    }
  }

  /**
   *
   */
  const renderList = () => {
    return [
      <MenuItem className={classes.item} key="link" onClick={() => handleAction(GET_GROUP_LINK)}>
        <ListItemIcon>
          <Icon>link</Icon>
        </ListItemIcon>
        <FormattedMessage id="ui.groupActionsMenu.item.link" defaultMessage="ui.groupActionsMenu.item.link" />
      </MenuItem>,
      isGroupAdmin &&
        scGroup.active && [
          <Divider key="divider" />,
          isMobile && (
            <MenuItem className={classes.item} key="edit" onClick={handleEditClick}>
              <ListItemIcon>
                <Icon>edit</Icon>
              </ListItemIcon>
              <FormattedMessage id="ui.groupActionsMenu.item.edit" defaultMessage="ui.groupActionsMenu.item.edit" />
            </MenuItem>
          ),
          <MenuItem className={classes.item} onClick={() => handleAction(DELETE_GROUP)} key="delete">
            <ListItemIcon>
              <Icon>delete</Icon>
            </ListItemIcon>
            <FormattedMessage id="ui.groupActionsMenu.item.delete" defaultMessage="ui.groupActionsMenu.item.delete" />
          </MenuItem>
        ]
    ];
  };

  if (!scGroup) {
    return null;
  }

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
          title={<FormattedMessage id="ui.groupActionsMenu.dialog.msg" defaultMessage="ui.groupActionsMenu.dialog.msg" />}
          btnConfirm={<FormattedMessage id="ui.groupActionsMenu.dialog.confirm" defaultMessage="ui.groupActionsMenu.dialog.confirm" />}
          onConfirm={handleDeleteThread}
          onClose={handleCloseDialog}
        />
      )}
      {openEdit && <GroupForm onClose={handleEditClick} group={scGroup} onSuccess={handleEditSuccess} />}
    </>
  );
}
