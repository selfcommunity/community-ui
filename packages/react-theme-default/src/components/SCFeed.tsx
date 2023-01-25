const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      maxWidth: theme.breakpoints.values['lg'],
      '& .SCFeed-left': {
        padding: theme.spacing(1.25),
        '&:last-child': {
          paddingBottom: theme.spacing(4)
        }
      },
      '& .SCFeed-right': {
        padding: theme.spacing(1.25, 0),
        '& > * > .SCWidget-root': {
          marginBottom: theme.spacing(3)
        }
      },
      '& .SCFeed-end': {
        padding: 0,
        marginBottom: theme.spacing(3),
        '& > div': {
          padding: theme.spacing(2)
        }
      }
    })
  }
};

export default Component;
