const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      margin: theme.spacing(1, 0),
      '& .SCLiveStreamFormSettings-access-view': {
        margin: theme.spacing(2, 0),
        width: '100%',
        '& .Mui-checked': {
          color: theme.palette.primary.main
        }
      }
    })
  }
};

export default Component;
