import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {grey, red} from '@mui/material/colors';
import {Link, SCNotificationDeletedForType, SCRoutingContextType, useSCRouting, StringUtils, SCRoutes} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributeType, getContributionSnippet, getRouteData} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import useThemeProps from '@mui/material/styles/useThemeProps';

const messages = defineMessages({
  kindlyNoticeFlag: {
    id: 'ui.notification.kindlyNoticeFlag.kindlyNoticeFlag',
    defaultMessage: 'ui.notification.kindlyNoticeFlag.kindlyNoticeFlag'
  }
});

const PREFIX = 'SCKindlyNoticeFlagNotification';

const classes = {
  root: `${PREFIX}-root`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  flagIconWrap: `${PREFIX}-flag-icon-wrap`,
  flagIcon: `${PREFIX}-flag-icon`,
  flagIconSnippet: `${PREFIX}-flag-icon-snippet`,
  flagText: `${PREFIX}-flag-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
  contributionYouWroteLabel: `${PREFIX}-contribution-you-wrote-label`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.listItemSnippet}`]: {
    padding: '0px 5px',
    alignItems: 'center',
    borderLeft: `2px solid ${grey[300]}`
  },
  [`& .${classes.listItemSnippetNew}`]: {
    borderLeft: `2px solid ${red[500]}`
  },
  [`& .${classes.flagIconWrap}`]: {
    minWidth: 'auto',
    paddingRight: 10
  },
  [`& .${classes.flagIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.flagIconSnippet}`]: {
    width: 30,
    height: 30
  },
  [`& .${classes.flagText}`]: {
    display: 'inline',
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionWrap}`]: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2)
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  }
}));

export interface NotificationKindlyNoticeFlagProps {
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
  notificationObject: SCNotificationDeletedForType;

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
 * This component render the content of the notification of type kindly notice flag
 * @param inProps
 * @constructor
 */
export default function KindlyNoticeFlagNotification(inProps: NotificationKindlyNoticeFlagProps): JSX.Element {
  // PROPS
  const props: NotificationKindlyNoticeFlagProps = useThemeProps({
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

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const contributionType = getContributeType(notificationObject);

  //INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <ListItem
        alignItems={isSnippetTemplate ? 'center' : 'flex-start'}
        component={'div'}
        classes={{root: classNames({[classes.listItemSnippet]: isSnippetTemplate, [classes.listItemSnippetNew]: notificationObject.is_new})}}>
        <ListItemAvatar classes={{root: classes.flagIconWrap}}>
          <Avatar variant="circular" classes={{root: classNames(classes.flagIcon, {[classes.flagIconSnippet]: isSnippetTemplate})}}>
            <Icon>outlined_flag</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {isSnippetTemplate ? (
                <Link
                  to={scRoutingContext.url(
                    SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                    getRouteData(notificationObject[contributionType])
                  )}>
                  <Typography component="span" color="inherit" className={classes.flagText}>
                    <FormattedMessage
                      id={`ui.notification.kindlyNoticeFlag.kindlyNoticeFlagSnippet`}
                      defaultMessage={`ui.notification.kindlyNoticeFlag.kindlyNoticeFlagSnippet`}
                    />
                  </Typography>
                </Link>
              ) : (
                <>
                  {!isSnippetTemplate && notificationObject.is_new && <NewChip />}
                  <Typography component="span" color="inherit" className={classes.flagText}>
                    {intl.formatMessage(messages[StringUtils.camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})}
                  </Typography>
                </>
              )}
            </>
          }
          secondary={<> {!isSnippetTemplate && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}</>}
        />
      </ListItem>
      {!isSnippetTemplate && (
        <Box className={classes.contributionWrap}>
          <Typography variant={'body2'} color={'inherit'} component={'span'} classes={{root: classes.contributionYouWroteLabel}}>
            <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
          </Typography>
          <Link
            to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}
            className={classes.contributionText}>
            <Typography component={'span'} variant="body2" gutterBottom>
              {getContributionSnippet(notificationObject[contributionType])}
            </Typography>
          </Link>
        </Box>
      )}
    </Root>
  );
}
