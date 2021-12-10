import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import {Link, SCFeedObjectTypologyType, SCNotificationMentionType, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import {getContributeType} from '../../../../utils/contribute';

const messages = defineMessages({
  quotedYouOn: {
    id: 'ui.userNotifications.mention.quotedYou',
    defaultMessage: 'ui.userNotifications.mention.quotedYou'
  }
});

const PREFIX = 'SCUserNotificationMention';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export default function UserNotificationMention({notificationObject = null, ...props}: {notificationObject: SCNotificationMentionType}): JSX.Element {
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const intl = useIntl();
  const objectType = getContributeType(notificationObject);
  return (
    <Root {...props}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Link to={scRoutingContext.url('profile', {id: notificationObject[objectType].author.id})}>
            <Avatar alt={notificationObject[objectType].author.username} variant="circular" src={notificationObject[objectType].author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url('profile', {id: notificationObject[objectType].author.id})}>
                {notificationObject[objectType].author.username}
              </Link>{' '}
              {intl.formatMessage(messages.quotedYouOn, {
                b: (...chunks) => <strong>{chunks}</strong>
              })}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Link to={scRoutingContext.url(objectType, {id: notificationObject[objectType].id})}>
                <Typography
                  component={'span'}
                  variant="body2"
                  gutterBottom
                  dangerouslySetInnerHTML={{__html: notificationObject[objectType].summary}}
                />
              </Link>
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <AccessTimeIcon sx={{paddingRight: '2px'}} />
                  <TimeAgo datetime={notificationObject.active_at} />
                </Grid>
              </Box>
            </React.Fragment>
          }
        />
      </ListItem>
    </Root>
  );
}
