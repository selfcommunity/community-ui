import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {green} from '@mui/material/colors';
import {Link, SCNotificationUnDeletedForType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import {getContributeType, getRouteData} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';

const PREFIX = 'SCUndeletedForNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NotificationUndeletedProps {
  /**
   * Id of the feedObject
   * @default `n_<notificationObject.sid>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationUnDeletedForType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type undeleted for
 * @param props
 * @constructor
 */
export default function UndeletedForNotification(props: NotificationUndeletedProps): JSX.Element {
  // PROPS
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const contributionType = getContributeType(notificationObject);

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={className} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Avatar variant="circular" sx={{bgcolor: green[500]}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <b>
                <FormattedMessage id="ui.notification.undeletedFor.restoredContent" defaultMessage="ui.notification.undeletedFor.restoredContent" />
              </b>
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
      <Box sx={{mb: 1, p: 1}}>
        {notificationObject.is_new && <NewChip />}
        <Typography component={'span'} variant={'body2'} color={'primary'}>
          <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
        </Typography>
        <Link to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}>
          <Typography
            component={'span'}
            variant="body2"
            sx={{textDecoration: 'underline'}}
            color={'primary'}
            gutterBottom
            dangerouslySetInnerHTML={{__html: notificationObject[contributionType].summary}}
          />
        </Link>
      </Box>
    </Root>
  );
}
