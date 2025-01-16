const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      [`& .SCLiveStreamRoom-title`]: {
        margin: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary
      },
      [`& .SCLiveStreamRoom-description`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: '1px solid #555555',
        borderRadius: '5px',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(0, 2)
      },
      [`& .SCLiveStreamRoom-content`]: {
        width: '100%'
      },
      [`& .SCLiveStreamRoom-prejoin`]: {
        margin: theme.spacing(),
        padding: theme.spacing(),
        display: 'grid',
        placeItems: 'center',
        height: 'auto',
        position: 'relative',
        '& .lk-form-control': {
          display: 'none'
        }
      },
      [`& .SCLiveStreamRoom-prejoin-loading`]: {
        '& .lk-prejoin': {
          opacity: 0.5
        }
      },
      [`& .SCLiveStreamRoom-prejoin-alert`]: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: '1px solid #555555',
        borderRadius: '5px'
      },
      [`& .SCLiveStreamRoom-share-link`]: {
        marginTop: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        '& textarea': {
          color: theme.palette.text.primary,
          '-webkit-text-fill-color': theme.palette.text.primary
        }
      },
      [`& .SCLiveStreamRoom-conference`]: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111111'
      },
      [`& .SCLiveStreamRoom-prejoin-loader`]: {
        maxWidth: 620,
        width: '100%',
        position: 'absolute',
        textAlign: 'center',
        '& .MuiTypography-root': {
          color: '#111111'
        }
      },
      [`& .SCLiveStreamRoom-end-prejoin-content`]: {
        color: theme.palette.common.black,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        paddingBottom: theme.spacing(3),
        [`& .SCLiveStreamRoom-end-prejoin-content-box`]: {
          width: '47%',
          [theme.breakpoints.down('md')]: {
            width: '90%'
          }
        }
      },
      '& .lk-prejoin': {
        maxWidth: 620,
        width: '100%',
        backgroundColor: '#111111',
        borderRadius: theme.shape.borderRadiusSm
      },
      '& .lk-join-button': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark
        }
      }
    }),
    dialogRoot: ({theme}: any) => ({
      [`& .SCLiveStreamRoom-end-conference-wrap`]: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        [`& .SCLiveStreamVideoConference-btn-back-home`]: {
          marginTop: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
