const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    snippetRoot: ({theme}: any) => ({
      overflow: 'visible',
      boxSizing: 'border-box',
      paddingLeft: `${theme.spacing()} !important`,
      paddingRight: `${theme.spacing()} !important`,
      '& .SCBaseItem-image': {
        '& .MuiAvatar-root': {
          width: 100,
          height: 60,
          '& img': {
            borderRadius: '5px'
          }
        }
      },
      '& .SCCourse-snippet-image': {
        position: 'relative',
        '& .SCCourse-snippet-in-progress': {
          height: 18,
          backgroundColor: theme.palette.secondary.main,
          position: 'absolute',
          top: 5,
          right: 3,
          color: theme.palette.common.white,
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
          '& span': {
            fontSize: '0.8rem',
            paddingLeft: theme.spacing(0.5),
            paddingRight: theme.spacing(0.5)
          }
        }
      },
      '& .SCBaseItem-text': {
        fontSize: theme.typography.fontSize,
        '& .SCCourse-snippet-primary': {
          color: theme.palette.text.primary,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none'
          },
          '& p': {
            fontWeight: theme.typography.fontWeightBold
          }
        },
        '& .SCCourse-snippet-secondary': {
          color: theme.palette.text.secondary
        }
      },
      '& .SCCourse-chip': {
        textTransform: 'uppercase',
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(0.5),
        color: theme.palette.common.white,
        borderRadius: 0,
        '& .MuiChip-label': {
          fontWeight: 700,
          padding: theme.spacing(0.5)
        }
      }
    }),
    previewRoot: ({theme}: any) => ({
      '& .SCCourse-preview-image-wrapper': {
        position: 'relative',
        '& .SCCourse-preview-image': {
          height: '110px'
        },
        '& .SCCourse-chip': {
          textTransform: 'uppercase',
          position: 'absolute',
          top: theme.spacing(2),
          left: theme.spacing(2),
          color: theme.palette.common.white,
          borderRadius: 0,
          '& .MuiChip-label': {
            fontWeight: 700,
            padding: theme.spacing(0.5)
          }
        },
        '& .SCCourse-preview-avatar': {
          position: 'absolute',
          bottom: theme.spacing(-2),
          left: theme.spacing(1.5),
          width: theme.selfcommunity.user.avatar.sizeMedium,
          height: theme.selfcommunity.user.avatar.sizeMedium,
          border: `#FFF solid ${theme.spacing(0.2)}`
        }
      },
      '& .SCCourse-preview-content': {
        padding: `16px ${theme.spacing(2)} 0 !important`,
        '& .SCCourse-preview-creator': {
          paddingTop: 0,
          marginBottom: theme.spacing(1)
        },
        '& .SCCourse-preview-name-wrapper': {
          textDecoration: 'none',
          color: 'inherit',
          h6: {
            fontWeight: 700
          },
          '& .SCCourse-preview-name': {
            marginBottom: theme.spacing(0.5)
          }
        },
        '& .SCCourse-preview-info': {
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(1)
        },
        '& .SCCourse-preview-category': {
          [theme.breakpoints.up('sm')]: {
            height: theme.spacing(4)
          },
          '& .MuiChip-root': {
            marginRight: theme.spacing(0.5)
          }
        }
      },
      '& .SCCourse-preview-progress': {
        [theme.breakpoints.up('sm')]: {
          height: theme.spacing(3)
        },
        justifyContent: 'center',
        padding: theme.spacing(1),
        '& .MuiLinearProgress-root': {
          width: '100%',
          height: 5,
          borderRadius: 5,
          marginTop: theme.spacing(1)
        },
        '& .SCCourse-preview-completed-status': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiIcon-root': {
            marginRight: theme.spacing(1)
          }
        },
        '& .SCCourse-preview-progress-bar': {
          backgroundColor: theme.palette.grey['300']
        }
      },
      '& .SCCourse-preview-actions': {
        justifyContent: 'center',
        padding: theme.spacing(2)
      }
    }),
    placeholderRoot: ({theme}: any) => ({
      '& .SCCourse-placeholder-image-wrapper': {
        position: 'relative',
        '& .SCCourse-placeholder-image': {
          height: '110px'
        },
        '& .SCCourse-placeholder-icon': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: theme.palette.common.white
        },
        '& .SCCourse-placeholder-chip': {
          backgroundColor: theme.palette.grey['600'],
          position: 'absolute',
          top: theme.spacing(2),
          left: theme.spacing(2),
          color: theme.palette.common.white,
          borderRadius: 0,
          '& .MuiChip-label': {
            fontWeight: 700,
            padding: theme.spacing(0.5)
          }
        },
        '& .SCCourse-placeholder-avatar': {
          position: 'absolute',
          bottom: theme.spacing(-2),
          left: theme.spacing(1.5),
          width: theme.selfcommunity.user.avatar.sizeMedium,
          height: theme.selfcommunity.user.avatar.sizeMedium,
          border: `#FFF solid ${theme.spacing(0.2)}`
        }
      },
      '& .SCCourse-placeholder-content': {
        padding: `16px ${theme.spacing(2)} 0 !important`,
        '& .SCCourse-placeholder-creator': {
          fontSize: '0.875rem',
          marginBottom: theme.spacing(0.5)
        },
        '& .SCCourse-placeholder-name-wrapper': {
          textDecoration: 'none',
          color: 'inherit',
          '& .SCCourse-placeholder-name': {
            fontSize: '1rem',
            marginBottom: theme.spacing(0.5)
          }
        },
        '& .SCCourse-placeholder-info': {
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(1)
        },
        [theme.breakpoints.up('sm')]: {
          height: theme.spacing(20.5)
        }
      },
      '& .SCCourse-placeholder-actions': {
        '& .MuiIcon-root': {
          marginRight: theme.spacing(1)
        },
        padding: theme.spacing(2)
      },
      '& .SCCourse-placeholder-create-button': {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(10.25),
        marginBottom: theme.spacing(10.25)
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCCourse-skeleton-preview-root': {
        '& .SCCourse-skeleton-preview-avatar': {
          position: 'absolute',
          bottom: '-20px',
          left: theme.spacing(1.5),
          border: `#FFF solid ${theme.spacing(0.2)}`
        },
        '& .SCCourse-skeleton-preview-content': {
          padding: `16px ${theme.spacing(2)} 0 !important`
        },
        '& .SCCourse-skeleton-preview-actions': {
          display: 'flex',
          marginTop: theme.spacing(4),
          justifyContent: 'center',
          padding: theme.spacing(2)
        }
      },
      '& .SCCourse-skeleton-snippet-root': {
        overflow: 'visible',
        boxSizing: 'border-box',
        paddingLeft: `${theme.spacing()} !important`,
        paddingRight: `${theme.spacing()} !important`,
        '& .SCCourse-skeleton-snippet-image': {
          position: 'relative',
          '& .MuiSkeleton-root': {
            borderRadius: '5px'
          },
          '& .MuiIcon-root': {
            color: theme.palette.common.white,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }
        },
        '& .SCBaseItem-actions': {
          maxWidth: 'none !important'
        }
      }
    })
  }
};

export default Component;
