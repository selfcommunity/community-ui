const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      height: '100vh',
      width: '100%',
      overflowY: 'hidden'
    }),
    dialogRoot: ({theme}: any) => ({
      [`& .SCLiveStreamVideoConference-end-conference-wrap`]: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        [`& .SCLiveStreamVideoConference-logo`]: {
          img: {
            maxHeight: '100px'
          }
        },
        [`& .SCLiveStreamVideoConference-btn-back-home`]: {
          marginTop: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
