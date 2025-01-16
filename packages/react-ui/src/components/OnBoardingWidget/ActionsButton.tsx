import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {
  Icon,
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  SwipeableDrawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {FormattedMessage} from 'react-intl';
import {PreferenceService} from '@selfcommunity/api-services';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {SCPreferenceName} from '@selfcommunity/types';
import {PREFIX} from './constants';
import {SCThemeType} from '@selfcommunity/react-core';

const classes = {
  root: `${PREFIX}-actions-button-root`,
  drawerRoot: `${PREFIX}-actions-drawer-root`,
  menuRoot: `${PREFIX}-actions-menu-root`,
  paper: `${PREFIX}-actions-paper`,
  item: `${PREFIX}-actions-item`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.drawerRoot
})(() => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.menuRoot
})(() => ({}));

export interface OnBoardingActionsButtonProps extends IconButtonProps {
  isExpanded: boolean;
  onExpandChange: () => void;
  onHideOnBoarding: () => void;
}

export default function OnBoardingActionsButton(inProps: OnBoardingActionsButtonProps): JSX.Element {
  // PROPS
  const props: OnBoardingActionsButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, isExpanded, onExpandChange, onHideOnBoarding, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Updates onBoarding dynamic preference
   */
  const hideOnBoarding = () => {
    PreferenceService.updatePreferences({[`${SCPreferenceName.ONBOARDING_HIDDEN}`]: true})
      .then(() => {
        onHideOnBoarding();
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const renderList = () => {
    if (isMobile) {
      return [
        isExpanded ? (
          <ListItem className={classes.item} key="expand_less">
            <ListItemButton onClick={onExpandChange}>
              <ListItemIcon>
                <Icon>expand_less</Icon>
              </ListItemIcon>
              <FormattedMessage id="ui.onBoardingWidget.actionsMenu.view.less" defaultMessage="ui.onBoardingWidget.actionsMenu.view.less" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem className={classes.item} key="expand_more">
            <ListItemButton onClick={onExpandChange}>
              <ListItemIcon>
                <Icon>expand_more</Icon>
              </ListItemIcon>
              <FormattedMessage id="ui.onBoardingWidget.actionsMenu.view.more" defaultMessage="ui.onBoardingWidget.actionsMenu.view.more" />
            </ListItemButton>
          </ListItem>
        ),
        <ListItem className={classes.item} key="close">
          <ListItemButton onClick={hideOnBoarding}>
            <ListItemIcon>
              <Icon>close</Icon>
            </ListItemIcon>
            <FormattedMessage id="ui.onBoardingWidget.actionsMenu.close" defaultMessage="ui.onBoardingWidget.actionsMenu.close" />
          </ListItemButton>
        </ListItem>
      ];
    } else {
      return [
        isExpanded ? (
          <MenuItem className={classes.item} key="expand_less" onClick={onExpandChange}>
            <ListItemIcon>
              <Icon>expand_less</Icon>
            </ListItemIcon>
            <FormattedMessage id="ui.onBoardingWidget.actionsMenu.view.less" defaultMessage="ui.onBoardingWidget.actionsMenu.view.less" />
          </MenuItem>
        ) : (
          <MenuItem className={classes.item} key="expand_more" onClick={onExpandChange}>
            <ListItemIcon>
              <Icon>expand_more</Icon>
            </ListItemIcon>
            <FormattedMessage id="ui.onBoardingWidget.actionsMenu.view.more" defaultMessage="ui.onBoardingWidget.actionsMenu.view.more" />
          </MenuItem>
        ),
        <MenuItem className={classes.item} key="close" onClick={hideOnBoarding}>
          <ListItemIcon>
            <Icon>close</Icon>
          </ListItemIcon>
          <FormattedMessage id="ui.onBoardingWidget.actionsMenu.close" defaultMessage="ui.onBoardingWidget.actionsMenu.close" />
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
              onClick={() => setAnchorEl(null)}
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
            <MenuRoot
              onClick={() => setAnchorEl(null)}
              className={classes.menuRoot}
              anchorEl={anchorEl}
              open
              onClose={handleClose}
              PaperProps={{className: classes.paper}}>
              {renderList()}
            </MenuRoot>
          )}
        </>
      )}
    </>
  );
}
