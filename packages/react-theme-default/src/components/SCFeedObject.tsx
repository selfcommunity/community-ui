import {alpha} from '@mui/system';

const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      width: '100%',
      '& .SCFeedObject-title-section': {
        '& a': {
          textDecoration: 'none'
        },
        '& a:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCFeedObject-username': {
        textDecoration: 'none',
        color: theme.palette.text.primary
      },
      '& .SCFeedObject-avatar': {
        width: theme.selfcommunity.user.avatar.sizeMedium,
        height: theme.selfcommunity.user.avatar.sizeMedium
      },
      '& .SCFeedObject-header': {
        paddingTop: theme.spacing(1),
        paddingBottom: 0,
        '& .MuiCardHeader-subheader': {
          display: 'flex',
          alignItems: 'center'
        }
      },
      '& .SCFeedObject-category': {
        color: theme.palette.primary.main,
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        maxHeight: 30,
        display: 'flex',
        flexDirection: 'row',
        overflowY: 'hidden',
        overflowX: 'auto',
        justifyContent: 'center',
        MsOverflowStyle: 'none' /* IE and Edge */,
        scrollbarWidth: 'none' /* Firefox */,
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        '& a:not(.MuiChip-clickable)': {
          color: 'inherit',
          textDecoration: 'none',
          display: 'inline-flex',
          '&::after': {
            content: '"\\2022"',
            padding: theme.spacing(),
            alignSelf: 'center'
          },
          '&:last-child::after': {
            display: 'none'
          },
          '&:hover': {
            color: theme.palette.secondary.main
          },
          '& span': {
            textTransform: 'initial',
            fontWeight: theme.typography.fontWeightBold
          }
        },
        '& .SCFeedObject-group, & .SCFeedObject-event': {
          height: 20,
          [theme.breakpoints.up('sm')]: {
            marginRight: `${theme.spacing(1)} !important`
          }
        }
      },
      '& .SCFeedObject-group, & .SCFeedObject-event': {
        justifyContent: 'flex-start',
        '& a': {
          padding: theme.spacing(0.5),
          margin: theme.spacing(0.5),
          color: theme.palette.common.white,
          maxHeight: 20,
          '&:hover': {
            backgroundColor: theme.palette.common.black
          },
          '& span': {
            color: theme.palette.common.white,
            textTransform: 'initial'
          }
        },
        borderBottom: '1px solid rgba(221, 221, 221, 1)',
        margin: theme.spacing(0.5, 2, 0, 2)
      },
      '& .SCFeedObject-content': {
        padding: theme.spacing(1, 0, 0, 0),
        '&.SCFeedObject-error': {
          padding: theme.spacing(2),
          textAlign: 'center'
        }
      },
      '& .SCFeedObject-snippet': {
        '& > div': {
          alignItems: 'flex-start'
        },
        '& .SCBaseItem-text': {
          marginTop: 0
        }
      },
      '& .SCFeedObject-snippet-content a': {
        textDecoration: 'none',
        color: theme.palette.text.secondary
      },
      '& .SCFeedObject-tag': {
        display: 'inline-flex'
      },
      '& .SCFeedObject-location': {
        display: 'inline-flex'
      },
      '& .SCFeedObject-actions-section': {
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
      },
      '& .SCFeedObject-reply-content': {
        width: '100%',
        boxSizing: 'border-box',
        margin: 0,
        padding: theme.spacing(0.2, 2)
      },
      '& .SCFeedObject-info-section': {
        padding: theme.spacing(0, 2)
      },
      '& .SCFeedObject-activity-at': {
        textDecoration: 'none',
        color: 'inherit',
        marginTop: 0
      },
      '& .SCFeedObject-deleted': {
        opacity: 0.3,
        '&:hover': {
          opacity: 1
        }
      },
      '&.SCFeedObject-preview, &.SCFeedObject-detail, &.SCFeedObject-search, &.SCFeedObject-share': {
        border: `0 none`,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 0,
        [theme.breakpoints.up('sm')]: {
          borderRadius: theme.shape.borderRadius
        },
        '& .SCFeedObject-category': {
          borderBottom: '1px solid rgba(221, 221, 221, 1)',
          margin: theme.spacing(0, 2),
          '& .SCFeedObject-group, & .SCFeedObject-event': {
            borderBottom: 'none',
            marginTop: 5,
            '& .MuiChip-icon': {
              fontWeight: theme.typography.fontWeightRegular
            }
          },
          '& .SCFeedObject-group .MuiChip-icon': {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(-1)
          },
          [theme.breakpoints.down('md')]: {
            justifyContent: 'space-evenly',
            '@supports (-webkit-touch-callout: none)': {
              justifyContent: 'start !important'
            }
          }
        },
        '& .SCFeedObject-header': {
          '& .MuiCardHeader-avatar': {
            marginRight: theme.spacing(1.5),
            '.MuiBadge-badge': {
              right: theme.spacing(0.25)
            }
          },
          '& .SCFeedObject-username': {
            fontWeight: theme.typography.fontWeightBold
          },
          '& .MuiCardHeader-subheader': {
            fontSize: '0.857rem',
            color: theme.palette.primary.main,
            '& .SCFeedObject-activity-at': {
              display: 'inline-flex',
              '&:hover': {
                color: 'inherit',
                textDecoration: 'underline'
              }
            },
            '& .SCFeedObject-tag, & .SCFeedObject-location': {
              '& .MuiIcon-root': {
                fontSize: '1rem',
                color: 'inherit'
              }
            }
          }
        },
        '& .SCFeedObject-content': {
          '& .SCFeedObject-title-section': {
            '& .SCFeedObject-title': {
              fontWeight: theme.typography.fontWeightBold,
              marginBottom: theme.spacing(1),
              padding: theme.spacing(0, 2)
            },
            '& a': {
              color: 'inherit'
            }
          },
          '& .SCFeedObject-text-section': {
            overflowWrap: 'anywhere',
            '& > :first-of-type': {
              marginBottom: 0,
              padding: theme.spacing(0, 2, 0.5),
              display: 'block'
            },
            '& hr': {
              margin: '1em 0'
            },
            '& a': {
              color: theme.palette.text.secondary,
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
                cursor: 'pointer'
              }
            },
            '& img': {
              maxWidth: '100%'
            },
            '& blockquote': {
              margin: 0,
              marginLeft: theme.spacing(2),
              marginBottom: theme.spacing(1),
              color: theme.palette.text.secondary,
              borderLeftColor: theme.palette.primary.main,
              borderLeftWidth: theme.spacing(0.25),
              borderLeftStyle: 'solid',
              paddingLeft: theme.spacing(2)
            },
            '& h1': {
              fontSize: '1.429rem',
              color: theme.palette.text.primary,
              fontWeight: theme.typography.fontWeightBold,
              margin: theme.spacing(0, 0, 1, 0)
            },
            '& h2': {
              fontSize: '1.143rem',
              color: theme.palette.text.primary,
              fontWeight: theme.typography.fontWeightBold,
              margin: theme.spacing(0, 0, 0.8, 0)
            },
            '& h3': {
              fontSize: '1rem',
              color: theme.palette.text.primary,
              fontWeight: theme.typography.fontWeightBold,
              margin: theme.spacing(0, 0, 0.5, 0)
            },
            '& p': {
              margin: 0
            },
            '& b': {
              fontWeight: 'bold'
            },
            '& i': {
              fontStyle: 'italic'
            },
            '& u': {
              textDecoration: 'underline'
            },
            '& s': {
              textDecoration: 'line-through'
            },
            '& sub': {
              fontSize: '0.8em',
              verticalAlign: 'sub !important'
            },
            '& sup': {
              fontSize: '0.8em',
              verticalAlign: 'super'
            },
            '& ol': {
              padding: 0,
              margin: 0
            },
            '& ol ol': {
              padding: 0,
              margin: 0,
              listStyleType: 'upper-alpha'
            },
            '& ol ol ol': {
              padding: 0,
              margin: 0,
              listStyleType: 'lower-alpha'
            },
            '& ol ol ol ol': {
              padding: 0,
              margin: 0,
              listStyleType: 'upper-roman'
            },
            '& ol ol ol ol ol': {
              padding: 0,
              margin: 0,
              listStyleType: 'lower-roman'
            },
            '& ul': {
              padding: 0,
              margin: 0
            },
            '& li': {
              margin: '0 32px'
            },
            '& span': {
              '& span': {
                display: 'inline'
              },
              '& span:not(:has(+ a))': {
                width: '100%'
              },
              '& a': {
                display: 'inline-block',
                margin: theme.spacing(0, 0.3)
              },
              '& a:hover': {
                '& span': {
                  textDecoration: 'underline'
                }
              },
              '& :last-child': {
                display: 'inline'
              }
            }
          },
          '& .SCFeedObject-medias-section': {
            '& .SCFeedObjectMediaPreview-root': {
              margin: theme.spacing(0, 1)
            }
          },
          '& .SCFeedObject-show-more': {
            fontSize: theme.typography.fontSize,
            fontWeight: theme.typography.fontWeightBold,
            padding: theme.spacing(0.25),
            marginTop: -2,
            justifyContent: 'start',
            '&:hover': {backgroundColor: 'transparent'}
          }
        },
        '& .SCFeedObject-actions-section': {
          '&:last-of-type': {
            marginBottom: 0
          },
          '& .SCFeedObject-actions-root': {
            margin: 0,
            padding: theme.spacing(0.2, 2, 0, 2),
            '& .SCFeedObject-actions-action': {
              marginTop: 0,
              '& .SCFeedObject-action-vote-view-audience-button, & .SCFeedObject-action-comment-view-audience-button, & .SCFeedObject-action-share-view-audience-button, & .SCReactionAction-view-audience-button':
                {
                  fontSize: '0.857rem',
                  fontWeight: theme.typography.fontWeightRegular,
                  marginTop: theme.spacing(0),
                  marginBottom: 0,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: 'inherit'
                  }
                },
              '& .MuiDivider-root': {
                borderColor: theme.palette.grey[300]
              },
              '& .SCFeedObject-action-vote-button, & .SCFeedObject-action-comment-button, & .SCFeedObject-action-share-button, & .SCReactionAction-button':
                {
                  color: theme.palette.primary.main,
                  marginTop: theme.spacing(-0.5),
                  marginBottom: theme.spacing(0.5),
                  borderRadius: '50%',
                  padding: theme.spacing(1),
                  minWidth: 0,
                  '& .MuiIcon-root': {
                    fontSize: '1.57rem'
                  },
                  '& > img': {
                    width: '1.57rem',
                    height: '1.57rem'
                  }
                }
            }
          },
          '& .SCFeedObject-reply-content': {
            marginLeft: 0,
            background: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
            '& .SCCommentObjectReply-root': {
              background: 'transparent',
              marginBottom: 0,
              '& .SCCommentObjectReply-comment': {
                background: 'transparent',
                border: '0 none',
                '& .SCEditor-root': {
                  '& .SCEditor-placeholder': {
                    fontWeight: theme.typography.fontWeightMedium
                  },
                  '& .SCEditor-content': {
                    paddingBottom: 0,
                    minHeight: 0
                  },
                  '& .SCEditor-actions': {
                    bottom: 0
                  }
                },
                '&.SCCommentObjectReply-has-value .SCEditor-root .SCEditor-actions': {
                  bottom: theme.spacing(-4)
                }
              }
            }
          }
        },
        '& .SCFeedObject-activities-section': {
          '& .SCFeedObject-activities-content': {
            paddingTop: 0,
            paddingBottom: 0,
            '& .SCFeedObject-activities-menu-selector': {
              '& .MuiButton-root': {
                marginTop: theme.spacing(0.2),
                fontSize: '0.857rem',
                fontWeight: theme.typography.fontWeightRegular,
                padding: theme.spacing(1)
              }
            },
            '& .SCCommentObject-root': {
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 0,
              paddingBottom: 0
            }
          },
          '& .SCCommentObject-skeleton-root': {
            background: 'transparent',
            marginTop: 5,
            marginBottom: '7px !important',
            '& .SCBaseItem-text': {
              '& .SCWidget-root': {
                '& .MuiCardContent-root': {
                  padding: theme.spacing()
                }
              }
            }
          },
          '& .SCCommentObjectReply-root': {
            '& .SCCommentObjectReply-comment': {
              marginBottom: '0 !important',
              border: `1px solid ${theme.palette.grey[300]}`,
              '& .SCEditor-root': {
                minHeight: theme.spacing(4),
                marginTop: 0,
                '& .SCEditor-content': {
                  minHeight: 0
                },
                '& .SCEditor-actions': {
                  bottom: theme.spacing(-4)
                }
              }
            }
          }
        }
      },
      '&.SCFeedObject-snippet': {
        '& .SCFeedObject-username': {
          fontSize: '1rem',
          fontWeight: theme.typography.fontWeightBold,
          display: 'block',
          marginBottom: theme.spacing(1)
        },
        '& .SCFeedObject-snippet-content': {
          fontSize: '1rem',
          marginBottom: theme.spacing(1)
        },
        '& .SCFeedObject-activity-at': {
          display: 'inline-flex',
          '&:hover': {
            color: 'inherit',
            textDecoration: 'underline'
          }
        }
      },
      '&.SCFeedObject-detail .SCFeedObject-reply-content': {
        borderBottom: '0 none'
      },
      '&.SCFeedObject-share': {
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)'
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      '&.SCFeedObject-preview, &.SCFeedObject-detail, &.SCFeedObject-search': {
        border: `0 none`,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 0,
        [theme.breakpoints.up('sm')]: {
          borderRadius: theme.shape.borderRadius
        }
      },
      '& .SCFeedObject-media': {
        height: 250,
        marginBottom: 20
      },
      '& .SCFeedObject-snippet > *': {
        paddingLeft: 0,
        paddingRight: 0
      }
    }),
    actionsRoot: ({theme}: any) => ({
      margin: '0px 0px',
      color: '#3A3A3A',
      '& .SCFeedObject-actions-action': {
        textAlign: 'center'
      }
    }),
    actionCommentRoot: ({theme}: any) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      '&.SCFeedObject-action-share-inline': {
        flexDirection: 'row-reverse'
      },
      '& .SCFeedObject-action-vote-divider': {
        width: '100%',
        borderBottom: 0
      }
    }),
    actionFollowRoot: ({theme}: any) => ({
      '& .SCFeedObject-action-follow-button': {
        color: theme.palette.primary.main,
        '&.SCFeedObject-action-follow-iconized': {
          borderRadius: '50%',
          padding: theme.spacing(1),
          minWidth: 'auto',
          fontSize: '1.429rem'
        },
        '&.SCFeedObject-action-follow-followed': {
          color: theme.palette.secondary.main
        }
      }
    }),
    actionShareRoot: ({theme}: any) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      '&.SCFeedObject-action-share-inline': {
        flexDirection: 'row-reverse'
      },
      '& .SCFeedObject-action-vote-divider': {
        width: '100%',
        borderBottom: 0
      },
      '& .SCFeedObject-action-share-view-audience-button': {
        whiteSpace: 'nowrap'
      }
    }),
    actionVoteRoot: ({theme}: any) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      '&.SCFeedObject-action-vote-inline': {
        flexDirection: 'row-reverse'
      },
      '& .SCFeedObject-action-vote-divider': {
        width: '100%',
        borderBottom: 0
      }
    }),
    activitiesRoot: ({theme}: any) => ({
      width: '100%'
    }),
    activitiesMenuRoot: ({theme}: any) => ({
      '& .SCFeedObject-activities-menu-selector': {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'flex-end'
      },
      '& .SCFeedObject-activities-menu-selector .MuiButton-root': {
        textTransform: 'capitalize',
        fontWeight: theme.typography.fontWeightBold
      }
    }),
    contributorsRoot: ({theme}: any) => ({
      '& .SCFeedObject-contributors-btn-participants': {
        padding: theme.spacing(0.5),
        marginLeft: theme.spacing(-0.5),
        color: 'inherit',
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '0.875rem'
      },
      minHeight: 28,
      marginTop: 0,
      marginBottom: 0,
      ['& .MuiAvatarGroup-root']: {
        justifyContent: 'flex-end'
      },
      ['& .MuiAvatar-root']: {
        backgroundColor: '#d5d5d5',
        border: '2px solid #FFF !important',
        color: '#FFF',
        fontSize: '0.55rem',
        width: theme.selfcommunity.user.avatar.sizeSmall,
        height: theme.selfcommunity.user.avatar.sizeSmall,
        marginLeft: theme.spacing(-1),
        lineHeight: '24px'
      }
    }),
    contributorsSkeletonRoot: ({theme}: any) => ({
      // [`& .${classes.btnParticipants}`]: {
      //   marginLeft: -10
      // }
    }),
    pollObjectRoot: ({theme}: any) => ({
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      borderTop: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`,
      borderBottom: `1px solid ${alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)}`,
      boxShadow: 'none',
      borderRadius: 0,
      '& .MuiButton-root': {
        '&:focus:not(:focus-visible)': {
          borderColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        }
      },
      '& .MuiCardHeader-root': {
        textAlign: 'center',
        padding: theme.spacing(2),
        '& .SCFeedObject-poll-object-toggle-button': {
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          '& .MuiButton-endIcon': {
            display: 'none'
          },
          '& .SCFeedObject-poll-object-expand-icon': {
            marginBottom: 2,
            marginLeft: -2,
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.shortest
            })
          },
          '& .SCFeedObject-poll-object-collapsed-icon': {
            transform: 'rotate(180deg)'
          }
        }
      },
      '& .SCFeedObject-poll-object-title': {
        textAlign: 'center',
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(1),
        fontWeight: theme.typography.fontWeightBold,
        wordWrap: 'break-word'
      },
      '& .SCFeedObject-poll-object-voters, & .SCFeedObject-poll-object-votes': {
        display: 'flex',
        margin: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiIcon-root': {
          width: '1em',
          marginRight: theme.spacing(1)
        }
      },
      '& .SCFeedObject-poll-object-expiration, & .SCFeedObject-poll-object-close, & .SCFeedObject-poll-object-voters': {
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(2.5),
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '0.765rem'
      },
      '& .SCFeedObject-poll-object-voters .MuiTypography-root': {
        fontWeight: theme.typography.fontWeightLight,
        fontSize: '1rem'
      },
      '& ul': {
        padding: theme.spacing(2.5),
        marginBottom: theme.spacing(2.5),
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        borderRadius: theme.shape.borderRadius,
        '& li': {
          padding: 0
        }
      }
    }),
    pollObjectChoicesRoot: ({theme}: any) => ({
      backgroundColor: 'transparent',
      marginBottom: theme.spacing(3),
      padding: 0,
      width: '100%',
      borderRadius: 0,
      '& .SCFeedObject-poll-object-choices-label, & .SCFeedObject-poll-object-choices-vote': {
        marginBottom: 0,
        fontWeight: theme.typography.fontWeightBold
      },
      '& .SCFeedObject-poll-object-choices-progress': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        '& .MuiLinearProgress-root': {
          height: 10,
          borderRadius: theme.shape.borderRadius,
          flexGrow: 2,
          marginRight: theme.spacing(2),
          backgroundColor: theme.palette.common.white
        },
        '& > .MuiTypography-root': {
          fontSize: '0.987rem',
          fontWeight: theme.typography.fontWeightLight
        }
      }
    }),
    relevantActivitiesRoot: ({theme}: any) => ({
      '& .SCFeedObject-relevant-activities-activity': {
        '& > .SCBaseItem-root': {
          borderRadius: 0,
          marginBottom: theme.spacing(2),
          '& .SCBaseItem-content': {
            alignItems: 'flex-start',
            '& .SCBaseItem-text': {
              margin: 0,
              '& .SCBaseItem-primary': {
                display: 'inline-block',
                marginBottom: theme.spacing(0.5),
                '& a:nth-of-type(1)': {
                  fontWeight: theme.typography.fontWeightBold,
                  textDecoration: 'none'
                },
                '& a': {
                  color: theme.palette.text.secondary,
                  textDecoration: 'underlined',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }
              },
              '& .SCBaseItem-secondary': {
                fontSize: '0.857rem'
              }
            }
          }
        },
        '& .SCFeedObject-activity-comment-username, & .SCFeedObject-activity-follow-username, & .SCFeedObject-activity-poll-vote-username, & .SCFeedObject-activity-vote-up-username':
          {
            color: 'inherit'
          },
        '& .SCFeedObject-activity-comment-avatar, & .SCFeedObject-activity-follow-avatar, & .SCFeedObject-activity-poll-vote-avatar, & .SCFeedObject-activity-vote-up-avatar':
          {
            width: theme.selfcommunity.user.avatar.sizeMedium,
            height: theme.selfcommunity.user.avatar.sizeMedium
          }
      }
    }),
    activityCommentRoot: ({theme}: any) => ({}),
    activityFollowRoot: ({theme}: any) => ({}),
    activityPollVoteRoot: ({theme}: any) => ({}),
    activityVoteUpRoot: ({theme}: any) => ({})
  }
};

export default Component;
