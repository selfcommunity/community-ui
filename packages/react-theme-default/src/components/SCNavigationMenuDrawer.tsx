import {darken} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDrawer-paper': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(40)
        }
      },
      '& .SCNavigationMenuDrawer-drawer-header': {
        minHeight: theme.mixins.toolbar.minHeight,
        padding: '1px',
        display: 'flex',
        justifyContent: 'space-between',
        '& > a:first-of-type': {
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          flexWrap: 'wrap'
        },
        '& img': {
          maxHeight: theme.mixins.toolbar.minHeight - 20,
          paddingLeft: theme.spacing(1.5)
        }
      },
      '& .SCNavigationMenuDrawer-drawer-content': {
        paddingTop: 0
      },
      '& .MuiTypography-subtitle1': {
        fontSize: '1.286rem',
        padding: theme.spacing(0, 2),
        '& MuiButton-root': {
          padding: theme.spacing(1, 1, 1, 2)
        },
        '& span:first-of-type': {
          color: darken(theme.palette.text.primary, 0.5)
        }
      },
      '& .SCBaseItemButton-text ': {
        maxWidth: '80%'
      },
      '& .SCNavigationMenuDrawer-drawer-footer-live-button': {
        margin: theme.spacing(3),
        maxWidth: 270
      }
    })
  }
};

export default Component;
