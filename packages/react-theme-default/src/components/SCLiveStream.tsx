const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({}),
    detailRoot: ({theme}: any) => ({
      '& .SCLiveStream-detail-image-wrapper': {
        position: 'relative',
        '& .SCLiveStream-detail-image': {
          height: '170px'
        },
        '& .SCLiveStream-detail-in-progress': {
          backgroundColor: theme.palette.secondary.main,
          position: 'absolute',
          top: 10,
          right: 10,
          color: theme.palette.common.white,
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
        }
      },
      '& .SCLiveStream-detail-content': {
        padding: `52px ${theme.spacing(3)} 0 !important`,
        '& .SCLiveStream-detail-user': {
          marginTop: '14px',
          '& .SCBaseItemButton-text': {
            margin: 0
          }
        },
        '& .SCLiveStream-detail-name-wrapper': {
          textDecoration: 'none',
          color: 'inherit',
          '& .SCLiveStream-detail-name': {
            marginBottom: '10px'
          }
        },
        '& .SCLiveStream-detail-first-divider': {
          marginTop: '18px',
          marginBottom: theme.spacing()
        },
        '& .SCLiveStream-detail-second-divider': {
          marginTop: theme.spacing(),
          marginBottom: '18px'
        }
      }
    }),
    previewRoot: ({theme}: any) => ({
      '& .SCLiveStream-preview-image-wrapper': {
        position: 'relative',
        '& .SCLiveStream-preview-image': {
          height: '80px'
        },
        '& .SCLiveStream-preview-in-progress': {
          height: 18,
          backgroundColor: theme.palette.secondary.main,
          position: 'absolute',
          top: 7,
          right: 7,
          color: theme.palette.common.white,
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
          '& span': {
            fontSize: '0.8rem',
            paddingLeft: theme.spacing(0.5),
            paddingRight: theme.spacing(0.5)
          }
        }
      },
      '& .SCLiveStream-preview-content': {
        padding: `${theme.spacing()} !important`,
        '& .SCLiveStreamInfoDetails-icon-text-wrapper': {
          '& .MuiTypography-root': {
            fontSize: '0.8rem'
          }
        },
        '& .SCLiveStream-detail-user': {
          marginTop: '14px',
          '& .SCBaseItemButton-text': {
            margin: 0
          }
        },
        '& .SCLiveStream-preview-name-wrapper': {
          marginTop: 3,
          textDecoration: 'none',
          color: 'inherit',
          '& h5': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }
      }
    }),
    snippetRoot: ({theme}: any) => ({
      overflow: 'visible',
      boxSizing: 'border-box',
      paddingLeft: `${theme.spacing()} !important`,
      paddingRight: `${theme.spacing()} !important`,
      '& .SCBaseItem-image': {
        '& .MuiAvatar-root': {
          width: 100,
          height: 60,
          borderRadius: '5px',
          '& img': {
            borderRadius: '5px'
          }
        }
      },
      '& .SCLiveStream-snippet-image': {
        position: 'relative',
        '& .SCLiveStream-snippet-in-progress': {
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
        '& .SCLiveStream-snippet-primary': {
          color: theme.palette.text.primary,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none'
          },
          '& p': {
            fontWeight: theme.typography.fontWeightBold
          }
        },
        '& .SCLiveStream-snippet-secondary': {
          color: theme.palette.text.secondary
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '& .SCLiveStream-skeleton-detail-root': {
        '& .SCLiveStream-skeleton-detail-calendar': {
          position: 'absolute',
          bottom: '-36px',
          left: '24px',
          boxShadow: '0px 3px 8px #00000040'
        },
        '& .SCLiveStream-skeleton-detail-content': {
          padding: `52px ${theme.spacing(3)} 0 !important`,
          '& .SCLiveStream-skeleton-detail-user': {
            marginTop: '14px',
            '& .SCBaseItemButton-text': {
              margin: 0
            }
          },
          '& .SCLiveStream-skeleton-detail-name-wrapper': {
            textDecoration: 'none',
            color: 'inherit',
            '& .SCLiveStream-skeleton-detail-name': {
              marginBottom: '10px'
            }
          },
          '& .SCLiveStream-skeleton-detail-first-divider': {
            marginTop: '18px',
            marginBottom: theme.spacing()
          },
          '& .SCLiveStream-skeleton-detail-second-divider': {
            marginTop: theme.spacing(),
            marginBottom: '18px'
          }
        }
      },
      '& .SCLiveStream-skeleton-preview-root': {
        '& .SCLiveStream-skeleton-preview-content': {
          padding: theme.spacing()
        },
        '& .SCLiveStream-skeleton-preview-image': {
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
      },
      '& .SCLiveStream-skeleton-snippet-root': {
        overflow: 'visible',
        boxSizing: 'border-box',
        paddingLeft: `${theme.spacing()} !important`,
        paddingRight: `${theme.spacing()} !important`,
        '& .SCLiveStream-skeleton-snippet-image': {
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
