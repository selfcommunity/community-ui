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
        textAlign: 'center',
        [`& .SCLiveStreamVideoConference-logo`]: {
          img: {
            maxHeight: 70,
            maxWidth: 300
          },
          marginBottom: theme.spacing(2)
        },
        [`& .SCLiveStreamVideoConference-btn-back-home`]: {
          marginTop: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
