import {alpha} from '@mui/system';
import {green, red} from '@mui/material/colors';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCNotification-header': {
        padding: theme.spacing(2, 2, 0, 2),
        '& .SCNotification-avatar': {
          width: theme.selfcommunity.user.avatar.sizeMedium,
          height: theme.selfcommunity.user.avatar.sizeMedium
        },
        '& .SCNotification-username': {
          fontWeight: theme.typography.fontWeightBold
        }
      },
      '& .SCNotification-content': {
        padding: 0,
        '& .SCNotification-uncollapsed': {
          padding: theme.spacing(2, 2, 1, 2),
          '& > *': {
            marginBottom: theme.spacing()
          }
        },
        '& .SCNotification-show-other-aggregated': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
        },
        '& .SCNotification-collapsed': {
          padding: theme.spacing(2),
          '& .MuiCollapse-wrapperInner > *': {
            marginBottom: theme.spacing()
          }
        },
        '& .SCNotificationItem-detail': {
          borderRadius: 0
        }
      },
      '& a:not(.MuiButton-root)': {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '&:hover, &:active': {
          color: theme.palette.text.primary,
          textDecoration: 'underline'
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      marginBottom: theme.spacing(2)
    }),
    collapsedForRoot: ({theme}: any) => ({
      width: '100%',
      '& .SCNotification-flag-icon': {
        backgroundColor: red[500],
        color: '#FFF'
      },
      '& .SCNotification-flag-text': {
        color: theme.palette.text.primary
      },
      '& .SCNotification-contribution-wrap': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden'
      },
      '& .SCNotification-contribution-text': {
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }),
    commentRoot: ({theme}: any) => ({
      '& .SCNotification-username': {
        fontWeight: theme.typography.fontWeightBold,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotification-vote-button': {
        color: 'inherit',
        padding: theme.spacing(1),
        fontSize: '1.143rem',
        minWidth: 0,
        borderRadius: '50%'
      },
      '& .SCNotification-contribution-text': {
        color: theme.palette.text.primary,
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }),
    contributionRoot: ({theme}: any) => ({
      '& .SCNotification-username': {
        fontWeight: theme.typography.fontWeightBold,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotification-vote-button': {
        color: 'inherit',
        padding: theme.spacing(1),
        fontSize: '1.143rem',
        minWidth: 0,
        borderRadius: '50%'
      },
      '& .SCNotification-contribution-text': {
        color: theme.palette.text.primary,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotificationItem-root .SCNotificationItem-header .SCNotificationItem-secondary': {
        marginTop: theme.spacing(1),
        '& .SCDateTimeAgo-root': {
          marginTop: 0
        }
      }
    }),
    contributionFollowRoot: ({theme}: any) => ({
      '& .SCNotification-username': {
        fontWeight: 700,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotification-follow-text': {
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightMedium
      },
      '& .SCNotification-contribution-text': {
        '&:hover': {
          textDecoration: 'underline'
        },
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden'
      },
      '& .MuiIcon-root': {
        fontSize: '18px',
        marginBottom: '0.5px'
      }
    }),
    deletedForRoot: ({theme}: any) => ({
      '& .SCNotification-flag-icon': {
        backgroundColor: red[500],
        color: '#FFF'
      },
      '& .SCNotification-flag-text': {
        color: theme.palette.text.primary
      },
      '& .SCNotification-contribution-wrap': {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden'
      },
      '& .SCNotification-contribution-text': {
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }),
    incubatorApprovedRoot: ({theme}: any) => ({
      '& .SCNotification-category-icon': {
        borderRadius: 3
      },
      '& .SCNotification-view-incubator-button': {
        padding: theme.spacing(),
        paddingBottom: 0,
        textTransform: 'initial',
        marginLeft: -8
      }
    }),
    kindlyNoticeFlagRoot: ({theme}: any) => ({
      '& .SCNotification-flag-icon': {
        backgroundColor: red[500],
        color: '#FFF'
      },
      '& .SCNotification-flag-text': {
        color: theme.palette.text.primary
      },
      '& .SCNotification-contribution-wrap': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden'
      },
      '& .SCNotification-contribution-text': {
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }),
    kindlyNoticeForRoot: ({theme}: any) => ({
      width: '100%',
      '& .SCNotification-flag-icon': {
        backgroundColor: red[500],
        color: '#FFF'
      },
      '& .SCNotification-flag-text': {
        color: theme.palette.text.primary
      },
      '& .SCNotification-contribution-wrap': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden'
      },
      '& .SCNotification-contribution-text': {
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }),
    mentionRoot: ({theme}: any) => ({
      '& .SCNotification-username': {
        fontWeight: 700,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotification-mention-text': {
        color: theme.palette.text.primary
      },
      '& .SCNotification-contribution-text': {
        '&:hover': {
          textDecoration: 'underline'
        },
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden'
      }
    }),
    privateMessageRoot: ({theme}: any) => ({
      '& .SCNotification-username': {
        display: 'inline',
        fontWeight: 700,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotification-message-label': {
        color: theme.palette.text.primary
      },
      '& .SCNotification-message-wrap': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        WebkitLineClamp: '2',
        lineClamp: 2,
        WebkitBoxOrient: 'vertical',
        '& p': {
          margin: 0
        }
      },
      '& .SCNotification-message': {
        height: 20,
        overflowY: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden',
        '&:hover': {
          textDecoration: 'underline'
        },
        '& > p': {
          overflowY: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          lineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }
      },
      '& .SCNotification-actions': {
        fontSize: '13px',
        maxWidth: '40%'
      }
    }),
    eventRoot: ({theme}: any) => ({
      '& .SCNotification-username, & a': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCNotificationItem-primary': {
        '& .MuiIcon-root': {
          float: 'right',
          fontSize: '20px',
          marginLeft: theme.spacing(0.5)
        },
        '& .SCEvent-root': {
          width: '100%',
          '& .SCEvent-snippet-root': {
            paddingLeft: '0 !important'
          }
        }
      },
      '& .SCNotificationItem-secondary': {
        textTransform: 'capitalize'
      },
      '& .SCNotification-snippet-time': {
        paddingLeft: theme.spacing(5)
      },
      '& .SCEvent-snippet-root': {
        backgroundColor: 'transparent !important'
      }
    }),
    liveStreamRoot: ({theme}: any) => ({
      '& .SCNotification-username, & a': {
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCNotificationItem-primary': {
        '& .MuiIcon-root': {
          float: 'right',
          fontSize: '20px',
          marginLeft: theme.spacing(0.5)
        },
        '& .SCEvent-root': {
          width: '100%',
          '& .SCEvent-snippet-root': {
            paddingLeft: '0 !important'
          }
        }
      },
      '& .SCNotificationItem-secondary': {
        textTransform: 'capitalize'
      },
      '& .SCNotification-snippet-time': {
        paddingLeft: theme.spacing(5)
      },
      '& .SCEvent-snippet-root': {
        backgroundColor: 'transparent !important'
      }
    }),
    groupRoot: ({theme}: any) => ({}),
    undeletedForRoot: ({theme}: any) => ({
      '& .SCNotification-undeleted-icon': {
        backgroundColor: red[500],
        color: '#FFF'
      },
      '& .SCNotification-undeleted-text': {
        color: theme.palette.text.primary
      },
      '& .SCNotification-contribution-wrap': {
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        textOverflow: 'ellipsis',
        display: 'inline',
        overflow: 'hidden'
      },
      '& .SCNotification-contribution-text': {
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    }),
    userBlockedRoot: ({theme}: any) => ({
      '& .SCNotification-unblocked-icon': {
        backgroundColor: green[500],
        color: '#FFF'
      },
      '& .SCNotification-blocked-icon': {
        backgroundColor: red[500],
        color: '#FFF'
      },
      '& .SCNotification-blocked-text': {
        color: theme.palette.text.primary
      }
    }),
    userConnectionRoot: ({theme}: any) => ({
      '& .SCNotification-username': {
        fontWeight: 700,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotification-connection-text': {
        color: theme.palette.text.primary
      }
    }),
    userFollowRoot: ({theme}: any) => ({
      width: '100%',
      '& .SCNotification-username': {
        fontWeight: 700,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotification-follow-text': {
        color: theme.palette.text.primary
      }
    }),
    voteUpRoot: ({theme}: any) => ({
      width: '100%',
      '& .SCNotification-username': {
        fontWeight: 700,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCNotification-vote-up-text': {
        color: theme.palette.text.primary
      },
      '& .SCNotification-contribution-text': {
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    })
  }
};

export default Component;
