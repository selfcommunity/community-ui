const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDialogTitle-root': {
        '& span': {
          flexGrow: 1,
          textAlign: 'center'
        }
      },
      '& .SCCreateLiveStreamDialog-root': {
        padding: theme.spacing(2, 0, 0, 0)
      }
    })
  }
};

export default Component;
