import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .MuiDialog-paper': {
        [theme.breakpoints.down('md')]: {
          height: '100%'
        },
        position: 'relative',
        overflowX: 'hidden',
        '& > form': {
          zIndex: 0,
          height: '100%'
        },
        '& .MuiDialogTitle-root': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: theme.spacing(0.5, 2, 0.5, 1),
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.grey[400]}`,
          zIndex: 2,
          backgroundColor: theme.palette.background.paper,
          '& .MuiTypography-root': {
            flexGrow: 1,
            textAlign: 'left',
            fontWeight: theme.typography.fontWeightMedium
          }
        },
        '& .MuiDialogContent-root': {
          margin: '45px 0',
          padding: theme.spacing(1, 2),
          height: `calc(100% - 45px - 45px - ${theme.spacing(2)})`,
          [theme.breakpoints.up('md')]: {
            overflowY: 'hidden'
          },
          '& .SCEditor-root': {
            padding: theme.spacing(1, 0),
            marginBottom: theme.spacing(3),
            position: 'relative',
            '& .SCEditor-placeholder': {
              left: 0,
              position: 'absolute'
            },
            '&.SCEditor-toolbar': {
              '& .SCEditorToolbarPlugin-root': {
                zIndex: 1,
                position: 'absolute',
                display: 'flex',
                bottom: theme.spacing(7),
                right: theme.spacing(0.2),
                left: theme.spacing(0.2),
                marginBottom: 0,
                backgroundColor: theme.palette.background.paper
              }
            }
          }
        },
        '& .SCComposer-types': {
          position: 'absolute',
          zIndex: 2,
          bottom: theme.spacing(7),
          left: 0,
          right: 0,
          justifyContent: 'center'
        },
        '& .MuiDialogActions-root': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: theme.spacing(0.5, 1),
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          zIndex: 1,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.grey[400]}`
        },
        '& .SCComposer-general-error': {
          marginBottom: theme.spacing(2),
          color: theme.palette.error.main
        }
      },
      [theme.breakpoints.up('md')]: {
        '& .MuiDialog-paper': {
          '& > form': {
            zIndex: 0
          },
          '& .MuiDialogContent-root': {
            minHeight: 300,
            height: 'auto'
          },
          '& .MuiDialogActions-root': {
            justifyContent: 'center'
          }
        }
      }
    }),
    attributesRoot: ({theme}: any) => ({}),
    contentDiscussionRoot: ({theme}: any) => ({
      '& .SCComposer-content-discussion-title': {
        '& .MuiInputBase-root': {
          maxHeight: 160,
          overflowY: 'auto',
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          fontSize: '1.3rem',
          fontWeight: theme.typography.fontWeightBold,
          [theme.breakpoints.up('md')]: {
            maxHeight: 110
          },
          '& fieldset': {
            display: 'none'
          },
          '&.MuiInputBase-adornedEnd .MuiTypography-root': {
            alignSelf: 'end'
          },
          '&.Mui-error': {
            color: theme.palette.error.main
          }
        },
        '& .MuiFormHelperText-root': {
          marginLeft: 0
        }
      },
      '& .SCEditor-root': {
        '& .SCEditor-placeholder': {
          top: theme.spacing(7)
        },
        '& .SCEditor-content': {
          overflowY: 'auto',
          minHeight: 300,
          maxHeight: `calc(100vh - 45px - 45px - 55px - 45px - ${theme.spacing(2)})`,
          [theme.breakpoints.up('md')]: {
            maxHeight: 380
          }
        }
      }
    }),
    contentPollRoot: ({theme}: any) => ({
      padding: theme.spacing(2),
      '& .SCComposer-content-poll-title, & .SCComposer-content-poll-choices, & .SCComposer-content-poll-choice-new, & .SCComposer-content-poll-metadata':
        {
          marginBottom: theme.spacing(3)
        },
      '& .SCComposer-content-poll-choices .MuiTextField-root': {
        marginBottom: theme.spacing()
      },
      '& .SCComposer-content-poll-metadata': {
        marginTop: theme.spacing(3)
      }
    }),
    contentPostRoot: ({theme}: any) => ({
      '& .SCEditor-root': {
        '& .SCEditor-placeholder': {
          top: theme.spacing()
        },
        '& .SCEditor-content': {
          overflowY: 'auto',
          minHeight: 300,
          maxHeight: `calc(100vh - 45px - 45px - ${theme.spacing(3)})`,
          [theme.breakpoints.up('md')]: {
            maxHeight: 400
          }
        }
      }
    }),
    layerTransitionRoot: ({theme}: any) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 5,
      background: theme.palette.background.paper,
      '& .MuiDialogContent-root': {
        height: 'calc(100% - 45px - 16px) !important',
        marginBottom: '0 !important'
      }
    }),
    layerAudienceRoot: ({theme}: any) => ({
      '& .MuiTabs-root': {
        minHeight: 'auto',
        marginBottom: theme.spacing(4),
        '& .MuiTabs-flexContainer': {
          justifyContent: 'center',
          '& .MuiTab-labelIcon': {
            minHeight: 'auto',
            flexDirection: 'row',
            '& .MuiIcon-root': {
              marginRight: theme.spacing(1)
            }
          }
        }
      },
      '& .SCComposer-layer-audience-message': {
        textAlign: 'center',
        marginBottom: theme.spacing(4)
      }
    }),
    layerCategoryRoot: ({theme}: any) => ({}),
    layerGroupRoot: ({theme}: any) => ({}),
    layerCloseRoot: ({theme}: any) => ({
      '& .SCComposer-layer-content': {
        '& .MuiTypography-root': {
          textAlign: 'center'
        },
        '& .MuiList-root': {
          '& .MuiListItem-root': {
            padding: 0,
            '& .MuiTypography-root': {
              fontSize: '1.143rem'
            },
            '&:nth-last-of-type(1)': {
              color: theme.palette.error.main
            }
          }
        }
      }
    }),
    layerLocationRoot: ({theme}: any) => ({}),
    skeletonRoot: ({theme}: any) => ({}),
    typeSwitchButtonGroupRoot: ({theme}: any) => ({
      '& .MuiToggleButton-root': {
        backgroundColor: theme.palette.common.black,
        color: alpha(theme.palette.common.white, 0.5),
        padding: theme.spacing(0.5, 2),
        fontSize: '1rem',
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'capitalize',
        '&.Mui-selected, &:hover, &:active, &.Mui-selected:hover': {
          color: theme.palette.common.white,
          backgroundColor: theme.palette.common.black
        },
        '&:nth-of-type(1)': {
          paddingLeft: theme.spacing(4)
        },
        '&:nth-last-of-type(1)': {
          paddingRight: theme.spacing(4)
        }
      }
    })
  }
};

export default Component;
