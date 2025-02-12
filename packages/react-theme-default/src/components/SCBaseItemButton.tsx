const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      position: 'relative',
      width: '100%',
      '&.MuiPaper-elevation': {
        paddingTop: theme.spacing(),
        paddingBottom: theme.spacing(),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        '&.MuiPaper-elevation0': {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }
      },
      '& .SCBaseItemButton-content': {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: theme.spacing(2),
        '& .SCBaseItemButton-image': {
          flexShrink: 0
        },
        '& .SCBaseItemButton-text': {
          marginTop: theme.spacing(),
          marginBottom: theme.spacing(),
          '& .SCBaseItemButton-primary': {
            color: theme.palette.text.primary
          },
          '& .SCBaseItemButton-secondary': {
            color: theme.palette.text.secondary
          }
        }
      },
      '&.SCBaseItemButton-with-actions': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        '& .SCBaseItemButton-content': {
          overflow: 'hidden',
          '& .SCBaseItemButton-text': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexGrow: 1
          }
        },
        '& .SCBaseItemButton-actions': {
          flexShrink: 0,
          maxWidth: theme.spacing(19)
        }
      }
    })
  }
};

export default Component;
