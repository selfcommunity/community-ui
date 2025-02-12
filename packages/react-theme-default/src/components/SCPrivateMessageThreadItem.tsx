const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      flexDirection: 'column',
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2, 4, 4, 2),
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      marginBottom: theme.spacing(1),
      '& .MuiListItemSecondaryAction-root': {
        right: 10,
        top: theme.spacing(3),
        zIndex: 1,
        '& .MuiButtonBase-root': {
          fontSize: '1.2rem'
        }
      },
      '& .SCPrivateMessageThreadItem-message-time': {
        position: 'absolute',
        bottom: theme.spacing(0),
        right: theme.spacing(3),
        padding: theme.spacing(0.5, 0, 0.5, 0)
      },
      '& .SCPrivateMessageThreadItem-username': {
        marginRight: 'auto',
        marginBottom: theme.spacing(1)
      },
      '& .SCPrivateMessageThreadItem-text': {
        display: 'flex',
        alignItems: 'center',
        zIndex: 1,
        width: 'calc(100% - 24px)',
        minWidth: 'calc(100% - 24px)',
        '& .MuiTypography-root': {
          fontSize: '1.143rem',
          whiteSpace: 'pre-line',
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          hyphens: 'auto'
        }
      },
      '& .SCPrivateMessageThreadItem-img': {
        display: 'flex',
        alignItems: 'center',
        objectFit: 'cover',
        flex: '0 0 95%',
        '& img': {
          width: '100%',
          height: '100%'
        }
      },
      '& .SCPrivateMessageThreadItem-video': {
        '& .MuiButtonBase-root': {
          color: theme.palette.common.white,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-60%, -50%)',
          '& .MuiIcon-root': {
            color: theme.palette.common.white,
            fontSize: '6rem',
            [theme.breakpoints.down('md')]: {
              fontSize: '3rem'
            }
          }
        },
        '& .SCPrivateMessageThreadItem-icon-button': {
          top: '40%',
          [theme.breakpoints.up('sm')]: {
            transform: 'translate(-70%, -40%)'
          },
          '& .MuiIcon-root': {
            color: theme.palette.common.white,
            fontSize: '3rem',
            [theme.breakpoints.down('md')]: {
              fontSize: '2rem'
            }
          }
        }
      },
      '& .SCPrivateMessageThreadItem-document': {
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(32.5)
        },
        '& img': {
          height: '100%',
          width: '100%'
        },
        '& .MuiButtonBase-root': {
          flexWrap: 'wrap',
          width: '100%',
          position: 'absolute',
          bottom: theme.spacing(4),
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'rgba(255,255,255,0.9)',
          display: 'flex',
          borderRadius: 0,
          '& .MuiTypography-root': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginLeft: theme.spacing(0.5)
          }
        }
      },
      '& .SCPrivateMessageThreadItem-other': {
        marginTop: theme.spacing(2),
        '& .MuiButtonBase-root': {
          padding: theme.spacing(2, 1, 0, 1),
          flexWrap: 'wrap',
          '& .MuiTypography-root': {
            marginRight: theme.spacing(1),
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            [theme.breakpoints.down('md')]: {
              fontSize: theme.typography.fontSize
            }
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({}),
    dialogRoot: ({theme}: any) => ({
      '& h2 .MuiIconButton-root': {
        top: theme.spacing(1),
        fontSize: '1.57rem'
      }
    })
  }
};

export default Component;
