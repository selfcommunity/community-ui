const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCLiveStreamForm-cover': {
        position: 'relative',
        height: 120,
        minHeight: 120,
        '& .SCEventForm-upload-event-cover-root': {
          position: 'absolute',
          right: theme.spacing(2),
          bottom: theme.spacing(1),
          padding: theme.spacing(1),
          minWidth: 'auto'
        }
      },
      '& .SCLiveStreamForm-warning': {
        margin: theme.spacing(2, 0),
        [`& a`]: {
          color: theme.palette.common.white,
          fontWeight: 'bold'
        }
      },
      [`& .SCLiveStreamForm-access-view`]: {
        margin: theme.spacing(2, 0)
      },
      [`& .SCLiveStreamForm-actions`]: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(2)
      }
    })
  }
};

export default Component;
