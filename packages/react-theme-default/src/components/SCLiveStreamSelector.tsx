const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLiveStreamSelector-warning': {
        margin: theme.spacing(2, 5, 2, 5),
        [`& a`]: {
          color: theme.palette.common.white,
          fontWeight: 'bold'
        }
      },
      '& .SCLiveStreamSelector-options': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
          display: 'block'
        },
        '& > div': {
          width: '290px',
          [theme.breakpoints.down('sm')]: {
            margin: '0px auto',
            marginBottom: theme.spacing(2)
          }
        }
      },
      '& .SCLiveStreamSelector-actions': {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: theme.spacing(4)
      }
    }),
    optionCardRoot: ({theme, selected}: any) => ({
      maxWidth: 300,
      height: 'auto',
      minHeight: 425,
      padding: theme.spacing(3),
      margin: theme.spacing(0, 3),
      cursor: 'pointer',
      transition: theme.transitions.create(['background-color', 'box-shadow'], {
        duration: theme.transitions.duration.short
      }),
      backgroundColor: selected ? theme.palette.grey[100] : theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.grey[50],
        boxShadow: theme.shadows[2]
      },
      border: `1px solid ${theme.palette.divider}`,
      [`& > div`]: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
        maxWidth: '300px'
      },
      [`& ul`]: {
        marginTop: theme.spacing(2),
        padding: 0,
        listStyle: 'none'
      }
    }),
    featureItemRoot: ({theme, selected}: any) => ({
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing(1.5),
      marginBottom: theme.spacing(2),
      '&:last-child': {
        marginBottom: 0
      }
    })
  }
};

export default Component;
