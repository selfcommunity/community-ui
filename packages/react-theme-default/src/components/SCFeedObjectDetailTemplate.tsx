const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCCommentsFeedObject-root': {
        padding: theme.spacing(2, 1),
        '& .SCCommentsObject-root h6': {
          paddingLeft: theme.spacing(2)
        }
      },
      '& .SCFeedObject-detail': {
        '& .SCFeedObject-content': {
          '& .SCFeedObject-text-section .SCFeedObject-text': {
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
            }
          }
        }
      }
    }),
    skeletonRoot: ({theme}: any) => ({
      marginTop: theme.spacing(2),
      '& .SCCommentsObject-skeleton-root': {
        '& .SCWidget-root': {
          marginBottom: '0px !important'
        }
      },
      '& .SCCommentObject-skeleton-root': {
        background: 'transparent',
        boxShadow: 'none',
        border: 0,
        paddingLeft: '0px !important',
        '& .SCCommentObject-skeleton-root': {
          marginBottom: '0px !important'
        }
      }
    })
  }
};

export default Component;
