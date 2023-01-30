const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      color: theme.palette.text.secondary,
      '& .MuiIcon-root': {
        fontSize: '1rem',
        lineHeight: '1.143rem',
        marginRight: 2
      },
      '& .MuiTypography-root': {
        lineHeight: '1rem',
        fontSize: '0.857rem'
      }
    })
  }
};

export default Component;
