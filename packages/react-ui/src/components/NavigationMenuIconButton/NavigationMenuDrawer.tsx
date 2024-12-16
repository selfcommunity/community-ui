import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Divider, Drawer, DrawerProps, Icon, IconButton, List} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import ScrollContainer from '../../shared/ScrollContainer';
import DefaultDrawerContent from './DefaultDrawerContent';
import DefaultHeaderContent from './DefaultHeaderContent';
import CreateLiveStreamButton, {CreateLiveStreamButtonProps} from '../CreateLiveStreamButton';
import {useSCUser} from '@selfcommunity/react-core';

const PREFIX = 'SCNavigationMenuDrawer';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  drawerRoot: `${PREFIX}-drawer-root`,
  drawerHeader: `${PREFIX}-drawer-header`,
  drawerHeaderAction: `${PREFIX}-drawer-header-action`,
  drawerContent: `${PREFIX}-drawer-content`,
  drawerFooter: `${PREFIX}-drawer-footer`,
  drawerFooterLiveStream: `${PREFIX}-drawer-footer-live`,
  drawerFooterLiveStreamButton: `${PREFIX}-drawer-footer-live-button`
};

const Root = styled(Drawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NavigationMenuDrawerProps extends DrawerProps {
  /**
   * Hide drawer header
   * @default true
   */
  showDrawerHeader?: boolean;
  /**
   * Custom Drawer header content
   * @default null
   */
  drawerHeaderContent?: React.ReactNode;
  /**
   * Custom Drawer content
   * @default null
   */
  drawerContent?: React.ReactNode;
  /**
   * Hide drawer footer
   * @default true
   */
  showDrawerFooter?: boolean;
  /**
   * Custom Drawer footer content
   * @default null
   */
  drawerFooterContent?: React.ReactNode;
  /**
   * Props to spread to ScrollContainer component
   * This lib use 'react-custom-scrollbars' component to perform scrollbars
   * For more info: https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
   * @default {}
   */
  ScrollContainerProps?: Record<string, any>;
  /**
   * Props to spread to CreateLiveStreamButton component
   * @default {}
   */
  CreateLiveStreamButtonComponentProps?: CreateLiveStreamButtonProps;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function NavigationMenuDrawer(inProps: NavigationMenuDrawerProps): JSX.Element {
  // PROPS
  const props: NavigationMenuDrawerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    showDrawerHeader = true,
    drawerHeaderContent = <DefaultHeaderContent />,
    drawerContent = <DefaultDrawerContent />,
    showDrawerFooterContent = true,
    drawerFooterContent = null,
    ScrollContainerProps = {},
    CreateLiveStreamButtonComponentProps = {},
    open,
    onClose,
    ...rest
  } = props;

  const scUserContext = useSCUser();
  const canCreateLiveStream = useMemo(() => scUserContext?.user?.permission?.create_livestream, [scUserContext?.user?.permission]);

  return (
    <Root anchor="left" className={classNames(classes.root, className)} open={open} onClose={onClose} {...rest}>
      {showDrawerHeader && (
        <>
          <Box className={classes.drawerHeader}>
            {drawerHeaderContent}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <IconButton className={classes.drawerHeaderAction} onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          </Box>
          <Divider />
        </>
      )}
      <ScrollContainer {...ScrollContainerProps}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <List className={classes.drawerContent} onClick={onClose}>
          {drawerContent}
        </List>
      </ScrollContainer>
      {showDrawerFooterContent && (
        <>
          <Box className={classes.drawerFooter}>
            {drawerFooterContent ? (
              drawerFooterContent
            ) : (
              <>
                {canCreateLiveStream && <Divider />}
                <Box className={classes.drawerFooterLiveStream}>
                  <CreateLiveStreamButton
                    color="primary"
                    className={classes.drawerFooterLiveStreamButton}
                    fullWidth
                    {...CreateLiveStreamButtonComponentProps}
                  />
                </Box>
              </>
            )}
          </Box>
        </>
      )}
    </Root>
  );
}
