import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import {Link, SCNotificationVoteUpType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';
import {grey, red} from '@mui/material/colors';
import {SCNotificationObjectTemplateType} from '../../../types';
import {getContributeType, getRouteData} from '../../../utils/contribute';
import useThemeProps from '@mui/material/styles/useThemeProps';

const messages = defineMessages({
  contributionFollow: {
    id: 'ui.notification.contributionFollow.follow',
    defaultMessage: 'ui.notification.contributionFollow.follow'
  }
});

const PREFIX = 'SCContributionFollowNotification';

const classes = {
  root: `${PREFIX}-root`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  avatarSnippet: `${PREFIX}-avatar-snippet`,
  username: `${PREFIX}-username`,
  followText: `${PREFIX}-mention-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionText: `${PREFIX}-contribution-text`,
  toastInfo: `${PREFIX}-toast-info`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.listItemSnippet}`]: {
    padding: '10px 5px',
    alignItems: 'center',
    borderLeft: `2px solid ${grey[300]}`
  },
  [`& .${classes.listItemSnippetNew}`]: {
    borderLeft: `2px solid ${red[500]}`
  },
  [`& .${classes.avatarWrap}`]: {
    minWidth: 'auto',
    paddingRight: 10
  },
  [`& .${classes.avatar}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.avatarSnippet}`]: {
    width: 30,
    height: 30
  },
  [`& .${classes.followText}`]: {
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  },
  '& .MuiIcon-root': {
    fontSize: '18px',
    marginBottom: '0.5px'
  },
  [`& .${classes.toastInfo}`]: {
    marginTop: 10,
    padding: `0px ${theme.spacing()}`
  }
}));

export interface ContributionFollowProps {
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
  notificationObject: SCNotificationVoteUpType;

  /**
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type follow (contribution)
 * @param inProps
 * @constructor
 */
export default function ContributionFollowNotification(inProps: ContributionFollowProps): JSX.Element {
  // PROPS
  const props: ContributionFollowProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const contributionType = getContributeType(notificationObject);

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <ListItem
        component={'div'}
        classes={{
          root: classNames({
            [classes.listItemSnippet]: isSnippetTemplate,
            [classes.listItemSnippetNew]: isSnippetTemplate && notificationObject.is_new
          })
        }}>
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)}>
            <Avatar
              alt={notificationObject.user.username}
              variant="circular"
              src={notificationObject.user.avatar}
              classes={{root: classNames(classes.avatar, {[classes.avatarSnippet]: isSnippetTemplate})}}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {template === SCNotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
              <Typography component="div" className={classes.followText} color="inherit">
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)} className={classes.username}>
                  {notificationObject.user.username}
                </Link>{' '}
                {intl.formatMessage(messages.contributionFollow, {
                  username: notificationObject.user.username,
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </Typography>
            </>
          }
          secondary={
            <>
              {template === SCNotificationObjectTemplateType.DETAIL && (
                <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
              )}
            </>
          }
        />
      </ListItem>
      {template === SCNotificationObjectTemplateType.TOAST && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className={classes.toastInfo}>
          <DateTimeAgo date={notificationObject.active_at} />
          <Typography color="primary">
            <Link
              to={scRoutingContext.url(
                SCRoutes[`${notificationObject[contributionType]['type'].toUpperCase()}_ROUTE_NAME`],
                getRouteData(notificationObject[contributionType])
              )}>
              <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
            </Link>
          </Typography>
        </Stack>
      )}
    </Root>
  );
}
