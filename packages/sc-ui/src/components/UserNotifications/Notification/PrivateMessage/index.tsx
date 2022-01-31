import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, ListItem, ListItemText, Typography} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Send';
import {Link, SCNotificationPrivateMessageType, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {grey} from '@mui/material/colors';
import {FormattedMessage} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import NotificationNewChip from '../../NotificationNewChip';

const PREFIX = 'SCUserNotificationPrivateMessage';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px',
    float: 'left'
  },
  '& .MuiListItemText-root': {
    color: grey[600],
    maxWidth: '60%'
  },
  '& .MuiListItemSecondaryAction-root': {
    color: grey[600],
    fontSize: '13px',
    maxWidth: '40%'
  },
  '& .MuiButton-root': {
    paddingTop: 1,
    paddingBottom: 1
  }
}));
export interface NotificationPMProps {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationPrivateMessageType;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function UserNotificationPrivateMessage(props: NotificationPMProps): JSX.Element {
  // PROPS
  const {notificationObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  /**
   * Renders root object
   */
  return (
    <Root {...rest}>
      <ListItem
        component={'div'}
        secondaryAction={
          <Box>
            <Box component={'span'} sx={{display: {xs: 'none', md: 'inline-block'}, marginRight: '5px', paddingTop: '5px', float: 'left'}}>
              <DateTimeAgo date={notificationObject.active_at} />
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{minWidth: 30}}
              component={Link}
              to={scRoutingContext.url('messages', {id: notificationObject.message.id})}>
              <Box component={'span'} sx={{display: {xs: 'none', md: 'block'}, marginRight: '2px'}}>
                <FormattedMessage
                  id="ui.userNotifications.privateMessage.btnReplyLabel"
                  defaultMessage="ui.userNotifications.privateMessage.btnReplyLabel"
                />
              </Box>
              <ReplyIcon />
            </Button>
          </Box>
        }>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NotificationNewChip />}
              <Box sx={{display: 'inline-block'}}>
                <Link to={scRoutingContext.url('messages', {id: notificationObject.message.id})}>
                  <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.message.html}} />
                </Link>
              </Box>
            </>
          }
        />
      </ListItem>
    </Root>
  );
}
