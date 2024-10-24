const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      [`& .SCLiveStreamRoom-content`]: {
        width: '100%'
      },
      [`& .SCLiveStreamRoom-preJoin`]: {
        padding: theme.spacing(2),
        display: 'grid',
        placeItems: 'center',
        height: '100%'
      },
      [`& .SCLiveStreamRoom-conference`]: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111111'
      },
      '& .lk-prejoin': {
        width: '620px',
        backgroundColor: '#111111',
        borderRadius: theme.shape.borderRadiusSm
      },
      '& .lk-form-control': {
        display: 'none'
      },
      '& .lk-join-button': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark
        }
      }
    })
  }
};

export default Component;
