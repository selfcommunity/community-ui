import React, {useContext, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Alert,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Popover,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {SCThemeType, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import Icon from '@mui/material/Icon';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';
import {useThemeProps} from '@mui/system';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-root`,
  helpPopover: `${PREFIX}-help-popover`,
  addMenuItem: `${PREFIX}-add-menuItem`,
  delMenuItem: `${PREFIX}-del-menuItem`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const messages = defineMessages({
  imageMaxSize: {
    id: 'ui.changeCover.button.change.alertMaxSize',
    defaultMessage: 'ui.changeCover.button.change.alertMaxSize'
  },
  errorLoadImage: {
    id: 'ui.changeCover.button.change.alertErrorImage',
    defaultMessage: 'ui.changeCover.button.change.alertErrorImage'
  }
});

export interface ChangeCoverProps {
  /**
   * On change function.
   * @default null
   */
  onChange?: (cover) => void;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Change Cover component. Learn about the available props and the CSS API.
 *
 *
 * This component renders a button that allows users to edit their profile cover and a popover that specifies format and sizes allowed.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/ChangeCover)

 #### Import
 ```jsx
 import {ChangeCover} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCChangeCoverButton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCChangeCoverButton-root|Styles applied to the root element.|
 |helpPopover|.SCChangeCoverButton-help-popover|Styles applied to the help popover element.|
 |addMenuItem|.SCChangeCoverButton-add-menuItem|Styles applied to the add menu element.|
 |delMenuItem|.SCChangeCoverButton-del-menuItem|Styles applied to the del menu element.|

 * @param inProps
 */
export default function ChangeCover(inProps: ChangeCoverProps): JSX.Element {
  //PROPS
  const props: ChangeCoverProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {onChange, autoHide, className, ...rest} = props;

  //CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  //STATE
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  let fileInput = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [anchorElPopover, setAnchorElPopover] = React.useState<null | HTMLElement>(null);
  const [openDeleteCoverDialog, setOpenDeleteCoverDialog] = useState<boolean>(false);
  const [isDeletingCover, setIsDeletingCover] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string | null>(null);

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const hasCover = scUserContext.user && scUserContext.user.cover !== null;

  const handleClickHelpButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElPopover(event.currentTarget);
  };
  const handleCloseHelpPopover = () => {
    setAnchorElPopover(null);
  };
  const isOpen = Boolean(anchorElPopover);

  // Anonymous
  if (!scUserContext.user) {
    return null;
  }

  /**
   * Handles file upload
   * @param event
   */
  const handleUpload = (event) => {
    const maxSize = 5 * 1024 * 1024;
    if (event.target.files[0]?.size <= maxSize) {
      fileInput = event.target.files[0];
      handleSave();
    } else {
      setAlert(intl.formatMessage(messages.imageMaxSize));
      setAnchorEl(null);
    }
  };

  /**
   * Handles deletion of a specific cover
   */
  function deleteCover() {
    setIsDeletingCover(true);
    handleSave(true);
  }

  /**
   * Handles cover saving after upload and delete actions
   */
  function handleSave(performDelete = false) {
    setLoading(true);
    const formData = new FormData();
    if (!performDelete) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      formData.append('cover', fileInput);
    } else {
      formData.append('cover', '');
    }
    http
      .request({
        url: Endpoints.UserPatch.url({id: scUserContext.user['id']}),
        method: Endpoints.UserPatch.method,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
      .then((res: HttpResponse<SCUserType>) => {
        scUserContext.updateUser({cover: res.data.cover});
        onChange && onChange(res.data.cover);
        setAnchorEl(null);
        setLoading(false);
        if (performDelete) {
          setIsDeletingCover(false);
          setOpenDeleteCoverDialog(false);
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setLoading(false);
        setAlert(intl.formatMessage(messages.errorLoadImage));
      });
  }

  /**
   * Renders change cover menu items
   */
  function renderMenuItems() {
    return (
      <Box>
        {loading ? (
          <MenuItem sx={{justifyContent: 'center'}}>
            <CircularProgress size={15} />
          </MenuItem>
        ) : (
          <>
            <input type="file" onChange={handleUpload} ref={fileInput} hidden accept=".gif,.png,.jpg,.jpeg" />
            <MenuItem disabled={loading} onClick={() => fileInput.current.click()} className={classes.addMenuItem}>
              <ListItemIcon>
                <Icon>add_circle_outline</Icon>
              </ListItemIcon>
              <FormattedMessage id="ui.changeCover.button.upload" defaultMessage="ui.changeCover.button.upload" />
            </MenuItem>
            {hasCover && (
              <MenuItem className={classes.delMenuItem} onClick={() => setOpenDeleteCoverDialog(true)}>
                <ListItemIcon>
                  <Icon>delete</Icon>
                </ListItemIcon>
                <FormattedMessage id="ui.changeCover.button.delete" defaultMessage="ui.changeCover.button.delete" />
              </MenuItem>
            )}
          </>
        )}
      </Box>
    );
  }

  /**
   * Renders change cover menu
   */
  const cc = (
    <React.Fragment>
      <Button size="small" variant="contained" disabled={loading} onClick={handleOpen} {...rest}>
        <Icon>photo_camera</Icon>
      </Button>
      {open && (
        <>
          {isMobile ? (
            <SwipeableDrawer open onClose={handleClose} onOpen={handleOpen} anchor="bottom" disableSwipeToOpen>
              {renderMenuItems()}
            </SwipeableDrawer>
          ) : (
            <Menu anchorEl={anchorEl} open onClose={handleClose}>
              {renderMenuItems()}
            </Menu>
          )}
        </>
      )}
      {!isMobile && (
        <>
          <Button className={classes.helpPopover} variant="contained" onClick={handleClickHelpButton}>
            <Icon>help_outline</Icon>
          </Button>
          {isOpen && (
            <Popover
              open={isOpen}
              anchorEl={anchorElPopover}
              onClose={handleCloseHelpPopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}>
              <Box sx={{p: '10px'}}>
                <Typography component="h3">
                  <FormattedMessage id="ui.changeCover.button.uploadA" defaultMessage="ui.changeCover.button.uploadA" />
                </Typography>
                <Divider />
                <Typography component="span">
                  <FormattedMessage
                    id="ui.changeCover.info"
                    defaultMessage="ui.changeCover.info"
                    values={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                      // @ts-ignore
                      li: (chunks) => <li>{chunks}</li>,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                      // @ts-ignore
                      ul: (chunks) => <ul>{chunks}</ul>
                    }}
                  />
                </Typography>
              </Box>
            </Popover>
          )}
        </>
      )}
      {openDeleteCoverDialog && (
        <ConfirmDialog
          open={openDeleteCoverDialog}
          title={<FormattedMessage id="ui.changeCover.dialog.msg" defaultMessage="ui.changeCover.dialog.msg" />}
          onConfirm={deleteCover}
          isUpdating={isDeletingCover}
          onClose={() => {
            setOpenDeleteCoverDialog(false);
            setAnchorEl(null);
          }}
        />
      )}
    </React.Fragment>
  );

  /**
   * If there is an error
   */
  if (alert) {
    return (
      <Alert color="error" onClose={() => setAlert(null)}>
        {alert}
      </Alert>
    );
  }

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return (
      <Root {...rest} className={classNames(classes.root, className)}>
        {cc}
      </Root>
    );
  }
  return null;
}
