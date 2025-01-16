const Component = {
  styleOverrides: {
    displayRoot: ({theme}: any) => ({
      textAlign: 'center',
      margin: 'auto',
      width: '100%',
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        minHeight: 170
      },
      '& .SCMediaFile-background': {
        backgroundSize: 'cover !important',
        backgroundPosition: 'center !important',
        backgroundRepeat: 'no-repeat !important'
      },
      '& .SCMediaFile-background-portrait': {
        backgroundSize: 'contain !important',
        backgroundPosition: 'center !important',
        backgroundRepeat: 'no-repeat !important'
      },
      '& .SCMediaFile-height-one': {
        width: '100%',
        paddingTop: '99%'
      },
      '& .SCMediaFile-height-half-one': {
        paddingTop: '50%'
      },
      '& .SCMediaFile-height-two': {
        width: '50%',
        paddingTop: '50%'
      },
      '& .SCMediaFile-height-three': {
        width: '33.3333%',
        paddingTop: '33.3333%'
      },
      '& .SCMediaFile-cover': {
        backgroundColor: 'rgba(102,102,102,0.2)',
        opacity: 0.8,
        position: 'absolute',
        right: 0,
        top: 0,
        left: 0,
        bottom: 0
      },
      '& .SCMediaFile-cover-text': {
        right: 0,
        left: 0,
        bottom: 0,
        color: '#FFF',
        fontSize: '7%',
        position: 'absolute',
        top: '50%',
        transform: 'translate(0%, -50%)',
        textAlign: 'center',
        '& > p': {
          margin: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      },
      '& .SCMediaFile-slide': {
        height: 0,
        bottom: '100%',
        overflow: 'hidden',
        fontSize: '3%',
        color: '#FFF'
      },
      '& .SCMediaFile-border': {
        position: 'relative',
        border: '2px solid #FFF',
        '&:hover > div': {
          bottom: 0,
          height: 'auto'
        },
        '&:hover > div.animate-text': {
          top: '66%'
        }
      },
      '& .SCMediaFile-gallery': {
        cursor: 'pointer'
      },
      '& .SCMediaFile-title .MuiTypography-root': {
        color: '#FFF',
        backgroundColor: theme.palette.getContrastText('#FFF'),
        opacity: 0.6
      },
      '& .SCMediaFile-icon-file': {
        fontSize: 14,
        position: 'relative',
        top: 2
      }
    }),
    lightboxRoot: ({theme}: any) => ({}),
    previewRoot: ({theme}: any) => ({
      '& > div': {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        maxWidth: '100%',
        overflow: 'auto',
        scrollbarWidth: 'thin',
        '& .SCMediaFile-media': {
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          borderRadius: theme.shape.borderRadius * 0.5,
          margin: theme.spacing(0.5),
          width: 120,
          height: 140,
          flexBasis: 120,
          flexGrow: 0,
          flexShrink: 0,
          '& .SCMediaFile-title': {
            position: 'absolute',
            left: theme.spacing(1),
            top: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            background: '#33333380 0% 0% no-repeat padding-box',
            color: theme.palette.common.white,
            fontSize: '0.875rem',
            padding: theme.spacing(0.5, 1),
            maxWidth: 50,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          },
          '& .SCMediaFile-delete': {
            background: theme.palette.common.white,
            position: 'absolute',
            right: theme.spacing(0.5),
            top: theme.spacing(0.5)
          }
        },
        '&:has(> :last-child:nth-of-type(1)) .SCMediaFile-media': {
          width: '100%',
          flexBasis: '100%',
          height: 220,
          margin: theme.spacing(0.5, 0),
          '& .SCMediaFile-title': {
            fontSize: '1rem',
            maxWidth: 200
          }
        }
      }
    }),
    triggerRoot: ({theme}: any) => ({}),
    triggerDrawerRoot: ({theme}: any) => ({
      zIndex: 1300
    }),
    triggerMenuRoot: ({theme}: any) => ({})
  }
};

export default Component;
