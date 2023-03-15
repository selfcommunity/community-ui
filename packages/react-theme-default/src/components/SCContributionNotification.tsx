const Component = {
  styleOverrides: {
    root: ({theme}: any) => ({
      '& .SCContributionNotification-username': {
        fontWeight: theme.typography.fontWeightBold,
        '&:hover': {
          textDecoration: 'underline'
        }
      },
      '& .SCContributionNotification-vote-button': {
        color: 'inherit',
        padding: theme.spacing(1),
        fontSize: '1.143rem',
        minWidth: 0,
        borderRadius: '50%'
      },
      '& .SCContributionNotification-contribution-text': {
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
    })
  }
};

export default Component;
