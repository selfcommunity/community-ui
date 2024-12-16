const Component = {
  styleOverrides: {
    root: ({theme}) => ({
      '& .SCUserLiveStreamWidget-content': {
        '& .SCUserLiveStreamWidget-header': {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginBottom: theme.spacing(2),

          '& .SCUserLiveStreamWidget-avatar-wrapper': {
            flexDirection: 'row',
            alignItems: 'center',
            color: 'inherit',
            padding: 0,
            minWidth: 'auto',
            '& .SCUserLiveStreamWidget-avatar': {
              width: theme.selfcommunity.user.avatar.sizeMedium,
              height: theme.selfcommunity.user.avatar.sizeMedium
            }
          },
          '& h4': {
            marginLeft: 7,
            lineHeight: '28px'
          }
        },

        '& .SCUserLiveStreamWidget-live-wrapper': {
          paddingTop: theme.spacing(2),
          gap: theme.spacing(2),

          '& .SCUserLiveStreamWidget-live': {
            '& > div': {
              padding: '0 !important',

              '& > .SCBaseItem-content': {
                '& > .SCBaseItem-text': {
                  margin: 0
                }
              }
            }
          }
        }
      },

      '& .SCUserLiveStreamWidget-actions': {
        padding: `0 ${theme.spacing(2)} 15px`,
        justifyContent: 'center',

        '& .SCSuggestedEventsWidget-actionButton': {
          color: theme.palette.primary.main
        }
      }
    }),
    skeletonRoot: ({theme}) => ({
      '& .SCUserLiveStreamWidget-content': {
        padding: `10px ${theme.spacing(2)} 12px`,

        '& .SCUserLiveStreamWidget-user': {
          marginBottom: theme.spacing(2),

          '& > .SCBaseItem-content': {
            '& > .SCBaseItem-text': {
              margin: 0
            }
          },

          '& > .SCBaseItem-actions': {
            display: 'none'
          }
        },

        '& .SCUserLiveStreamWidget-live-wrapper': {
          gap: theme.spacing(2),

          '& .SCUserLiveStreamWidget-live': {
            '& > div': {
              padding: '0 !important',

              '& > .SCBaseItem-content': {
                '& > .SCBaseItem-text': {
                  margin: 0
                }
              }
            }
          }
        }
      },

      '& .SCUserLiveStreamWidget-actions': {
        padding: `0 ${theme.spacing(2)} 15px`,
        justifyContent: 'center'
      }
    }),
    dialogRoot: ({theme}) => ({
      '& .SCUserLiveStreamWidget-infinite-scroll': {
        height: '400px',

        [theme.breakpoints.down('md')]: {
          height: '100%'
        },

        '& .SCEvent-root': {
          width: '100%'
        }
      }
    })
  }
};

export default Component;
