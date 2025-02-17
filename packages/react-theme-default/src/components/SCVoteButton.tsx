const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      color: theme.palette.primary.main,
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      borderRadius: '50%',
      padding: theme.spacing(1.5),
      minWidth: 0,
      '& .MuiIcon-root': {
        fontSize: '1.57rem'
      },
      '&.MuiButton-sizeSmall': {
        padding: theme.spacing(0.5),
        '& .MuiIcon-root': {
          fontSize: '1rem'
        }
      }
    }),
    popperRoot: ({theme}: any) => ({
      zIndex: 1400,
      '& .SCVoteButton-reaction .MuiIcon-root': {
        fontSize: '22px'
      }
    })
  }
};

export default Component;
